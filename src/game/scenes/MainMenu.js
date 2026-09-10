import { Scene } from 'phaser';

export class MainMenu extends Scene
{
  constructor() {
    super('MainMenu');
  }

  create() {
    this.add.image(0, 0, 'title')
      .setOrigin(0);

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('Game');
    });
        
    this.input.on('pointerdown', () => {
      this.scene.start('Game');
    });
  }
}