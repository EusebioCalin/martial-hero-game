export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const GROUND_Y = 500;
export const FRAME_SIZE = 200;

export const FIGHTER_SCALE = 2.1;

export const MOVE_SPEED = 200;
export const JUMP_VELOCITY = -550;
export const GRAVITY = 800;

export const MAX_HEALTH = 100;
export const ATTACK1_DAMAGE = 10;
export const ATTACK2_DAMAGE = 20;

export const ATTACK1_HITBOX = { offsetX: 50, offsetY: 0, width: 80, height: 30 };
export const ATTACK2_HITBOX = { offsetX: 50, offsetY: 0, width: 90, height: 30 };

// Frame indices (0-based) during which the hitbox is active
export const ATTACK1_ACTIVE_FRAMES = [2, 3];
export const ATTACK2_ACTIVE_FRAMES = [3, 4];

// Fighter body collision rect
export const FIGHTER_BODY_WIDTH = 30;
export const FIGHTER_BODY_HEIGHT = 60;
export const FIGHTER_BODY_OFFSET_X = 80;
export const FIGHTER_BODY_OFFSET_Y = 70;
