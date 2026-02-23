import Phaser from 'phaser';
import { HealthBar } from '../ui/HealthBar';
import { RoundIndicator } from '../ui/RoundIndicator';

export class UIScene extends Phaser.Scene {
  private hbP1!: HealthBar;
  private hbP2!: HealthBar;
  private ripP1!: RoundIndicator;
  private ripP2!: RoundIndicator;
  private centerText!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'UIScene', active: false }); }

  create(): void {
    const { width } = this.cameras.main;

    // Health bars
    this.hbP1 = new HealthBar(this, 20, 16, false);
    this.hbP2 = new HealthBar(this, width - 20 - 350, 16, true);

    // Player labels
    this.add.text(20, 46, 'P1', { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' }).setDepth(101);
    this.add.text(width - 20, 46, 'P2', { fontSize: '14px', color: '#4488ff', fontFamily: 'monospace' })
      .setOrigin(1, 0).setDepth(101);

    // Round indicators
    this.ripP1 = new RoundIndicator(this, 180, 60);
    this.ripP2 = new RoundIndicator(this, width - 180, 60);

    // Round label
    this.add.text(width / 2, 16, 'ROUND', { fontSize: '18px', color: '#ffcc00', fontFamily: 'monospace' })
      .setOrigin(0.5, 0).setDepth(101);

    // Center text (KO, ROUND, etc.)
    this.centerText = this.add.text(width / 2, 200, '', {
      fontSize: '64px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ff4400',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    // Subscribe to GameScene events
    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('health-update', (p: number, hp: number) => {
      if (p === 0) this.hbP1.draw(hp);
      else this.hbP2.draw(hp);
    });
    gameScene.events.on('round-start', (roundNum: number) => {
      this._showCenterText(`ROUND ${roundNum}`, 1500);
    });
    gameScene.events.on('round-end', (winner: number) => {
      if (winner === 0) this.ripP1.addWin();
      else this.ripP2.addWin();
      this._showCenterText('K.O.', 2000);
    });
    gameScene.events.on('match-over', (winner: number) => {
      this._showCenterText(`P${winner + 1} WINS!`, 9999);
      this.time.delayedCall(3000, () => {
        this.ripP1.reset();
        this.ripP2.reset();
        this.hbP1.draw(100);
        this.hbP2.draw(100);
        this.centerText.setAlpha(0);
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');
        this.scene.start('MenuScene');
      });
    });
  }

  private _showCenterText(msg: string, duration: number): void {
    this.centerText.setText(msg).setAlpha(1);
    if (duration < 9000) {
      this.tweens.add({
        targets: this.centerText,
        alpha: 0,
        delay: duration - 400,
        duration: 400,
        ease: 'Linear',
      });
    }
  }
}
