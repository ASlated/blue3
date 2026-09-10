import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        this.score = data.score;
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

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0, false, (_camera, progress) => {
                if (progress >= 1) {
                    this.scene.start('Game'); 
                }
            });
        });

        let scoreText = this.add.bitmapText(56, 54, 'font', this.score).setOrigin(0);
        scoreText.setX(32 - Math.floor(scoreText.width / 2));
        
        this.cameras.main.fadeIn(500);
    }
}
