class C_IrALocal extends FSMState {
  onEnter() {
    console.log(`[Cliente ${this.owner.id}] Entró al estado: IrALocal`);
  }

  update() { 
    this.owner.moverseHacia(1000, 910); 
  } 
  
  doChecks() {
    if (Math.hypot(1000 - this.owner.posicion.x, 910 - this.owner.posicion.y) < 20) {
      this.fsm.setState("Entrando");
    }
  }
}