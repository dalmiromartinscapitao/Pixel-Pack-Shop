class Pared extends GameObject {
  constructor(x, y, juego, espejada = false, escala = 1) {
    super(x, y, juego);
    this.sprite = new PIXI.Sprite(juego.texturaPared);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.scale.set(espejada ? -escala : escala, escala);
    this.container.addChild(this.sprite);

    const ancho = Math.abs(this.sprite.width);
    const alto = Math.abs(this.sprite.height);
    this.offsetY = alto / 2;

    // Colisión exacta 1:1
    this.body = Matter.Bodies.rectangle(x, y - (alto / 2), ancho, alto, { isStatic: true });
    Matter.Composite.add(juego.world, this.body);
    
    juego.paredes.push(this);
  }
}