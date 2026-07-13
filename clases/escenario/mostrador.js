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

    this.body = Matter.Bodies.rectangle(x, y - (alto / 2), ancho, alto, { isStatic: true });
    Matter.Composite.add(juego.world, this.body);

    juego.mostradores.push(this);
    this.fila = [];
  }

  agregarALaFila(cliente) {
    this.fila.push(cliente);
    this.reorganizarFila();
  }

  reorganizarFila() {
    const espaciado = 80; 
    this.fila.forEach((cliente, index) => {
      cliente.targetX = this.posicion.x - (espaciado * (index + 1));
      cliente.targetY = this.posicion.y + 50;
    });
  }

  removerDeLaFila(cliente) {
    const indice = this.fila.indexOf(cliente);
    if (indice > -1) {
      this.fila.splice(indice, 1);
      this.reorganizarFila(); // Reordena a los que quedan en la cola
      console.log(`Cliente eliminado. Fila restante: ${this.fila.length}`);
    }
  }
}