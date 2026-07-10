class Protagonista extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    
    this.velocidadMaxima = 5;

    // --- SISTEMA DE INVENTARIO ---
    this.itemSostenido = null; // null significa manos vacías
    
    // Inicializamos el spriteItem vacío para asignarle la textura dinámicamente
    this.spriteItem = new PIXI.Sprite(); 
    this.spriteItem.anchor.set(0.5, 1);
    
    // La coordenada Y negativa lo empuja hacia arriba para flotar sobre la cabeza
    this.spriteItem.y = -60; 
    this.spriteItem.visible = false; 
    
    // Configuración para que se dibuje por delante del sprite del jugador
    this.spriteItem.zIndex = 100;
    this.container.sortableChildren = true;
    this.container.addChild(this.spriteItem);

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
      console.error("El JSON de protagonista no se cargó correctamente.");
    }
  }

  update() {
    this.manejarmeConElTeclado();
    this.manejarAcciones(); 
    super.update(); 
  }

  manejarAcciones() {
    // Interacción con el Anaquel (Tecla L)
    if (this.juego.teclado.l) {
      this.interactuarConAnaquel();
      delete this.juego.teclado.l; 
    }

    // Interacción con el Mostrador (Tecla P)
    if (this.juego.teclado.p) {
      this.entregarAlMostrador();
    }
  }

  interactuarConAnaquel() {
    const anaquelCercano = this.juego.anaqueles.find(a => 
      Math.hypot(a.posicion.x - this.posicion.x, a.posicion.y - this.posicion.y) < 150
    );

    if (!anaquelCercano) return;

    if (this.itemSostenido !== null) {
      // SI YA TENEMOS UN MANGA: Intentamos devolverlo
      // Pasamos el itemSostenido como argumento
      if (anaquelCercano.agregarManga(this.itemSostenido)) {
        this.itemSostenido = null;
        this.spriteItem.visible = false;
        console.log("Dejaste el manga en el anaquel.");
      } else {
        console.log("El anaquel está lleno o no acepta este tipo.");
      }
    } else {
      // SI ESTAMOS VACÍOS: Intentamos sacar un manga
      const mangaAgarrado = anaquelCercano.quitarManga();
      
      if (mangaAgarrado) {
        this.itemSostenido = mangaAgarrado;
        
        // Buscamos la textura en el AssetCache usando el nombre del manga
        const textura = PIXI.Assets.get(mangaAgarrado);
        if (textura) {
            this.spriteItem.texture = textura;
            this.spriteItem.visible = true;
        } else {
            console.warn(`No se encontró la textura para: ${mangaAgarrado}`);
        }
        
        console.log(`Agarraste un ${mangaAgarrado} del anaquel.`);
      } else {
        console.log("El anaquel está vacío.");
      }
    }
  }

  entregarAlMostrador() {
    if (!this.itemSostenido) return;

    const mostrador = this.juego.mostradores[0];
    if (!mostrador) return;

    const distProta = Math.hypot(this.posicion.x - mostrador.posicion.x, this.posicion.y - mostrador.posicion.y);
    
    if (distProta < 150 && mostrador.fila.length > 0) {
      const primerCliente = mostrador.fila[0];
      
      if (primerCliente.fsm && primerCliente.fsm.currentStateName === "EsperandoRespuesta") {
        this.itemSostenido = null;
        this.spriteItem.visible = false;
        console.log("Manga entregado al cliente.");
      }
    }
  }

  manejarmeConElTeclado() {
    const fuerza = 0.002;
    let moviendoseHorizontal = false;

    if (this.juego.teclado.a) {
      this.aplicarFuerza(-fuerza, 0);
      moviendoseHorizontal = true;
      if (this.animacionQueEstamosUsandoAhorita !== "izquierda") {
        this.cambiarAnimacion("izquierda");
      }
    } else if (this.juego.teclado.d) {
      this.aplicarFuerza(fuerza, 0);
      moviendoseHorizontal = true;
      if (this.animacionQueEstamosUsandoAhorita !== "derecha") {
        this.cambiarAnimacion("derecha");
      }
    }

    if (this.juego.teclado.w) {
      this.aplicarFuerza(0, -fuerza);
      if (!moviendoseHorizontal && this.animacionQueEstamosUsandoAhorita !== "atras") {
        this.cambiarAnimacion("atras");
      }
    } else if (this.juego.teclado.s) {
      this.aplicarFuerza(0, fuerza);
      if (!moviendoseHorizontal && this.animacionQueEstamosUsandoAhorita !== "frente") {
        this.cambiarAnimacion("frente");
      }
    }
  }
}