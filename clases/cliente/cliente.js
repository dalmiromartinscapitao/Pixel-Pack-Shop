class Cliente extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    this.juego.clientes.push(this);
    this.puntoSpawn = { x, y };
    this.despachado = false;
    
    // Globito de texto para mensajes
    this.textoMensaje = new PIXI.Text({ 
      text: "", 
      style: new PIXI.TextStyle({ 
        fontFamily: 'Arial', 
        fontSize: 16, 
        fill: '#FFFFFF', 
        stroke: { color: '#000000', width: 3 }
      }) 
    });
    this.textoMensaje.anchor.set(0.5, 1);
    this.textoMensaje.y = -50; // Arriba de la cabeza
    this.textoMensaje.visible = false;
    this.container.addChild(this.textoMensaje);

    const catalogo = ["mangaazul", "mangarojo", "mangapurpura", "mangaverde"];

    this.pedido = catalogo[Math.floor(Math.random() * catalogo.length)];
    
    console.log(`Cliente creado con pedido: ${this.pedido}`);

    // Configuración de la máquina de estados referenciando las clases externas
    const configFSM = {
      initialState: "IrALocal",
      states: {
        IrALocal: C_IrALocal, 
        Entrando: C_Entrando, 
        IrAFila: C_IrAFila,
        EsperandoRespuesta: C_EsperandoRespuesta, 
        Atendido: C_Atendido,
        Enojado: C_Enojado, 
        Saliendo: C_Saliendo
      }
    };
    this.fsm = new FSM(this, configFSM);
  }

  mostrarMensaje(texto) {
    this.textoMensaje.text = texto;
    this.textoMensaje.visible = true;
  }
  
  ocultarMensaje() { 
    this.textoMensaje.visible = false; 
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
    this.fsm.update(1); // Avanza 1 frame de la máquina de estados
    super.update();
  }
}