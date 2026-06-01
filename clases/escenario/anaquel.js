class Anaquel extends GameObject {
  constructor(x, y, juego) {
    super(x, y, juego);

    this.juego.anaqueles.push(this);

    this.static = true;

    this.sprite = new PIXI.Sprite(juego.texturaAnaquel);

    this.sprite.anchor.set(0.5, 1);

    this.container.addChild(this.sprite);
  }
}