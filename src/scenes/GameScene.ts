import Phaser from 'phaser';
import { Fighter } from '../fighters/Fighter';
import { InputHandler } from '../input/InputHandler';
import { FighterState } from '../types';
import {
  GAME_WIDTH, GAME_HEIGHT, GROUND_Y,
} from '../constants';

const P1_START_X = 240;
const P2_START_X = GAME_WIDTH - 240;
const ROUND_START_DELAY = 1500; // ms after KO before next round

export class GameScene extends Phaser.Scene {
  private fighters!: [Fighter, Fighter];
  private inputs!: [InputHandler, InputHandler];
  private ground!: Phaser.Physics.Arcade.StaticGroup;

  private roundActive = false;
  private roundNum = 1;
  private wins = [0, 0];
  private roundEndTimer: Phaser.Time.TimerEvent | null = null;

  constructor() { super('GameScene'); }

  create(): void {
    this._buildBackground();
    this._buildGround();
    this._buildFighters();
    this._buildOverlaps();

    this.roundActive = false;
    this.roundNum = 1;
    this.wins = [0, 0];

    // Small delay before first round
    this.time.delayedCall(ROUND_START_DELAY, () => this._startRound());
    this.events.emit('round-start', this.roundNum);
  }

  update(): void {
    if (!this.roundActive) return;

    const [f0, f1] = this.fighters;
    const [i0, i1] = this.inputs;

    f0.update(i0.getState());
    f1.update(i1.getState());

    // Update facing — only when not dead/locked
    if (f0.sm.state !== FighterState.DEAD) f0.updateFacing(f1.x);
    if (f1.sm.state !== FighterState.DEAD) f1.updateFacing(f0.x);

    // Check for death
    if (f0.sm.state === FighterState.DEAD && f1.sm.state !== FighterState.DEAD) {
      this._endRound(1);
    } else if (f1.sm.state === FighterState.DEAD && f0.sm.state !== FighterState.DEAD) {
      this._endRound(0);
    } else if (f0.sm.state === FighterState.DEAD && f1.sm.state === FighterState.DEAD) {
      // Double KO — no winner, replay round
      this._endRound(-1);
    }
  }

  private _buildBackground(): void {
    // Animated background sprite — scaled to fill the canvas
    const bg = this.add.sprite(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(-1);
    bg.play('background');
  }

  private _buildGround(): void {
    this.ground = this.physics.add.staticGroup();
    const groundImg = this.ground.create(GAME_WIDTH / 2, GROUND_Y + 10, '') as Phaser.Physics.Arcade.Image;
    groundImg.setVisible(false);
    groundImg.setDisplaySize(GAME_WIDTH, 20);
    (groundImg.body as Phaser.Physics.Arcade.StaticBody).setSize(GAME_WIDTH, 20);
    groundImg.refreshBody();
  }

  private _buildFighters(): void {
    const f0 = new Fighter(this, P1_START_X, 0);
    const f1 = new Fighter(this, P2_START_X, 1);

    this.physics.add.collider(f0, this.ground);
    this.physics.add.collider(f1, this.ground);
    // No body collider between fighters — characters share space freely (standard
    // fighting game behaviour). Contact is handled exclusively by the hitbox system.

    this.fighters = [f0, f1];
    this.inputs = [
      new InputHandler(this, 0),
      new InputHandler(this, 1),
    ];

    // Set initial depth so fighters render in front of ground
    f0.setDepth(5);
    f1.setDepth(5);
  }

  private _buildOverlaps(): void {
    const [f0, f1] = this.fighters;

    // P1's hitbox hits P2
    this.physics.add.overlap(f0.hitbox, f1, (_hb, target) => {
      const attacking = f0.sm.state === FighterState.ATTACK1 || f0.sm.state === FighterState.ATTACK2;
      if (!f0.hitLanded && attacking) {
        f0.hitLanded = true;
        (target as Fighter).takeHit(f0.getDamageForCurrentAttack());
        this.events.emit('health-update', 1, (target as Fighter).health);
      }
    });

    // P2's hitbox hits P1
    this.physics.add.overlap(f1.hitbox, f0, (_hb, target) => {
      if (!f1.hitLanded) {
        f1.hitLanded = true;
        (target as Fighter).takeHit(f1.getDamageForCurrentAttack());
        this.events.emit('health-update', 0, (target as Fighter).health);
      }
    });
  }

  private _endRound(winner: number): void {
    if (!this.roundActive) return;
    this.roundActive = false;

    if (this.roundEndTimer) {
      this.roundEndTimer.remove();
      this.roundEndTimer = null;
    }

    if (winner >= 0) {
      this.wins[winner]++;
      this.events.emit('round-end', winner);
    } else {
      // Double KO — emit for both
      this.events.emit('round-end', 0);
      this.events.emit('round-end', 1);
    }

    const winsNeeded = 2;
    const p0wins = this.wins[0] >= winsNeeded;
    const p1wins = this.wins[1] >= winsNeeded;

    if (p0wins || p1wins) {
      const matchWinner = p0wins ? 0 : 1;
      this.time.delayedCall(ROUND_START_DELAY, () => {
        this.events.emit('match-over', matchWinner);
      });
    } else {
      this.roundNum++;
      this.roundEndTimer = this.time.delayedCall(ROUND_START_DELAY, () => {
        this._startRound();
        this.events.emit('round-start', this.roundNum);
      });
    }
  }

  private _startRound(): void {
    const [f0, f1] = this.fighters;
    f0.reset(P1_START_X);
    f1.reset(P2_START_X);
    this.events.emit('health-update', 0, 100);
    this.events.emit('health-update', 1, 100);
    this.roundActive = true;
  }
}
