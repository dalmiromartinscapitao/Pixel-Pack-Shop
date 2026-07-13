class L_AtrapadoSaliendo extends FSMState {
  update() { 
    this.owner.moverseHacia(this.owner.puntoSpawn.x, this.owner.puntoSpawn.y); 
  }
  
  doChecks() {
    if (Math.hypot(this.owner.puntoSpawn.x - this.owner.posicion.x, this.owner.puntoSpawn.y - this.owner.posicion.y) < 20) {
      this.owner.eliminarDePantalla();
    }
  }
}