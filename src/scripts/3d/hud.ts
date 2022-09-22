//------------------------------------------------- HUD

import { Scene3D } from '@enable3d/phaser-extension';

export class HUD {

  private scene: Phaser.Scene | any
  private initialized: boolean = false;
  private score: Phaser.GameObjects.Text
  private scoreText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, HUDType: string)
    {
      this.scene = scene;
      this._init();
    }

    private _init(): void
    { 
  
    //------------- UI


      ////score text

        this.score = this.scene.add.text(50, 50, 'SCORE: ', {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.scoreText = this.scene.add.text(180, 50, this.scene.score.toString(), {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.initialized = true;

      //listen for resize

        this.scene.scale.on('resize', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('change', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('webkitfullscreenchange', ()=> this.resizeWindow(this.scene), false);


      //----------- on scene update
  
          this.scene.events.on('update', ()=> {

            if (!this.initialized)
              return;

            if (this.scoreText)
              this.scoreText.setText(this.scene.score.toString()); 

      });

     

    }

    //------------------------------------

    public alert(message: string, optional?: string): void
    {
      this.scene.add.text(this.scene.cameras.main.width / 2 - (20 / 100) * this.scene.cameras.main.width, 300, message, {fontSize: "40px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
      if (optional)
      {
        let optionalText = this.scene.add.text(this.scene.cameras.main.width / 2 - (10 / 100) * this.scene.cameras.main.width, 360, optional, {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.scene.tweens.add({targets: optionalText, alpha: 0, duration: 2000, ease: 'Sine.easeOut', repeat: -1, yoyo: true, yoyoDelay: 500});
      }
    }

  //------------------------------------- resize

    private resizeWindow(scene: Phaser.Scene | Scene3D): void 
    {

      if (!scene.scene.settings.active)
          return;

      if (innerWidth < innerHeight) //portrait
      {

        this.score.setPosition(this.scene.cameras.main.width - 180, 50);
        this.scoreText.setPosition(this.scene.cameras.main.width - 100, 50);
      }
      else
      {

        this.score.setPosition(innerWidth - 180, 50);
        this.scoreText.setPosition(innerWidth - 100, 50);
      }
    }
}
  
  