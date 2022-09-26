//------------------------------------------------- HUD

import { ExtendedMesh, Scene3D, THREE } from '@enable3d/phaser-extension';

export class HUD {

  private scene: Phaser.Scene | any
  private initialized: boolean = false;
  private textA: Phaser.GameObjects.Text
  private textB: Phaser.GameObjects.Text
  private textC: Phaser.GameObjects.Text
  private textD: Phaser.GameObjects.Text

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
        this.textD = this.scene.add.text(50, 200, '', {fontSize: "20px", fontFamily: "Digitizer"}).setColor("#ffff00").setStroke('#000000', 4).setShadow(2, 2, '#000000', 1, false);

        this.initialized = true;

      //listen for resize

        this.scene.scale.on('resize', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('change', ()=> this.resizeWindow(this.scene), false);
        screen.orientation?.addEventListener('webkitfullscreenchange', ()=> this.resizeWindow(this.scene), false);


      //----------- on scene update
  
      this.scene.events.on('update', ()=> {

          if (!this.initialized)
            return;

            this.scene.entities.filter((i: any) => {

              if (i.key === 'xbot' && i.obj !== null)
              {

                const cam = this.scene.third.camera, 
                      player = this.scene['player'],
                      playerPos = this.scene['player'].self.object.position;

                let direction: any = null,
                    position = i.obj.position,
                    rotation = i.obj.rotation.y.toFixed(2).toString(),
                    vecA = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z),
                    vecB = new THREE.Vector3(position.x, position.y, position.z), 
        
                    vecA_length = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z), 
                    vecB_length = Math.sqrt(vecB.x * vecB.x + vecB.y * vecB.y + vecB.z * vecB.z), 
                
                    inverse_length_vecA = 1 / vecA_length, 
                    inverse_length_vecB = 1 / vecB_length, 
                
                    unit_vecA = new THREE.Vector3(vecA.x * inverse_length_vecA, vecA.y * inverse_length_vecA, vecA.z * inverse_length_vecA), 
                    unit_vecB = new THREE.Vector3(vecB.x * inverse_length_vecB, vecB.y * inverse_length_vecB, vecB.z * inverse_length_vecB), 
                
                    dotProd = (unit_vecA.x * unit_vecB.x) + (unit_vecA.y * unit_vecB.y) + (unit_vecA.z * unit_vecB.z);

                if (player.raycaster.ray)
                  direction = cam.getWorldDirection(player.raycaster.ray.direction);

                if (i.name === 'bot A')
                {
                  this.textB.setText(`bot A position: (x: ${position.x}, y: ${position.y}, z: ${position.z}), y-rotations: ${rotation}`);
                  this.textA.setText(`your position: (x: ${playerPos.x.toFixed(2)}, y: ${playerPos.y.toFixed(2)}, z: ${playerPos.z.toFixed(2)})`);
                  this.textC.setText(`dot product is: ${dotProd.toFixed(2)}`);
                  this.textD.setText(`normalized direction: x: ${direction.normalize().x.toFixed(2)}, y: ${direction.normalize().y.toFixed(2)}, z: ${direction.normalize().z.toFixed(2)}`);
                }
              
              }
            
            }); 


         
      });

  


    }

    // public getDotProduct(vec: THREE.Vector3): number
    // {
    //   return (x * vec.x + y * vec.y + z * vec.z)
    // }

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
  
  


/*


let vecA = new THREE.Vector3(3, -5, 7),
    vecB = new THREE.Vector3(5, -2, -9)

    base = (vecA.x * vecB.x) + (vecA.y * vecB.y) + (vecA.z * vecB.z)) = 15 + 10 - 63 = -38

let vecA_length = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z) = Math.sqrt(9 + 25 + 49) = Math.sqrt(83) = 9.1100433
    vecB_length = Math.sqrt(vecB. * vecB.x + vecB.y * vecB.y + vecB.z * vecB.z) = Math.sqrt(25 + 4 + 81) = Math.sqrt(110) = 10.488088

    inverse_length_vecA = 1 / vecA_length = 0.1097642
    inverse_length_vecB = 1 / vecB_length = 0.0953463

let unit_vecA = (vecA.x * inverse_length_vecA, vecA.y * inverse_length_vecA, vecA.z * inverse_length_vecA) = (0.3292926, -0.548821, 0.7683494)
    unit_vecB = (vecB.x * inverse_length_vecB, vecB.y * inverse_length_vecB, vecB.z * inverse_length_vecB) = (0.4767315, -01906926, -0.8581167)

    dot prod = (unit_vecA.x * unit_vecB.x) + (unit_vecA.y * unit_vecB.y) + (unit_vecA.z * unit_vecB.z) = Math.floor().toFixed(2)

public getDotProduct(vec: THREE.Vector3): number
{
  return (x * vec.x + y * vec.y + z * vec.z)
}





*/