class Mostrador extends GameObject {
  constructor(x, y, juego, escala = 1) {
    super(x, y, juego);

    this.sprite = new PIXI.Sprite(juego.texturaMostrador);
    this.sprite.anchor.set(0.5, 1); 
    this.sprite.scale.set(escala);
    this.container.addChild(this.sprite);

    const ancho = Math.abs(this.sprite.width);
    const alto = Math.abs(this.sprite.height);

    this.offsetY = alto / 2;

    const altoFisico = alto * 0.4;
    const anchoFisico = ancho * 0.9;
    
    this.body = Matter.Bodies.rectangle(
      x, 
      y - alto + (altoFisico / 2) + 20, 
      anchoFisico, 
      altoFisico, 
      { isStatic: true }
    );
    Matter.Composite.add(juego.world, this.body);

    juego.mostradores.push(this);
    this.fila = [];
  }

  agregarALaFila(cliente) {
    this.fila.push(cliente);
  }

  removerDeLaFila(cliente) {
    const indice = this.fila.indexOf(cliente);
    if (indice !== -1) {
      this.fila.splice(indice, 1);
    }
  }
}