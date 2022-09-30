
import { Scene3D, ExtendedObject3D } from '@enable3d/phaser-extension';
import { LevelManager } from '../LevelManager';


export async function Level (scene: Scene3D): Promise<Readonly<void>>
{
  LevelManager.level.traverse((child: any) => {

    if (child.isMesh)
    {
  
      if (child.name === 'ramp' || child.name === 'ladder') 
        child.visible = false;
  
      if (child.name === 'platform')
      {
  
        let tmp = child.position.clone(),
            platform = new ExtendedObject3D;
  
         platform.position.copy(tmp);
  
        scene.third.physics.add.existing(platform, {
          shape: 'box', 
          width: 90,
          height: 5,
          depth: 90,
          mass: 0,
          collisionFlags: 2
        });
  
        scene.tweens.add({
          targets: tmp, 
          duration: 5000, 
          repeatDelay: 3000, 
          delay: 3000, 
          hold: 3000,
          ease: 'Sine.easeInOut', 
          y: tmp.y + 70, 
          repeat: -1, 
          yoyo: true,
          onUpdate: ()=> {
            child.position.setY(tmp.y); 
            platform.position.setY(tmp.y);
            platform.body.needUpdate = true;
          }
        });
  
        if (child.body !== null && child.body !== undefined)
          scene.third.physics.destroy(child)
      }
  
    }
  
  });
}

