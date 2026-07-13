class L_BuscandoAnaquel extends FSMState {
  onEnter() {
    this.buscarNuevoTarget();
  }

  buscarNuevoTarget() {
    const anaquelesConStock = this.owner.juego.anaqueles.filter(a => a.mangas.length > 0);
    
    if (anaquelesConStock.length > 0) {
      this.target = anaquelesConStock[Math.floor(Math.random() * anaquelesConStock.length)];
      this.owner.anaquelRobado = this.target; 
    } else {
      this.target = null;
    }
  }
  
  update() {
   
    if (this.target && this.target.mangas.length === 0) {
      this.buscarNuevoTarget();
    }

    if (!this.target) {
      console.log("No hay anaqueles con stock, el ladrón se retira.");
      this.fsm.setState("YendoPuerta"); 
      return;
    }

    if (this.target) {
      this.owner.moverseHacia(this.target.posicion.x, this.target.posicion.y);
    }
  }
  
  doChecks() {
    if (this.target && Math.hypot(this.target.posicion.x - this.owner.posicion.x, this.target.posicion.y - this.owner.posicion.y) < 100) {
      this.fsm.setState("Robando");
    }
  }
}