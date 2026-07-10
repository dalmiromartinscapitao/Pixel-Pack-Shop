class Persona extends GameObject {
  constructor(x, y, textures, juego) {
    super(x, y, juego);

    this.juego.personas.push(this);
    this.velocidadBase = 1.5;
    this.velocidadMaxima = this.velocidadBase;
    this.offsetY = 14; 

    this.body = Matter.Bodies.circle(x, y, 12, { frictionAir: 0.15 });
    Matter.Composite.add(this.juego.world, this.body);

    this.cargarSpritesAnimados(textures);
    this.cambiarAnimacion("abajo");
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

  // MÉTODO NUEVO PARA IA: Resuelve el caminar y animar hacia un punto automáticamente
  moverseHacia(tx, ty) {
    const dx = tx - this.posicion.x;
    const dy = ty - this.posicion.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia > 15) {
      const fuerza = 0.00015;
      this.aplicarFuerza((dx / distancia) * fuerza, (dy / distancia) * fuerza);

      if (this.spritesAnimados) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.cambiarAnimacion(dx > 0 ? "derecha" : "izquierda");
        } else {
          this.cambiarAnimacion(dy > 0 ? "frente" : "atras");
        }
      }
    } else {
      Matter.Body.setVelocity(this.body, { x: 0, y: 0 }); // Frena
    }
    return distancia;
  }

  update() {
    this.limitarVelocidad();
    super.update();
  }

  render() {
    super.render(); 
  }
}