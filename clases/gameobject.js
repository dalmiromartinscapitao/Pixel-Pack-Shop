class GameObject {
  constructor(x, y, juego) {
    this.juego = juego;
    this.container = new PIXI.Container();
    this.velocidadMaxima = 3;

    this.id = juego.gameObjects.length;
    this.juego.gameObjects.push(this);
    this.juego.containerPrincipal.addChild(this.container);

    this.posicion = { x, y };
    this.body = null;
    this.offsetY = 0; 
  }

  cambiarAnimacion(cual) {
    if (!this.spritesAnimados || !this.spritesAnimados[cual]) return;

    this.animacionQueEstamosUsandoAhorita = cual;
    for (let key of Object.keys(this.spritesAnimados)) {
      this.spritesAnimados[key].visible = false;
    }
    this.spritesAnimados[cual].visible = true;
    this.spriteAnimadoActual = this.spritesAnimados[cual];
  }

  cargarSpritesAnimados(textureData) {
    this.spritesAnimados = {};
    for (let key of Object.keys(textureData.animations)) {
      this.spritesAnimados[key] = new PIXI.AnimatedSprite(textureData.animations[key]);
      this.spritesAnimados[key].label = key; 
      this.spritesAnimados[key].play();
      this.spritesAnimados[key].loop = true;
      this.spritesAnimados[key].animationSpeed = 0.3;
      this.spritesAnimados[key].scale.set(3.5);
      this.spritesAnimados[key].anchor.set(0.5, 1); 
      
      this.spritesAnimados[key].y = 16; 
      
      this.container.addChild(this.spritesAnimados[key]);
    }
  }

  update() {
  
  
    this.render();
  }

  render() {
    if (!this.body) return;

    this.posicion.x = this.body.position.x;
    this.posicion.y = this.body.position.y;

    this.container.x = this.posicion.x;
    this.container.y = this.posicion.y + this.offsetY;

    this.container.zIndex = this.container.y;
  }
}