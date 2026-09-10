import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game, Scale } from 'phaser';
import BendWaves from './shaders/FilterBendWaves.js';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 64,
    height: 64,
    parent: 'game-container',
    backgroundColor: '#15254b',
    pixelArt: true,
    roundPixels: true,
    scale: {
        autoCenter: Scale.CENTER_BOTH,
        mode: Scale.FIT
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ],
    renderNodes: {
        FilterBendWaves: BendWaves.Filter
    }
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}

export default StartGame;
