class Persona extends GameObject {
  constructor(x, y, textures, juego) {
    super(x, y, juego);

    this.juego.personas.push(this);
    this.velocidadBase = CONFIGURACION.npc.velocidadBasePorDefecto;
    this.velocidadMaxima = this.velocidadBase;
    this.offsetY = 0; 

    this.body = Matter.Bodies.circle(x, y, CONFIGURACION.npc.radioCuerpo, { frictionAir: CONFIGURACION.npc.friccionAire });
    Matter.Composite.add(this.juego.world, this.body);

    this.spritesAnimados = {};
    this.animacionActual = null;

    this.cargarSpritesAnimados(textures);
    this.cambiarAnimacion("frente"); 
  }

  cargarSpritesAnimados(textures) {
    if (textures && textures.animations) {
      for (let key in textures.animations) {
        const anim = new PIXI.AnimatedSprite(textures.animations[key]);
        anim.anchor.set(0.5, 1);
        anim.animationSpeed = 0.12; 
        anim.visible = false;
        
        anim.scale.set(1); 
        
        this.spritesAnimados[key] = anim;
        this.container.addChild(anim);
      }
    }
    
    this.container.scale.set(2.5);
  }

  cambiarAnimacion(nombre) {
    if (this.animacionActual === nombre) return;
    
    if (this.animacionActual && this.spritesAnimados[this.animacionActual]) {
      this.spritesAnimados[this.animacionActual].visible = false;
      this.spritesAnimados[this.animacionActual].stop();
    }

    if (this.spritesAnimados[nombre]) {
      this.spritesAnimados[nombre].visible = true;
      this.spritesAnimados[nombre].play();
      this.animacionActual = nombre;
    }
  }

  aplicarFuerza(x, y) {
    Matter.Body.applyForce(this.body, this.body.position, { x, y });
  }

  limitarVelocidad() {
    const vel = this.body.velocity;
    const velocidad = Math.hypot(vel.x, vel.y);

    if (velocidad > this.velocidadMaxima) {
      const factor = this.velocidadMaxima / velocidad;
      Matter.Body.setVelocity(this.body, { x: vel.x * factor, y: vel.y * factor });
    }
  }

  moverseHacia(tx, ty) {
    const dx = tx - this.posicion.x;
    const dy = ty - this.posicion.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia > 15) {
      const fuerza = CONFIGURACION.npc.multiplicadorFuerza * this.velocidadMaxima;
      this.aplicarFuerza((dx / distancia) * fuerza, (dy / distancia) * fuerza);

      if (this.spritesAnimados) {

        this.cambiarAnimacion(dy > 0 ? "frente" : "atras");
        
        if (this.spritesAnimados[this.animacionActual] && !this.spritesAnimados[this.animacionActual].playing) {
            this.spritesAnimados[this.animacionActual].play();
        }
      }
    } else {
      Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
      
      if (this.animacionActual && this.spritesAnimados[this.animacionActual]) {
         this.spritesAnimados[this.animacionActual].gotoAndStop(0);
      }
    }
    return distancia;
  }

  update() {
    this.separarseDeLasPersonasYCosasCercanas()
    this.limitarVelocidad();
    super.update();
  }

  separarseDeLasPersonasYCosasCercanas(){
    if(this instanceof Protagonista) return

    const radioEmpuje = 80;
    const fuerzaEmpuje = 0.009 * this.velocidadMaxima;
    this.juego.personas.forEach(otraPersona => {
      if(otraPersona === this) return;

      const dx = this.posicion.x - otraPersona.posicion.x;
      const dy = this.posicion.y - otraPersona.posicion.y;
      const distanciaCuadrada=dx*dx+dy*dy;

      if(distanciaCuadrada > 0 && distanciaCuadrada < radioEmpuje*radioEmpuje) {
        // const distancia = Math.sqrt(distanciaCuadrada);
        this.aplicarFuerza(dx / distanciaCuadrada * fuerzaEmpuje, dy / distanciaCuadrada * fuerzaEmpuje);
      }
    });
  }

  render() {
    super.render(); 
  }
}