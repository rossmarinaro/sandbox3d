
/***  TEXT / SCENE UI for text ****/


export class Text {

    constructor ()
    {

        this.texts = 0,
        this.textContent = [],
        this.color = '',
        this.acceptString = '',
        this.fontSystem = {
            intro: System.mobileAndTabletCheck() ? '2.4rem' : '3rem',
            game: System.mobileAndTabletCheck() ? '1.7rem' : '3rem',
            select: System.mobileAndTabletCheck() ? '3rem' : '4rem', 
            multiplayer: System.mobileAndTabletCheck() ? '2.7rem' : '3rem'
        };
    }

    //--------------------- set interactive options

    setInteractiveText(scene, text, bool)
    {
        let _scene = scene.scene.get('TextUI');
        return bool ? _scene['showOptions'](scene, text) : null;
    }

    //---------------------- output text to ui 

    async exec (scene, textType, textColor, options, optionsArray, content, stage, bool)
    {
        if (stage !== undefined && stage !== null)
            textType = 'select';

        this.textContent.push(content);

        scene.scene.run('TextUI', [scene, textType, textColor, options, optionsArray]);
       
        scene.time.delayedCall(500, ()=> {

            let isSelectable = textType === 'select' || textType === 'dialog' ? true : false;

            if (isSelectable)
            {
                scene.time.delayedCall(1500, ()=> this.setInteractiveText(scene, stage, bool));
                this.textContent = [];
            }
        });

    //text content
        return content;
    }

    
//------------------------ players's interaction with other characters and options, speech bubble exclamation


    async characterInteractionDialog(scene, x, y, flipX, overlap, _message, optionsArr, bool, stage)
    {

        System.app.interact = true;

        if (overlap !== null)
        {
            overlap.active = false;
            System.app.physics.collisions.blockCollideCallback(overlap);
        }

    //is this text related to selections?

        let options = optionsArr !== null ? true : false,
            message = _message + '                                       ',
            speechBub = scene.add.sprite(x, y, 'speech_bub').play('speech_bub_anims').setFlipX(flipX),
            txt = scene.add.text(speechBub.x, speechBub.y - 30, `!`, { font: "90px Digitizer", fill: '#000'});

        if (optionsArr === null || optionsArr === 'undefined')
            optionsArr = [];

        System.app.text.exec(scene, 'dialog', null, options, optionsArr, message, stage, bool);

        scene.time.delayedCall(3000, ()=> {
            let fade = scene.tweens.add({
                targets: [speechBub, txt], alpha: { value: 0, ease: 'Power1', duration: 1000 }, repeat: 0, 
                onComplete: ()=> {
                    speechBub.destroy();
                    txt.destroy();
                    fade.remove();
                    if (overlap !== null)
                        overlap.active = true;
                    System.app.interact = false;
                }
            });
        });
    }
    
} 

//---------------------------------------------------- Text UI 


export class TextUI extends Phaser.Scene {

    constructor(){
        super('TextUI');
    }
    create([scene, textType, textColor, options, optionsArray])
    {   
        this._scene = scene;
        this.options = options;
        this.textType = textType;
        this.optionsArray = optionsArray;
        this.eventTyping = undefined;
        this.textToShow = "";
        this.messageToShow = "";
        this.txt = null; 

    //// avatar

        this.avatar = this.add.image(20, 50, `avatar_player_${textColor}`).setVisible(false); 

    //text showing the message
    
        switch(textType)
        {
            case 'intro' : this.textOutput = this.add.text((5 / 100) * this.cameras.main.width, 0, "", { fill: '#ffff00', font: `${System.app.text.fontSystem.intro} Bangers`, wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#ff0000', 4).setShadow(4, 4, '#000000', true, false).setDepth(2); break;
            case 'dialog' : this.textOutput = this.add.text((5 / 100) * this.cameras.main.width, 0, "", { fill: '#ffffff', font: `${System.app.text.fontSystem.game} Bangers`, wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#000000', 5).setDepth(2); break;
            case 'multiplayer' : 
                    this.textOutput = this.add.text(this.avatar.x + 50, this.avatar.y, "", { fill: textColor, font: `${System.app.text.fontSystem.multiplayer} Bangers`, wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#000000', 5).setDepth(2); 
                //show avatar of other players
                    if (textColor !== null && !textColor.startsWith('#'))
                        this.avatar.setVisible(true);
            break;
            case 'select' : this.textOutput = this.add.text((5 / 100) * this.scale.width, 0, "", { fill: '#ffff00', font: `${System.app.text.fontSystem.select} Digitizer`, wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, margin: 'auto', align: 'center'}).setStroke('#ff0000', 4.2).setDepth(2); break;
        }

        this.txtGraphics = this.add.graphics();
        this.txtGraphics.fillStyle(0x1f317d, 0.6);
        this.rectangleDialog = this.txtGraphics.fillRect(200, 400, 500, 110).setVisible(false);

    //fade out text

        this.fadeOutDialog = this.tweens.add({targets: this.textOutput, alpha: 0, duration: 1500, ease: 'Power1', onComplete: ()=> this.textOutput.visible = false}).pause();

    //start sequence

        this.showDialogue(this.txt);
    } 

    //---------------------------------------

    update()
    {
        System.isPortrait(this) || this.cameras.main.height > this.cameras.main.width ? 
            this.textOutput.setY(50) : this.textOutput.setY(0);
    }

    //-------------------------------------------show options

    showOptions (scene, text) 
    { 

        System.app.cutScene = true;

        if (this.textType === 'select') //if entering new map
        {
            System.app.cutScene = true;
            
            this.add.text((35 / 100) * this.scale.width, this.scale.height / 2, "Yes", { fill: '#ffff00', font: '50px Bangers', wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#ff0000', 4).setShadow(4, 4, '#000000', true, false).setDepth(2).setInteractive()
            .on('pointerdown', () =>{
                System.app.events.ee.emit('game', System.app.text.acceptString);
                this.scene.stop('TextUI');
            });
            this.add.text((65 / 100) * this.scale.width, this.scale.height / 2, "No", { fill: '#ffff00', font: '50px Bangers', wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#ff0000', 4).setShadow(4, 4, '#000000', true, false).setDepth(2).setInteractive()
            .on('pointerdown', () =>{
                System.app.cutScene = false;
                this.options = false;
                this.scene.stop('TextUI');
            });
            System.app.text.textContext = scene;
            System.app.text.acceptString = text;
        }
        else if (this.optionsArray !== null) //if dialog
        {
            this.add.text((25 / 100) * this.scale.width, this.scale.height / 1.5, this.optionsArray[0], { fill: '#ffff00', font: '50px Bangers', wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#ff0000', 4).setShadow(4, 4, '#000000', true, false).setDepth(2).setInteractive()
            .on('pointerdown', () =>{
                System.app.cutScene = false;
                this.options = false;
                System.app.events.ee.emit('dialog', true);
                this.scene.stop('TextUI');
            });
            this.text2 = this.add.text((25 / 100) * this.scale.width, this.scale.height / 2, this.optionsArray[1], { fill: '#ffff00', font: '50px Bangers', wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#ff0000', 4).setShadow(4, 4, '#000000', true, false).setDepth(2).setInteractive()
            .on('pointerdown', () =>{
                System.app.cutScene = false;
                this.options = false;
                System.app.events.ee.emit('dialog', false);
                this.scene.stop('TextUI');
            });

        //optional third param

            if (this.optionsArray[2] !== 'undefined')
            {
                this.add.text((28 / 100) * this.scale.width, this.text2.y - 100, this.optionsArray[2], { fill: '#ffff00', font: '50px Bangers', wordWrap: { width: this.scale.width - (10 / 100) * this.scale.width, useAdvancedWrap: true}, align: 'left'}).setStroke('#ff0000', 4).setShadow(4, 4, '#000000', true, false).setDepth(2).setInteractive()
                .on('pointerdown', () =>{
                    System.app.cutScene = false;
                    this.options = false;
                    System.app.events.ee.emit('dialog', null);
                    this.scene.stop('TextUI');
                });
            }
        }
    
    }

    //------------------------------------------message

    hideDialogue ()
    { 
        //hide the current dialogue or goes to the next one in a sequential dialog, increment text output

        System.app.text.texts++; 
        this.showDialogue(this.txt);     
      
        if (System.app.text.texts >= System.app.text.textContent.length) 
        {
            System.app.text.texts = 0;    
            this.textId = System.app.text.textContent.join(' '); 
            System.app.text.textContent = []; 
            this.fadeOutDialog.play(); 
             //console.log(`texts: ${System.app.text.texts}`, `content array ${System.app.text.textContent}`, this.textId);
        } 
    }

    //------------------------------------shows the dialogue window with a specific message

    showDialogue (text) 
    { 
        text = System.app.text.textContent[System.app.text.texts];

        if (text != null)
        {
            let i = 0;

            this.messageToShow = text;
            this.textToShow = ``;
            this.textOutput.text = this.textToShow;
            
            if (this.eventTyping !== undefined) 
                this.eventTyping.remove(false); 

            this.eventTyping = this.time.addEvent(
                { 
                    delay: 50, args: [text], repeat: text.length - 1,
                    callback: (text) => {
                        this.textToShow += text[i]
                        this.textOutput.text = this.textToShow;
                        i++;
                }
            });
            this.time.addEvent({ 
                args: [text], delay: text.length * 50 + 500,
                callback: () => this.hideDialogue()
            });
        }
        else if (this.options === false)
            this.scene.stop('TextUI');
       
    }


}








