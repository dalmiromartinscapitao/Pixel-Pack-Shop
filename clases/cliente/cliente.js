class Cliente extends Persona {
 constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    this.juego.clientes.push(this);
    this.puntoSpawn = { x, y };
    this.despachado = false;
    
    this.velocidadBase = CONFIGURACION.cliente.velocidadMaxima; 
    this.velocidadMaxima = this.velocidadBase;

    this.id = Math.floor(Math.random() * 10000); 

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
    this.textoMensaje.y = -50; 
    this.textoMensaje.visible = false;
    this.container.addChild(this.textoMensaje);

   
    const catalogo = this.juego.obtenerCatalogoDisponible();
    this.pedido = catalogo[Math.floor(Math.random() * catalogo.length)];
    
    console.log(`[Cliente ${this.id}] Creado en puerta con pedido: ${this.pedido}`);

    const configFSM = {
      initialState: "IrALocal",
      states: {
        IrALocal: C_IrALocal, 
        Entrando: C_Entrando, 
        IrAFila: C_IrAFila,
        EsperandoRespuesta: C_EsperandoRespuesta, 
        Atendido: C_Atendido,
        Enojado: C_Enojado, 
        YendoPuerta: C_YendoPuerta, 
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

moverseHacia(tx, ty) {
    const dx = tx - this.posicion.x;
    const dy = ty - this.posicion.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia > 15) {
      const fuerza = 0.00005 * this.velocidadMaxima;
      this.aplicarFuerza((dx / distancia) * fuerza, (dy / distancia) * fuerza);

      if (this.spritesAnimados) {
        
        this.cambiarAnimacion(dy > 0 ? "frente" : "atras");
      }
    } else {
      Matter.Body.setVelocity(this.body, { x: 0, y: 0 }); 
    }
    return distancia;
  }

  update() {
    if (this.despachado) return;
    this.fsm.update(1); 
    super.update();
  }
}