import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game, Scale } from 'phaser';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 64,
    height: 64,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    roundPixels: true,
    scale: {
        autoCenter: Scale.CENTER_BOTH,
        mode: Scale.FIT
    },
    scene: [
        Boot,
        Preloader,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
