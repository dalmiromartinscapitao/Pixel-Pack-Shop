
class MenuPrincipal {
    constructor(juego) {
        this.juego = juego;
        this.container = new PIXI.Container();
        this.juego.pixiApp.stage.addChild(this.container);

        const fondo = new PIXI.Sprite(PIXI.Assets.get('menu_fondo'));
        fondo.width = window.innerWidth;
        fondo.height = window.innerHeight;
        this.container.addChild(fondo);

        const titulo = new PIXI.Text({ 
            text: "Pixel Pack Shop", 
            style: { fontFamily: 'FuenteDinero', fill: 0xffffff, fontSize: 100, fontWeight: 'bold', stroke: {color: 0x000000, width: 5} } 
        });
        titulo.anchor.set(0.5);
        titulo.x = window.innerWidth / 2;
        titulo.y = 150;
        this.container.addChild(titulo);

        this.btnComenzar = this.crearBoton("COMENZAR", 350, () => {
            this.juego.iniciarMusica();
            this.container.visible = false;
            this.juego.crearNivel();
        });

        this.btnTutorial = this.crearBoton("TUTORIAL", 450, () => {
            this.contenedorTutorial.visible = true;
        });

        this.container.addChild(this.btnComenzar);
        this.container.addChild(this.btnTutorial);

        this.crearTutorial();
    }

    crearBoton(texto, y, callback) {
        const btn = new PIXI.Text({ 
            text: texto, 
            style: { fontFamily: 'FuenteDinero', fill: 0xffff00, fontSize: 50, fontWeight: 'bold' } 
        });
        btn.anchor.set(0.5);
        btn.x = window.innerWidth / 2;
        btn.y = y;
        btn.interactive = true;
        btn.cursor = 'pointer';
        
        btn.on('pointerover', () => { btn.style.fill = 0xffffff; btn.scale.set(1.1); });
        btn.on('pointerout', () => { btn.style.fill = 0xffff00; btn.scale.set(1); });
        btn.on('pointerdown', callback);
        return btn;
    }

    crearTutorial() {
        this.contenedorTutorial = new PIXI.Container();
        this.contenedorTutorial.visible = false;
        
        const imgTutorial = new PIXI.Sprite(PIXI.Assets.get('tutorial_img'));
        imgTutorial.anchor.set(0.5);
        imgTutorial.x = window.innerWidth / 2;
        imgTutorial.y = window.innerHeight / 2;
        this.contenedorTutorial.addChild(imgTutorial);

        const btnCerrar = new PIXI.Text({ 
            text: "VOLVER", 
            style: { fontFamily: 'FuenteDinero', fill: 0xff0000, fontSize: 40 } 
        });
        btnCerrar.anchor.set(1); 
        btnCerrar.x = window.innerWidth - 50;
        btnCerrar.y = window.innerHeight - 50;
        btnCerrar.interactive = true;
        btnCerrar.on('pointerdown', () => this.contenedorTutorial.visible = false);
        btnCerrar.on('pointerover', () => btnCerrar.scale.set(1.1));
        btnCerrar.on('pointerout', () => btnCerrar.scale.set(1));
        
        this.contenedorTutorial.addChild(btnCerrar);
        this.container.addChild(this.contenedorTutorial);
    }
}