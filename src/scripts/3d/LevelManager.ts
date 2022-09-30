import { Scene3D, ExtendedObject3D } from '@enable3d/phaser-extension';
import { Actor } from './Actor';
import { Level } from './maps/level';

export class LevelManager {

  private static currentLevel: string 
  
  public static level: Actor

  //------------------------------------------- load map

  public static async load (scene: Scene3D, key: string): Promise<Readonly<boolean>>
  {
    LevelManager.currentLevel = key;
    LevelManager.level = new Actor(scene, false, LevelManager.currentLevel, 'level', 0, 0, 0);

    await LevelManager.level.preload();

    switch (LevelManager.currentLevel)
    {
      case 'level': Level(scene); break;
    }

    await LevelManager.setCollisions(scene);

    return true;

  }

  //--------------------------------------------------- set physics / collisions

  private static async setCollisions (scene: Scene3D): Promise<void>
  {

    return new Promise(res => {
      
      let obj = LevelManager.level.obj; 

      if (obj && obj instanceof Array)
      {
        obj.forEach((child: ExtendedObject3D ) => {

        child.castShadow = child.receiveShadow = true;
          res(
            scene.third.physics.add.existing(child, {
              shape: 'convex',
              mass: 0,
              collisionFlags: 1,
              autoCenter: false
            })
          );
        });
      }
    });
    
  } 

   
}