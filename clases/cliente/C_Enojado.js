
  class C_Enojado extends FSMState {
  onEnter() {
    console.log(`[Cliente ${this.owner.id}] Entró al estado: Enojado`);
    this.owner.mostrarMensaje("Que lentos");
    
    if (this.owner.spritesAnimados) {
      for (let key in this.owner.spritesAnimados) {
        this.owner.spritesAnimados[key].tint = 0xFF0000;
      }
    }
    
    if (this.owner.juego.mostradores.length > 0) {
      this.owner.juego.mostradores[0].removerDeLaFila(this.owner);
    }

    this.owner.velocidadMaxima = 10; 

  }
  
  doChecks() {
    if (this.currentFrame > 60) this.fsm.setState("YendoPuerta");
  }
}