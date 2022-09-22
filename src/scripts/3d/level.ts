import { THREE, ExtendedObject3D, Scene3D } from '@enable3d/phaser-extension';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class Level extends ExtendedObject3D {

  public scene: Scene3D
  private bkgndMountains: ExtendedObject3D

    constructor(scene: Scene3D)
    {
      super();
      this.scene = scene;
      this.name = 'map';
    
    }
    public async load()
    {
      await this.scene.third.load.gltf('level').then(async (gltf: GLTF) => await this._init(gltf));
    }
    private async _init(gltf: GLTF)
    {
      
      for (let i in gltf.scene.children)
        this.add(gltf.scene);
  
      this.scene.third.add.existing(this);
  
      //sky box

      // const loader = new THREE.CubeTextureLoader(),
      //       texture = loader.load([
      //         'assets/backgrounds/pixel.png',
      //         'assets/backgrounds/pixel.png',
      //         'assets/backgrounds/pixel.png',
      //         'assets/backgrounds/pixel.png',
      //         'assets/backgrounds/pixel.png',
      //         'assets/backgrounds/pixel.png'
      //     ]);
          
      // this.scene.third.heightMap.scene.background = texture;
  
      this.traverse((child: any) => {

        if (child.isMesh)
        {
          this.scene.third.physics.add.existing(child, {
            shape: 'convex',
            mass: 0,
            autoCenter: false,
            collisionFlags: 1
          });
          child.castShadow = child.receiveShadow = true;

          if (child.name === 'ramp' || child.name === 'ladder') 
            child.visible = false;

          if (child.name === 'platform')
          {

            let tmp = child.position.clone(),
                platform = new ExtendedObject3D();

             platform.position.copy(tmp);

            this.scene.third.physics.add.existing(platform, {
              shape: 'box', 
              width: 90,
              height: 5,
              depth: 90,
              mass: 0,
              collisionFlags: 2
            });
 
            this.scene.tweens.add({
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
              this.scene.third.physics.destroy(child)
          }

          if (child.material)
          {
            child.material.metalness = 0.4;
            child.material.shininess = 50;
          // child.material.reflectivity = 2
          }
        }
   
      });
    }

  }