export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const GROUND_Y = 30;
export const FRAME_SIZE = 200;

export const FIGHTER_SCALE = 1.7;

export const MOVE_SPEED = 200;
export const JUMP_VELOCITY = -550;
export const GRAVITY = 800;

export const MAX_HEALTH = 100;
export const ATTACK1_DAMAGE = 10;
export const ATTACK2_DAMAGE = 20;

export const ATTACK1_HITBOX = { offsetX: 60, offsetY: 30, width: 80, height: 60 };
export const ATTACK2_HITBOX = { offsetX: 60, offsetY: 50, width: 90, height: 70 };

// Frame indices (0-based) during which the hitbox is active
export const ATTACK1_ACTIVE_FRAMES = [2, 3];
export const ATTACK2_ACTIVE_FRAMES = [3, 4];

// Fighter body collision rect
export const FIGHTER_BODY_WIDTH = 60;
export const FIGHTER_BODY_HEIGHT = 160;
export const FIGHTER_BODY_OFFSET_X = 70;
export const FIGHTER_BODY_OFFSET_Y = 20;
