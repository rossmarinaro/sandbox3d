
import { ExtendedObject3D, Scene3D } from '@enable3d/phaser-extension';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Utils } from '../system/Utils';



//----------------- Actor FBX / GLB

export class Actor extends ExtendedObject3D {

    public asset_id: string
    public key: string
    public obj: any
    public scene: Scene3D
    public callback: Function | null | undefined
    
    private x: number 
    private y: number 
    private z: number 
    private _scale: number | undefined

    private static idIterator: number = 0
    private rotationRate: number | undefined
    
    constructor (

      scene: Scene3D, 
      render: boolean,
      key: string, 
      name: string, 
      x: number, 
      y: number, 
      z: number, 
      scale?: number, 
      rotationRate?: number, 
      callback?: Function
    
    )
    {
      super();

      Actor.idIterator++;

      this.scene = scene;
      this.callback = callback;
      this.key = key;
      this.name = name;
      this._scale = scale;
      this.rotationRate = rotationRate;
      this.x = x;
      this.y = y;
      this.z = z;

      if (render)
        this.preload(); 
      
    }

    //----------------------------------------

    public async preload (): Promise<Readonly<void>>
    {

      this.type = await Utils.getFileType(this.scene, this.key);

      this.asset_id = `${this.type + '_' + Actor.idIterator.toString()}`; 

      this.type === 'glb' ?

        await this.scene.third.load.gltf(this.key).then(async (obj: GLTF) => {
          this.morphTargetInfluences = obj['morphTargetInfluences'];
          this.obj = obj.scene.children; 
          this.add(obj.scene); 
        }) :
        await this.scene.third.load.fbx(this.key).then(async (obj: any) => {
          this.obj = obj;
          this.add(obj); 
        });

      this.load();
    }


    //---------------------------------- 

    public async load(): Promise<Readonly<void>>
    {

      for (let i in this.obj.animations) 
        this.anims.add(this.obj.animations[i].name, this.obj.animations[i]);

      this.scene.third.animationMixers.add(this.anims.mixer); 
  
      this.scene.third.add.existing(this);

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

      this.init();

      if (this['callback'])
        this['callback']();

    }

    //-------------------------------------------

    private init (): void
    {
      
      switch (this.type)
      {
        //------------------- glb

        case 'glb':

          this.position.set(this.x, this.y, this.z);

          if (this._scale)
            this.scale.set(this._scale, this._scale, this._scale);
          
              this.scene.events.on('update', ()=> {

                if (!this.morphTargetInfluences) 
                  return;

                this.morphTargetInfluences[0] += 0.01;
                this.morphTargetInfluences[1] += 0.01;

                if (this.morphTargetInfluences[0] >= 1)
                  this.morphTargetInfluences[0] = 0;

                if (this.morphTargetInfluences[1] >= 1)
                  this.morphTargetInfluences[1] = 0;
              });

        break;

        //----------------------- fbx

        case 'fbx': 

          this.obj.position.set(this.x, this.y, this.z);
          this.obj.rotation.set(0, 3, 0);

          if (this._scale)
            this.obj.scale.set(this._scale, this._scale, this._scale);

          this.scene.events.on('update', ()=> this.obj.rotation.y += this.rotationRate);

        break;
      }
    }

}
