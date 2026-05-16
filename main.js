import {
  Application,
  Assets,
  Graphics,
  Sprite,
  Text,
  Container,

  NoiseFilter,
  BlurFilter,
  ColorMatrixFilter

} from 'pixi.js';

import { cards } from './cards.js';

(async () => {

  // =========================================
  // APP
  // =========================================

  const app = new Application();

  await app.init({
    resizeTo: window,
    backgroundColor: 0x1e1e1e
  });

  document.body.style.margin = '0';

  document.body.appendChild(app.canvas);

  // =========================================
  // MEDIDAS
  // =========================================

  const screenW = app.screen.width;
  const screenH = app.screen.height;

  const topHeight = screenH * 0.45;

  const leftPanelWidth = screenW * 0.40;
  const rightPanelWidth = screenW - leftPanelWidth;

  // =========================================
  // VARIABLES
  // =========================================

  let currentCardSprite = null;
  let currentCardIndex = null;

  let cardTexts = [];

  let magnifierEnabled = false;

  let zoomCard = null;
  let zoomMask = null;
  let zoomBorder = null;

  // =========================================
  // FONDO
  // =========================================

  const background = new Graphics()
    .rect(0, 0, screenW, screenH)
    .fill(0x161616);

  app.stage.addChild(background);

  // =========================================
  // TIENDA
  // =========================================

  const shopTexture =
    await Assets.load('./assets/tienda.png');

  const shop =
    new Sprite(shopTexture);

  shop.x = 20;
  shop.y = 20;

  shop.width = screenW - 40;
  shop.height = topHeight - 30;

  app.stage.addChild(shop);

  // =========================================
  // PANEL IZQUIERDO
  // =========================================

  const leftPanel = new Graphics()
    .roundRect(
      20,
      topHeight + 10,
      leftPanelWidth - 30,
      screenH - topHeight - 30,
      12
    )
    .fill(0x252525);

  app.stage.addChild(leftPanel);

  // =========================================
  // PANEL DERECHO
  // =========================================

  const rightPanel = new Graphics()
    .roundRect(
      leftPanelWidth,
      topHeight + 10,
      rightPanelWidth - 20,
      screenH - topHeight - 30,
      12
    )
    .fill(0x101010);

  app.stage.addChild(rightPanel);

  // =========================================
  // BOTON REAL
  // =========================================

  const realButton = new Graphics()
    .roundRect(
      leftPanelWidth + 20,
      topHeight + 20,
      140,
      50,
      10
    )
    .fill(0x3fa34d);

  realButton.eventMode = 'static';
  realButton.cursor = 'pointer';

  app.stage.addChild(realButton);

  const realText = new Text({
    text: 'REAL',
    style: {
      fill: 0xffffff,
      fontSize: 22
    }
  });

  realText.x = leftPanelWidth + 55;
  realText.y = topHeight + 32;

  app.stage.addChild(realText);

  // =========================================
  // BOTON FALSA
  // =========================================

  const fakeButton = new Graphics()
    .roundRect(
      leftPanelWidth + 180,
      topHeight + 20,
      140,
      50,
      10
    )
    .fill(0xb33939);

  fakeButton.eventMode = 'static';
  fakeButton.cursor = 'pointer';

  app.stage.addChild(fakeButton);

  const fakeText = new Text({
    text: 'FALSA',
    style: {
      fill: 0xffffff,
      fontSize: 22
    }
  });

  fakeText.x = leftPanelWidth + 210;
  fakeText.y = topHeight + 32;

  app.stage.addChild(fakeText);

  // =========================================
  // LUPA
  // =========================================

  const magnifierTexture =
    await Assets.load('./assets/lupa.png');

  const magnifierButton =
    new Sprite(magnifierTexture);

  magnifierButton.width = 70;
  magnifierButton.height = 70;

  magnifierButton.x = screenW - 100;
  magnifierButton.y = screenH - 100;

  magnifierButton.alpha = 0.5;

  magnifierButton.eventMode = 'static';
  magnifierButton.cursor = 'pointer';

  app.stage.addChild(magnifierButton);

  magnifierButton.on(
    'pointerdown',
    () => {

      magnifierEnabled =
        !magnifierEnabled;

      magnifierButton.alpha =
        magnifierEnabled
          ? 1
          : 0.5;

    }
  );

  // =========================================
  // CLIENTE
  // =========================================

  const customer =
    new Container();

  customer.cards = [

  {
    ...cards.blueDragon,
    fake: Math.random() < 0.4
  },

  {
    ...cards.darkWizard,
    fake: Math.random() < 0.4
  },

  {
    ...cards.fireKnight,
    fake: Math.random() < 0.4
  }

];

  customer.speed = 1.5;

  customer.arrived = false;

  customer.leaving = false;

  // =========================================
  // SPRITE CLIENTE
  // =========================================

  const customerTexture =
    await Assets.load('./assets/customer.png');

  const customerSprite =
    new Sprite(customerTexture);

  customerSprite.anchor.set(0.5);

  customerSprite.scale.set(1);

  customer.addChild(customerSprite);

  customer.x = 80;
  customer.y = 240;

  app.stage.addChild(customer);

  // =========================================
  // FUNCION MOSTRAR CARTA
  // =========================================

  async function showCard(card, index) {

    currentCardIndex = index;

    // =====================================
    // LIMPIAR CARTA ANTERIOR
    // =====================================

    if (currentCardSprite) {

      app.stage.removeChild(
        currentCardSprite
      );

    }

    if (zoomCard) {

      app.stage.removeChild(
        zoomCard
      );

    }

    if (zoomMask) {

      app.stage.removeChild(
        zoomMask
      );

    }

    if (zoomBorder) {

      app.stage.removeChild(
        zoomBorder
      );

    }

    // =====================================
    // CARGAR TEXTURA
    // =====================================

    const texture =
      await Assets.load(
        card.image
      );

    // =====================================
    // CREAR SPRITE
    // =====================================

    const sprite =
      new Sprite(texture);

    sprite.anchor.set(0.5);

    sprite.x =
      leftPanelWidth +
      (rightPanelWidth / 2);

    sprite.y =
      topHeight + 280;

    sprite.width = 250;
    sprite.height = 350;

    sprite.eventMode = 'static';

    app.stage.addChild(sprite);

    currentCardSprite =
      sprite;

    // =====================================
    // ZOOM
    // =====================================

    zoomCard =
      new Sprite(texture);

      if (card.fake) {

  // =========================
  // RUIDO
  // =========================

  const noise =
    new NoiseFilter();

  noise.noise = 0.18;

  // =========================
  // BLUR
  // =========================

  const blur =
    new BlurFilter();

  blur.blur = 1.5;

  // =========================
  // COLOR
  // =========================

  const color =
    new ColorMatrixFilter();

  color.desaturate();

  // =========================
  // APLICAR
  // =========================

  zoomCard.filters = [

    noise,
    blur,
    color

  ];

}

    zoomCard.anchor.set(0.5);

    zoomCard.width = 500;
    zoomCard.height = 700;

    zoomCard.visible = false;

    app.stage.addChild(zoomCard);

    // =====================================
    // MASK
    // =====================================

    zoomMask =
      new Graphics()
        .circle(0, 0, 140)
        .fill(0xffffff);

    zoomMask.visible = false;

    app.stage.addChild(zoomMask);

    // =====================================
    // BORDER
    // =====================================

    zoomBorder =
      new Graphics()
        .circle(0, 0, 140)
        .stroke({
          color: 0xffffff,
          width: 5
        });

    zoomBorder.visible = false;

    app.stage.addChild(zoomBorder);

    zoomCard.mask = zoomMask;

    // =====================================
    // MOVIMIENTO LUPA
    // =====================================

    sprite.on(
      'pointermove',
      (event) => {

        if (!magnifierEnabled) {

          zoomMask.visible = false;
          zoomBorder.visible = false;
          zoomCard.visible = false;

          return;

        }

        const mouse =
          event.global;

        zoomMask.visible = true;
        zoomBorder.visible = true;
        zoomCard.visible = true;

        zoomMask.x = mouse.x;
        zoomMask.y = mouse.y;

        zoomBorder.x = mouse.x;
        zoomBorder.y = mouse.y;

        const localX =
          mouse.x - sprite.x;

        const localY =
          mouse.y - sprite.y;

        zoomCard.x =
          sprite.x -
          (localX * 2);

        zoomCard.y =
          sprite.y -
          (localY * 2);

      }
    );

    // =====================================
    // OUT
    // =====================================

    sprite.on(
      'pointerout',
      () => {

        zoomMask.visible = false;
        zoomBorder.visible = false;
        zoomCard.visible = false;

      }
    );

  }

  // =========================================
  // LISTA CARTAS
  // =========================================

  function renderCards() {

    // =====================================
    // LIMPIAR
    // =====================================

    cardTexts.forEach((text) => {

      app.stage.removeChild(text);

    });

    cardTexts = [];

    let startY = topHeight + 100;

    // =====================================
    // CREAR TEXTOS
    // =====================================

    customer.cards.forEach(
      (card, index) => {

        const cardText =
          new Text({

            text: card.name,

            style: {
              fill: 0xffffff,
              fontSize: 24
            }

          });

        cardText.x = 50;
        cardText.y = startY;

        startY += 50;

        // IMPORTANTE

        cardText.eventMode =
          'static';

        cardText.cursor =
          'pointer';

        // agregar al stage

        app.stage.addChild(
          cardText
        );

        cardTexts.push(
          cardText
        );

        // =================================
        // CLICK
        // =================================

        cardText.on(
          'pointerdown',
          () => {

            console.log(
              'CLICK EN:',
              card.name
            );

            showCard(
              card,
              index
            );

          }
        );

      }
    );

  }

  // =========================================
  // BOTON REAL
  // =========================================

  realButton.on(
    'pointerdown',
    () => {

      if (
        currentCardIndex == null
      ) return;

      customer.cards.splice(
        currentCardIndex,
        1
      );

      if (currentCardSprite) {

        app.stage.removeChild(
          currentCardSprite
        );

      }

      currentCardSprite = null;

      renderCards();

    }
  );

  // =========================================
  // BOTON FALSA
  // =========================================

  fakeButton.on(
    'pointerdown',
    () => {

      if (
        currentCardIndex == null
      ) return;

      customer.cards.splice(
        currentCardIndex,
        1
      );

      if (currentCardSprite) {

        app.stage.removeChild(
          currentCardSprite
        );

      }

      currentCardSprite = null;

      renderCards();

    }
  );

  // =========================================
  // GAME LOOP
  // =========================================

  app.ticker.add(() => {

    // entrar

    if (
      !customer.arrived &&
      !customer.leaving
    ) {

      customer.x += customer.speed;

      if (
        customer.x >=
        screenW - 360
      ) {

        customer.arrived = true;

        renderCards();

      }

    }

    // salir

    if (
      customer.leaving
    ) {

      customer.x -= 3;

      customer.scale.x = -1;

    }

    // irse

    if (
      customer.cards.length === 0
    ) {

      customer.leaving = true;

    }

  });

})();