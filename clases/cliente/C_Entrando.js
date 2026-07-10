class C_Entrando extends FSMState {
  onEnter() { 
    this.fsm.setState("IrAFila"); // Transición instantánea
  }
}