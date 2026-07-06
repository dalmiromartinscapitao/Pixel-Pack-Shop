class Juego {
  constructor() {
    this.pixiApp = null;
    this.pixiInicializado = false;
    this.gameObjects = [];
    this.personas = [];
    this.clientes = [];
    this.mostradores = [];
    
    this.mesas = [];
    this.paredes = [];
    this.anaqueles = [];
    this.teclado = {};
    this.mouse = {};
    this.ahora = performance.now();

    this.targetCamara = null;
    this.anchoMundo = 2000;
    this.altoMundo = 1000;

    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.world.gravity.y = 0;

    this.tiempoUltimoCliente = 0;
    this.frecuenciaClientes = 3500; 

    this.init();
  }

  async init() {
    if (this.pixiInicializado) return;

    this.pixiApp = new PIXI.Application();
    const opcionesDePixi = {
      background: "#ffff00",
      width: window.innerWidth,
      height: window.innerHeight,
    };
    await this.pixiApp.init(opcionesDePixi);

    this.containerPrincipal = new PIXI.Container();
    this.containerPrincipal.label = "container principal";
    this.pixiApp.stage.addChild(this.containerPrincipal);

    window.__PIXI_APP__ = this.pixiApp;
    document.body.appendChild(this.pixiApp.canvas);
    this.pixiInicializado = true;

    await this.precargarAssets();
    this.ponerFondo();
    this.crearEventListeners();
    this.crearNivel();

    
  }

  ponerFondo() {
    this.fondo = new PIXI.Sprite(this.texturaFondo);
    this.fondo.width = this.anchoMundo;
    this.fondo.height = this.altoMundo;
    this.containerPrincipal.addChild(this.fondo);
  }

  crearEventListeners() {
    window.onmousemove = (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    };

    window.onkeydown = (evento) => {
      this.teclado[evento.key.toLowerCase()] = true;
    };

    window.onkeyup = (evento) => {
      delete this.teclado[evento.key.toLowerCase()];
    };

    window.addEventListener('resize', () => {
      if (this.pixiApp && this.pixiApp.renderer) {
        this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
      }
      if (this.ui) this.ui.redimensionar();
    });
  }

  async precargarAssets() {
    this.ssChica = await PIXI.Assets.load("spritesheet/chica.json");
    this.jsonNuevoProta = await PIXI.Assets.load("spritesheet/protagonista.json"); 

    await PIXI.Assets.load({
      alias: 'FuenteDinero',
      src: 'assets/fuente.otf'
    });

    this.texturaFondo = await PIXI.Assets.load("assets/fondo.png");
    this.texturaMesa = await PIXI.Assets.load("assets/mesa.png");
    this.texturaPared = await PIXI.Assets.load("assets/ladrillo.png");
    this.texturaAnaquel = await PIXI.Assets.load("assets/anaquel.png");
    this.texturaMostrador = await PIXI.Assets.load("assets/mostrador.png"); 
    this.texturaCuadroUI = await PIXI.Assets.load("assets/UI_DINERO.png");
  }

  ponerMostradores() { 
    new Mostrador(1650, 600, this);
  }

  ponerAnaqueles() {
    const posicionesAnaqueles = [
      { x: 200, y: 450 }, { x: 350, y: 450 }, { x: 500, y: 450 },
      { x: 1250, y: 450 }, { x: 1400, y: 450 },
    ];
    for (let i = 0; i < posicionesAnaqueles.length; i++) {
      new Anaquel(posicionesAnaqueles[i].x, posicionesAnaqueles[i].y, this);
    }
  }

  ponerParedes() {
    const posicionesParedes = [
      { x: 400, y: 910, espejada: false },
      { x: 1600, y: 910, espejada: true },
    ];
    for (let i = 0; i < posicionesParedes.length; i++) {
      new Pared(posicionesParedes[i].x, posicionesParedes[i].y, this, posicionesParedes[i].espejada);
    }
  }

  ponerMesas() {
    const posicionesMesas = [
      { x: 150, y: 780 }, { x: 430, y: 650 }, { x: 700, y: 780 },
      { x: 1300, y: 780 }, { x: 1800, y: 780 },
    ];
    for (let i = 0; i < posicionesMesas.length; i++) {
      new Mesa(posicionesMesas[i].x, posicionesMesas[i].y, this);
    }
  }

  crearNivel() {
    this.prota = new Protagonista(window.innerWidth / 2, window.innerHeight / 2, this.jsonNuevoProta, this);
    this.targetCamara = this.prota;

    this.ponerParedes();
    this.ponerMesas();
    this.ponerAnaqueles();
    this.ponerMostradores(); 

    this.ui = new InterfaceUsuario(this); 
    this.gameLoop();
  }

  asignarTargetCamara(quien) {
    if (!(quien instanceof GameObject)) return;
    this.targetCamara = quien;
  }

  moverCamara() {
    const valorObjetivoDelContainerPrincipalX = -this.targetCamara.posicion.x + window.innerWidth * 0.5;
    const valorObjetivoDelContainerPrincipalY = -this.targetCamara.posicion.y + window.innerHeight * 0.5;
    const cuantoLerp = 0.01;

    this.containerPrincipal.x += (valorObjetivoDelContainerPrincipalX - this.containerPrincipal.x) * cuantoLerp;
    this.containerPrincipal.y += (valorObjetivoDelContainerPrincipalY - this.containerPrincipal.y) * cuantoLerp;

    if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
    if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;

    this.limiteDerechoCamara = -this.anchoMundo + window.innerWidth;
    this.limiteInferiorCamara = -this.altoMundo + window.innerHeight;

    if (this.containerPrincipal.x < this.limiteDerechoCamara) this.containerPrincipal.x = this.limiteDerechoCamara;
    if (this.containerPrincipal.y < this.limiteInferiorCamara) this.containerPrincipal.y = this.limiteInferiorCamara;
  }

  atenderClienteEnMostrador() {
    if (this.mostradores.length === 0) return;
    const mostrador = this.mostradores[0];

    if (mostrador.fila.length === 0) return;

  
    const distProtaAlMostrador = Math.hypot(this.prota.posicion.x - mostrador.posicion.x, this.prota.posicion.y - mostrador.posicion.y);
    
    const primerCliente = mostrador.fila[0];
    const distClienteAlMostrador = Math.hypot(primerCliente.posicion.x - mostrador.posicion.x, primerCliente.posicion.y - mostrador.posicion.y);

    if (distProtaAlMostrador < 150 && distClienteAlMostrador < 150) {
      console.log("¡Cliente atendido con J!");
      
      mostrador.removerDeLaFila(primerCliente);
      
    
      primerCliente.estado = "SALIENDO";
      primerCliente.target = primerCliente.puntoSpawn; 

     
      if (this.ui) this.ui.sumarDinero(100);

     
      delete this.teclado.j; 
    }
  }

  eliminarGameObject(objeto) {
    if (objeto.body) Matter.Composite.remove(this.world, objeto.body);
    if (objeto.container && objeto.container.parent) objeto.container.parent.removeChild(objeto.container);

    this.clientes = this.clientes.filter(c => c !== objeto);
    this.personas = this.personas.filter(p => p !== objeto);
    this.gameObjects = this.gameObjects.filter(g => g !== objeto);
  }

  gameLoop() {
    Matter.Engine.update(this.engine, 1000 / 60);

    if (performance.now() - this.tiempoUltimoCliente > this.frecuenciaClientes) {
      if (this.clientes.length < 5) {
        new Cliente(0, 0, this.ssChica, this); 
        this.tiempoUltimoCliente = performance.now();
      }
    }

    // SOLUCIÓN: Escuchamos la tecla J
    if (this.teclado.j) {
      this.atenderClienteEnMostrador();
    }

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].update();
    }

    if (this.ui) this.ui.update();

    this.moverCamara();
    requestAnimationFrame(() => this.gameLoop());
  }
}