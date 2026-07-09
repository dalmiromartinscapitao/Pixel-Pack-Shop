class Cliente extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    this.esLadron = Math.random() < 0.3; // 30% probabilidad de ser ladrón
    this.estado = "CAMINANDO_A_ANAQUEL";
    this.velocidadBase = 1.5;
    this.tiempoParpadeo = 0;
    
    if (this.esLadron && juego.anaqueles.length > 0) {
      this.target = juego.anaqueles[Math.floor(Math.random() * juego.anaqueles.length)];
    }
  }

  update() {
    // Lógica del ladrón
    if (this.esLadron) {
      if (this.estado === "CAMINANDO_A_ANAQUEL" && this.target) {
        const dist = Math.hypot(this.target.posicion.x - this.posicion.x, this.target.posicion.y - this.posicion.y);
        if (dist < 50) {
          this.estado = "ROBANDO";
        }
      }

      if (this.estado === "ROBANDO") {
        // Tinte titilante
        this.tiempoParpadeo++;
        this.container.tint = (this.tiempoParpadeo % 10 < 5) ? 0xFFFFFF : 0x000000;
        
        // Se va tras 2 segundos
        if (this.tiempoParpadeo > 120) { 
          this.estado = "HUYENDO";
          this.container.tint = 0xFFFFFF; // Reset color
          this.target = { posicion: { x: -100, y: -100 } }; // Punto de salida
        }
      }
    }

    super.update();
  }

  // Se llama desde Juego.js al presionar 'O'
  serAtrapado() {
    this.estado = "ATRAPADO_ROJO";
    this.container.tint = 0xFF0000; // Rojo
    this.velocidadBase *= 3; // Triple de velocidad
    // Aquí podrías añadir una lógica para que después de un tiempo se elimine
  }
}