class Protagonista extends Persona {
  constructor(x, y, textures, juego) {
    super(x, y, textures, juego);
    
    this.velocidadMaxima = 5;

    this.itemSostenido = null; 
    
    this.spriteItem = new PIXI.Sprite(); 
    this.spriteItem.anchor.set(0.5, 1);
    this.spriteItem.y = -60; 
    this.spriteItem.visible = false; 
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
        this.spritesAnimados[key].scale.set(0.2); 
        this.spritesAnimados[key].animationSpeed = 0.04; 
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
    if (this.juego.teclado.l) {
      const interactuoConMostrador = this.entregarAlMostrador();
      if (!interactuoConMostrador) {
        this.interactuarConAnaquel();
      }
      delete this.juego.teclado.l; 
    }

    if (this.juego.teclado.p) {
      this.atraparLadronCercano();
      delete this.juego.teclado.p;
    }
  }

  atraparLadronCercano() {
    const ladron = this.juego.clientes.find(c => 
      c.esLadron && 
      c.itemSostenido !== null && 
      Math.hypot(c.posicion.x - this.posicion.x, c.posicion.y - this.posicion.y) < 100
    );

    if (ladron) {
      console.log("¡Atrapaste al ladrón!");
      
      if (ladron.itemSostenido && ladron.anaquelRobado) {
        ladron.anaquelRobado.agregarManga(ladron.itemSostenido);
        ladron.itemSostenido = null;
        ladron.spriteItem.visible = false;
        console.log("El manga fue devuelto a su anaquel.");
      }

      ladron.fsm.setState("Atrapado");
    }
  }

  entregarAlMostrador() {
    if (this.juego.mostradores.length === 0) return false;
    const mostrador = this.juego.mostradores[0];

    const distProta = Math.hypot(this.posicion.x - mostrador.posicion.x, this.posicion.y - mostrador.posicion.y);
    if (distProta > 150) return false; 

    if (mostrador.fila.length > 0) {
      const primerCliente = mostrador.fila[0];
      
      if (primerCliente.fsm && primerCliente.fsm.currentStateName === "EsperandoRespuesta") {
        if (this.itemSostenido === primerCliente.pedido) {
          primerCliente.fsm.setState("Atendido");
          
          const ganancia = this.juego.precios[this.itemSostenido].venta;
          if(this.juego.uiDinero) {
              this.juego.uiDinero.sumarDinero(ganancia);
          }

          if (this.juego.mangasVendidos === undefined) this.juego.mangasVendidos = 0;
          this.juego.mangasVendidos++;

          this.itemSostenido = null;
          this.spriteItem.visible = false;
          console.log(`¡Venta exitosa! Cobraste: $${ganancia}`);
        }
      }
    }
    return true;
  }

  interactuarConAnaquel() {
    const anaquelCercano = this.juego.anaqueles.find(a => 
      Math.hypot(a.posicion.x - this.posicion.x, a.posicion.y - this.posicion.y) < 150
    );

    if (!anaquelCercano) return;

    if (this.itemSostenido !== null) {
      if (anaquelCercano.agregarManga(this.itemSostenido)) {
        this.itemSostenido = null;
        this.spriteItem.visible = false;
      }
    } else {
      const mangaAgarrado = anaquelCercano.quitarManga();
      if (mangaAgarrado) {
        this.itemSostenido = mangaAgarrado;
        const textura = PIXI.Assets.get(mangaAgarrado);
        if (textura) {
            this.spriteItem.texture = textura;
            this.spriteItem.visible = true;
        }
      }
    }
  }

  manejarmeConElTeclado() {
    const fuerza = 0.002;
    let moviendoseHorizontal = false;

    if (this.juego.teclado.a) {
      this.aplicarFuerza(-fuerza, 0);
      moviendoseHorizontal = true;
      if (this.animacionQueEstamosUsandoAhorita !== "izquierda") this.cambiarAnimacion("izquierda");
    } else if (this.juego.teclado.d) {
      this.aplicarFuerza(fuerza, 0);
      moviendoseHorizontal = true;
      if (this.animacionQueEstamosUsandoAhorita !== "derecha") this.cambiarAnimacion("derecha");
    }

    if (this.juego.teclado.w) {
      this.aplicarFuerza(0, -fuerza);
      if (!moviendoseHorizontal && this.animacionQueEstamosUsandoAhorita !== "atras") this.cambiarAnimacion("atras");
    } else if (this.juego.teclado.s) {
      this.aplicarFuerza(0, fuerza);
      if (!moviendoseHorizontal && this.animacionQueEstamosUsandoAhorita !== "frente") this.cambiarAnimacion("frente");
    }
  }
}