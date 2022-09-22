
import { Scene3D, THREE } from '@enable3d/phaser-extension';


export class Lighting {

    public scene: Scene3D

    constructor(
      scene: Scene3D, 
      dirPosX: number, 
      dirPosY: number, 
      ambPosX: number, 
      ambPosY: number,
      dirIntensity: number,
      ambIntensity: number
    )
    {
      this.scene = scene;
      new THREE.Color(0xff0000);
      const dirlight = new THREE.DirectionalLight(0xffffff, dirIntensity),
            amblight = new THREE.AmbientLight(0xF7941E, ambIntensity);
      dirlight.position.set(0, dirPosX, dirPosY).normalize();
      dirlight.rotation.set(1, 1, 1);
      amblight.position.set(0, ambPosX, ambPosY).normalize();
      amblight.rotation.set(1, 1, 1);

      this.scene.third.add.existing(dirlight);
      this.scene.third.add.existing(amblight);
      //dirlight.needUpdate = true;
      //amblight.needUpdate = true;
      this.scene.events.on('update', ()=> {
        if (amblight)
        {
          amblight.rotation.x++;
         // amblight.needUpdate = true;
        }
      });
    }
  }