class Protagonista extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    
    this.velocidadMaxima = 5;

    if (this.spritesAnimados && this.spritesAnimados["frente"]) {
      this.cambiarAnimacion("frente");
    }
  }

  cargarSpritesAnimados(textureData) {
    if (textureData && textureData.animations) {
      super.cargarSpritesAnimados(textureData);
      
      for (let key of Object.keys(this.spritesAnimados)) {
        this.spritesAnimados[key].scale.set(0.45);
        this.spritesAnimados[key].animationSpeed = 0.1; 
      }
    } else {
      console.error("El JSON de protagonista no se cargó en el formato nativo de PixiJS.");
    }
  }

  manejarmeConElTeclado() {
    const fuerza = 0.002;
    let moviendoseHorizontal = false;
    let algunaTeclaPresionada = false;

    if (this.juego.teclado.a) {
      this.aplicarFuerza(-fuerza, 0);
      moviendoseHorizontal = true;
      algunaTeclaPresionada = true;
      if (this.animacionQueEstamosUsandoAhorita !== "izquierda") {
        this.cambiarAnimacion("izquierda");
      }
    } else if (this.juego.teclado.d) {
      this.aplicarFuerza(fuerza, 0);
      moviendoseHorizontal = true;
      algunaTeclaPresionada = true;
      if (this.animacionQueEstamosUsandoAhorita !== "derecha") {
        this.cambiarAnimacion("derecha");
      }
    }

    if (this.juego.teclado.w) {
      this.aplicarFuerza(0, -fuerza);
      algunaTeclaPresionada = true;
      if (!moviendoseHorizontal && this.animacionQueEstamosUsandoAhorita !== "atras") {
        this.cambiarAnimacion("atras");
      }
    } else if (this.juego.teclado.s) {
      this.aplicarFuerza(0, fuerza);
      algunaTeclaPresionada = true;
      if (!moviendoseHorizontal && this.animacionQueEstamosUsandoAhorita !== "frente") {
        this.cambiarAnimacion("frente");
      }
    }
 
    if (!algunaTeclaPresionada) {
     
      if (this.animacionQueEstamosUsandoAhorita === "frente" || this.animacionQueEstamosUsandoAhorita === "abajo") {
        if (this.spritesAnimados["idle"] && this.animacionQueEstamosUsandoAhorita !== "idle") {
          this.cambiarAnimacion("idle");
        }
      }
    }
  }

  update() {
    this.manejarmeConElTeclado();
    super.update();
  }
}