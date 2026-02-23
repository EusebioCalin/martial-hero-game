import Phaser from 'phaser';

export class Hitbox extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, '');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    this.setVisible(false);
    this.disable();
  }

  enable(x: number, y: number, w: number, h: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.setActive(true);
    body.reset(x, y);
    body.setSize(w, h);
    body.enable = true;
  }

  disable(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.setActive(false);
    body.enable = false;
  }
}
