//------------------------------------------------- HUD

import { THREE, Scene3D } from '@enable3d/phaser-extension';
import { Utils } from '../system/Utils';


export class HUD {

  private scene: Phaser.Scene | any
  private initialized: boolean = false;
  private textA: Phaser.GameObjects.Text
  private textB: Phaser.GameObjects.Text
  private textC: Phaser.GameObjects.Text
  private textD: Phaser.GameObjects.Text
  private textE: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, HUDType: string)
    {
      this.scene = scene;
      this.init();
    }

    private init(): void
    { 
  
    //------------- UI


      // text banks

        this.textA = this.scene.add.text(50, 50, '', {fontSize: "15px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.textB = this.scene.add.text(50, 100, '', {fontSize: "15px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.textC = this.scene.add.text(50, 150, '', {fontSize: "15px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.textD = this.scene.add.text(50, 200, '', {fontSize: "15px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);
        this.textE = this.scene.add.text(50, 250, '', {fontSize: "15px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);

        this.initialized = true;

      //listen for resize

        this.scene.scale.on('resize', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('change', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('webkitfullscreenchange', ()=> this.resizeWindow(this.scene), false);

      //----------- on scene update
    
      this.scene.events.on('update', async ()=> {

          if (!this.initialized)
            return;

          const 
            player = this.scene['player'],
            playerPosition = this.scene['player'].self.obj.position,
            botA = this.scene['botA'],
            botB = this.scene['botB'];

          if (botA && botA.obj !== null)
          {
                  
            let direction: any = null,
                dotProduct = Utils.getDotProduct(player.self, botA);

            if (player.raycaster.ray)
              direction = this.scene.third.camera.getWorldDirection(player.raycaster.ray.direction);
              
            /* bones: 
                mixamorigHips
                mixamorigSpine
                mixamorigLeftUpLeg
                mixamorigRightUpLeg 
            */

            const bone = await Utils.getNearestBone(botA, botB, 'mixamorigHips'),

                  bonePos = await bone?.bone['getWorldPosition'](new THREE.Vector3());
                
            if (!bonePos)
              return;
            
            this.textA.setText(`Normalized Direction: { X: ${direction.normalize().x.toFixed(2)}, Y: ${direction.normalize().y.toFixed(2)}, Z: ${direction.normalize().z.toFixed(2)} }`);
            this.textB.setText(`Your Position: { X: ${playerPosition.x.toFixed(2)}, Y: ${playerPosition.y.toFixed(2)}, Z: ${playerPosition.z.toFixed(2)} }`);
            this.textC.setText(`Bot-A Position: { X: ${botA.obj.position.x}, Y: ${botA.obj.position.y}, Z: ${botA.obj.position.z} }, Y-Rotations: ${botA.obj.rotation.y.toFixed(2).toString()}`);
            this.textD.setText(`Dot Product (player, bot-A): ${dotProduct.toFixed(2)}`);
            this.textE.setText(`Closest Bone (bot A to bot B): ${bone?.bone['name']}, { X: ${bonePos.x.toFixed(2)} Y: ${bonePos.y.toFixed(2)} Z: ${bonePos.z.toFixed(2)} }`);
            
          }
 

      });
    }

  //------------------------------------ pop up notification


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
  
  
