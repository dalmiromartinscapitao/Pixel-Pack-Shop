class Ladron extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    this.juego.clientes.push(this); 
    this.puntoSpawn = { x, y };
    this.despachado = false;
    this.esLadron = true; 

    
    this.velocidadBase = 3.5; 
    this.velocidadMaxima = this.velocidadBase;

   
    this.itemSostenido = null; 
    this.anaquelRobado = null; 

    this.spriteItem = new PIXI.Sprite(); 
    this.spriteItem.anchor.set(0.5, 1);
    this.spriteItem.y = -60; 
    this.spriteItem.visible = false; 
    this.spriteItem.zIndex = 100;
    
    this.container.sortableChildren = true;
    this.container.addChild(this.spriteItem);

    const configFSM = {
      initialState: "Entrando",
      states: {
        Entrando: L_Entrando, 
        BuscandoAnaquel: L_BuscandoAnaquel,
        Robando: L_Robando, 
        YendoPuerta: L_YendoPuerta,        
        Escapando: L_Escapando, 
        Atrapado: L_Atrapado,
        AtrapadoSaliendo: L_AtrapadoSaliendo 
      }
    };
    this.fsm = new FSM(this, configFSM);
  }

 moverseHacia(tx, ty) {
    const dx = tx - this.posicion.x;
    const dy = ty - this.posicion.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia > 15) {
      const fuerza = 0.00005 * this.velocidadMaxima;
      this.aplicarFuerza((dx / distancia) * fuerza, (dy / distancia) * fuerza);

      if (this.spritesAnimados) {
        
        this.cambiarAnimacion(dy > 0 ? "frente" : "atras");
      }
    } else {
      Matter.Body.setVelocity(this.body, { x: 0, y: 0 }); 
    }
    return distancia;
  }

  eliminarDePantalla() {
    this.despachado = true;
    if (this.body) Matter.Composite.remove(this.juego.world, this.body);
    this.container.visible = false;
    Matter.Body.setPosition(this.body, { x: -9999, y: -9999 }); 
    const idx = this.juego.clientes.indexOf(this);
    if (idx > -1) this.juego.clientes.splice(idx, 1);
  }

  update() {
    if (this.despachado) return;
    this.fsm.update(1);
    super.update();
  }
}