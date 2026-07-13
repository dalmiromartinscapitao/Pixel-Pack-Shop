
class UiDinero {
  constructor(juego) {
    this.juego = juego;
    this.dinero = 500; 
    this.brilloIntensidad = 1.0;
    this.bucleBrilloActivo = false;

    this.container = new PIXI.Container();
    this.container.label = "Capa_UI_Dinero";
    this.juego.pixiApp.stage.addChild(this.container);

    this.filtroBrillo = new PIXI.ColorMatrixFilter();
    this.container.filters = null;

    this.crearElementos();
  }

  crearElementos() {
    this.cuadro = new PIXI.Sprite(this.juego.texturaCuadroUI);
    this.cuadro.anchor.set(1, 0);
    this.cuadro.x = window.innerWidth - 20;
    this.cuadro.y = 20;
    this.cuadro.scale.set(0.8);
    this.container.addChild(this.cuadro);

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
    this.container.addChild(this.textoContador);
  }

  sumarDinero(cantidad) {
    this.dinero += cantidad;
    this.textoContador.text = `$${this.dinero}`;

    this.juego.sonidoPlata.currentTime = 0; 
    this.juego.sonidoPlata.play();
    
    this.brilloIntensidad = 2.0; 
    this.bucleBrilloActivo = true;
    this.container.filters = [this.filtroBrillo];
  }

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
        this.container.filters = null;
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