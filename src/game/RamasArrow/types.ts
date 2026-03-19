export interface Vec2 {
  x: number;
  y: number;
}

export type SpriteClipName = 'idle' | 'walk' | 'shoot' | 'run';

export interface SpriteClipDefinition {
  src: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps: number;
  loop: boolean;
  rowIndex: number;
  normalizedFrameSize: number;
  anchor: Vec2;
}

export type SpriteAssets = Partial<Record<SpriteClipName, HTMLImageElement>>;

export interface PlayerAnimationState {
  clip: SpriteClipName;
  frame: number;
  elapsed: number;
  locked: boolean;
}

export interface Player {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  walkSpeed: number;
  runSpeed: number;
  vx: number;
  isRunning: boolean;
  rotation: number;
  displayScale: number;
  animation: PlayerAnimationState;
}

export interface Arrow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  active: boolean;
  stuck: boolean;
  stuckTime: number;
  piercing: boolean;
}

export interface HeadHitZone {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
}

export interface Effigy {
  x: number;
  y: number;
  width: number;
  height: number;
  heads: HeadHitZone[];
  bodyHits: number;
  swayOffset: number;
  swayDir: number;
}

export interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  sourceX: number;
  sourceY: number;
}

export interface FireSource {
  x: number;
  y: number;
  intensity: number;
}

export interface AimState {
  aiming: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  power: number;
  angle: number;
}

export type GamePhase = 'ready' | 'aiming' | 'flying' | 'hit' | 'won' | 'lost';

export interface GameState {
  phase: GamePhase;
  arrow: Arrow | null;
  player: Player;
  effigy: Effigy;
  aim: AimState;
  fireSources: FireSource[];
  fireParticles: FireParticle[];
  arrowsLeft: number;
  totalArrows: number;
  headsHit: number;
  totalHeads: number;
  timer: number;
  bestTime: number | null;
  finalBurn: boolean;
  finalBurnProgress: number;
  wind: number;
  consecutiveHits: number;
  bestStreak: number;
  showVictory: boolean;
  crowdCheer: number;
  clouds: Cloud[];
  runInProgress: boolean;
}

export interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

export interface Cloud {
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  opacity: number;
}
