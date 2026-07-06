class InterfaceUsuario {
  constructor(juego) {
    this.juego = juego;
    this.dinero = 0;

    this.brilloIntensidad = 1.5;
    this.bucleBrilloActivo = false;

    this.containerUI = new PIXI.Container();
    this.containerUI.label = "Capa_UI_Dinero";
    this.juego.pixiApp.stage.addChild(this.containerUI);

    this.filtroBrillo = new PIXI.ColorMatrixFilter();
    this.containerUI.filters = null;

    this.crearElementos();
    this.registrarTeclaP();
  }

  crearElementos() {

    this.cuadro = new PIXI.Sprite(this.juego.texturaCuadroUI);
    this.cuadro.anchor.set(1, 0); // Anclaje arriba a la derecha
    this.cuadro.x = window.innerWidth - 20; // 20px de separación del borde derecho
    this.cuadro.y = 20; // 20px de separación del borde superior
    this.cuadro.scale.set(0.8); // Ajusta la escala si se ve muy grande o chico
    this.containerUI.addChild(this.cuadro);

    // 2. Estilo de texto con tu fuente ('FuenteDinero') y color blanco medio amarillo (#FFFFCC)
    const estiloTexto = new PIXI.TextStyle({
      fontFamily: 'FuenteDinero', // Alias exacto que pusiste en juego.js
      fontSize: 26,
      fill: '#FFFFCC', // Color blanco tirando a amarillo suave
      fontWeight: 'bold',
      stroke: { color: '#000000', width: 4 }, // Contorno negro para que resalte
      dropShadow: {
        alpha: 0.4,
        angle: 1.5,
        blur: 2,
        color: '#000000',
        distance: 3
      }
    });


    this.textoContador = new PIXI.Text({ text: `$${this.dinero}`, style: estiloTexto });
    this.textoContador.anchor.set(0.5, 0.5); 
    
    this.textoContador.x = this.cuadro.x - (this.cuadro.width / 2);
    this.textoContador.y = this.cuadro.y + (this.cuadro.height / 2);
    this.containerUI.addChild(this.textoContador);
  }

  registrarTeclaP() {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'p') {
        this.sumarDinero(100); 
      }
    });
  }

  sumarDinero(cantidad) {
    this.dinero += cantidad;
    this.textoContador.text = `$${this.dinero}`;
    this.activarEfectoBrillo();
  }

  activarEfectoBrillo() {
    this.brilloIntensidad = 2.5; 
    this.bucleBrilloActivo = true;
    this.containerUI.filters = [this.filtroBrillo];
  }


  update() {
    if (this.bucleBrilloActivo) {
      if (this.brilloIntensidad > 1.0) {
        this.brilloIntensidad -= 0.05; 
        this.filtroBrillo.brightness(this.brilloIntensidad, false);
      } else {
       
        this.containerUI.filters = null;
        this.bucleBrilloActivo = false;
      }
    }
  }

  redimensionar() {
    if (this.cuadro && this.textoContador) {
      this.cuadro.x = window.innerWidth - 20;
      this.textoContador.x = this.cuadro.x - (this.cuadro.width / 2);
      this.textoContador.y = this.cuadro.y + (this.cuadro.height / 2);
    }
  }
}