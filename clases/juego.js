class Juego {
  constructor() {
    this.pixiApp;
    this.pixiInicializado = false;
    this.gameObjects = [];
    this.personas = [];
    this.enemigos = [];
    this.mesas = [];
    this.paredes = [];
    this.anaqueles = [];
    this.teclado = {};
    this.mouse = {};
    this.ahora = performance.now();

    this.targetCamara = null;

    this.anchoMundo = 2000;
    this.altoMundo = 1000;

    this.init();
  }

  async init() {
    if (this.pixiInicializado) {
      console.log("no podes arrancar pixi de nuevo");
      return;
    }

    console.log("arrancando");
    this.pixiApp = new PIXI.Application();
    console.log("app de pixi creada", this.pixiApp);

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

    console.log("pixi app inicializada");
    //agregamos el elementos canvas creado por pixi en el documento html
    document.body.appendChild(this.pixiApp.canvas);
    this.pixiInicializado = true;

    await this.precargarAssets();

    this.ponerFondo();

    this.crearEventListeners();

    this.crearNivel();
  }

  ponerFondo() {

  this.fondo =
    new PIXI.Sprite(
      this.texturaFondo
    );

  this.fondo.width =
    this.anchoMundo;

  this.fondo.height =
    this.altoMundo;

  this.containerPrincipal.addChild(
    this.fondo
  );

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
  }
  async precargarAssets() {
    this.ssChica = await PIXI.Assets.load("spritesheet/chica.json");
    this.texturaFondo = await PIXI.Assets.load("assets/fondo.png");
    this.texturaMesa = await PIXI.Assets.load("assets/mesa.png");
    this.texturaPared = await PIXI.Assets.load("assets/ladrillo.png");
    this.texturaAnaquel = await PIXI.Assets.load("assets/anaquel.png")
  }

  ponerAnaqueles(){

    const posicionesAnaqueles = [

    { x: 200, y: 350 },
    { x: 350, y: 350 },
    { x: 500, y: 350 },

    { x: 1250, y: 350 },
    { x: 1400, y: 350 },

  ];

  for (let i = 0; i < posicionesAnaqueles.length; i++) {

    const posicion = posicionesAnaqueles[i];

    new Anaquel(
      posicion.x,
      posicion.y,
      this
    );
  }
  }

  ponerParedes() {

  const posicionesParedes = [

  {
    x: 400,
    y: 850,
    espejada: false
  },

  {
    x: 1600,
    y: 850,
    espejada: true
  },

];

  for (let i = 0; i < posicionesParedes.length; i++) {

    const posicion = posicionesParedes[i];

    new Pared(
  posicion.x,
  posicion.y,
  this,
  posicion.espejada
);
}
}

 ponerMesas() {

  const posicionesMesas = [

    { x: 150, y: 700 },
    { x: 450, y: 500 },
    { x: 700, y: 700 },

    { x: 1300, y: 700 },
    { x: 1800, y: 700 },

  ];

  for (let i = 0; i < posicionesMesas.length; i++) {

    const posicion = posicionesMesas[i];

    new Mesa(
      posicion.x,
      posicion.y,
      this
    );

  }

}

  crearNivel() {
    this.prota = new Protagonista(
      window.innerWidth / 2,
      window.innerHeight / 2,
      this.ssChica,
      this,
    );

    this.targetCamara = this.prota;

    this.ponerParedes();

    this.ponerMesas();

    this.ponerAnaqueles();

    this.gameLoop();

    for (let i = 0; i < 10; i++) {
      //definimos coord x
      const coordenadaXDeEsteConejito = Math.random() * window.innerWidth;
      //definimos y
      const coordenadaYDeEsteConejito = Math.random() * window.innerHeight;

      const instanciaDeConejito = new Enemigo(
        coordenadaXDeEsteConejito,
        coordenadaYDeEsteConejito,
        this.ssChica,
        this,
      );
    }
  }

  asignarTargetCamara(quien) {
    if (!(quien instanceof GameObject)) return;
    this.targetCamara = quien;
  }

  moverCamara() {
    //adonde tiene q moverse el cont principal:
    const valorObjetivoDelContainerPrincipalX =
      -this.targetCamara.posicion.x + window.innerWidth * 0.5;

    const valorObjetivoDelContainerPrincipalY =
      -this.targetCamara.posicion.y + window.innerHeight * 0.5;

    //lerp de la posicion actual hasta la pos a la q tiene q moverse:

    const cuantoLerp = 0.01;

    this.containerPrincipal.x +=
      (valorObjetivoDelContainerPrincipalX - this.containerPrincipal.x) *
      cuantoLerp;

    this.containerPrincipal.y +=
      (valorObjetivoDelContainerPrincipalY - this.containerPrincipal.y) *
      cuantoLerp;

    //limites

    if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
    if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;

    this.limiteDerechoCamara = -this.anchoMundo + window.innerWidth;
    this.limiteInferiorCamara = -this.altoMundo + window.innerHeight;

    if (this.containerPrincipal.x < this.limiteDerechoCamara) {
      this.containerPrincipal.x = this.limiteDerechoCamara;
    }

    if (this.containerPrincipal.y < this.limiteInferiorCamara) {
      this.containerPrincipal.y = this.limiteInferiorCamara;
    }
  }

  gameLoop() {
    const nuevoAhora = performance.now();

    for (let i = 0; i < this.gameObjects.length; i++) {
      const gameobject = this.gameObjects[i];
      gameobject.update();
    }

    this.moverCamara();

    // console.log("gameloop", nuevoAhora, this);
    const duracionFrame = nuevoAhora - this.ahora;
    this.fps = 1000 / duracionFrame;

    // console.log(fps)

    this.ahora = nuevoAhora;

    requestAnimationFrame(() => {
      this.gameLoop();
    });
  }
}