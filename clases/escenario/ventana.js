class Ventana {
    constructor(x, y, juego, sheet, escala = 0.5) { 
        this.juego = juego;
        this.tiempoAcumulado = 0;
        this.frameActual = 0;

        this.texturas = [];
        for (let i = 0; i < 12; i++) {
            this.texturas.push(sheet.textures[`ventana_${i}`]);
        }

        this.sprite = new PIXI.Sprite(this.texturas[0]);
        this.sprite.anchor.set(0.5);
        
        this.sprite.scale.set(escala); 
        
        this.sprite.x = x;
        this.sprite.y = y;
        
        this.juego.containerPrincipal.addChild(this.sprite);
        this.juego.gameObjects.push(this);
    }

   update() {
    
    const tiempoTranscurrido = performance.now() - this.juego.tiempoInicio;

 
    let nuevoFrame = Math.floor((tiempoTranscurrido / this.juego.duracionNivel) * 12);

    
    if (nuevoFrame > 11) nuevoFrame = 11;
    if (nuevoFrame < 0) nuevoFrame = 0;

    if (this.frameActual !== nuevoFrame) {
        this.frameActual = nuevoFrame;
        this.sprite.texture = this.texturas[this.frameActual];
    }
}
}