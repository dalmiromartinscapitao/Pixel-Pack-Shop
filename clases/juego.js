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
    window.onkeydown = (evento) => { this.teclado[evento.key.toLowerCase()] = true; };
    window.onkeyup = (evento) => { delete this.teclado[evento.key.toLowerCase()]; };
    window.addEventListener('resize', () => {
      if (this.pixiApp && this.pixiApp.renderer) this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
      if (this.uiDinero) this.uiDinero.redimensionar();
    });
  }

  async precargarAssets() {
    // Personajes y entorno general
    this.ssChica = await PIXI.Assets.load("spritesheet/chica.json");
    this.jsonNuevoProta = await PIXI.Assets.load("spritesheet/protagonista.json"); 
    await PIXI.Assets.load({ alias: 'FuenteDinero', src: 'assets/fuente.otf' });
    this.texturaFondo = await PIXI.Assets.load("assets/fondo.png");
    this.texturaMesa = await PIXI.Assets.load("assets/mesa.png");
    this.texturaPared = await PIXI.Assets.load("assets/ladrillo.png");
    this.texturaMostrador = await PIXI.Assets.load("assets/mostrador.png"); 
    this.texturaCuadroUI = await PIXI.Assets.load("assets/UI_DINERO.png");
    
    // UI Tienda
    await PIXI.Assets.load({ alias: 'tienda_boton', src: 'assets/tienda_boton.png' });
    await PIXI.Assets.load({ alias: 'tienda_menu_fondo', src: 'assets/tienda_fondo.png' });

    // CARGA DE LOS 4 SPRITESHEETS DE ANAQUELES
    this.texturaAnaquelAzul = await PIXI.Assets.load("spritesheet/anaquel_azul.json");
    this.texturaAnaquelRojo = await PIXI.Assets.load("spritesheet/anaquel_rojo.json");
    this.texturaAnaquelVerde = await PIXI.Assets.load("spritesheet/anaquel_verde.json");
    this.texturaAnaquelPurpura = await PIXI.Assets.load("spritesheet/anaquel_purpura.json");

    // CARGA DE LAS 4 IMÁGENES DE MANGAS (usando los alias que usará el cliente)
    await PIXI.Assets.load({ alias: 'mangaazul', src: 'assets/mangaazul.png' });
    await PIXI.Assets.load({ alias: 'mangarojo', src: 'assets/mangarojo.png' });
    await PIXI.Assets.load({ alias: 'mangaverde', src: 'assets/mangaverde.png' });
    await PIXI.Assets.load({ alias: 'mangapurpura', src: 'assets/mangapurpura.png' });
  }

  ponerMostradores() { new Mostrador(1000, 500, this); }
  
  ponerAnaqueles() {
    // Al crearlos, les pasamos su spritesheet específico y el string identificador
    new Anaquel(200, 450, this, this.texturaAnaquelAzul, "mangaazul");
    new Anaquel(350, 450, this, this.texturaAnaquelRojo, "mangarojo");
    new Anaquel(500, 450, this, this.texturaAnaquelVerde, "mangaverde");
    new Anaquel(1250, 450, this, this.texturaAnaquelPurpura, "mangapurpura");
  }

  ponerParedes() {
    const pos = [{ x: 400, y: 910, e: false }, { x: 1600, y: 910, e: true }];
    for (let p of pos) new Pared(p.x, p.y, this, p.e);
  }

  ponerMesas() {
    const pos = [{ x: 150, y: 780 }, { x: 430, y: 650 }, { x: 700, y: 780 }, { x: 1300, y: 780 }, { x: 1800, y: 780 }];
    for (let p of pos) new Mesa(p.x, p.y, this);
  }

  crearNivel() {
    this.prota = new Protagonista(window.innerWidth / 2, window.innerHeight / 2, this.jsonNuevoProta, this);
    this.targetCamara = this.prota;

    this.ponerParedes();
    this.ponerMesas();
    this.ponerAnaqueles();
    this.ponerMostradores(); 

    this.uiDinero = new UiDinero(this); 
    this.tienda = new TiendaUI(this);
    this.gameLoop();
  }

  moverCamara() {
    const targetX = -this.targetCamara.posicion.x + window.innerWidth * 0.5;
    const targetY = -this.targetCamara.posicion.y + window.innerHeight * 0.5;
    this.containerPrincipal.x += (targetX - this.containerPrincipal.x) * 0.01;
    this.containerPrincipal.y += (targetY - this.containerPrincipal.y) * 0.01;

    if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
    if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;

    const limiteDer = -this.anchoMundo + window.innerWidth;
    const limiteInf = -this.altoMundo + window.innerHeight;

    if (this.containerPrincipal.x < limiteDer) this.containerPrincipal.x = limiteDer;
    if (this.containerPrincipal.y < limiteInf) this.containerPrincipal.y = limiteInf;
  }

  atenderClienteEnMostrador() {
    if (this.mostradores.length === 0) return;
    const mostrador = this.mostradores[0];

    if (mostrador.fila.length === 0) return;

    const primerCliente = mostrador.fila[0];
    const distProta = Math.hypot(this.prota.posicion.x - mostrador.posicion.x, this.prota.posicion.y - mostrador.posicion.y);

    if (distProta < 150 && primerCliente.fsm && primerCliente.fsm.currentStateName === "EsperandoRespuesta") {
      primerCliente.fsm.setState("Atendido");
      delete this.teclado.p; 
    }
  }

  atraparLadron() {
    for (let cliente of this.clientes) {
      if (cliente.esLadron && cliente.fsm) {
        const estadoActual = cliente.fsm.currentStateName;

        if (estadoActual === "Robando" || estadoActual === "Escapando") {
          const dist = Math.hypot(this.prota.posicion.x - cliente.posicion.x, this.prota.posicion.y - cliente.posicion.y);
          
          if (dist < 100) { 
            cliente.fsm.setState("Atrapado"); 
            delete this.teclado.o; 
            break; 
          }
        }
      }
    }
  }

  gameLoop() {
    Matter.Engine.update(this.engine, 1000 / 60);

    if (performance.now() - this.tiempoUltimoCliente > this.frecuenciaClientes) {
      if (this.clientes.length < 15) { 
        const spawnX = Math.random() > 0.5 ? 50 : this.anchoMundo - 50;
        const spawnY = this.altoMundo - 20;

        if (Math.random() < 0.2 && typeof Ladron !== 'undefined') {
          new Ladron(spawnX, spawnY, this.ssChica, this);
        } else {
          new Cliente(spawnX, spawnY, this.ssChica, this); 
        }

        this.tiempoUltimoCliente = performance.now();
      }
    }

    if (this.teclado.p) this.atenderClienteEnMostrador();
    if (this.teclado.o) this.atraparLadron();

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].update();
    }

    if (this.uiDinero) this.uiDinero.update();

    this.moverCamara();
    requestAnimationFrame(() => this.gameLoop());
  }
}