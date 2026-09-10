import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    preload ()
    {
    }
    
    create ()
    {
        this.add.image(0, 0, 'game-over').setOrigin(0);
        this.input.keyboard.on('keydown-SPACE', () => {
            this.cameras.main.fade(500, 0, 0, 0, false, (_camera, progress) => {
                if (progress >= 1) {
                    this.scene.start('Game'); 
                }
            });
        });
        this.cameras.main.fadeIn(500);
    }
}
