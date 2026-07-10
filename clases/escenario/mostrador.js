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

    // COLISIÓN 1:1 EXACTA
    // Creamos un rectángulo que coincide exactamente con el sprite
    this.body = Matter.Bodies.rectangle(x, y - (alto / 2), ancho, alto, { isStatic: true });
    Matter.Composite.add(juego.world, this.body);

    juego.mostradores.push(this);
    this.fila = [];
  }

  agregarALaFila(cliente) {
    // 1. Agregamos al cliente a la lista de espera
    this.fila.push(cliente);
    
    // 2. Ordenamos a todos para que ocupen su lugar
    this.reorganizarFila();
  }

  reorganizarFila() {
    const espaciado = 60; // Distancia entre cada cliente en la fila
    
    // Recorremos la fila y le asignamos una posición objetivo a cada cliente
    this.fila.forEach((cliente, index) => {
      // Ajusta la lógica de posición según hacia dónde quieras que crezca la fila.
      // Aquí estamos haciendo que la fila crezca hacia la izquierda (X negativo)
      cliente.targetX = this.posicion.x - (espaciado * (index + 1));
      cliente.targetY = this.posicion.y + 50; // Un poco por debajo del mostrador
    });
  }

  // Método extra necesario: Llamar a esto cuando un cliente es atendido
  quitarDeLaFila(cliente) {
    const indice = this.fila.indexOf(cliente);
    if (indice > -1) {
      this.fila.splice(indice, 1);
      this.reorganizarFila(); // Esto hace que los de atrás se muevan al hueco
    }
  }
  // ... resto de métodos (agregarALaFila, etc.)
}