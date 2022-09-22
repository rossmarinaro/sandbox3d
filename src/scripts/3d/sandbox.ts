
import { Scene3D, ExtendedObject3D, ExtendedMesh } from '@enable3d/phaser-extension';
import { System } from '../system/Config';
import { Lighting } from './lighting';
import { Player } from '../3d/player';
import { HUD } from '../3d/hud';
import { Controller } from '../3d/controller';
import { Level } from './level';
import { Actor } from './Actor';
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
    private pickups: Actor[]
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

  
      new Actor(this, 'test_monkey', 'glb', 100, -40, 100, 5.25);

      new Actor(this, 'xbot', 'fbx', 120, -50, 100, 0.25);
      new Actor(this, 'xbot', 'fbx', 120, -50, 80, 0.25);
  
      




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