class UiDinero {
  constructor(juego) {
    this.juego = juego;
    // Empezamos con 500 para poder probar la tienda
    this.dinero = 500; 
    this.brilloIntensidad = 1.0;
    this.bucleBrilloActivo = false;

    this.containerUI = new PIXI.Container();
    this.containerUI.label = "Capa_UI_Dinero";
    this.juego.pixiApp.stage.addChild(this.containerUI);

    this.filtroBrillo = new PIXI.ColorMatrixFilter();
    this.containerUI.filters = null;

    this.crearElementos();
  }

  crearElementos() {
    this.cuadro = new PIXI.Sprite(this.juego.texturaCuadroUI);
    this.cuadro.anchor.set(1, 0);
    this.cuadro.x = window.innerWidth - 20;
    this.cuadro.y = 20;
    this.cuadro.scale.set(0.8);
    this.containerUI.addChild(this.cuadro);

    const estiloTexto = new PIXI.TextStyle({
      fontFamily: 'FuenteDinero',
      fontSize: 26,
      fill: '#FFFFCC',
      fontWeight: 'bold',
      stroke: { color: '#000000', width: 4 },
      dropShadow: { alpha: 0.4, angle: 1.5, blur: 2, color: '#000000', distance: 3 }
    });

    this.textoContador = new PIXI.Text({ text: `$${this.dinero}`, style: estiloTexto });
    this.textoContador.anchor.set(0.5, 0.5);
    this.textoContador.x = this.cuadro.x - (this.cuadro.width / 2);
    this.textoContador.y = this.cuadro.y + (this.cuadro.height / 2);
    this.containerUI.addChild(this.textoContador);
  }

  sumarDinero(cantidad) {
    this.dinero += cantidad;
    this.textoContador.text = `$${this.dinero}`;
    
    this.brilloIntensidad = 2.0; 
    this.bucleBrilloActivo = true;
    this.containerUI.filters = [this.filtroBrillo];
  }

  // NUEVO MÉTODO: Para que la tienda pueda cobrarte
  restarDinero(cantidad) {
    this.dinero -= cantidad;
    this.textoContador.text = `$${this.dinero}`;
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