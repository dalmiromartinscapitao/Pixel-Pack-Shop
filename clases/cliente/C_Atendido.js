class C_Atendido extends FSMState {
  onEnter() {
    this.owner.mostrarMensaje("¡Gracias!");
    if (this.owner.juego.mostradores.length > 0) {
      this.owner.juego.mostradores[0].removerDeLaFila(this.owner);
    }
    if (this.owner.juego.uiDinero) {
      this.owner.juego.uiDinero.sumarDinero(100);
    }
  }
  
  doChecks() {
    if (this.currentFrame > 60) this.fsm.setState("Saliendo"); // Espera 1 seg y se va
  }
}