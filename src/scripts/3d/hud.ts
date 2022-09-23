//------------------------------------------------- HUD

import { ExtendedMesh, Scene3D } from '@enable3d/phaser-extension';

export class HUD {

  private scene: Phaser.Scene | any
  private initialized: boolean = false;
  private textA: Phaser.GameObjects.Text
  private textB: Phaser.GameObjects.Text
  private textC: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, HUDType: string)
    {
      this.scene = scene;
      this.init();
    }

    private init(): void
    { 
  
    //------------- UI


      //// text

        this.textA = this.scene.add.text(50, 50, '', {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.textB = this.scene.add.text(50, 100, '', {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.textC = this.scene.add.text(50, 150, '', {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);

        this.initialized = true;

      //listen for resize

        this.scene.scale.on('resize', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('change', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('webkitfullscreenchange', ()=> this.resizeWindow(this.scene), false);

        const resetText = (txt: Phaser.GameObjects.Text, obj: ExtendedMesh, rotation: number) => {
          obj.rotation.set(0, rotation, 0);
          txt.setText(obj.rotation.y.toFixed(2).toString());
        }

      //----------- on scene update

      let done = false;
  
      this.scene.events.on('update', ()=> {

          if (!this.initialized)
            return;

            this.scene.entities.filter((i: any) => {
              if (i.key === 'xbot' && i.obj !== null)
              {
                let rotation = i.obj.rotation.y.toFixed(2).toString();

                switch (i.name)
                {
                  case 'bot A': 
                  //if (rotation > 3)
                    //resetText(this.textA, i.obj, 0);
                  this.textA.setText(`y-rotation A:   ${rotation}`); 
                  break;
                  case 'bot B':
              
                    this.textB.setText(`y-rotation B:   ${rotation}`); 
                  break;
                }

                let areFacing = i.obj.rotation.y === 1 ? true : false;

                this.textC.setText(`are A and B facing?: ${areFacing}`); 
        

                if (areFacing === true && done === false)
                {
                  done = true;
                  this.alert('is facing!');
                }
              }

            }); 

         
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

      }
      else
      {

      }
    }
}
  
  