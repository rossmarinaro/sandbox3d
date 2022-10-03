
import { THREE, ExtendedObject3D, Scene3D, FirstPersonControls } from '@enable3d/phaser-extension';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { System } from '../system/Config';



//------------------------------------------------- player

export class Player {

    private scene: Scene3D 
    private currentEquipped: any
    private collide: boolean
    private isSelf: boolean | undefined
    private equipped: any
    private canJump: boolean

    public raycaster: THREE.Raycaster | null = null
    public id: string | undefined
    public data: any
    public username: string | null
    public color: string
    public anims: string
    public alive: boolean
    public movement = {x: 0, y: 0, z: 0}
    public rotationSpeed: number
    public health: number
    public hitbox: any
    public Actor: typeof System.app.sys3d.actor | null
    public self = {
      skin: new ExtendedObject3D(),
      obj: new ExtendedObject3D() 
    }

    constructor(scene: Scene3D | any, isSelf?: boolean, data?: any)
    {
      this.scene = scene;
      this.isSelf = isSelf;
      this.data = data;
      this.health = this.data ? this.data.health : Infinity;
      this.id = this.data ? this.data.id : 0;
      this.username = this.data ? this.data.username : null; 
      this.color = '';
      this.alive = true;
      this.collide = false;
      this.canJump = false;
      this.hitbox = null;
      this.anims = '';

      this.currentEquipped = {
        key: '',
        obj: null,
        quantity: 0
      };

      this._init();
    }
  
    private _init(): void
    {


        this.scene.third.physics.add.existing(this.self.obj, {shape: 'capsule', mass: 1.8, radius: 3, offset: { y: 5 }, height: 30});
        this.self.obj.body.setAngularFactor(0, 0, 0);
        this.self.obj.body.setFriction(0.1);
        this.self.obj.body.setGravity(0, -200, 0);
        this.self.obj.body.setPosition(150, 0, 50);

        this.self.obj.body.on.collision(async (otherObject, event) => {

          if (otherObject.name === 'ladder')
            this.self.obj.body.setVelocityY(100);  
     

        });


    }


  //------------------------------------------------ set players animation state


    private setState(state: string | null): void
    {
      if (state === this.self.skin.anims.current || state === null)
        return;

        this.self.skin.anims.play(state);


    }



  //--------------------------------------------------- player crouch


    public crouch(): void
    {

      this.movement.x = THREE.MathUtils.lerp(this.movement.x,this.movement.x - 0.5, 0.2);
      this.movement.y = THREE.MathUtils.lerp(this.movement.y, this.movement.y - 1, 0.2);   
      this.self.obj.body.setAngularVelocityY(0);


    }
  
  //--------------------------------------------------- player idle

    
    public idle(): void
    {

      this.self.obj.body.setVelocityX(0);
      this.self.obj.body.setVelocityZ(0);  
      this.self.obj.body.setAngularVelocityY(0);
  
    }


  //--------------------------------------------------- player jump


    public jump(): void
    {

      if (this.canJump === false)
        return;

      this.canJump = false;

      this.setState('jump');
    

      this.self.obj.body.applyImpulse({x: 0, y: 150, z: 0}, {x: 0, y: -200, z: 0})

    }


  //---------------------------------- player move

  
    public move(forceX: number, forceY: number): void
    {

      if ( !this.raycaster)
        return;

      const cam = this.scene.third.camera,
            direction = cam.getWorldDirection(this.raycaster.ray.direction),
            x = direction.x * 100, 
            z = direction.z * 100;

    //right
      if (forceX > 40) 
      {
        this.self.obj.body.setVelocityX(-z);
        this.self.obj.body.setVelocityZ(x);
      }

    //left
      else if (forceX < -40) 
      {  
        this.self.obj.body.setVelocityX(z);
        this.self.obj.body.setVelocityZ(-x);
      }
    //down
      else if (forceY < -40) 
      {
        this.self.obj.body.setVelocityX(x);
        this.self.obj.body.setVelocityZ(z);
      }
    //up
      else if (forceY > 40) 
      {
        this.self.obj.body.setVelocityX(-x);
        this.self.obj.body.setVelocityZ(-z);
      }

      if (this.self.obj.body) 
        this.self.obj.body.setAngularVelocityY(0);

    }
    

    //-------------------------------------------- player look


    public look(x: number, y: number, camera: FirstPersonControls): void
    {
        
      camera.update(x, y);
      
    //object's body rotates with camera

      const 
      v3 = new THREE.Vector3(),
      rotation = this.scene.third.camera.getWorldDirection(v3),
      theta = Math.atan2(rotation.x, rotation.z),
      rotationMan = this.self.obj.getWorldDirection(v3),
      thetaMan = Math.atan2(rotationMan.x, rotationMan.z),
      l = Math.abs(theta - thetaMan);
    
      this.rotationSpeed = 2; //4//isTouchDevice ? 2 : 4
    
      let d = Math.PI / 24

      if (l > d && l > Math.PI - d || theta < thetaMan) 
        this.rotationSpeed *= -1; 
      if (this.self.obj.body) 
        this.self.obj.body.setAngularVelocityY(this.rotationSpeed);  

    }

  //------------------------------------------------- player attack


    public async attack(): Promise<void>
    {

      if (!this.alive)
        return;
        
      const getCurrentWeapon = async ()=> {

        switch (this.currentEquipped.key)
        {
          case 'automac1000': 

            this.scene.third.load.gltf('bullet_3d').then((gltf: GLTF) => this.currentEquipped.obj.fire(gltf));
            return 'Rifle Shoot';

          case 'rolling_pin1': 
            
            this.currentEquipped.obj.fire();
            return 'strike';

          default: return null;
        }
        
      },
      attack = await getCurrentWeapon();

      this.setState(attack);
    }

  //--------------------------------------------- init powerup

  public initPowerup(type: string): void
  {
    switch (type)
    {
      case 'ikura_maki_tile':
        this.health += 4;
        System.app.audio.play('gulp', 1, false, this.scene, 0);
      break;
    }
  }


  //---------------------------------------------- drop item / weapon
  

    public dropItem (equipped: string): void
    {


    }

  
  //----------------------------------------------- update on scene

  
    public update(time: number): void
    {
  
        this.raycaster = new THREE.Raycaster();
        const pos = new THREE.Vector3(),
              movementY = (num: number) => { return num - this.movement.y };
  
        this.raycaster.setFromCamera({ 
          x: 0.6 - this.movement.x, 
          y: System.self.isPortrait(this.scene) || System.self.isDesktop(this.scene) ? movementY(-0.8) : movementY(-0.5) 
        }, 
        this.scene.third.camera); 
  
        pos.copy(this.raycaster.ray.direction);
        pos.multiplyScalar(0.8 + this.movement.z);
        pos.add(this.raycaster.ray.origin);

        this.raycaster.ray.origin.copy(this.scene.third.camera.position);

        this.anims = this.self.skin.anims.current;

        if (this.collide === true)
          this.canJump = true;

        this.self.obj.body.on.collision((otherObject, event) => {

          if (event !== 'end')
           this.collide = true;
          else 
            this.collide = false;
   
      

        });
    }
  }
  