class C_IrAFila extends FSMState {
  onEnter() {
    if (this.owner.juego.mostradores.length === 0) return this.fsm.setState("Saliendo");
    this.mostrador = this.owner.juego.mostradores[0];
    
    if (this.mostrador.fila.length >= 5) {
      this.fsm.setState("Saliendo"); // Fila llena, se va
    } else {
      this.mostrador.agregarALaFila(this.owner);
    }
  }
  
  update() {
    if (!this.mostrador) return;
    const indice = this.mostrador.fila.indexOf(this.owner);
    if (indice === -1) return;

    const destinoY = this.mostrador.posicion.y + 60 + (indice * 60);
    const distancia = this.owner.moverseHacia(this.mostrador.posicion.x, destinoY);

    if (distancia <= 15) this.owner.cambiarAnimacion("atras"); // Mira al mostrador
  }
  
  doChecks() {
    if (this.mostrador && this.mostrador.fila.indexOf(this.owner) === 0) {
      const dist = Math.hypot(this.owner.posicion.x - this.mostrador.posicion.x, this.owner.posicion.y - (this.mostrador.posicion.y + 60));
      if (dist <= 20) this.fsm.setState("EsperandoRespuesta"); // Es el primero y llegó a la caja
    }
  }
}