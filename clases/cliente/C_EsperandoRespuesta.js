class C_EsperandoRespuesta extends FSMState {
  onEnter() { 
    this.owner.mostrarMensaje("¡Hola! Quiero 1 ítem"); 
  }
  
  update() { 
    this.owner.cambiarAnimacion("atras"); 
  }
  
  doChecks() {
    // 20 segundos a 60 FPS = 1200 frames de tolerancia
    if (this.currentFrame > 1200) this.fsm.setState("Enojado");
  }
}