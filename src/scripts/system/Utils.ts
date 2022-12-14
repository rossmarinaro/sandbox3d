/* COMMON UTILS */

import { Scene3D, THREE } from '@enable3d/phaser-extension';
import { System } from './Config';


export class Utils {

    public static strings = {

        joinWithUnderscore: function (a: string, b: string): string
        {
            return a += `_${b}`;
        },

        modUnderscore: function(str: any, op: string): string
        {
            let strArr: string[] = [];
            for(let i = 0; i < str.length; i++)
                strArr.push(str[i]);          
            return strArr.includes('_') ? str.toString().replaceAll('_', op === 'replace' ?  ' ' : '') : str;
        },

        checkSpace: async function(str: string): Promise<string>
        {  
            return str.includes(' ') ? str.replace(' ', '') : str;
        },

        removeStringPart: async function(str: string, part: string): Promise<string>
        {      
           return str.toString().replace(part, '');
        },

        removeNumbers: async function(str: string): Promise<string>
        {      
            let strArr: string[] = [],
                numArr: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            for(let char = 0; char < str.length; char++)
                strArr.push(str[char]); 
                    
            const check = async ()=> {
                for(let char = 0; char < strArr.length; char++)
                    if (numArr.includes(strArr[char].toString()))
                    {
                        let _string = strArr.filter(i => isNaN(parseInt(i)));  
                        return _string.join('');
                    }
                    return str;
            }
            const newStr = await check();

            return newStr;
     
        }

        
    }

    //------------------------------------------ get file type

    public static async getFileType(scene: Scene3D, key: string): Promise<Readonly<string>>
    {
        const cache = scene.cache.json.get('resources_3d'),
              obj = cache.assets.filter((asset: any) => Object.keys(asset).toString() === key),
              file: Object = Object.entries(obj[0]),
              extension = file[0][1].endsWith('glb') ? 'glb' : 'fbx';

        return extension;
    }


    //------------------------------------ get mesh vertex position


    public static async getMeshVertexPosition(mesh: THREE.Object3D | any): Promise<Readonly<THREE.Vector3> | null>
    {
        if (!mesh.obj)
            return null;

        let vertex = new THREE.Vector3,
           att = vertex.fromBufferAttribute(mesh.obj[0].geometry.morphAttributes.position[0], mesh.id); 

        return null; //att;
    }


    //------------------------------------ get nearest bone


    public static async getNearestBone (

        meshA: typeof System.app.sys3d.actor, 
        meshB: typeof System.app.sys3d.actor, 
        key: string

    ): Promise<Readonly<{bone: Object, pos: number}> | null>
    {

        /* possible bone keys: 
            mixamorigHips
            mixamorigSpine
            mixamorigLeftUpLeg
            mixamorigRightUpLeg 
        */

        const 

           bonesA = meshA.obj?.children.filter((i: THREE.Object3D) => i instanceof THREE.Bone),
           bonesB = meshB.obj?.children.filter((i: THREE.Object3D) => i instanceof THREE.Bone),
           bones: any[] = [];
           
        if (bonesA && bonesB)
        { 
            bonesA?.map((i: THREE.Object3D) => i.children.map((bone: THREE.Object3D) => bones.push( { bone, worldPos: bone?.getWorldPosition(new THREE.Vector3) } )));

            let worldPos = bonesB?.map((i: THREE.Object3D) => i.children.map((bone: THREE.Object3D) => {
                    if (bone.name === key)
                        return bone?.getWorldPosition(new THREE.Vector3);
                }));
                
            if (worldPos[0][0])
            {
                let arr: any[] = [],
                    getSum = (i: any) => { return i.x + i.y + i.z; };

                bones.forEach((bone: THREE.Object3D) => arr.push({bone: bone['bone'], pos: getSum(bone['worldPos'])}));

                let bone = arr.reduce((prev, curr) => prev.pos < curr.pos ? prev : curr);   

                return bone;
            }
        }

        return null;
    }


    //------------------------------------ get dot product of two vector locations


    public static getDotProduct(

        actorA: typeof System.app.sys3d.player | typeof System.app.sys3d.actor, 
        actorB: typeof System.app.sys3d.player | typeof System.app.sys3d.actor

    ): Readonly<number>
    {
        let posA = actorA.position,
            posB = actorB.position,
            
            vecA = new THREE.Vector3(posA.x, posA.y, posA.z),
            vecB = new THREE.Vector3(posB.x, posB.y, posB.z), 

            vecA_length = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z), 
            vecB_length = Math.sqrt(vecB.x * vecB.x + vecB.y * vecB.y + vecB.z * vecB.z), 
        
            inverse_length_vecA = 1 / vecA_length, 
            inverse_length_vecB = 1 / vecB_length, 
        
            unit_vecA = new THREE.Vector3(vecA.x * inverse_length_vecA, vecA.y * inverse_length_vecA, vecA.z * inverse_length_vecA), 
            unit_vecB = new THREE.Vector3(vecB.x * inverse_length_vecB, vecB.y * inverse_length_vecB, vecB.z * inverse_length_vecB), 
        
            dotProduct = (unit_vecA.x * unit_vecB.x) + (unit_vecA.y * unit_vecB.y) + (unit_vecA.z * unit_vecB.z);

        return dotProduct;

    }
    
}