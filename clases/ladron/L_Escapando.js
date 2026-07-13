class L_Escapando extends FSMState {
  update() { 
    this.owner.velocidadMaxima = this.owner.velocidadBase * 11; 
    this.owner.moverseHacia(this.owner.puntoSpawn.x, this.owner.puntoSpawn.y); 
  }
  
  doChecks() {
    if (Math.hypot(this.owner.puntoSpawn.x - this.owner.posicion.x, this.owner.puntoSpawn.y - this.owner.posicion.y) < 20) {
      
      if (this.owner.itemSostenido && this.owner.juego.uiDinero) {
        console.log("¡El ladrón escapó con el botín!");
        this.owner.juego.uiDinero.sumarDinero(-50); 
      }
      this.owner.eliminarDePantalla();
    }
  }
}