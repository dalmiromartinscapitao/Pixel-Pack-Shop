class L_YendoPuerta extends FSMState {
  onEnter() {
    this.owner.velocidadMaxima = this.owner.velocidadBase * 5; 
  }
  
  update() { 
    this.owner.moverseHacia(1000, 910); 
  }
  
  doChecks() {
    
    if (Math.hypot(1000 - this.owner.posicion.x, 910 - this.owner.posicion.y) < 20) {
      this.fsm.setState("Escapando");
    }
  }
}