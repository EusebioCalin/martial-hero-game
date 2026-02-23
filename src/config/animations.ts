export interface SpriteConfig {
  key: string;
  file: string;
  frameCount: number;
  frameRate: number;
  repeat: number;
}

export const SPRITE_CONFIGS: SpriteConfig[] = [
  { key: 'idle',       file: 'Idle.png',                       frameCount: 8, frameRate: 10, repeat: -1 },
  { key: 'run',        file: 'Run.png',                        frameCount: 8, frameRate: 12, repeat: -1 },
  { key: 'jump',       file: 'Jump.png',                       frameCount: 2, frameRate: 8,  repeat: 0  },
  { key: 'fall',       file: 'Fall.png',                       frameCount: 2, frameRate: 8,  repeat: -1 },
  { key: 'attack1',    file: 'Attack1.png',                    frameCount: 6, frameRate: 14, repeat: 0  },
  { key: 'attack2',    file: 'Attack2.png',                    frameCount: 6, frameRate: 12, repeat: 0  },
  { key: 'hit',        file: 'Take Hit.png',                   frameCount: 4, frameRate: 12, repeat: 0  },
  { key: 'death',      file: 'Death.png',                      frameCount: 6, frameRate: 10, repeat: 0  },
  { key: 'hit-flash',  file: 'Take Hit - white silhouette.png', frameCount: 4, frameRate: 24, repeat: 0  },
];
