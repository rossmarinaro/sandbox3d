////Events 

import { System } from './Config';

import { Scene3D } from '@enable3d/phaser-extension';

export class EventManager {

    public manager: any
    public socket: any
    public ee: any
    
    private scene: Phaser.Scene
    private events: Phaser.Events.EventEmitter

    constructor()
    {
        this.manager = null;
        this.socket = null;
        this.ee = null;
    }

    private stopCommon(): void
    {
        
        this.scene.sound.stopAll(); 
        this.scene.sound.removeAll(); 
    
        /* .. */
        
    }


    public quitGame(scene: Phaser.Scene | Scene3D): void
    {
        if (System.app.events.socket !== null)
            System.app.events.socketClose(scene['connection']);

        System.app.gameState = false;
        System.app.events.ee.emit('exit');
    }

    public async socketInit(): Promise<boolean>
    {
        if (System.app.events.socket !== null)
            return true;


        System.app.events.socket 
           .on('connect_error', (err: any) => System.app.events.socketErrorHandler(err))
           .on('connect_failed', (err: any) => System.app.events.socketErrorHandler(err))
           .on('connect_disconnect', (err: any) => System.app.events.socketErrorHandler(err));

        return false;
    }

    public socketClose(socket: any): void
    {
        socket.disconnect();  
        System.app.events.socket = null;
    }

    public socketErrorHandler (err: any): boolean
    {
        console.log('socket error: ', err);
        System.app.ui.displayMessage(`OOF! NETWORK ERROR: ${err}`, true, true);
        
        return false;
    }

    public init (scene: Phaser.Scene): void
    {

        this.scene = scene;
        this.events = scene.events;

        System.app.events.ee = this.events;


        this.events
        
        .on('exit', async ()=> {  //// exit main game

            this.stopCommon();


            this.scene.scene.stop('Menu3D');
        });

    }


}
