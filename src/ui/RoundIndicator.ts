import Phaser from 'phaser';

const PIP_RADIUS = 10;
const PIP_GAP = 28;

export class RoundIndicator {
  private gfx: Phaser.GameObjects.Graphics;
  private wins = 0;
  private cx: number;
  private cy: number;

  constructor(scene: Phaser.Scene, cx: number, cy: number) {
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(100);
    this.gfx.setScrollFactor(0);
    this.cx = cx;
    this.cy = cy;
    this._draw();
  }

  addWin(): void {
    this.wins = Math.min(3, this.wins + 1);
    this._draw();
  }

  reset(): void {
    this.wins = 0;
    this._draw();
  }

  getWins(): number { return this.wins; }

  private _draw(): void {
    this.gfx.clear();
    for (let i = 0; i < 3; i++) {
      const px = this.cx + (i - 1) * PIP_GAP;
      if (i < this.wins) {
        this.gfx.fillStyle(0xffdd00, 1);
        this.gfx.fillCircle(px, this.cy, PIP_RADIUS);
      }
      this.gfx.lineStyle(2, 0xffffff, 1);
      this.gfx.strokeCircle(px, this.cy, PIP_RADIUS);
    }
  }
}
