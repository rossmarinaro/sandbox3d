
import { ExtendedMesh, ExtendedObject3D, Scene3D } from '@enable3d/phaser-extension';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';



//----------------- Actor FBX / GLB

export class Actor extends ExtendedObject3D {


    public obj: ExtendedMesh | null
    public _id: number | string | undefined

    private scene: Scene3D
    private key: string
    private x: number 
    private y: number 
    private z: number 
    private _scale: number | undefined
    private rotationRate: number | undefined
    

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

        });
    }

    //------------------------------------------ fbx

    private initFBX(obj: any): void
    {

        this.add(obj); 

        for (let i in obj.animations) 
          this.anims.add(obj.animations[i].name, obj.animations[i]);

        this.scene.third.animationMixers.add(this.anims.mixer); 
      
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
          obj.rotation.set(0, 3, 0);

          if (this._scale)
            obj.scale.set(this._scale, this._scale, this._scale);

            this.scene.events.on('update', ()=> {
              obj.rotation.y += this.rotationRate;
              this.obj = obj;
      
            });
            
  
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