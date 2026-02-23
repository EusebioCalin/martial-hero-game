export enum FighterState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  JUMPING = 'JUMPING',
  FALLING = 'FALLING',
  ATTACK1 = 'ATTACK1',
  ATTACK2 = 'ATTACK2',
  HIT = 'HIT',
  DEAD = 'DEAD',
}

export type PlayerIndex = 0 | 1;

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack1: boolean;
  attack2: boolean;
}

export interface HitInfo {
  damage: number;
  attacker: PlayerIndex;
}
