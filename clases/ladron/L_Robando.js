class L_Robando extends FSMState {
  update() {
    Matter.Body.setVelocity(this.owner.body, { x: 0, y: 0 }); 
    const colorBlink = (this.currentFrame % 20 < 10) ? 0xFFFFFF : 0xFFE700;
    if (this.owner.spritesAnimados) {
      for (let key in this.owner.spritesAnimados) {
        this.owner.spritesAnimados[key].tint = colorBlink;
      }
    }
  }
  
  doChecks() {
    if (this.currentFrame > 150) { 
      
     
      if (this.owner.spritesAnimados) {
        for (let key in this.owner.spritesAnimados) {
          this.owner.spritesAnimados[key].tint = 0xFFFFFF;
        }
      }

    
      const tipoManga = this.owner.anaquelRobado.getTipo();
      const mangaRobado = this.owner.anaquelRobado.quitarManga();
      
      if (mangaRobado) {
        this.owner.itemSostenido = tipoManga; 
        
        
        const textura = PIXI.Assets.get(tipoManga);
        if (textura) {
            this.owner.spriteItem.texture = textura;
            this.owner.spriteItem.visible = true;
            this.owner.spriteItem.alpha = 1;
            console.log("¡Ladrón robó: " + tipoManga + "!");
        }
      } else {
        console.log("Anaquel vacío.");
      }
      
     
      this.fsm.setState("YendoPuerta");
    }
  }
}