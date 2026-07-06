class Cliente extends Persona {
  constructor(x, y, textures, juego) {
    const apareceIzquierda = Math.random() > 0.5;
    const spawnX = apareceIzquierda ? 50 : juego.anchoMundo - 50;
    const spawnY = juego.altoMundo - 20;

    super(spawnX, spawnY, textures, juego);

    this.juego.clientes.push(this);
    this.velocidadMaxima = 1.5; 
    this.container.tint = 0xffffff; 

    this.puntoSpawn = { x: spawnX, y: spawnY };
    this.estado = "COMPRANDO"; 
    
    this.distanciaPersonal = 20;
    this.clientesCercaMio = [];
    this.despachado = false; 

    if (this.juego.mostradores.length > 0) {
      this.target = this.juego.mostradores[0];
      this.target.agregarALaFila(this);
    } else {
      this.target = this.puntoSpawn;
      this.estado = "SALIENDO";
    }
  }

  obtenerClientesCerca() {
    this.clientesCercaMio = [];
    for (let i = 0; i < this.juego.clientes.length; i++) {
      const otro = this.juego.clientes[i];
      if (otro !== this && !otro.despachado) {
        const dist = Math.hypot(otro.posicion.x - this.posicion.x, otro.posicion.y - this.posicion.y);
        if (dist < 80) this.clientesCercaMio.push(otro);
      }
    }
  }

  separacion() {
    if (this.clientesCercaMio.length === 0) return;
    const fuerzaMax = 0.0002;
    for (let i = 0; i < this.clientesCercaMio.length; i++) {
      const otro = this.clientesCercaMio[i];
      let dx = otro.posicion.x - this.posicion.x;
      let dy = otro.posicion.y - this.posicion.y;
      let dist = Math.hypot(dx, dy);

      if (dist > 0 && dist < this.distanciaPersonal) {
        const ratio = this.distanciaPersonal / dist;
        this.aplicarFuerza(-(dx / dist) * fuerzaMax * ratio, -(dy / dist) * fuerzaMax * ratio);
      }
    }
  }

  irHaciaTarget() {
    if (!this.target) return;

    let destinoX = this.target.posicion ? this.target.posicion.x : this.target.x;
    let destinoY = this.target.posicion ? this.target.posicion.y : this.target.y;


    if (this.estado === "COMPRANDO" && this.target.fila) {
      const miPosicionEnFila = this.target.fila.indexOf(this);
      if (miPosicionEnFila !== -1) {
        destinoY = this.target.posicion.y + 60 + (miPosicionEnFila * 70);
      }
    }

    const dx = destinoX - this.posicion.x;
    const dy = destinoY - this.posicion.y;
    const distancia = Math.hypot(dx, dy);


    if (distancia > 15) {
      const fuerzaCaminata = 0.00015;
      this.aplicarFuerza((dx / distancia) * fuerzaCaminata, (dy / distancia) * fuerzaCaminata);

      if (this.spritesAnimados && Object.keys(this.spritesAnimados).length > 0) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.cambiarAnimacion(dx > 0 ? "derecha" : "izquierda");
        } else {
          this.cambiarAnimacion(dy > 0 ? "frente" : "atras");
        }
      }
    } else {
      
      Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
      if (this.estado === "COMPRANDO") {
        this.cambiarAnimacion("atras"); 
      }
    }
  }

  eliminarDePantalla() {
    this.despachado = true;
    if (this.body) Matter.Composite.remove(this.juego.world, this.body);
    this.container.visible = false;
    Matter.Body.setPosition(this.body, { x: -9999, y: -9999 }); 
    
    const index = this.juego.clientes.indexOf(this);
    if (index > -1) this.juego.clientes.splice(index, 1);
  }

  update() {
    if (this.despachado) return;

    const enFila = this.target && this.target.fila && this.target.fila.includes(this);
    if (!enFila) {
      this.obtenerClientesCerca();
      this.separacion();
    }

    if (this.estado === "SALIENDO") {
      const distSalida = Math.hypot(this.target.x - this.posicion.x, this.target.y - this.posicion.y);
      if (distSalida < 40) {
        this.eliminarDePantalla();
        return; 
      }
    }

    this.irHaciaTarget();
    super.update();
  }
}