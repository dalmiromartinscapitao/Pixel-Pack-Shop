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
    this.frecuenciaClientes = 6000; 
    this.tiempoInicio = 0;

    this.juegoTerminado = false;
    this.mangasVendidos = 0;
    this.dineroInicialNivel = 500; 
    this.duracionNivel = 5 * 60 * 1000; 

    this.sonidoFondo = new Audio('assets/fondo.mp3');
    this.sonidoFondo.loop = true;
    this.sonidoFondo.volume = 0.3;

    this.sonidoPlata = new Audio('assets/plata.mp3');
    this.sonidoEnojado = new Audio('assets/enojado.mp3');

    this.mangasAnterior = 0;
    this.dineroAnterior = 0;

    this.precios = {
      mangaazul: { compra: 100, venta: 150 },
      mangarojo: { compra: 200, venta: 400 },
      mangaverde: { compra: 500, venta: 700 },
      mangapurpura: { compra: 800, venta: 2000 }
    };

    this.init();
  }

 iniciarMusica() {
      this.sonidoFondo.play().catch(e => console.log("Esperando interacción del usuario..."));
  }


  async init() {
    if (this.pixiInicializado) return;

    PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest';
    this.pixiApp = new PIXI.Application();
    await this.pixiApp.init({ background: "#000000", width: window.innerWidth, height: window.innerHeight });

    this.containerPrincipal = new PIXI.Container();
    this.containerPrincipal.label = "container principal";
    this.containerPrincipal.sortableChildren = true;
    this.pixiApp.stage.addChild(this.containerPrincipal);

    window.__PIXI_APP__ = this.pixiApp;
    document.body.appendChild(this.pixiApp.canvas);
    this.pixiInicializado = true;

    await this.precargarAssets();
    this.crearEventListeners();
    
    this.menu = new MenuPrincipal(this);
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
    this.spritesClientes = [];
    for (let i = 1; i <= 8; i++) {
        const sheet = await PIXI.Assets.load(`spritesheet/cliente_${i}.json`);
        this.spritesClientes.push(sheet);
    }
    this.texturaVentana = await PIXI.Assets.load("spritesheet/ventana.json");
    this.jsonNuevoProta = await PIXI.Assets.load("spritesheet/protagonista.json"); 
    await PIXI.Assets.load({ alias: 'FuenteDinero', src: 'assets/fuente.otf' });
    this.texturaFondo = await PIXI.Assets.load("assets/fondo.png");
    this.texturaMesa = await PIXI.Assets.load("assets/mesa.png");
    this.texturaPared = await PIXI.Assets.load("assets/ladrillo.png");
    this.texturaMostrador = await PIXI.Assets.load("assets/mostrador.png"); 
    this.texturaCuadroUI = await PIXI.Assets.load("assets/UI_DINERO.png");
    
    await PIXI.Assets.load({ alias: 'menu_fondo', src: 'assets/menu_fondo.jpg' });
    await PIXI.Assets.load({ alias: 'tutorial_img', src: 'assets/tutorial.png' });
    await PIXI.Assets.load({ alias: 'resumen_dia', src: 'assets/resumen_del_dia.png' }); 
    await PIXI.Assets.load({ alias: 'tienda_boton', src: 'assets/tienda_boton.png' });
    await PIXI.Assets.load({ alias: 'tienda_menu_fondo', src: 'assets/tienda_fondo.png' });

    this.texturaAnaquelAzul = await PIXI.Assets.load("spritesheet/anaquel_azul.json");
    this.texturaAnaquelRojo = await PIXI.Assets.load("spritesheet/anaquel_rojo.json");
    this.texturaAnaquelVerde = await PIXI.Assets.load("spritesheet/anaquel_verde.json");
    this.texturaAnaquelPurpura = await PIXI.Assets.load("spritesheet/anaquel_purpura.json");

    await PIXI.Assets.load({ alias: 'mangaazul', src: 'assets/mangaazul.png' });
    await PIXI.Assets.load({ alias: 'mangarojo', src: 'assets/mangarojo.png' });
    await PIXI.Assets.load({ alias: 'mangaverde', src: 'assets/mangaverde.png' });
    await PIXI.Assets.load({ alias: 'mangapurpura', src: 'assets/mangapurpura.png' });
  }

  ponerVentana() {
    new Ventana(650, 200, this, this.texturaVentana, 0.35); 
    new Ventana(1550, 200, this, this.texturaVentana, 0.35); 
}

  ponerMostradores() { new Mostrador(1000, 500, this); }
  
  ponerAnaqueles() {
    new Anaquel(200, 430, this, this.texturaAnaquelAzul, "mangaazul");
    new Anaquel(400, 430, this, this.texturaAnaquelRojo, "mangarojo");
    new Anaquel(1350, 430, this, this.texturaAnaquelVerde, "mangaverde");
    new Anaquel(1750, 430, this, this.texturaAnaquelPurpura, "mangapurpura");
  }

  ponerParedes() {
  
    const pos = [
        { x: 300, y: 910, e: false, sx: 2, sy: 1 }, 
        { x: 1700, y: 910, e: true, sx: 2, sy: 1 }
    ];

    for (let p of pos) {
        new Pared(p.x, p.y, this, p.e, p.sx, p.sy);
    }
}

  ponerMesas() {
    const pos = [{ x: 150, y: 780 }, { x: 400, y: 650 }, { x: 600, y: 780 }, { x: 1300, y: 780 }, { x: 1800, y: 780 }];
    for (let p of pos) new Mesa(p.x, p.y, this);
  }

  crearNivel(esReinicio = false) {
    this.tiempoInicio = performance.now();
    this.juegoTerminado = false;
    this.mangasVendidos = 0;
    
    this.containerPrincipal.visible = true;

    if (!esReinicio) {
        this.dineroInicialNivel = 500; 
    }

    this.ponerFondo();
    this.prota = new Protagonista(window.innerWidth / 2, window.innerHeight / 2, this.jsonNuevoProta, this);
    this.targetCamara = this.prota;

    this.ponerVentana();
    this.ponerParedes();
    this.ponerMesas();
    this.ponerAnaqueles();
    this.ponerMostradores(); 

    this.uiDinero = new UiDinero(this); 
    this.uiDinero.dinero = this.dineroInicialNivel;
    
    if (this.uiDinero.textoContador) {
        this.uiDinero.textoContador.text = "$" + this.dineroInicialNivel;
    }
    
    this.tienda = new TiendaUI(this);
    this.pantallaResumen = new PantallaResumen(this);

    if (!esReinicio) {
        this.gameLoop();
    }
  }

  limpiarNivel() {
    Matter.World.clear(this.world, false);
    this.containerPrincipal.removeChildren();

    if (this.uiDinero) this.pixiApp.stage.removeChild(this.uiDinero.container);
    if (this.tienda) this.pixiApp.stage.removeChild(this.tienda.container);
    if (this.pantallaResumen) this.pixiApp.stage.removeChild(this.pantallaResumen.container);

    this.gameObjects = [];
    this.personas = [];
    this.clientes = [];
    this.mostradores = [];
    this.mesas = [];
    this.paredes = [];
    this.anaqueles = [];
  }

 reiniciarNivel() {
    
    this.mangasAnterior = this.mangasVendidos;
    this.dineroAnterior = this.uiDinero.dinero;

    this.limpiarNivel();
    this.crearNivel(true); 
  }

  volverAlMenu() {
    this.limpiarNivel();
    this.mangasVendidos = 0;
    this.dineroInicialNivel = 500;
    
    this.mangasAnterior = 0;
    this.dineroAnterior = 0;
    
    if (this.menu) this.menu.container.visible = true; 
  }

  obtenerCatalogoDisponible() {
    const tiempoPasadoMs = performance.now() - this.tiempoInicio;
    const minutos = tiempoPasadoMs / 60000;


    if (minutos < 2) return ["mangaazul", "mangarojo"];
    if (minutos < 3) return ["mangaazul", "mangarojo", "mangaverde"];
    
    return ["mangaazul", "mangarojo", "mangaverde", "mangapurpura"];
  }

  moverCamara() {
    if (!this.targetCamara) return;
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

  debugMatter() {
    if (!this.debugGraphics) {
        this.debugGraphics = new PIXI.Graphics();
        this.debugGraphics.zIndex = 99999;
        this.containerPrincipal.addChild(this.debugGraphics);
    }

    this.debugGraphics.clear();
    
    const bodies = Matter.Composite.allBodies(this.world);
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        const vertices = body.vertices;
        
        const path = [];
        for (let j = 0; j < vertices.length; j++) {
            path.push(vertices[j].x, vertices[j].y);
        }
        
        this.debugGraphics.poly(path);
        this.debugGraphics.fill({ color: 0xff0000, alpha: 0.5 });
        this.debugGraphics.stroke({ width: 1, color: 0xffffff });
    }
  }

  gameLoop() {
    if (!this.juegoTerminado) {
      Matter.Engine.update(this.engine, 1000 / 60);

      const tiempoTranscurrido = performance.now() - this.tiempoInicio;
      if (tiempoTranscurrido >= this.duracionNivel) {
          this.juegoTerminado = true;
          
          this.containerPrincipal.visible = false;
          if (this.uiDinero) this.uiDinero.container.visible = false;
          if (this.tienda) this.tienda.container.visible = false; 

          this.pantallaResumen.mostrar(); 
      }

      const minutosPasados = tiempoTranscurrido / 60000;
      this.frecuenciaClientes = Math.max(3000, 6000 - (minutosPasados * 750));

      if (performance.now() - this.tiempoUltimoCliente > this.frecuenciaClientes) {
        if (this.clientes.length < 15) { 
          const spawnX = Math.random() > 0.5 ? 50 : this.anchoMundo - 50;
          const spawnY = this.altoMundo - 20;
          const randomSheet = this.spritesClientes[Math.floor(Math.random() * this.spritesClientes.length)];

          if (Math.random() < 0.2 && typeof Ladron !== 'undefined') {
            new Ladron(spawnX, spawnY, randomSheet, this);
          } else {
            new Cliente(spawnX, spawnY, randomSheet, this); 
          }
          this.tiempoUltimoCliente = performance.now();
        }
      }

      if (this.mostradores.length > 0 && this.mostradores[0].fila.length > 0) {
        const primerCliente = this.mostradores[0].fila[0];
        if (primerCliente.fsm) {
          if (primerCliente.fsm.currentStateName === "IrAFila") {
            const dist = Math.hypot(primerCliente.posicion.x - this.mostradores[0].posicion.x, primerCliente.posicion.y - (this.mostradores[0].posicion.y + 60));
            if (dist < 150) { 
              primerCliente.fsm.setState("EsperandoRespuesta");
            }
          }
        }
      }

      for (let i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].update();
      }
    }

    if (this.uiDinero && !this.juegoTerminado) this.uiDinero.update();
    if (!this.juegoTerminado) this.moverCamara();

    //debug:
    this.debugMatter();

    requestAnimationFrame(() => this.gameLoop());
  }
}