import Phaser from 'phaser';
import { SPRITE_CONFIGS } from '../config/animations';
import { FRAME_SIZE } from '../constants';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload(): void {
    // Loading text
    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Loading...',
      { fontSize: '32px', color: '#ffffff' }
    ).setOrigin(0.5);

    // Progress bar
    const bar = this.add.graphics();
    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0xffffff, 1);
      bar.fillRect(200, 290, 560 * value, 20);
    });
    this.load.on('complete', () => { bar.destroy(); text.destroy(); });

    // Load all spritesheets
    for (const cfg of SPRITE_CONFIGS) {
      this.load.spritesheet(cfg.key, `assets/sprites/${cfg.file}`, {
        frameWidth: FRAME_SIZE,
        frameHeight: FRAME_SIZE,
      });
    }

    // Background: 11520x1920, 6 frames → 1920x1920 each
    this.load.spritesheet('background', 'assets/background/background_1.png', {
      frameWidth: 1920,
      frameHeight: 1920,
    });
  }

  create(): void {
    // Create animations from all configs
    for (const cfg of SPRITE_CONFIGS) {
      this.anims.create({
        key: cfg.key,
        frames: this.anims.generateFrameNumbers(cfg.key, { start: 0, end: cfg.frameCount - 1 }),
        frameRate: cfg.frameRate,
        repeat: cfg.repeat,
      });
    }

    this.anims.create({
      key: 'background',
      frames: this.anims.generateFrameNumbers('background', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    console.log('[BootScene] All animations created:', SPRITE_CONFIGS.map(c => c.key).join(', '), 'background');
    // this.scene.start('MenuScene');
    this.scene.start('GameScene');
  }
}
