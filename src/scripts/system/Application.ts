///**** APPLICATION LEVEL CONFIG ***////  

import * as types from '../../../typings/types'

import { Config, System } from './Config';


import { AudioManager } from './Audio';
import { AjaxManager } from './ajax.js';
import { EventManager } from './eventManager';
import { Boot } from '../preload/Boot';
import { Preload } from '../preload/Preload';
import { Text, TextUI } from './Text.js';
import { Camera } from './camera';
import { Sandbox3D } from '../3d/sandbox';
import { Menu3D } from '../3d/menu';

//------------------------------------ APP

export default class Application {

    public timeOfDay: number
    public timeWarp: number 
    public gameData: any
    public groups?: any
    public scale: any
    public pipeline: any[]
    public groundArray: any[]
    public gameState: boolean = false
    public gameSaved: boolean = false
    public cutScene: boolean = false
    public interact: boolean = false
    public fightBoss: boolean = false
 
    public ajax: AjaxManager
    public audio: AudioManager
    public cam: Camera
    public text: Text
    public events: EventManager


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

        this.ajax = new AjaxManager;
        this.audio = new AudioManager;
        this.cam = new Camera;
        this.events = new EventManager;
        this.text = new Text;
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
        

    //--------------------array of stages / minigames within the game

        this.scene = [

            new Boot,
            new Preload,  
            new TextUI, 
            new Sandbox3D,
            new Menu3D

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

        System.app.text.textType = 'dialog';  

    ////events / map, level

        System.app.events.init(scene);
    

    }
    
}

        

