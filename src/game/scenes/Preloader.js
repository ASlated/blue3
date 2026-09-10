import { Scene, GameObjects } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.spritesheet('player', '3-color-guy.png', {frameWidth: 11, frameHeight: 16});
        
        this.load.spritesheet('tiles', 'blue3tiles.png', {frameWidth: 16, frameHeight: 16});

        this.load.image('game-over', 'game_over.png');

        this.load.image('font', 'font.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 7,
            repeat: -1
        });

        this.cache.bitmapFont.add('font', GameObjects.RetroFont.Parse(this, {
            image: 'font',
            width: 4,
            height: 5,
            chars: '0123456789',
            charsPerRow: 10,
            spacing: { x: 0, y: 0 }
        }));

        this.scene.start('Game');
    }
}
