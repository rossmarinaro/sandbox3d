////Events 

import { System } from './Config';

import { Scene3D } from '@enable3d/phaser-extension';

export class EventManager {

    public static ee: Phaser.Events.EventEmitter | null = null
    public static socket: any = null
    private static scene: Phaser.Scene
    

    private static stopCommon(): void
    {
        
        EventManager.scene.sound.stopAll(); 
        EventManager.scene.sound.removeAll(); 
    
        /* .. */
        
    }

    //--------------------------------

    public static quitGame(scene: Phaser.Scene | Scene3D): void
    {
        if (System.app.events.socket !== null)
            System.app.events.socketClose(scene['connection']);

        System.app.gameState = false;
        System.app.events.ee.emit('exit');
    }

    //--------------------------------

    public static async socketInit(): Promise<boolean>
    {
        if (System.app.events.socket !== null)
            return true;


        System.app.events.socket 
           .on('connect_error', (err: any) => System.app.events.socketErrorHandler(err))
           .on('connect_failed', (err: any) => System.app.events.socketErrorHandler(err))
           .on('connect_disconnect', (err: any) => System.app.events.socketErrorHandler(err));

        return false;
    }

    //--------------------------------

    public static socketClose(socket: any): void
    {
        socket.disconnect();  
        System.app.events.socket = null;
    }

    //--------------------------------

    public static socketErrorHandler (err: any): boolean
    {
        console.log('socket error: ', err);
        System.app.ui.displayMessage(`OOF! NETWORK ERROR: ${err}`, true, true);
        
        return false;
    }

    //--------------------------------

    public static init (scene: Phaser.Scene): void
    {

        EventManager.scene = scene;
        System.app.events.ee = scene.events;

        System.app.events.ee
        
        .on('exit', async ()=> {  //// exit main game

            EventManager.stopCommon();


            EventManager.scene.scene.stop('Menu3D');
        });

    }


}
