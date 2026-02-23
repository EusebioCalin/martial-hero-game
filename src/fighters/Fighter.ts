import Phaser from 'phaser';
import { FighterState, PlayerIndex, InputState } from '../types';
import { FighterStateMachine } from './FighterStateMachine';
import { Hitbox } from './Hitbox';
import {
  MOVE_SPEED, JUMP_VELOCITY,
  FIGHTER_BODY_WIDTH, FIGHTER_BODY_HEIGHT,
  FIGHTER_BODY_OFFSET_X, FIGHTER_BODY_OFFSET_Y,
  ATTACK1_HITBOX, ATTACK2_HITBOX,
  ATTACK1_ACTIVE_FRAMES, ATTACK2_ACTIVE_FRAMES,
  ATTACK1_DAMAGE, ATTACK2_DAMAGE,
  MAX_HEALTH, GROUND_Y, FIGHTER_SCALE,
} from '../constants';

export class Fighter extends Phaser.Physics.Arcade.Sprite {
  readonly playerIndex: PlayerIndex;
  readonly sm: FighterStateMachine;
  readonly hitbox: Hitbox;

  health = MAX_HEALTH;
  facingRight = true;
  hitLanded = false;

  private _flashSprite: Phaser.GameObjects.Sprite | null = null;

  constructor(scene: Phaser.Scene, x: number, playerIndex: PlayerIndex) {
    // Spawn Y positions body bottom at GROUND_Y regardless of scale.
    // Derivation: body_bottom = spriteY + (OFFSET_Y + BODY_H - FRAME/2) * scale
    // → spriteY = GROUND_Y - (BODY_H / 2) * scale
    super(scene, x, GROUND_Y - (FIGHTER_BODY_HEIGHT / 2) * FIGHTER_SCALE, 'idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.playerIndex = playerIndex;
    this.sm = new FighterStateMachine();
    this.hitbox = new Hitbox(scene);

    this.setScale(FIGHTER_SCALE);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(FIGHTER_BODY_WIDTH, FIGHTER_BODY_HEIGHT);
    body.setOffset(FIGHTER_BODY_OFFSET_X, FIGHTER_BODY_OFFSET_Y);
    body.setCollideWorldBounds(true);

    // P2 gets blue tint
    if (playerIndex === 1) {
      this.setTint(0x448800);
    }

    // Initial facing: P1 faces right, P2 faces left
    if (playerIndex === 1) {
      this.setFlipX(true);
      this.facingRight = false;
    }

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this._onAnimComplete, this);
    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this._onAnimUpdate, this);
  }

  /** Call each frame with current input state */
  update(input: InputState): void {
    if (this.sm.state === FighterState.DEAD) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    // --- State transitions from input ---
    if (!this.sm.locked) {
      if (input.attack1 && onGround) {
        if (this.sm.transition(FighterState.ATTACK1)) {
          this.hitLanded = false;
          this.hitbox.disable();
        }
      } else if (input.attack2 && onGround) {
        if (this.sm.transition(FighterState.ATTACK2)) {
          this.hitLanded = false;
          this.hitbox.disable();
        }
      } else if (input.jump && onGround) {
        this.sm.transition(FighterState.JUMPING);
        body.setVelocityY(JUMP_VELOCITY);
      } else if (input.left || input.right) {
        this.sm.transition(FighterState.RUNNING);
      } else {
        this.sm.transition(FighterState.IDLE);
      }
    }

    // --- Air state ---
    if (!onGround && this.sm.state !== FighterState.ATTACK1 && this.sm.state !== FighterState.ATTACK2 && this.sm.state !== FighterState.HIT) {
      if (body.velocity.y < 0) {
        this.sm.transition(FighterState.JUMPING);
      } else if (body.velocity.y > 0) {
        this.sm.transition(FighterState.FALLING);
      }
    }

    // --- Horizontal movement ---
    // Allow movement during attacks; only freeze on HIT stagger (dead already returned early)
    if (this.sm.state !== FighterState.HIT) {
      if (input.left) {
        body.setVelocityX(-MOVE_SPEED);
      } else if (input.right) {
        body.setVelocityX(MOVE_SPEED);
      } else {
        body.setVelocityX(0);
      }
    } else {
      body.setVelocityX(0);
    }

    this._playAnimation();
    this._updateFlash();
  }

  updateFacing(otherX: number): void {
    if (this.sm.state === FighterState.DEAD) return;
    const shouldFaceRight = otherX > this.x;
    if (shouldFaceRight !== this.facingRight) {
      this.facingRight = shouldFaceRight;
      this.setFlipX(!shouldFaceRight);
    }
  }

  takeHit(damage: number): void {
    if (this.sm.state === FighterState.DEAD) return;
    this.health = Math.max(0, this.health - damage);
    if (this.health <= 0) {
      this.hitbox.disable();
      this.sm.transition(FighterState.DEAD);
      this._playAnimation();
    } else {
      this.sm.transition(FighterState.HIT);
      this._playAnimation();
      this._startFlash();
    }
  }

  reset(x: number): void {
    this.health = MAX_HEALTH;
    this.hitLanded = false;
    this.hitbox.disable();
    this.sm['_state'] = FighterState.IDLE;
    this.sm['_locked'] = false;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(x, GROUND_Y - (FIGHTER_BODY_HEIGHT / 2) * FIGHTER_SCALE);
    body.setVelocity(0, 0);
    this.facingRight = this.playerIndex === 0;
    this.setFlipX(this.playerIndex === 1);
    this.play('idle');
  }

  private _playAnimation(): void {
    const state = this.sm.state;
    const animMap: Record<FighterState, string> = {
      [FighterState.IDLE]: 'idle',
      [FighterState.RUNNING]: 'run',
      [FighterState.JUMPING]: 'jump',
      [FighterState.FALLING]: 'fall',
      [FighterState.ATTACK1]: 'attack1',
      [FighterState.ATTACK2]: 'attack2',
      [FighterState.HIT]: 'hit',
      [FighterState.DEAD]: 'death',
    };
    const animKey = animMap[state];

    // console.log(`Player ${this.playerIndex + 1} state: ${state}, health: ${this.health}`, `this.anims: ${{...this.anims}}`);
    if (this.anims.currentAnim?.key !== animKey || !this.anims.isPlaying) {
      this.play(animKey, true);
    }
  }

  private _onAnimComplete(): void {
    const state = this.sm.state;
    if (state === FighterState.ATTACK1 || state === FighterState.ATTACK2 || state === FighterState.HIT) {
      this.hitbox.disable();
      this.sm.unlock();
      this._playAnimation();
    }
  }

  private _onAnimUpdate(_anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame): void {
    const state = this.sm.state;
    if (state !== FighterState.ATTACK1 && state !== FighterState.ATTACK2) {
      this.hitbox.disable();
      return;
    }

    const frameIndex = frame.index - 1; // Phaser frames are 1-based
    const activeFrames = state === FighterState.ATTACK1 ? ATTACK1_ACTIVE_FRAMES : ATTACK2_ACTIVE_FRAMES;
    const hitboxCfg = state === FighterState.ATTACK1 ? ATTACK1_HITBOX : ATTACK2_HITBOX;

    if (activeFrames.includes(frameIndex)) {
      const dir = this.facingRight ? 1 : -1;
      const hbX = this.x + dir * hitboxCfg.offsetX * FIGHTER_SCALE;
      const hbY = this.y + hitboxCfg.offsetY * FIGHTER_SCALE;

      console.log(`Activating hitbox for Player 
        ${this.playerIndex + 1} at frame ${frameIndex} (anim frame ${frame.index})`);
        console.log('hitbox position', { hbX, hbY });
      this.hitbox.enable(hbX, hbY, hitboxCfg.width * FIGHTER_SCALE, hitboxCfg.height * FIGHTER_SCALE);
    } else {
      this.hitbox.disable();
    }
  }

  private _startFlash(): void {
    if (this._flashSprite) {
      this._flashSprite.destroy();
      this._flashSprite = null;
    }
    const flash = this.scene.add.sprite(this.x, this.y, 'hit-flash');
    flash.setDepth(10);
    if (!this.facingRight) flash.setFlipX(true);
    flash.play('hit-flash');
    flash.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      flash.destroy();
      if (this._flashSprite === flash) this._flashSprite = null;
    });
    this._flashSprite = flash;
  }

  private _updateFlash(): void {
    if (this._flashSprite) {
      this._flashSprite.setPosition(this.x, this.y);
    }
  }

  getDamageForCurrentAttack(): number {
    return this.sm.state === FighterState.ATTACK1 ? ATTACK1_DAMAGE : ATTACK2_DAMAGE;
  }
}
