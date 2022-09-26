import '../style.css';

import * as Phaser from 'phaser'
import { enable3d } from '@enable3d/phaser-extension';   
import Application from './system/Application';

'use strict';



//-------------------- window error

    // window.onerror = function(err, url, line){
    //     alert(`${err}, \n ${url}, \n ${line}`);
      //window.location.reload();
    //     return true;
    // }

//--------------------- on load

    window.onload = async ()=> {          

        System.app = new Application(System); 
        enable3d(() => System.game = new Phaser.Game(System.app))

        .withPhysics('assets/wasm');

    }  





    