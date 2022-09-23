
import { ExtendedMesh, ExtendedObject3D, Scene3D } from '@enable3d/phaser-extension';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';



//------------------------------------------------------------------------- RIFLE

export class Actor extends ExtendedObject3D {

    public static bones1: ExtendedMesh[] = []
    public static bones2: ExtendedMesh[] = []
    public obj: ExtendedMesh | null

    private scene: Scene3D
    private key: string
    private x: number 
    private y: number 
    private z: number 
    private _scale: number | undefined
    private rotationRate: number | undefined
    
    public _id: number | string | undefined

    constructor(scene: Scene3D, key: string, type: string, name: string, x: number, y: number, z: number, scale?: number, rotationRate?: number)
    {
      super();

      this.scene = scene;
      this.key = key;
      this.name = name;
      this.type = type;
      this._scale = scale;
      this.rotationRate = rotationRate;
      this.x = x;
      this.y = y;
      this.z = z;
      this.obj = null;

      this.type === 'glb' ?
        this.scene.third.load.gltf(this.key).then((obj: GLTF) => this.initGLB(obj)) :
        this.scene.third.load.fbx(this.key).then((obj: any) => this.initFBX(obj));

    
    }

    //---------------------------------- glb

    private initGLB(obj: GLTF): void
    {
      let sue: any;

      this.add(obj.scene); 

      for (let i in obj.animations) 
        this.anims.add(obj.animations[i].name, obj.animations[i]);

      this.scene.third.animationMixers.add(this.anims.mixer);  

      this.anims.play('blink');

      this.scene.third.add.existing(this);

      sue = obj.scene.children; 

      this.traverse((i: any) => {                                  

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


        this.position.set(this.x, this.y, this.z);

        if (this._scale)
          this.scale.set(this._scale, this._scale, this._scale);

        this.scene.time.delayedCall(3000, ()=> {

          sue[0].morphTargetInfluences[0] = 1;
          sue[0].morphTargetInfluences[1] = 1;

  
            // for (let bone1 in bones1)
            // {
            //   for (let bone2 in bones2)
            //   {
            //     console.log(bones1[bone1], bones2[bone2])
            //   }
            // }
  
        });
    }

    //------------------------------------------ fbx

    private initFBX(obj: any): void
    {

        this.add(obj); 

        this.scene.third.add.existing(this);

        this.traverse((i: any) => {                                  
  
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

          obj.position.set(this.x, this.y, this.z);

          if (this._scale)
            obj.scale.set(this._scale, this._scale, this._scale);

            this.scene.events.on('update', ()=> {
              obj.rotation.y += this.rotationRate;
              this.obj = obj;
      
            });
            
          obj.children[0].children.forEach((i: ExtendedMesh) => Actor.bones1.push(i));
  
      this.traverse((child: any) => {
  
        if (child.isMesh)
        {
          child.castShadow = child.receiveShadow = true;
          if (child.material)
          {
            child.material.metalness = 0.3;
            child.material.roughness = 0.3;
          }
        }
      });

    }
}