class Anaquel extends GameObject {
    constructor(x, y, juego, spritesheet, tipo, escala = 1) {
        super(x, y, juego);
        
        this.sheet = spritesheet;
        this.tipo = tipo; // Ej: "mangaazul", "mangarojo", etc.
        
        this.sprite = new PIXI.Sprite();
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(escala);
        this.container.addChild(this.sprite);

        // Inicializamos vacío
        this.mangas = []; 
        
        this.actualizarVisual();

        const ancho = 111 * escala;
        const alto = 187 * escala;
        this.offsetY = alto*0.1 

        this.body = Matter.Bodies.rectangle(x, y - (alto / 2), ancho, alto/4, { isStatic: true });
        Matter.Composite.add(juego.world, this.body);

        juego.anaqueles.push(this);
    }

    actualizarVisual() {
        let cantidad = this.mangas.length;
        if (cantidad > 14) cantidad = 14; 
        this.sprite.texture = this.sheet.textures[`frame_${cantidad}`];
    }

    quitarManga() {
        if (this.mangas.length > 0) {
            const mangaSacado = this.mangas.pop();
            this.actualizarVisual();
            return mangaSacado; 
        }
        return false; 
    }

    agregarManga(tipoMangaIngresado) {
        // Restricción: No mezclar colores
        if (this.mangas.length > 0 && this.mangas[0] !== tipoMangaIngresado) {
            console.warn("Este anaquel es de otro color.");
            return false;
        }

        if (this.mangas.length < 14) { 
            this.mangas.push(tipoMangaIngresado);
            this.actualizarVisual();
            return true;
        }
        return false; 
    }

    getTipo() {
        return this.tipo;
    }
}