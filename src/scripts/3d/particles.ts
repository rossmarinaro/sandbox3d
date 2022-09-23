import { Scene3D, THREE } from '@enable3d/phaser-extension';
import { Shaders } from './shaders';
 
 //----------------------- muzzle flash

 export class MuzzleFlash  {

    private x: number
    private y: number
    private z: number
    private limit: number
    private cubeSineDriver: number
    private clock: THREE.Clock
    private scene: Scene3D
    private particles: any
    private meshes:  any[] | never[]
    private muzzle: any

    constructor(scene: Scene3D, muzzle: any, x: number, y: number, z: number) 
    {
 
        this.scene = scene;
        this.muzzle = muzzle;
        this.x = x;
        this.y = y;
        this.z = z;
        this.limit = 100;
        this.clock = new THREE.Clock();
        this.cubeSineDriver = 0;
        this.meshes = [];
        this.particles = [];

        this.init();
    }

    private init(): void 
    {

      //this.scene.third.load.texture('').then(texture => {

        const
            //material = new THREE.MeshLambertMaterial({map: texture, transparent: false}),

            shader = new Shaders,
            geometry = new THREE.BoxGeometry(50, 50, 50)//new THREE.PlaneBufferGeometry(10, 10);

            //if (material.map !== null)
                //material.map.minFilter = THREE.LinearFilter;
            
            while(this.limit > 0) 
            {
                this.meshes[this.limit] = new THREE.Mesh(geometry, shader);
                this.meshes[this.limit].position.set(this.x + (Math.random() * 10), this.y, this.z + (Math.random() * 10));
                this.meshes[this.limit].rotation.z = Math.random() * 360;
                this.particles.push(this.meshes[this.limit]);
                this.scene.third.add.existing(this.meshes[this.limit]);
                //this.meshes[this.limit].position.copy(this.muzzle.position);
                //this.muzzle.attach(this.meshes[this.limit]);
                this.limit--;
            }

        //});

        this.update();

        this.scene.time.delayedCall(1500, ()=> {
            this.meshes.forEach(i => { 
                i.geometry.dispose(); 
                i.material.dispose();
                this.scene.third.scene.remove(i);
            });
        });
    }

    private update(): void 
    {

        this.cubeSineDriver += 0.01;

        this.meshes.forEach(mesh => {
            
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.01;
           // mesh.position.x = this.x + Math.sin(this.cubeSineDriver) * Math.random() * 10 > 5 ? -5 : 5;
            //mesh.position.z = this.z + Math.sin(this.cubeSineDriver) * 5;
        });

        let particlesLength = this.particles.length,
            delta = this.clock.getDelta();

        while(particlesLength--) 
          this.particles[particlesLength].rotation.z += delta * 0.2;
        
        requestAnimationFrame(this.update.bind(this));
    }

  }
