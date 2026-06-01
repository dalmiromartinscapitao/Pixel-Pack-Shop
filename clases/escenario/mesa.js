class Mesa extends GameObject {
  constructor(x, y, juego) {
    super(x, y, juego);

    this.juego.mesas.push(this);

    this.static = true;

    this.sprite = new PIXI.Sprite(juego.texturaMesa);
    
    this.sprite.anchor.set(0.5, 1);
    
    this.container.addChild(this.sprite);
  }
}