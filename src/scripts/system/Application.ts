///**** APPLICATION LEVEL CONFIG ***////  

import * as types from '../../../typings/types'

import { Config, System } from './Config';


import { AudioManager } from './Audio';
import { EventManager } from './eventManager';
import { Boot } from '../preload/Boot';
import { Preload } from '../preload/Preload';
import { Camera } from './camera';
import { Sandbox3D } from '../3d/sandbox';

import { Player } from '../3d/player';
import { Actor } from '../3d/Actor';



//------------------------------------ APP

export default class Application {

    public timeOfDay: number
    public timeWarp: number 
    public gameData: any
    sys3d: any
    public groups?: any
    public scale: any
    public pipeline: any[]
    public groundArray: any[]
    public gameState: boolean = false

    public audio: typeof AudioManager = AudioManager
    public cam: typeof Camera = Camera
    public events: typeof EventManager = EventManager

    private input: types.input
    private scene: Phaser.Scene[]
    private transparent: boolean
    private pixelArt: boolean
    private dom: { createContainer: boolean }
    private parent: string
    private backgroundColor: string
    private date: Date
    private hours: number 
    private type: number
    private physics: any

    
//-----------------------------------------------------------

    constructor(system: Config)
    {  

        this.type = Phaser.WEBGL;
        this.transparent = true,
        this.parent = 'game';

        this.scale = {
            mode: system.mode,
            autoCenter: system.position,
            width: system.width,
            height: system.height,
            min: {
                width: system.min.width,
                height: system.min.height
            },
            max: {
                width: system.max.width,
                height: system.max.height
            },
            scaleRatio: 0,
            parentBottom: null, 
            sizerBottom: null
        };

        this.dom = {
            createContainer: true,
            //modal: null
        };

        this.input = {
            virtual: true,
            gamepad: true,
            type: system.inputType,
            mode: 'A'
        };

        this.physics = {
            default: 'arcade'
        };
        
        this.sys3d = {
            player: Player,
            actor: Actor
        };


    //--------------------array of stages / minigames within the game

        this.scene = [

            new Boot,
            new Preload,  
            new Sandbox3D

        ];

    }


//------------------------------------    INIT LEVEL, groups, base game utils, called every main scene

  
    public async init(scene: Phaser.Scene): Promise<void>    
    { 
        
    ////time of day

        this.date = new Date();
        this.hours = this.date.getHours();

        System.app.timeWarp = 1;
        System.app.timeOfDay = this.hours * System.app.timeWarp; 

    ////events / map, level

        this.events.init(scene);
    

    }
    
}

        

