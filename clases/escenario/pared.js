class Pared extends GameObject {

  constructor(x,y,juego,espejada = false) {
    super(x, y, juego);

    this.juego.paredes.push(this);

    this.static = true;

    this.sprite =
      new PIXI.Sprite(
        juego.texturaPared
      );

    this.sprite.anchor.set(0.5, 1);

    this.sprite.width = 900;

    // espejar
    if (espejada) {
      this.sprite.scale.x *= -1;
    }

    this.container.addChild(
      this.sprite
    );
  }
}