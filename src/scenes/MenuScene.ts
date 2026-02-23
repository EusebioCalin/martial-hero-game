import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create(): void {
    const { width, height } = this.cameras.main;

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0030, 0x1a0030, 0x000820, 0x000820, 1);
    bg.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, 160, 'MARTIAL HERO', {
      fontSize: '72px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ff4400',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Controls cheatsheet
    const ctrlStyle = { fontSize: '16px', fontFamily: 'monospace', color: '#aaffaa' };
    this.add.text(width / 2 + 10, 320, 'P1: WASD to move  G=Attack1  H=Attack2', ctrlStyle).setOrigin(0.5);
    this.add.text(width / 2 + 10, 350, 'P2: ←→↑ to move  K=Attack1  L=Attack2', ctrlStyle).setOrigin(0.5);

    // Press Enter
    const pressEnter = this.add.text(width / 2, 450, 'PRESS ENTER TO FIGHT', {
      fontSize: '28px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: pressEnter,
      alpha: 0,
      duration: 600,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
    });

    // Best of 3
    this.add.text(width / 2, 505, 'Best of 3 rounds', {
      fontSize: '16px',
      color: '#888888',
    }).setOrigin(0.5);

    const enter = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enter.once('down', () => {
      this.scene.start('GameScene');
      this.scene.start('UIScene');
    });
  }
}
