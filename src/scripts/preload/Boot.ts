/* BOOT */

import { System } from '../system/Config';
import { Utils } from '../system/Utils';

import resources_3d from './resources/3d.json';
import JoyStick from '../plugins/joystick.js';

export class Boot extends Phaser.Scene { 

    private gameData: any

    constructor() {
        super("Boot");      
    }
    
//---------------------- initialize 

    public async init(): Promise<void> 
    {
        

    //utilities

        System.utils = new Utils;
        
    //game scale 

        System.app.scale.scaleWidth = this.scale.width; 
        System.app.scale.scaleHeight = this.scale.height;
        System.app.scale.scaleRatio = System.app.scale.scaleWidth / System.app.scale.scaleHeight * 0.9; 
            
    }
    private async preload(): Promise<void>
    {
        //// assets

            this.load.json('resources_3d', resources_3d);
        ////plugins

        this.load.plugin('rexvirtualjoystickplugin', JoyStick, true);

    }
    
//------------------------------- run preload scene

    private async create(): Promise<void>
    {   
        this.add.text(0, 0, '', { font: "1px Digitizer"}).setAlpha(0);
        this.add.text(0, 0, '', { font: "1px Bangers"}).setAlpha(0);

        this.time.delayedCall(500, ()=> {

        //gameplay data object (gets passed scene to scene)
            const data: any = new Phaser.Scenes.Systems(this, this.gameData); 
            this.scene.run('Preload', data.config);
            this.scene.stop('Boot');

        });
    }
}


   