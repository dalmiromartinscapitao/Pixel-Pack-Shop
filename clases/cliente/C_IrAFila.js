class C_IrAFila extends FSMState {
  onEnter() {
    console.log(`[Cliente ${this.owner.id}] Entró al estado: IrAFila`);
    
    if (this.owner.juego.mostradores.length === 0) return this.fsm.setState("YendoPuerta");
    this.mostrador = this.owner.juego.mostradores[0];
    
    if (this.mostrador.fila.length >= 6) {
      
      this.fsm.setState("YendoPuerta"); 
    } else {
      this.mostrador.agregarALaFila(this.owner);
    }
  }
  
  update() {
    if (!this.mostrador) return;
    const indice = this.mostrador.fila.indexOf(this.owner);
    if (indice === -1) return;

    const destinoY = this.mostrador.posicion.y + 80 + (indice * 60);
    const distancia = this.owner.moverseHacia(this.mostrador.posicion.x, destinoY);

    if (distancia <= 25) {
        this.owner.cambiarAnimacion("atras"); 
    }
  }
  
  doChecks() {
    if (this.mostrador && this.mostrador.fila.indexOf(this.owner) === 0) {
      const dist = Math.hypot(
        this.owner.posicion.x - this.mostrador.posicion.x, 
        this.owner.posicion.y - (this.mostrador.posicion.y + 80)
      );
      
      if (dist <= 60) { 
        this.fsm.setState("EsperandoRespuesta"); 
      }
    }
  }
}