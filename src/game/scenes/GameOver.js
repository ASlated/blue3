import { Scene } from 'phaser';
import BendWaves from '../shaders/FilterBendWaves.js';

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

        this.filterStarted = false;

        this.input.keyboard.on('keydown-SPACE', () => {
            this.restartGame();
        });
        
        this.input.on('pointerdown', () => {
            this.restartGame();
        });

        let scoreText = this.add.bitmapText(56, 54, 'font', this.score).setOrigin(0);
        scoreText.setX(32 - Math.floor(scoreText.width / 2));
        
        // this.cameras.main.fadeIn(500);
    }

    restartGame() {
        if (!this.filterStarted) {
            this.cameras.main.filters.external.add(new BendWaves.Controller(this.cameras.main));
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    this.scene.start('Game');
                }
            });
        }
    }
}
