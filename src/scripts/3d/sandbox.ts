
import { Scene3D } from '@enable3d/phaser-extension';
import { System } from '../system/Config';

import { Lighting } from './lighting';
import { Player } from '../3d/player';
import { HUD } from '../3d/hud';
import { Controller } from '../3d/controller';
import { LevelManager } from './LevelManager';



export class Sandbox3D extends Scene3D {

    public score: number

    private _scene: Phaser.Scene
    private lighting: Lighting
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
      System.self.makeTransparantBackground();

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

    //load map before objects

      await LevelManager.load(this, 'level');

      this.player = new Player(this, true);
      this.hud = new HUD(this);
      this.controller = new Controller(this, this.player);

    //actors

      const botA = new System.app.sys3d.actor(this, true, 'xbot', 'bot A', 120, -50, 100, 0.25, 0.1),
            botB = new System.app.sys3d.actor(this, true, 'xbot', 'bot B', 120, -50, 50, 0.15, 0),
            monkey = new System.app.sys3d.actor(this, true, 'test_monkey', 'monkey', 100, -40, 100, 5.25),
            swankyVelvet = new System.app.sys3d.actor(this, true, 'swanky_velvet', 'swanky velvet', 50, -50, -50, 0.15, 0);

    //entities

      this.entities = [this.player, botA, botB, monkey, swankyVelvet];

    //delayed call, anims

      this.time.delayedCall(100, async ()=> {

      //play anims

        monkey.anims.play('blink');
        swankyVelvet.anims.play('Idle');


      });

    }

    //------------------------------------------- main update

    public update(time: number): void
    {

      if (this.entities === [])
        return;

    //update entities

      for (let entity in this.entities)
        if (typeof this.entities[entity].update === 'function')
          this.entities[entity].update(time);

    //update HUD
    
      if (this.hud)
        this.hud.update();
    }


}