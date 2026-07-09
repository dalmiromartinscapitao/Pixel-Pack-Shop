class Mesa extends GameObject {
  constructor(x, y, juego, escala = 1) {
    super(x, y, juego);
    this.sprite = new PIXI.Sprite(juego.texturaMesa);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.scale.set(escala);
    this.container.addChild(this.sprite);

    const ancho = Math.abs(this.sprite.width);
    const alto = Math.abs(this.sprite.height);
    this.offsetY = alto / 2;

    // Colisión exacta 1:1 con el sprite
    this.body = Matter.Bodies.rectangle(x, y - (alto / 2), ancho, alto, { isStatic: true });
    Matter.Composite.add(juego.world, this.body);
    
    juego.mesas.push(this);
    
    // NUEVO: Control de asientos para la IA
    this.asientos = { arriba: null, abajo: null };
  }
}