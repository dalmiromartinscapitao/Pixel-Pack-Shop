class Pared extends GameObject {
  
  constructor(x, y, juego, espejada = false, escala = 1, factorAncho = 1.7) {
    super(x, y, juego);

    this.sprite = new PIXI.Sprite(juego.texturaPared);
    this.sprite.anchor.set(0.5, 1);
    
    const escalaX = escala * factorAncho;

    if (espejada) {

      this.sprite.scale.set(-escalaX, escala);
    } else {
      this.sprite.scale.set(escalaX, escala);
  }
    this.container.addChild(this.sprite);

    const ancho = Math.abs(this.sprite.width);
    const alto = Math.abs(this.sprite.height);

    this.offsetY = alto / 2;

    const alturaFisica = alto - 32;
    this.body = Matter.Bodies.rectangle(x, y - alto / 2, ancho, alturaFisica, { isStatic: true });
    Matter.Composite.add(juego.world, this.body);

    juego.paredes.push(this);
  }
}