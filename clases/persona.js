class Persona extends GameObject {
  constructor(x, y, textures, juego) {
    super(x, y, juego);

    this.juego.personas.push(this);
    this.velocidadMaxima = 5;

    this.offsetY = 14; 

    this.body = Matter.Bodies.circle(x, y, 12, {
      frictionAir: 0.15,
    });

    Matter.Composite.add(this.juego.world, this.body);

    this.cargarSpritesAnimados(textures);
    this.cambiarAnimacion("abajo");
  }

  aplicarFuerza(x, y) {
    Matter.Body.applyForce(this.body, this.body.position, { x, y });
  }

  limitarVelocidad() {
    const vel = this.body.velocity;
    const velocidad = Math.hypot(vel.x, vel.y);

    if (velocidad > this.velocidadMaxima) {
      const factor = this.velocidadMaxima / velocidad;
      Matter.Body.setVelocity(this.body, {
        x: vel.x * factor,
        y: vel.y * factor,
      });
    }
  }

  update() {
    this.limitarVelocidad();
    super.update();
  }

  render() {
    super.render(); 
  }
}