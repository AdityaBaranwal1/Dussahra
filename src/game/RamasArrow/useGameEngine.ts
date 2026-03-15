import { useRef, useCallback } from 'react';
import type {
  GameState, Arrow, Effigy, BowState, FireParticle,
  HeadHitZone,
} from './types';
import {
  GRAVITY, MAX_PARTICLES, HITS_TO_WIN, MAX_ARROWS,
  ARROW_SPEED_MULTIPLIER,
} from './types';
import {
  drawBackground, drawBow, drawTrajectoryPreview,
  drawArrow, drawEffigy, drawFireParticles,
  drawHUD, drawWinScreen, drawLoseScreen,
} from './drawUtils';

const BEST_TIME_KEY = 'ramasArrow_bestTime';

function loadBestTime(): number | null {
  try {
    const v = localStorage.getItem(BEST_TIME_KEY);
    return v ? parseFloat(v) : null;
  } catch {
    return null;
  }
}

function saveBestTime(t: number) {
  try {
    localStorage.setItem(BEST_TIME_KEY, t.toFixed(1));
  } catch { /* noop */ }
}

function createHeads(effigyX: number, effigyY: number, effigyHeight: number): HeadHitZone[] {
  const heads: HeadHitZone[] = [];
  const headRadius = 10;
  const topY = effigyY - effigyHeight * 0.5 - headRadius * 2;

  // 10 heads in a fan/pyramid: rows of 4, 3, 2, 1
  const rows = [4, 3, 2, 1];
  let rowY = topY;
  for (const count of [...rows].reverse()) {
    const rowWidth = count * headRadius * 2.4;
    for (let i = 0; i < count; i++) {
      const hx = effigyX - rowWidth / 2 + headRadius * 1.2 + i * headRadius * 2.4;
      heads.push({
        x: hx,
        y: rowY,
        radius: headRadius,
        hit: false,
        fireSource: null,
      });
    }
    rowY -= headRadius * 2.4;
  }

  return heads;
}

function createEffigy(canvasW: number, canvasH: number): Effigy {
  const x = canvasW * 0.75;
  const groundY = canvasH * 0.85;
  const height = canvasH * 0.45;
  const y = groundY - height * 0.5;
  const width = 80;

  return {
    x, y, width, height,
    heads: createHeads(x, y, height),
    bodyHits: [],
    totalHits: 0,
    burning: false,
    burnProgress: 0,
    ashProgress: 0,
  };
}

function createBow(canvasW: number, canvasH: number): BowState {
  return {
    x: canvasW * 0.15,
    y: canvasH * 0.7,
    angle: -Math.PI * 0.25,
    power: 0,
    maxPower: 200,
    drawing: false,
    drawStart: null,
    drawCurrent: null,
  };
}

function createInitialState(w: number, h: number): GameState {
  return {
    phase: 'ready',
    bow: createBow(w, h),
    arrow: null,
    effigy: createEffigy(w, h),
    particles: [],
    arrowsLeft: MAX_ARROWS,
    maxArrows: MAX_ARROWS,
    timer: 0,
    bestTime: loadBestTime(),
    hitStreak: 0,
    totalHits: 0,
    canvasWidth: w,
    canvasHeight: h,
  };
}

function spawnFireParticles(
  particles: FireParticle[],
  x: number, y: number,
  count: number,
  intense: boolean
) {
  const colors = ['#D4A843', '#B85042', '#ff6b35', '#ffaa00'];
  for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * (intense ? 60 : 30),
      vy: -Math.random() * (intense ? 120 : 60) - 20,
      life: 0.5 + Math.random() * (intense ? 1 : 0.6),
      maxLife: 0.5 + Math.random() * (intense ? 1 : 0.6),
      size: 2 + Math.random() * (intense ? 5 : 3),
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function updateParticles(particles: FireParticle[], dt: number): FireParticle[] {
  return particles.filter(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy -= 40 * dt; // particles rise
    p.life -= dt;
    return p.life > 0;
  });
}

function checkHeadCollision(arrow: Arrow, heads: HeadHitZone[]): HeadHitZone | null {
  for (const head of heads) {
    if (head.hit) continue;
    const dx = arrow.x - head.x;
    const dy = arrow.y - head.y;
    if (dx * dx + dy * dy < (head.radius + 5) * (head.radius + 5)) {
      return head;
    }
  }
  return null;
}

function checkBodyCollision(arrow: Arrow, effigy: Effigy): boolean {
  const bodyLeft = effigy.x - effigy.width * 0.3;
  const bodyRight = effigy.x + effigy.width * 0.3;
  const bodyTop = effigy.y - effigy.height * 0.5;
  const bodyBot = effigy.y + effigy.height * 0.35;

  return (
    arrow.x >= bodyLeft && arrow.x <= bodyRight &&
    arrow.y >= bodyTop && arrow.y <= bodyBot
  );
}

export function useGameEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const keyStateRef = useRef<Set<string>>(new Set());

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    stateRef.current = createInitialState(canvas.width, canvas.height);
  }, [canvasRef]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    const state = stateRef.current;
    if (!state) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    if (state.phase === 'win') {
      resetGame();
      return;
    }

    if (state.phase === 'ready' && state.arrowsLeft <= 0) {
      resetGame();
      return;
    }

    if (state.phase === 'ready' || state.phase === 'hit') {
      state.phase = 'aiming';
      state.bow.drawing = true;
      state.bow.drawStart = { x: mx, y: my };
      state.bow.drawCurrent = { x: mx, y: my };
      canvas.setPointerCapture(e.pointerId);
    }
  }, [canvasRef, resetGame]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const state = stateRef.current;
    if (!state || state.phase !== 'aiming' || !state.bow.drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    state.bow.drawCurrent = { x: mx, y: my };

    // Slingshot: drag AWAY from target, arrow flies toward target
    const dx = state.bow.drawStart!.x - mx;
    const dy = state.bow.drawStart!.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);

    state.bow.power = Math.min(dist, state.bow.maxPower);
    state.bow.angle = Math.atan2(dy, dx);
  }, [canvasRef]);

  const fireArrow = useCallback((state: GameState) => {
    if (state.arrowsLeft <= 0) return;

    const { bow } = state;
    state.arrow = {
      x: bow.x,
      y: bow.y,
      vx: Math.cos(bow.angle) * bow.power * ARROW_SPEED_MULTIPLIER,
      vy: Math.sin(bow.angle) * bow.power * ARROW_SPEED_MULTIPLIER,
      rotation: bow.angle,
      active: true,
      stuck: false,
      stuckTime: 0,
    };
    state.arrowsLeft--;
    state.phase = 'flying';
    bow.drawing = false;
    bow.power = 0;
    bow.drawStart = null;
    bow.drawCurrent = null;
  }, []);

  const handlePointerUp = useCallback((_e: PointerEvent) => {
    const state = stateRef.current;
    if (!state || state.phase !== 'aiming') return;

    if (state.bow.power > 10) {
      fireArrow(state);
    } else {
      state.phase = 'ready';
      state.bow.drawing = false;
      state.bow.power = 0;
    }
  }, [fireArrow]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const state = stateRef.current;
    if (!state) return;

    if (e.key === 'Escape') return; // handled by component

    keyStateRef.current.add(e.key);

    if (e.key === ' ') {
      e.preventDefault();
      if (state.phase === 'win' || (state.phase === 'ready' && state.arrowsLeft <= 0)) {
        resetGame();
        return;
      }
      if ((state.phase === 'ready' || state.phase === 'hit') && state.arrowsLeft > 0) {
        state.bow.power = state.bow.maxPower * 0.6;
        fireArrow(state);
      }
    }
  }, [resetGame, fireArrow]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keyStateRef.current.delete(e.key);
  }, []);

  const updateKeyboardAim = useCallback((state: GameState, dt: number) => {
    const keys = keyStateRef.current;
    const rotSpeed = 1.5;
    const powerSpeed = 150;

    if (keys.has('ArrowLeft')) {
      state.bow.angle -= rotSpeed * dt;
    }
    if (keys.has('ArrowRight')) {
      state.bow.angle += rotSpeed * dt;
    }
    if (keys.has('ArrowUp')) {
      state.bow.power = Math.min(state.bow.power + powerSpeed * dt, state.bow.maxPower);
      state.bow.drawing = true;
    }
    if (keys.has('ArrowDown')) {
      state.bow.power = Math.max(state.bow.power - powerSpeed * dt, 0);
      if (state.bow.power <= 0) state.bow.drawing = false;
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!state || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    // Update timer
    if (state.phase !== 'ready' && state.phase !== 'win') {
      state.timer += dt;
    }

    // Keyboard aiming
    if (state.phase === 'ready' || state.phase === 'aiming' || state.phase === 'hit') {
      updateKeyboardAim(state, dt);
    }

    // Arrow physics
    if (state.arrow && state.arrow.active && !state.arrow.stuck) {
      state.arrow.x += state.arrow.vx * dt;
      state.arrow.y += state.arrow.vy * dt;
      state.arrow.vy += GRAVITY * dt;
      state.arrow.rotation = Math.atan2(state.arrow.vy, state.arrow.vx);

      // Check head collision
      const hitHead = checkHeadCollision(state.arrow, state.effigy.heads);
      if (hitHead) {
        hitHead.hit = true;
        hitHead.fireSource = { x: hitHead.x, y: hitHead.y, intensity: 1 };
        state.arrow.stuck = true;
        state.arrow.active = false;
        state.effigy.totalHits++;
        state.totalHits++;
        state.hitStreak++;

        spawnFireParticles(state.particles, hitHead.x, hitHead.y, 15, false);

        if (state.effigy.totalHits >= HITS_TO_WIN) {
          state.effigy.burning = true;
        }
      }
      // Check body collision
      else if (checkBodyCollision(state.arrow, state.effigy)) {
        state.effigy.bodyHits.push({
          x: state.arrow.x,
          y: state.arrow.y,
          intensity: 0.5,
        });
        state.arrow.stuck = true;
        state.arrow.active = false;
        state.effigy.totalHits++;
        state.totalHits++;
        state.hitStreak++;

        spawnFireParticles(state.particles, state.arrow.x, state.arrow.y, 8, false);

        if (state.effigy.totalHits >= HITS_TO_WIN) {
          state.effigy.burning = true;
        }
      }

      // Off screen
      if (
        state.arrow.x > state.canvasWidth + 50 ||
        state.arrow.y > state.canvasHeight + 50 ||
        state.arrow.x < -50
      ) {
        state.arrow.active = false;
        state.arrow.stuck = true;
        state.hitStreak = 0;
      }
    }

    // Arrow landed — transition back
    if (state.arrow && !state.arrow.active && state.phase === 'flying') {
      state.arrow.stuckTime += dt;
      if (state.arrow.stuckTime > 0.3) {
        if (state.effigy.burning) {
          // Don't change phase yet, let burn animation play
        } else if (state.arrowsLeft <= 0) {
          state.phase = 'ready'; // will show lose screen
        } else {
          state.phase = 'hit'; // ready for next shot
        }
      }
    }

    // Burning animation
    if (state.effigy.burning && state.phase !== 'win') {
      state.effigy.burnProgress += dt * 0.5;

      // Spawn fire everywhere
      for (const head of state.effigy.heads) {
        if (head.hit || state.effigy.burnProgress > 0.3) {
          spawnFireParticles(state.particles, head.x, head.y, 1, true);
        }
      }
      for (const src of state.effigy.bodyHits) {
        spawnFireParticles(state.particles, src.x, src.y, 1, true);
      }
      // General body fire
      if (state.effigy.burnProgress > 0.2) {
        const ex = state.effigy.x + (Math.random() - 0.5) * state.effigy.width * 0.6;
        const ey = state.effigy.y + (Math.random() - 0.5) * state.effigy.height * 0.5;
        spawnFireParticles(state.particles, ex, ey, 2, true);
      }

      if (state.effigy.burnProgress >= 2) {
        state.phase = 'win';
        const bt = state.bestTime;
        if (bt === null || state.timer < bt) {
          state.bestTime = state.timer;
          saveBestTime(state.timer);
        }
      }
    }

    // Update persistent fire sources
    for (const head of state.effigy.heads) {
      if (head.fireSource) {
        spawnFireParticles(state.particles, head.fireSource.x, head.fireSource.y, 1, false);
      }
    }
    for (const src of state.effigy.bodyHits) {
      spawnFireParticles(state.particles, src.x, src.y, 1, false);
    }

    // Update particles
    state.particles = updateParticles(state.particles, dt);

    // === DRAW ===
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas.width, canvas.height);
    drawEffigy(ctx, state.effigy);
    drawFireParticles(ctx, state.particles);
    drawBow(ctx, state.bow);

    if (state.phase === 'aiming') {
      drawTrajectoryPreview(ctx, state.bow);
    }

    if (state.arrow && (state.arrow.active || state.arrow.stuckTime < 1)) {
      drawArrow(ctx, state.arrow);
    }

    drawHUD(ctx, state);

    if (state.phase === 'win') {
      drawWinScreen(ctx, state);
    } else if (state.phase === 'ready' && state.arrowsLeft <= 0 && !state.effigy.burning) {
      drawLoseScreen(ctx, state);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef, updateKeyboardAim]);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    stateRef.current = createInitialState(canvas.width, canvas.height);
    lastTimeRef.current = 0;

    // Input listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef, gameLoop, handlePointerDown, handlePointerMove, handlePointerUp, handleKeyDown, handleKeyUp]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  }, [canvasRef, handlePointerDown, handlePointerMove, handlePointerUp, handleKeyDown, handleKeyUp]);

  return { start, stop, resetGame };
}
