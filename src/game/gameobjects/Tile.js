import { GameObjects } from 'phaser';

export class Tile extends GameObjects.Image {
    constructor(scene, x, y, index, scrollFactor, physics) {
        super(scene, x, y, 'tiles', index); 
        this.setOrigin(0);
        scene.add.existing(this);
        scene.tiles.add(this);
        if (!scrollFactor) {
            scrollFactor = 1
        }
        this.setScrollFactor(scrollFactor);
        if (physics) {
            this.body = scene.physics.add.staticBody(x, y, this.width, this.height);
        }
    }

    update() {
        if (this.x < this.scene.cameras.main.scrollX * this.scrollFactorX - 16) {
            this.destroy();
        }
    }
}