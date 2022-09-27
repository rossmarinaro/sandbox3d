
import { Scene3D } from '@enable3d/phaser-extension';
import { System } from '../system/Config';
import { Utils } from '../system/Utils';
import { Lighting } from './lighting';
import { Player } from '../3d/player';
import { HUD } from '../3d/hud';
import { Controller } from '../3d/controller';
import { Level } from './level';
import { Actor } from './Actor';import { THREE } from '@enable3d/phaser-extension';



export class Sandbox3D extends Scene3D {

    public score: number

    private _scene: Phaser.Scene
    private lighting: Lighting
    private level: Level
    private player: Player | null = null
    private hud: HUD
    private controller: Controller
    private entities: any[] = []


    constructor(){
        super({key:'Sandbox3D'});
    }
    public init(scene: Phaser.Scene): void
    {

      this._scene = scene;

      this.score = 0;


      System.orientation.unlock();
      System.makeTransparantBackground(scene);

      this.accessThirdDimension({ maxSubSteps: 10, fixedTimeStep: 1 / 180 });
      //this.third.physics.debug?.enable();
      //this.renderer.clear()

    }
    
    //---------------------------------------- 

    private async preload(): Promise<void>
    {
      await this._scene.scene.get('Preload')['preload3D'](this._scene, this);
    }

    //---------------------------------------- 

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

    //actors

    const monkey = new Actor(this, 'test_monkey', 'glb', 'monkey', 100, -40, 100, 5.25),
          botA = new Actor(this, 'xbot', 'fbx', 'bot A', 120, -50, 100, 0.25, 0.1),
          botB = new Actor(this, 'xbot', 'fbx', 'bot B', 120, -50, 50, 0.15, 0),
          swankyVelvet = new Actor(this, 'swanky_velvet', 'fbx', 'swanky velvet', 50, -50, -50, 0.15, 0);

    //entities

      this.entities = [this.player, botA, botB, monkey, swankyVelvet];

    //delayed call, get nearest bones

      this.time.delayedCall(1000, ()=> {

         /* bones: 
            mixamorigHips
            mixamorigSpine
            mixamorigLeftUpLeg
            mixamorigRightUpLeg 
        */

        Utils.getNearestBone(botA, botB, 'mixamorigHips');

      //play anims

        monkey.anims.play('blink');
        swankyVelvet.anims.play('Idle');

      });

    }

    //-------------------------------------------

    public update(time: number): void
    {

      if (this.entities === [])
        return;

      for (let entity in this.entities)
        if (typeof this.entities[entity].update === 'function')
          this.entities[entity].update(time);
    }


}