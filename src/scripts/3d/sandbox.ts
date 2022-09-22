
import { Scene3D, ExtendedObject3D, ExtendedMesh } from '@enable3d/phaser-extension';
import { System } from '../system/Config';
import { Lighting } from './lighting';
import { Player } from '../3d/player';
import { HUD } from '../3d/hud';
import { Controller } from '../3d/controller';
import { Level } from './level';
import { ItemProp } from './ItemProp';
import { Inventory3D } from './inventory/manager';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';


export class Sandbox3D extends Scene3D {

    public score: number

    private lighting: Lighting
    private level: Level
    private player: Player | null = null
    private hud: HUD
    private controller: Controller
    private entities: Player[] = []

    private _scene: Phaser.Scene
    private players: Player[]
    private pickups: ItemProp[]
    private otherPlayer: Player | null = null
    
    constructor(){
        super({key:'Sandbox3D'});
    }
    public init(scene: Phaser.Scene): void
    {
      
      this._scene = scene;
      this.players = [];
      this.pickups = [];
      this.score = 0;

      this.data['weapons'] = ['']; 
      this.data['items'] = [];
      this.data['powerups'] = [];
      Inventory3D.resetAmmo(0);

      System.orientation.unlock();
      System.makeTransparantBackground(scene);

      this.accessThirdDimension({ maxSubSteps: 10, fixedTimeStep: 1 / 180 });  
      //this.third.physics.debug?.enable();    
      //this.renderer.clear()

    }  
    private async preload(): Promise<void>
    { 
      await this._scene.scene.get('Preload')['preload3D'](this._scene, this);
    }
    private async create(): Promise<void>
    {
      
      System.app.init(this, null);

      this.lighting = new Lighting(this, 185, 20, -185, -20, 1.6, 1.8);
      this.level = new Level(this);

    //load map before objects

      await this.level.load();

      this.player = new Player(this, true);
      this.hud = new HUD(this, 'Sandbox3D');
      this.controller = new Controller(this, this.player);

      //Inventory3D.setItem(this, 'rolling_pin1');

    //entities
  
      this.entities = [this.player]; 
      
    //some test pickups

      // new ItemProp(this, 'automac1000', 150, 45, 150);
      // new ItemProp(this, 'automac1000', -150, 45, -150);

      // new ItemProp(this, 'ikura_maki_tile', -200, 45, -200);
      // new ItemProp(this, 'ikura_maki_tile', 200, 45, 200);

      // new ItemProp(this, 'automac1000', -150, -40, -150);
      // new ItemProp(this, 'automac1000', 150, -40, 150);

      // new ItemProp(this, 'ikura_maki_tile', -200, -40, 200);
      // new ItemProp(this, 'ikura_maki_tile', 200, -40, 200);




      let test = new ExtendedObject3D(), 
          test2 = new ExtendedObject3D(),
          test3 = new ExtendedObject3D(),
          bones1: any[] = [],
          bones2: any[] = [],
          sue: any;

      this.third.load.gltf('test_monkey').then((obj: GLTF) => {

        test.add(obj.scene); 

        for (let i in obj.animations) 
          test.anims.add(obj.animations[i].name, obj.animations[i]);

        this.third.animationMixers.add(test.anims.mixer);  

        test.anims.play('blink');

        this.third.add.existing(test);

        sue = obj.scene.children; 

        test.traverse((i: any) => {                                  
  
          if (i.isMesh)
          {                                                                
      
            i.castShadow = i.receiveShadow = true;

            if (i.material)
            {
              i.material.metalness = 0.3;
              i.material.roughness = 0.3;
            }
          }
          });

          test.position.set(100, -40, 100)
          test.scale.set(5.25, 5.25, 5.25)
      });


      this.third.load.fbx('xbot').then((obj: any) => {

        test2.add(obj); 

        this.third.add.existing(test2);

        test2.traverse((i: any) => {                                  
  
          if (i.isMesh)
          {                                                                
      
            i.castShadow = i.receiveShadow = true;

            if (i.material)
            {
              i.material.metalness = 0.3;
              i.material.roughness = 0.3;
            }
          }
          });
          obj.position.set(120, -50, 80)
          obj.scale.set(0.25, 0.25, 0.25)
          obj.children[0].children.forEach(i => {
            bones1.push(i)
           // console.log(i)
          });
      });


      this.third.load.fbx('xbot').then((obj: any) => {

        test3.add(obj); 

        this.third.add.existing(test3);

        test3.traverse((i: any) => {                                  
  
          if (i.isMesh)
          {                                                                
      
            i.castShadow = i.receiveShadow = true;

            if (i.material)
            {
              i.material.metalness = 0.3;
              i.material.roughness = 0.3;
            }
          }
          });
          obj.rotation.set(0, 0.2, 0)
          obj.position.set(120, -50, 100)
          obj.scale.set(0.25, 0.25, 0.25)
          obj.children[0].children.forEach(i => {
            bones2.push(i)
           // console.log(i)
          });
      });

  
      this.time.delayedCall(3000, ()=> {

        sue[0].morphTargetInfluences[0] = 1;
        sue[0].morphTargetInfluences[1] = 1;

          console.log(test2, test3)

          // for (let bone1 in bones1)
          // {
          //   for (let bone2 in bones2)
          //   {
          //     console.log(bones1[bone1], bones2[bone2])
          //   }
          // }

      });







    }

    public update(time: number): void
    {

      if (this.entities === [])
        return;

      for (let entity in this.entities)
        if (typeof this.entities[entity].update === 'function')
          this.entities[entity].update(time);
    }


}