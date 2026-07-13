
class TiendaUI {
    constructor(juego) {
        this.juego = juego;
        this.container = new PIXI.Container();
        this.juego.pixiApp.stage.addChild(this.container);

        this.visible = false;
        this.carrito = [];
        this.total = 0;

        this.catalogo = [
            { id: "mangaazul", nombre: "Azul" },
            { id: "mangarojo", nombre: "Rojo" },
            { id: "mangaverde", nombre: "Verde" },
            { id: "mangapurpura", nombre: "Púrpura" }
        ];

        window.addEventListener('keydown', (e) => {
            if (e.key === "Shift") this.toggleTienda();
        });

        this.crearBotonAcceso();
        this.crearMenuPrincipal();
    }

    crearBotonAcceso() {
        this.btnIcono = new PIXI.Sprite(PIXI.Assets.get('tienda_boton'));
        this.btnIcono.anchor.set(0.5);
        this.btnIcono.x = window.innerWidth / 2;
        this.btnIcono.y = window.innerHeight - 80;
        this.btnIcono.interactive = true;
        this.btnIcono.on('pointerdown', () => this.toggleTienda());
        this.container.addChild(this.btnIcono);
    }

    crearMenuPrincipal() {
        this.menu = new PIXI.Container();
        this.menu.visible = false;
        this.menu.x = window.innerWidth / 2;
        this.menu.y = window.innerHeight / 2;
        this.container.addChild(this.menu);

        const fondo = new PIXI.Sprite(PIXI.Assets.get('tienda_menu_fondo'));
        fondo.anchor.set(0.5);
        this.menu.addChild(fondo);

        this.areaContenido = new PIXI.Container();
        this.areaContenido.y = -100;
        this.menu.addChild(this.areaContenido);

        this.textoTotal = new PIXI.Text({ 
            text: "Total: $0", 
            style: { fontFamily: 'FuenteDinero', fill: 0xffffff, fontSize: 30 } 
        });
        this.textoTotal.anchor.set(0.5);
        this.textoTotal.y = 80;
        this.menu.addChild(this.textoTotal);

        this.btnConfirmar = new PIXI.Text({ 
            text: "COMPRAR", 
            style: { fontFamily: 'FuenteDinero', fill: 0x00ff00, fontSize: 24, fontWeight: 'bold' } 
        });
        this.btnConfirmar.anchor.set(0.5);
        this.btnConfirmar.x = 80;
        this.btnConfirmar.y = 150;
        this.btnConfirmar.interactive = true;
        this.btnConfirmar.on('pointerdown', () => this.ejecutarCompra());
        this.menu.addChild(this.btnConfirmar);

        this.btnCancelar = new PIXI.Text({ 
            text: "CANCELAR", 
            style: { fontFamily: 'FuenteDinero', fill: 0xff0000, fontSize: 24, fontWeight: 'bold' } 
        });
        this.btnCancelar.anchor.set(0.5);
        this.btnCancelar.x = -80;
        this.btnCancelar.y = 150;
        this.btnCancelar.interactive = true;
        this.btnCancelar.on('pointerdown', () => this.toggleTienda());
        this.menu.addChild(this.btnCancelar);

        this.renderizarCatalogo();
    }

    renderizarCatalogo() {
        this.areaContenido.removeChildren();
        const dineroActual = this.juego.uiDinero.dinero;

        this.catalogo.forEach((prod, i) => {
            if (!this.juego.precios[prod.id]) return;

            const cont = new PIXI.Container();
            cont.x = -180 + (i * 120);
            cont.y = 0;

            const precio = this.juego.precios[prod.id].compra;
            const noAlcanza = (this.total + precio > dineroActual);

            const textoPrecio = new PIXI.Text({ 
                text: `$${precio}`, 
                style: { fontFamily: 'FuenteDinero', fill: 0xffffff, fontSize: 22, fontWeight: 'bold' } 
            });
            textoPrecio.anchor.set(0.5);
            textoPrecio.y = -70;
            cont.addChild(textoPrecio);

            const sprite = new PIXI.Sprite(PIXI.Assets.get(prod.id));
            sprite.anchor.set(0.5);
            sprite.scale.set(2);
            sprite.tint = noAlcanza ? 0x555555 : 0xFFFFFF;
            cont.addChild(sprite);

            const btn = new PIXI.Text({ 
                text: "+", 
                style: { fontFamily: 'FuenteDinero', fill: noAlcanza ? 0x555555 : 0xffff00, fontSize: 40 } 
            });
            btn.anchor.set(0.5);
            btn.y = 80;
            btn.interactive = !noAlcanza;
            if (!noAlcanza) {
                btn.on('pointerdown', () => this.agregarAlCarrito(prod.id));
            }
            cont.addChild(btn);

            this.areaContenido.addChild(cont);
        });
    }

    agregarAlCarrito(id) {
        const precio = this.juego.precios[id].compra;
        if (this.total + precio > this.juego.uiDinero.dinero) return;

        this.carrito.push(id);
        this.total += precio;
        this.textoTotal.text = `Total: $${this.total}`;
        this.renderizarCatalogo();
    }

   ejecutarCompra() {
    if (this.carrito.length === 0) return;

    let costoReal = 0;
    this.carrito.forEach(item => {

        const anaquel = this.juego.anaqueles.find(a => 
            a.mangas.length < 14 && a.tipo === item
        );
        
        if (anaquel) {
            anaquel.agregarManga(item);
            costoReal += this.juego.precios[item].compra;
        } else {
            console.warn(`No hay anaqueles disponibles para: ${item}`);
        }
    });

    if (costoReal > 0) {
        this.juego.uiDinero.restarDinero(costoReal);
        this.resetTienda();
        this.toggleTienda();
    }
}

    resetTienda() {
        this.carrito = [];
        this.total = 0;
        this.textoTotal.text = "Total: $0";
        this.renderizarCatalogo();
    }

    toggleTienda() {
        this.menu.visible = !this.menu.visible;
        if (!this.menu.visible) {
            this.resetTienda();
        } else {
            this.renderizarCatalogo();
        }
    }
}