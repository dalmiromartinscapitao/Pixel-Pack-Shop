class C_Enojado extends FSMState {
  onEnter() {
    this.owner.mostrarMensaje("¡Qué lentos!");
    this.owner.container.tint = 0xFF8888; // Se pone color rojo enfado
    if (this.owner.juego.mostradores.length > 0) {
      this.owner.juego.mostradores[0].removerDeLaFila(this.owner);
    }
  }
  
  doChecks() {
    if (this.currentFrame > 60) this.fsm.setState("Saliendo");
  }
}