import { Scene, GameObjects, Input } from 'phaser';
import { Tile } from '../gameobjects/Tile';
import BendWaves from '../shaders/FilterBendWaves.js';

const TREE_SCROLL_FACTOR = 0.5;
const CLOUD_SCROLL_FACTOR = 0.25;

const JUMP_VELOCITY = -150; // Initial jump burst
const HANG_GRAVITY = 400;   // Reduced gravity during peak/hold
const NORMAL_GRAVITY = 1500;

export class Game extends Scene
{
    constructor ()
    {
        super({
            key: 'Game',
            physics: {
                arcade: {
                    // gravity: { y: 0 },
                    // gravity: { y: 1500 },
                    debug: false,
                    fps: 240
                }
            }
        });
    }

    create ()
    {
        this.music = this.sound.add('music')
        this.music.play({loop: -1});

        this.currentBottom = 0;
        this.currentMiddle = 0;
        this.currentTop = 0;
        this.treeCounter = 0;
        this.setNextTree();
        this.cloudCounter = 0;
        this.setNextCloud();
        this.secondCloudTile = false;
        this.chasmCounter = 0;
        this.setNextChasm(10);

        GameObjects.GameObjectFactory.register('tile', (x, y, index, scrollFactor, physics) => {
            let tile = new Tile(this, x, y, index, scrollFactor, physics);
            return tile;
        });

        this.tiles = this.add.group()
        this.tiles.runChildUpdate = true;

        this.jumpButtonDown = false;
        this.space = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);

        this.player = this.physics.add.sprite(32, 32, 'player')
            .play('player-walk')
            .setOrigin(0)
            .setDepth(10);

        this.alive = true;

        this.cameras.main.setBounds(0, 0, 999999999, 64)
            .startFollow(this.player)
            .setFollowOffset(-24)
            .setRoundPixels(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-SPACE', () => {
            this.jump();
        })
        
        this.input.on('pointerdown', () => {
            this.jump();            
        })
        
        this.player.body
            .setVelocityX(50)
            .setAccelerationX(1)
            .setOffset(3, 1)
            .setSize(6, 16)
            .setGravityY(NORMAL_GRAVITY);

        this.text = this.add.text(0, 0, '', {fontSize: "16px", color: "#000"})
            .setOrigin(0)
            .setDepth(20)
            .setScrollFactor(0);


        this.score = 0;
        this.scoreText = this.add.bitmapText(63, 1, 'font', '0')
            .setScrollFactor(0)
            .setOrigin(1, 0)
            .setDepth(20);
    }

    update()
    {
        if (this.space.isDown || this.input.activePointer.isDown) {
            this.jumpButtonDown = true;
        } else {
            this.jumpButtonDown = false;
        }

        // --- HANG TIME LOGIC ---
        // If holding the jump key while moving upward, reduce gravity
        if (this.jumpButtonDown && this.player.body.velocity.y < 0) {
            this.player.body.setGravityY(HANG_GRAVITY);
        } else {
            // Reset to normal gravity when they let go or start falling
            this.player.body.setGravityY(NORMAL_GRAVITY);
        }

        if (this.player.y > 48 && this.alive) {
            this.alive = false;
            this.cameras.main.stopFollow();
            this.cameras.main.filters.external.add(new BendWaves.Controller(this.cameras.main));
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    this.music.stop();
                    this.scene.start('GameOver', {score: this.getScore()});
                }
            });
        }

        while (this.cameras.main.worldView.right * TREE_SCROLL_FACTOR > this.currentMiddle * 16 - 48) {
            let x = this.currentMiddle * 16 - 16;
            if (this.treeCounter >= this.nextTree) {
                this.add.tile(x, 16, 4, TREE_SCROLL_FACTOR);
                this.add.tile(x, 32, 6, TREE_SCROLL_FACTOR);
                this.treeCounter = 0;
                this.setNextTree();
            } else {
                this.add.tile(x, 16, 5, TREE_SCROLL_FACTOR);
                this.add.tile(x, 32, 7, TREE_SCROLL_FACTOR);
                this.treeCounter++;
            }
            this.currentMiddle++;
        }
        
        while (this.cameras.main.worldView.right * CLOUD_SCROLL_FACTOR > this.currentTop * 16 - 64) {
            let x = this.currentTop * 16 - 16;
            if (this.secondCloudTile) {
                this.add.tile(x, 0, this.secondCloudTile, CLOUD_SCROLL_FACTOR);
                this.secondCloudTile = false
                this.cloudCounter = 0;
                this.setNextCloud();
            } else if (this.cloudCounter > this.nextCloud) {
                let cloud = Math.floor(Math.random() * 2)
                this.add.tile(x, 0, cloud * 2, CLOUD_SCROLL_FACTOR);
                this.secondCloudTile = cloud * 2 + 1;
            } else {
                this.add.tile(x, 0, 5, CLOUD_SCROLL_FACTOR);
                this.add.tile(x, 0, 5, CLOUD_SCROLL_FACTOR);
                this.cloudCounter++;
            }
            this.currentTop++;
        }
        
        while (this.cameras.main.worldView.right > this.currentBottom * 16 - 16) {
            let x = this.currentBottom * 16 - 16;
            if (this.chasmCounter > this.nextChasm) {
                this.add.tile(x, 48, 8);
                this.chasmCounter = 0;
                this.setNextChasm();
            } else {
                this.physics.add.collider(this.player, this.add.tile(x, 48, 9, 1, true));
                this.chasmCounter++;
            }
            this.currentBottom++;
        }

        this.text.setText([
        ]);

        if (this.alive) {
            this.score++;
        }
        this.scoreText.setText(this.getScore());
    }
    
    setNextTree()
    {
        this.nextTree = Math.floor(Math.random() * 4);
    }
    
    setNextCloud()
    {
        this.nextCloud = Math.floor(Math.random() * 4);
    }
    
    setNextChasm(offset = 0)
    {
        this.nextChasm = Math.floor(Math.random() * 4) + offset;
    }

    getScore() {
        return Math.floor(this.score / 10) * 10;
    }

    jump() {
        if (this.player.body.blocked.down) {
            this.player.setVelocityY(JUMP_VELOCITY);
        }
    }
}
