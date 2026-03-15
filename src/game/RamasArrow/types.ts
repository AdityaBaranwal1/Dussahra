export interface Vec2 {
  x: number;
  y: number;
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
}

export interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface FireSource {
  x: number;
  y: number;
  intensity: number;
}

export interface HeadHitZone {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
  fireSource: FireSource | null;
}

export interface Effigy {
  x: number;
  y: number;
  width: number;
  height: number;
  heads: HeadHitZone[];
  bodyHits: FireSource[];
  totalHits: number;
  burning: boolean;
  burnProgress: number;
  ashProgress: number;
}

export interface BowState {
  x: number;
  y: number;
  angle: number;
  power: number;
  maxPower: number;
  drawing: boolean;
  drawStart: Vec2 | null;
  drawCurrent: Vec2 | null;
}

export type GamePhase = 'ready' | 'aiming' | 'flying' | 'hit' | 'win';

export interface GameState {
  phase: GamePhase;
  bow: BowState;
  arrow: Arrow | null;
  effigy: Effigy;
  particles: FireParticle[];
  arrowsLeft: number;
  maxArrows: number;
  timer: number;
  bestTime: number | null;
  hitStreak: number;
  totalHits: number;
  canvasWidth: number;
  canvasHeight: number;
}

export const GRAVITY = 600;
export const MAX_PARTICLES = 200;
export const HITS_TO_WIN = 7;
export const MAX_ARROWS = 10;
export const ARROW_SPEED_MULTIPLIER = 3.5;
