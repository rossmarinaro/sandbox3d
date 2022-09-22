import * as types from '../../../../typings/types';
import { Scene3D, ExtendedObject3D } from '@enable3d/phaser-extension';
import { System } from '../../system/Config';


export class Inventory3D {

    private static weapons: string[] = ['rolling_pin1', 'automac1000']
    private static powerups: string[] = ['ikura_maki_tile']
    private static selections: string[] = [...Inventory3D.weapons, ...Inventory3D.powerups]

    public static currentSelection: string
    
    public static ammo: types.ammo = {
        automac1000: 0,
        penne_pistol: 0,
        rigatoni_rocket_launcher: 0,
        grenade: 0,
        dynamite: 0
    }

//------------------------------------------------ reset ammo

    public static resetAmmo (base: number): void
    {
        Inventory3D.ammo = {
            automac1000: base,
            penne_pistol: base,
            rigatoni_rocket_launcher: base,
            grenade: base,
            dynamite: base
        }
    }

//------------------------------------------------ get item / pickup



//------------------------------ set item

    public static async setItem(scene: Scene3D, item: string): Promise<void>
    {

        System.vibrate(20);
        
        let player = scene['player'];

        if (scene['player'].currentEquipped.obj !== null)
            scene['player'].currentEquipped.obj.remove(scene['player'].currentEquipped.obj.children[0]);

        const applySelection = async () => {

            switch (item)
            {
                case 'rolling_pin1' : 
                    return [/* 0, new RollingPin(player, scene) */];
                case 'automac1000' : 
                    return [/* Inventory3D.ammo.automac1000, new Automac1000(player, scene) */]; 
            }
        }

        let selection = await applySelection();
        
        if (selection)
        {
            scene['player'].currentEquipped.key = item;
            scene['player'].currentEquipped.quantity = selection[0];
            scene['player'].currentEquipped.obj = selection[1]; 
        }

        Inventory3D.currentSelection = item;

    }



}