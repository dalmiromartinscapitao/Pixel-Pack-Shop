// --- ESTADOS DE LA FSM DEL LADRÓN ---
class L_Entrando extends FSMState {
  update() { this.owner.moverseHacia(1000, 910); }
  doChecks() {
    if (Math.hypot(1000 - this.owner.posicion.x, 910 - this.owner.posicion.y) < 20) {
      this.fsm.setState("BuscandoAnaquel");
    }
  }
}

class L_BuscandoAnaquel extends FSMState {
  onEnter() {
    const anaqueles = this.owner.juego.anaqueles;
    if (anaqueles.length > 0) {
      this.target = anaqueles[Math.floor(Math.random() * anaqueles.length)];
    } else {
      this.fsm.setState("Escapando"); // Si no hay muebles, se va
    }
  }
  update() {
    if (this.target) this.owner.moverseHacia(this.target.posicion.x, this.target.posicion.y);
  }
  doChecks() {
    if (this.target && Math.hypot(this.target.posicion.x - this.owner.posicion.x, this.target.posicion.y - this.owner.posicion.y) < 40) {
      this.fsm.setState("Robando");
    }
  }
}

class L_Robando extends FSMState {
  update() {
    Matter.Body.setVelocity(this.owner.body, { x: 0, y: 0 }); // Se queda quieto
    this.owner.container.tint = (this.currentFrame % 10 < 5) ? 0xFF0000 : 0xFFFFFF; // Titila
  }
  doChecks() {
    if (this.currentFrame > 120) { // 2 Segundos robando
      if (this.owner.juego.uiDinero) this.owner.juego.uiDinero.sumarDinero(-50);
      this.fsm.setState("Escapando");
    }
  }
}

class L_Escapando extends FSMState {
  onEnter() {
    this.owner.container.tint = 0xFFFFFF; 
    this.owner.velocidadMaxima = this.owner.velocidadBase * 2; // Corre al DOBLE
  }
  update() { this.owner.moverseHacia(this.owner.puntoSpawn.x, this.owner.puntoSpawn.y); }
  doChecks() {
    if (Math.hypot(this.owner.puntoSpawn.x - this.owner.posicion.x, this.owner.puntoSpawn.y - this.owner.posicion.y) < 20) {
      this.owner.eliminarDePantalla();
    }
  }
}

class L_Atrapado extends FSMState {
  onEnter() {
    this.owner.container.tint = 0xFF0000; // Totalmente rojo
    this.owner.velocidadMaxima = this.owner.velocidadBase * 3; // Corre al TRIPLE
  }
  update() { this.owner.moverseHacia(this.owner.puntoSpawn.x, this.owner.puntoSpawn.y); }
  doChecks() {
    if (Math.hypot(this.owner.puntoSpawn.x - this.owner.posicion.x, this.owner.puntoSpawn.y - this.owner.posicion.y) < 20) {
      this.owner.eliminarDePantalla();
    }
  }
}

// --- CLASE LADRÓN ---
class Ladron extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    this.juego.clientes.push(this); // Lo sumamos a la lista compartida de clientes para facilitar loops
    this.puntoSpawn = { x, y };
    this.despachado = false;
    this.esLadron = true; // Flag identificadora

    const configFSM = {
      initialState: "Entrando",
      states: {
        Entrando: L_Entrando, BuscandoAnaquel: L_BuscandoAnaquel,
        Robando: L_Robando, Escapando: L_Escapando, Atrapado: L_Atrapado
      }
    };
    this.fsm = new FSM(this, configFSM);
  }

  eliminarDePantalla() {
    this.despachado = true;
    if (this.body) Matter.Composite.remove(this.juego.world, this.body);
    this.container.visible = false;
    Matter.Body.setPosition(this.body, { x: -9999, y: -9999 }); 
    const idx = this.juego.clientes.indexOf(this);
    if (idx > -1) this.juego.clientes.splice(idx, 1);
  }

  update() {
    if (this.despachado) return;
    this.fsm.update(1);
    super.update();
  }
}