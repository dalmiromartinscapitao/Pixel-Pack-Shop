class C_Atendido extends FSMState {
  onEnter() {
    console.log(`[Cliente ${this.owner.id}] Entró al estado: Atendido`);
    
    if (this.owner.juego.mostradores.length > 0) {
        this.owner.juego.mostradores[0].removerDeLaFila(this.owner);
    }
    if (this.owner.juego.uiDinero) {
        this.owner.juego.uiDinero.sumarDinero(50);
    }

   this.owner.velocidadMaxima = 7;
  }
  
  doChecks() {
   
    if (this.currentFrame > 60) this.fsm.setState("YendoPuerta"); 
  }
}