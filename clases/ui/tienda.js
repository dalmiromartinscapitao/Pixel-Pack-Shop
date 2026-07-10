class TiendaUI {
    constructor(juego) {
        this.juego = juego;
        this.container = new PIXI.Container();
        this.juego.pixiApp.stage.addChild(this.container);

        this.visible = false;
        this.carrito = [];
        this.total = 0;
        this.precioPorManga = 20;

        // Catálogo de productos
        this.catalogo = [
            { id: "mangaazul", nombre: "Azul" },
            { id: "mangarojo", nombre: "Rojo" },
            { id: "mangaverde", nombre: "Verde" },
            { id: "mangapurpura", nombre: "Púrpura" }
        ];

        this.crearBotonAcceso();
        this.crearMenuPrincipal();
    }

    crearBotonAcceso() {
        // Botón para abrir/cerrar la tienda
        this.btnIcono = new PIXI.Sprite(PIXI.Assets.get('tienda_boton'));
        this.btnIcono.anchor.set(0.5);
        this.btnIcono.x = window.innerWidth / 2;
        this.btnIcono.y = window.innerHeight - 80;
        this.btnIcono.interactive = true;
        this.btnIcono.buttonMode = true;
        this.btnIcono.on('pointerdown', () => this.toggleTienda());
        this.container.addChild(this.btnIcono);
    }

    crearMenuPrincipal() {
        this.menu = new PIXI.Container();
        this.menu.visible = false;
        this.menu.x = window.innerWidth / 2;
        this.menu.y = window.innerHeight / 2;
        this.container.addChild(this.menu);

        // Fondo del menú
        const fondo = new PIXI.Sprite(PIXI.Assets.get('tienda_menu_fondo'));
        fondo.anchor.set(0.5);
        this.menu.addChild(fondo);

        // Área de productos
        this.areaContenido = new PIXI.Container();
        this.areaContenido.y = -100;
        this.menu.addChild(this.areaContenido);

        // Texto Total
        this.textoTotal = new PIXI.Text({ text: "Total: $0", style: { fill: 0xffffff, fontSize: 24 } });
        this.textoTotal.anchor.set(0.5);
        this.textoTotal.y = 100;
        this.menu.addChild(this.textoTotal);

        // --- BOTÓN DE CONFIRMAR ---
        this.btnConfirmar = new PIXI.Text({ text: "CONFIRMAR COMPRA", style: { fill: 0x00ff00, fontSize: 22, fontWeight: 'bold' } });
        this.btnConfirmar.anchor.set(0.5);
        this.btnConfirmar.y = 160;
        this.btnConfirmar.interactive = true;
        // Fondo para el botón (rectángulo clicable)
        this.btnConfirmar.hitArea = new PIXI.Rectangle(-100, -20, 200, 40);
        
        this.btnConfirmar.on('pointerdown', () => this.ejecutarCompra());
        this.menu.addChild(this.btnConfirmar);

        this.renderizarCatalogo();
    }

    renderizarCatalogo() {
        this.areaContenido.removeChildren();
        
        this.catalogo.forEach((prod, i) => {
            const cont = new PIXI.Container();
            cont.x = -150 + (i * 100);
            cont.y = 0;

            const sprite = new PIXI.Sprite(PIXI.Assets.get(prod.id));
            sprite.scale.set(0.4);
            cont.addChild(sprite);

            const btn = new PIXI.Text({ text: "+", style: { fill: 0xffff00, fontSize: 30 } });
            btn.anchor.set(0.5);
            btn.y = 80;
            btn.interactive = true;
            btn.on('pointerdown', () => this.agregarAlCarrito(prod.id));
            cont.addChild(btn);

            this.areaContenido.addChild(cont);
        });
    }

    agregarAlCarrito(id) {
        this.carrito.push(id);
        this.total += this.precioPorManga;
        this.textoTotal.text = `Total: $${this.total}`;
    }

    ejecutarCompra() {
        if (this.carrito.length === 0) return;

        // Validar dinero
        if (this.juego.uiDinero.dinero < this.total) {
            console.warn("No tienes suficiente dinero.");
            return;
        }

        let comprasRealizadas = 0;

        this.carrito.forEach(item => {
            // Buscar anaquel que acepte el tipo (o esté vacío)
            const anaquel = this.juego.anaqueles.find(a => 
                a.mangas.length < 14 && (a.mangas.length === 0 || a.mangas[0] === item)
            );
            
            if (anaquel) {
                anaquel.agregarManga(item);
                comprasRealizadas++;
            }
        });

        if (comprasRealizadas > 0) {
            this.juego.uiDinero.restarDinero(comprasRealizadas * this.precioPorManga);
            this.carrito = [];
            this.total = 0;
            this.textoTotal.text = "Total: $0";
            this.toggleTienda(); // Cierra el menú tras comprar
        }
    }

    toggleTienda() {
        this.menu.visible = !this.menu.visible;
    }
}