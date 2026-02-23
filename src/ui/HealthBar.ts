import Phaser from 'phaser';
import { MAX_HEALTH } from '../constants';

const BAR_WIDTH = 350;
const BAR_HEIGHT = 24;
const PADDING = 4;

export class HealthBar {
  private gfx: Phaser.GameObjects.Graphics;
  private x: number;
  private y: number;
  private reversed: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, reversed = false) {
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(100);
    this.gfx.setScrollFactor(0);
    this.x = x;
    this.y = y;
    this.reversed = reversed;
    this.draw(MAX_HEALTH);
  }

  draw(health: number): void {
    const pct = Math.max(0, health / MAX_HEALTH);
    this.gfx.clear();

    // Background
    this.gfx.fillStyle(0x222222, 1);
    this.gfx.fillRect(this.x, this.y, BAR_WIDTH, BAR_HEIGHT);

    // Health fill
    const fillWidth = (BAR_WIDTH - PADDING * 2) * pct;
    const color = pct > 0.5 ? 0x44dd44 : pct > 0.25 ? 0xdddd00 : 0xdd2222;
    this.gfx.fillStyle(color, 1);

    const fillX = this.reversed
      ? this.x + PADDING + (BAR_WIDTH - PADDING * 2) * (1 - pct)
      : this.x + PADDING;

    this.gfx.fillRect(fillX, this.y + PADDING, fillWidth, BAR_HEIGHT - PADDING * 2);

    // Border
    this.gfx.lineStyle(2, 0xffffff, 1);
    this.gfx.strokeRect(this.x, this.y, BAR_WIDTH, BAR_HEIGHT);
  }
}
