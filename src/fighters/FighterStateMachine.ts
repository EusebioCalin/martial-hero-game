import { FighterState } from '../types';

export class FighterStateMachine {
  private _state: FighterState = FighterState.IDLE;
  private _locked = false;

  get state(): FighterState { return this._state; }
  get locked(): boolean { return this._locked; }

  transition(next: FighterState): boolean {
    if (this._state === FighterState.DEAD) return false;

    // HIT can interrupt attacks
    if (next === FighterState.HIT && this._locked) {
      this._setLocked(next);
      return true;
    }

    // DEAD overrides everything
    if (next === FighterState.DEAD) {
      this._state = FighterState.DEAD;
      this._locked = false;
      return true;
    }

    if (this._locked) return false;

    this._setLocked(next);
    return true;
  }

  private _setLocked(next: FighterState): void {
    this._state = next;
    this._locked = next === FighterState.ATTACK1
                || next === FighterState.ATTACK2
                || next === FighterState.HIT;
  }

  unlock(): void {
    if (this._locked) {
      this._locked = false;
      // Return to IDLE after unlocking
      if (this._state !== FighterState.DEAD) {
        this._state = FighterState.IDLE;
      }
    }
  }

  isGrounded(): boolean {
    return this._state !== FighterState.JUMPING && this._state !== FighterState.FALLING;
  }
}
