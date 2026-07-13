class PantallaResumen {
    constructor(juego) {
        this.juego = juego;
        this.container = new PIXI.Container();
        this.container.visible = false;
        this.container.zIndex = 1000; 
        this.juego.pixiApp.stage.addChild(this.container);

        const fondoNegro = new PIXI.Graphics();
        fondoNegro.rect(0, 0, window.innerWidth, window.innerHeight);
        fondoNegro.fill(0x000000);
        this.container.addChild(fondoNegro);

        const papel = new PIXI.Sprite(PIXI.Assets.get('resumen_dia'));
        papel.anchor.set(0.5);
        papel.x = window.innerWidth / 2;
        papel.y = window.innerHeight / 2;
        this.container.addChild(papel);

        const titulo = new PIXI.Text({
            text: "RESUMEN DEL DIA",
            style: { fontFamily: 'FuenteDinero', fill: 0x000000, fontSize: 65, fontWeight: 'bold' }
        });
        titulo.anchor.set(0.5);
        titulo.x = window.innerWidth / 2;
        titulo.y = window.innerHeight / 2 - 130; 
        this.container.addChild(titulo);

        this.textoMangas = new PIXI.Text({
            text: "Mangas Vendidos: 0",
            style: { fontFamily: 'FuenteDinero', fill: 0x333333, fontSize: 40 }
        });
        this.textoMangas.anchor.set(0.5);
        this.textoMangas.x = window.innerWidth / 2;
        this.textoMangas.y = window.innerHeight / 2 - 40;
        this.container.addChild(this.textoMangas);

        this.textoDinero = new PIXI.Text({
            text: "Dinero Final: $0",
            style: { fontFamily: 'FuenteDinero', fill: 0x006600, fontSize: 45, fontWeight: 'bold' }
        });
        this.textoDinero.anchor.set(0.5);
        this.textoDinero.x = window.innerWidth / 2;
        this.textoDinero.y = window.innerHeight / 2 + 20;
        this.container.addChild(this.textoDinero);
        
        this.textoAnterior = new PIXI.Text({
            text: "",
            style: { fontFamily: 'FuenteDinero', fill: 0x555555, fontSize: 30, fontStyle: 'italic' }
        });
        this.textoAnterior.anchor.set(0.5);
        this.textoAnterior.x = window.innerWidth / 2;
        this.textoAnterior.y = window.innerHeight / 2 + 80;
        this.container.addChild(this.textoAnterior);

        this.btnReintentar = this.crearBoton("REINTENTAR DIA", window.innerHeight / 2 + 160, () => {
            this.container.visible = false;
            this.juego.reiniciarNivel();
        });
        this.container.addChild(this.btnReintentar);

        this.btnMenu = this.crearBoton("MENU PRINCIPAL", window.innerHeight / 2 + 230, () => {
            this.container.visible = false;
            this.juego.volverAlMenu();
        });
        this.container.addChild(this.btnMenu);
    }

    crearBoton(texto, y, callback) {
        const btn = new PIXI.Text({
            text: texto,
            style: { fontFamily: 'FuenteDinero', fill: 0xffffff, fontSize: 35, stroke: {color: 0x000000, width: 4} }
        });
        btn.anchor.set(0.5);
        btn.x = window.innerWidth / 2;
        btn.y = y;
        btn.interactive = true;
        btn.cursor = 'pointer';

        btn.on('pointerover', () => { btn.scale.set(1.1); btn.style.fill = 0xffff00; });
        btn.on('pointerout', () => { btn.scale.set(1); btn.style.fill = 0xffffff; });
        btn.on('pointerdown', callback);

        return btn;
    }

    mostrar() {
        this.container.visible = true;
        this.textoMangas.text = `Mangas Vendidos: ${this.juego.mangasVendidos}`;
        this.textoDinero.text = `Dinero Final: $${this.juego.uiDinero.dinero}`;

        // Mostrar resumen anterior solo si hay datos
        if (this.juego.mangasAnterior > 0 || this.juego.dineroAnterior > 0) {
            this.textoAnterior.text = `DIA ANTERIOR: ${this.juego.mangasAnterior} mangas | $${this.juego.dineroAnterior}`;
        } else {
            this.textoAnterior.text = "";
        }
    }
}