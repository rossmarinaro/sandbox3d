/* AUDIO */

import { System } from './Config';


export class AudioManager {

    private default: boolean = false;
    private sound: any;
    private cached: string[] = [];

    public noAudio: boolean = false;

    public music = {

        track: '',

        fadeIn: (src: string, vol: number, scene: any) => {

            for (let music of scene.sound.sounds) 
                if (music.key === System.app.audio.music.track) 
                    scene.tweens.add({ targets: music, volume: { value: 0, ease: 'Power1', duration: 500 }});
            let obj = scene.sound.add(src).setLoop(true).setVolume(0);
            scene.tweens.add({ targets: obj, volume: { value: vol, ease: 'Power1', duration: 3000}, onStart: ()=> obj.play()});
        },

        fadeOut: (src: string, vol: number, scene: any) => {

            for (let music of scene.sound.sounds) 
            {
                if (music.key === src)
                { 
                    scene.tweens.add({targets: music, volume: { value: 0, ease: 'Power1', duration: 3000 },  
                    onComplete: () => {
                        System.app.audio.music.play(scene);
                        scene.tweens.add({ targets: music, volume: { value: vol, ease: 'Power1', duration: 3000 }})
                        music.stop();
                        scene.sound.removeByKey(music); 
                    }});
                }
            }
        },

        play: async (scene: Phaser.Scene) =>{ 

            const getStage = async ()=> {

                switch (scene.data['currentStage'])
                {
                   
                    default: return '';
                }
            }

            const track = await getStage();

            System.app.audio.music.track = track;
            
            let src = scene.sound.add(track)['setLoop'](true).setVolume(0.8);
            src.play();
        }
    };

    //-------------------------------------------------------------------------

    constructor() 
    {
        this.noAudio = false;
        this.default = false;
        this.sound = null;
        this.cached = [];
    };

    public play (src: string, vol: number, loop: boolean, scene: Phaser.Scene, detune: number): void
    {
    //     System.app.audio.cached.push(src);
    //     System.app.audio.cached.filter((e: string) => { 
    //     System.app.audio.sound = scene.sound.add(src);
    //     System.app.audio.sound.setLoop(loop).setVolume(vol).setDetune(detune);

    // //if sound is already in cache, remove it

    //         if (e.toString() === src) 
    //             System.app.audio.cached.pop(src);
    //         System.app.audio.sound.play();  
    //     });
    }

    public stop (src: string, scene: any): void 
    { 
        for (let snd of scene.sound.sounds) 
            if (snd.key == src) 
                snd.stop();
    }
}