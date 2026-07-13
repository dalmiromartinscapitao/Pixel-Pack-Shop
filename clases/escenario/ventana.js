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
        this.tiempoAcumulado += 16.6; 
        if (this.tiempoAcumulado >= 20000) { 
            this.tiempoAcumulado = 0;
            this.frameActual = (this.frameActual + 1) % 12;
            this.sprite.texture = this.texturas[this.frameActual];
        }
    }
}