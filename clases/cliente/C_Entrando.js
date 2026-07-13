class C_Entrando extends FSMState {
  onEnter() { 
    console.log(`[Cliente ${this.owner.id}] Entró al estado: Entrando`);
    this.fsm.setState("IrAFila"); 
  }
}