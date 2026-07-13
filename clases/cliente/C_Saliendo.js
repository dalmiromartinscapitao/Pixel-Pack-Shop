class C_Saliendo extends FSMState {
  onEnter() { 
    console.log(`[Cliente ${this.owner.id}] Entró al estado: Saliendo`);

    this.owner.ocultarMensaje(); 
  }
  
  update() { 
  
    this.owner.moverseHacia(this.owner.puntoSpawn.x, this.owner.puntoSpawn.y); 
  }
  
  doChecks() {
    if (Math.hypot(this.owner.puntoSpawn.x - this.owner.posicion.x, this.owner.puntoSpawn.y - this.owner.posicion.y) < 20) {
      console.log(`[Cliente ${this.owner.id}] Salió de la pantalla. Eliminando...`);
      this.owner.eliminarDePantalla();
    }
  }
}