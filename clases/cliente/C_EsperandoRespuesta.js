class C_EsperandoRespuesta extends FSMState {
  onEnter() { 
    console.log(`[Cliente ${this.owner.id}] Entró al estado: EsperandoRespuesta`);
    
    this.owner.textoMensaje.anchor.set(0, 1); 
    this.owner.textoMensaje.x = 20; 
    this.owner.textoMensaje.y = -40; 
    
    this.owner.mostrarMensaje(`¡Quiero:\n${this.owner.pedido}!`); 
  }
  
  update() { 
    this.owner.cambiarAnimacion("atras"); 

    if (this.currentFrame === 600) {
        this.owner.ocultarMensaje();
    }
  }
  
  doChecks() {
 
    if (this.currentFrame > 1200) {
        this.fsm.setState("Enojado");
    }
  }
}