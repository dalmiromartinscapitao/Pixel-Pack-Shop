class L_Atrapado extends FSMState {
  onEnter() {
    if (this.owner.spritesAnimados) {
      for (let key in this.owner.spritesAnimados) {
        this.owner.spritesAnimados[key].tint = 0xFF8888; 
      }
    }
    this.owner.velocidadMaxima = this.owner.velocidadBase * 8; 
  }
  
  update() { 
    this.owner.moverseHacia(1000, 910); 
  }
  
  doChecks() {
    if (Math.hypot(1000 - this.owner.posicion.x, 910 - this.owner.posicion.y) < 20) {
      this.fsm.setState("AtrapadoSaliendo");
    }
  }
}