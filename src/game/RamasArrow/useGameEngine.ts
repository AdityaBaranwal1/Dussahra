import { useRef, useEffect, type RefObject } from 'react';
import { LPC_AIM_HOLD_FRAME, getClipAnchor, getClipDefinition, getClipDrawSize, getPlayerDisplayScale, loadSpriteAssets } from './spriteManifest';
import type { GameState, Effigy, Cloud, CanvasDimensions, HeadHitZone, Player, SpriteAssets, SpriteClipName } from './types';
import {
  drawBackground, drawBow, drawPlayerAnchorGuide, drawPlayerWithRotation,
  drawTrajectoryPreview, drawFlyingArrow, drawEffigy, drawFire, drawWind, drawHUD,
  drawVictoryScreen, drawLostScreen, drawInstructions, drawShadow
} from './drawUtils';

const GRAVITY = 800;
const MAX_POWER = 100;
const TOTAL_ARROWS = 10;
const TOTAL_HEADS = 10;
const HEADS_TO_WIN = 7;
const MAX_PARTICLES = 200;
const BEST_TIME_KEY = 'ramasArrow_bestTime';
const MIN_SHOT_POWER = 8;
const POWER_SHOT_THRESHOLD = 75;
const PIERCING_VELOCITY_REDUCTION = 0.65;
const PLAYER_GROUND_OFFSET = 8;
const DEBUG_PLAYER_ANCHOR = false;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getGroundY(dim: CanvasDimensions) {
  return dim.height * 0.85;
}

function createPlayer(dim: CanvasDimensions): Player {
  const groundY = getGroundY(dim);
  const displayScale = getPlayerDisplayScale(dim.height);

  return {
    x: dim.width * 0.2,
    y: groundY + PLAYER_GROUND_OFFSET,
    minX: dim.width * 0.1,
    maxX: dim.width * 0.48,
    walkSpeed: Math.max(170, dim.width * 0.18),
    runSpeed: Math.max(250, dim.width * 0.24),
    vx: 0,
    isRunning: false,
    rotation: 0,
    displayScale,
    animation: {
      clip: 'idle',
      frame: 0,
      elapsed: 0,
      locked: false,
    },
  };
}

function getAimFrame(power: number) {
  const normalizedPower = clamp(power / MAX_POWER, 0, 1);
  return clamp(Math.round(normalizedPower * LPC_AIM_HOLD_FRAME), 0, LPC_AIM_HOLD_FRAME);
}

function getPlayerBowPos(player: Player, clipName: SpriteClipName) {
  const drawSize = getClipDrawSize(clipName, player.displayScale);
  const anchor = getClipAnchor(clipName, player.displayScale);
  const topLeftX = player.x - drawSize.width / 2;
  const topLeftY = player.y - drawSize.height;

  return {
    x: topLeftX + anchor.x,
    y: topLeftY + anchor.y,
  };
}

function createEffigy(dim: CanvasDimensions): Effigy {
  // Vanilla-style effigy: pole at 80% width, heads stacked on top
  const effigyX = dim.width * 0.8;
  const groundY = dim.height * 0.85;

  // Scale head size and pole proportionally to viewport
  const scale = Math.min(dim.width, dim.height) / 700;
  const headSize = Math.max(14, Math.round(18 * scale));
  const pad = Math.max(4, Math.round(6 * scale));
  const poleHeight = Math.max(80, Math.round(120 * scale));
  const crossbarY = groundY - Math.round(poleHeight * 0.67);
  const effigyBaseY = groundY - poleHeight + headSize; // Bottom row sits at top of pole

  const heads: HeadHitZone[] = [];
  const rows = 4;

  // Build pyramid bottom-up: row 0 = bottom (4 heads), row 3 = top (1 head)
  for (let row = 0; row < rows; row++) {
    const headsInRow = rows - row;
    const rowWidth = headsInRow * (headSize * 2 + pad) - pad;
    let currentX = effigyX - rowWidth / 2 + headSize;
    const currentY = effigyBaseY - row * (headSize * 2 + pad);

    for (let i = 0; i < headsInRow; i++) {
      heads.push({
        x: currentX,
        y: currentY,
        radius: headSize,
        hit: false,
      });
      currentX += headSize * 2 + pad;
    }
  }

  return {
    x: effigyX,
    y: crossbarY,
    width: Math.round(60 * scale),
    height: poleHeight,
    heads,
    bodyHits: 0,
    swayOffset: 0,
    swayDir: 0, // No sway
  };
}

function generateClouds(dim: CanvasDimensions): Cloud[] {
  const clouds: Cloud[] = [];
  for (let i = 0; i < 7; i++) {
    clouds.push({
      x: Math.random() * dim.width,
      y: dim.height * (0.05 + Math.random() * 0.25),
      speed: 8 + Math.random() * 15,
      width: 60 + Math.random() * 100,
      height: 12 + Math.random() * 18,
      opacity: 0.15 + Math.random() * 0.25,
    });
  }
  return clouds;
}

function createInitialState(dim: CanvasDimensions): GameState {
  const stored = localStorage.getItem(BEST_TIME_KEY);
  const bestTime = stored ? parseFloat(stored) : null;

  const player = createPlayer(dim);
  player.x = -50; // Start offscreen for run-in entrance

  return {
    phase: 'ready',
    arrow: null,
    player,
    effigy: createEffigy(dim),
    aim: { aiming: false, startX: 0, startY: 0, currentX: 0, currentY: 0, power: 0, angle: 0 },
    fireSources: [],
    fireParticles: [],
    arrowsLeft: TOTAL_ARROWS,
    totalArrows: TOTAL_ARROWS,
    headsHit: 0,
    totalHeads: TOTAL_HEADS,
    timer: 0,
    bestTime,
    finalBurn: false,
    finalBurnProgress: 0,
    wind: (Math.random() - 0.5) * 2,
    consecutiveHits: 0,
    bestStreak: 0,
    showVictory: false,
    crowdCheer: 0,
    clouds: generateClouds(dim),
    runInProgress: true,
  };
}

function syncResizedPlayer(player: Player, dim: CanvasDimensions): Player {
  const resizedPlayer = createPlayer(dim);
  const previousSpan = Math.max(1, player.maxX - player.minX);
  const ratio = (player.x - player.minX) / previousSpan;

  resizedPlayer.x = resizedPlayer.minX + ratio * (resizedPlayer.maxX - resizedPlayer.minX);
  resizedPlayer.animation = player.animation;
  return resizedPlayer;
}

export function useGameEngine(canvasRef: RefObject<HTMLCanvasElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gameCanvas = canvas;

    const keys: Record<string, boolean> = {};
    let raf = 0;
    let lastTime = 0;
    let dim: CanvasDimensions = { width: 800, height: 600, scale: 1 };
    let state: GameState;
    let spriteAssets: SpriteAssets = {};
    let spritesReady = false;

    function getBowPos() {
      const clip = state.aim.aiming || state.player.animation.clip === 'shoot' ? 'shoot' : state.player.animation.clip;
      return getPlayerBowPos(state.player, clip);
    }

    function resizeCanvas() {
      const parent = gameCanvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      const w = rect.width || parent.clientWidth || window.innerWidth || 1280;
      const h = rect.height || parent.clientHeight || window.innerHeight || 800;

      gameCanvas.width = w * dpr;
      gameCanvas.height = h * dpr;
      gameCanvas.style.width = w + 'px';
      gameCanvas.style.height = h + 'px';

      const ctx = gameCanvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      dim = { width: w, height: h, scale: dpr };

      if (state) {
        const newEffigy = createEffigy(dim);
        for (let i = 0; i < Math.min(state.effigy.heads.length, newEffigy.heads.length); i++) {
          newEffigy.heads[i].hit = state.effigy.heads[i].hit;
        }
        newEffigy.bodyHits = state.effigy.bodyHits;
        state.effigy = newEffigy;
        state.player = syncResizedPlayer(state.player, dim);
        if (state.aim.aiming) {
          const bow = getBowPos();
          state.aim.startX = bow.x;
          state.aim.startY = bow.y;
        }
      }
    }

    function resetGame() {
      state = createInitialState(dim);
    }

    function startShootAnimation() {
      state.player.animation.clip = 'shoot';
      state.player.animation.frame = getAimFrame(state.aim.power);
      state.player.animation.elapsed = 0;
      state.player.animation.locked = true;
    }

    function fireArrow() {
      if (state.arrowsLeft <= 0 || state.phase === 'won' || state.phase === 'lost') return;

      const bow = getBowPos();
      const isPiercing = state.aim.power >= POWER_SHOT_THRESHOLD;
      const speed = state.aim.power * 9.6;
      const vx = Math.cos(state.aim.angle) * speed;
      const vy = Math.sin(state.aim.angle) * speed;

      state.arrow = {
        x: bow.x, y: bow.y,
        vx, vy,
        rotation: state.aim.angle,
        active: true, stuck: false, stuckTime: 0,
        piercing: isPiercing,
      };
      startShootAnimation();
      state.arrowsLeft--;
      state.phase = 'flying';
      state.aim.aiming = false;
      state.aim.power = 0;
    }

    function checkCollision() {
      const arrow = state.arrow;
      if (!arrow || !arrow.active) return;

      const eff = state.effigy;
      const tipX = arrow.x + Math.cos(arrow.rotation) * 20;
      const tipY = arrow.y + Math.sin(arrow.rotation) * 20;

      for (const head of eff.heads) {
        if (head.hit) continue;
        const dx = tipX - head.x;
        const dy = tipY - head.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < head.radius + 5) {
          head.hit = true;
          state.headsHit++;
          state.consecutiveHits++;
          state.bestStreak = Math.max(state.bestStreak, state.consecutiveHits);
          state.crowdCheer = 1;
          state.fireSources.push({ x: head.x, y: head.y, intensity: 1.5 });

          if (state.headsHit >= HEADS_TO_WIN && !state.finalBurn) {
            state.finalBurn = true;
            state.phase = 'won';
            arrow.active = false;
            arrow.stuck = true;

            // Set ALL remaining heads on fire and create fire sources everywhere
            const eff = state.effigy;
            for (const h of eff.heads) {
              if (!h.hit) {
                h.hit = true;
                state.fireSources.push({ x: h.x, y: h.y, intensity: 1.5 });
              }
            }
            // Fire on the pole body too
            const groundY = getGroundY(dim);
            state.fireSources.push({ x: eff.x, y: groundY - eff.height * 0.3, intensity: 2.0 });
            state.fireSources.push({ x: eff.x, y: groundY - eff.height * 0.6, intensity: 2.0 });
            state.fireSources.push({ x: eff.x, y: groundY - eff.height * 0.9, intensity: 1.5 });
            return;
          }

          if (arrow.piercing) {
            // Piercing arrow: reduce velocity and keep flying
            arrow.vx *= PIERCING_VELOCITY_REDUCTION;
            arrow.vy *= PIERCING_VELOCITY_REDUCTION;
            state.phase = 'flying'; // stay in flying phase
          } else {
            // Normal arrow: stop on first head
            arrow.active = false;
            arrow.stuck = true;
            state.phase = 'hit';
            return;
          }
        }
      }

      // Off-screen check (no body collision — arrows pass through the pole)
      if (arrow.x > dim.width + 50 || arrow.y > dim.height + 50 || arrow.x < -100) {
        arrow.active = false;
        if (state.phase === 'flying') {
          state.consecutiveHits = 0;
        }
        state.phase = state.arrowsLeft > 0 ? 'ready' : 'lost';
      }
    }

    function spawnFireParticles(dt: number) {
      const maxParticles = state.finalBurn ? 500 : MAX_PARTICLES;

      for (const src of state.fireSources) {
        const spawnRate = state.finalBurn ? 8 : 2;
        const spawnCount = Math.ceil(spawnRate * src.intensity * dt * 60);
        for (let i = 0; i < spawnCount && state.fireParticles.length < maxParticles; i++) {
          const spread = state.finalBurn ? 20 : 10;
          state.fireParticles.push({
            x: src.x + (Math.random() - 0.5) * spread * src.intensity,
            y: src.y,
            vx: (Math.random() - 0.5) * (state.finalBurn ? 50 : 30),
            vy: -30 - Math.random() * (state.finalBurn ? 100 : 60) * src.intensity,
            life: 0.5 + Math.random() * (state.finalBurn ? 1.2 : 0.8),
            maxLife: 0.5 + Math.random() * (state.finalBurn ? 1.2 : 0.8),
            size: 2 + Math.random() * (state.finalBurn ? 6 : 4) * src.intensity,
            sourceX: src.x, sourceY: src.y,
          });
        }
      }

      if (state.finalBurn && state.finalBurnProgress > 0.1) {
        const eff = state.effigy;
        const groundY = getGroundY(dim);
        const intensity = state.finalBurnProgress;
        const extraRate = Math.floor(intensity * 8 * dt * 60);
        for (let i = 0; i < extraRate && state.fireParticles.length < maxParticles; i++) {
          // Scatter fire across the full effigy height (pole to top head)
          const fireY = groundY - Math.random() * eff.height;
          state.fireParticles.push({
            x: eff.x + (Math.random() - 0.5) * 120 * intensity,
            y: fireY,
            vx: (Math.random() - 0.5) * 60 * intensity,
            vy: -50 - Math.random() * 100 * intensity,
            life: 0.5 + Math.random() * 0.8,
            maxLife: 0.5 + Math.random() * 0.8,
            size: 3 + Math.random() * 6 * intensity,
            sourceX: eff.x, sourceY: fireY,
          });
        }
      }
    }

    function updatePlayerMovement(dt: number) {
      if (state.runInProgress) return;
      const movingAllowed = !state.aim.aiming && !state.player.animation.locked && state.phase !== 'won' && state.phase !== 'lost';
      const moveLeft = !!(keys.a || keys.A || keys.ArrowLeft);
      const moveRight = !!(keys.d || keys.D || keys.ArrowRight);
      const movementAxis = movingAllowed ? (moveRight ? 1 : 0) - (moveLeft ? 1 : 0) : 0;
      const isRunning = movingAllowed && !!keys.Shift;
      const speed = isRunning ? state.player.runSpeed : state.player.walkSpeed;

      state.player.vx = movementAxis * speed;
      state.player.isRunning = isRunning && movementAxis !== 0;
      state.player.x = clamp(state.player.x + state.player.vx * dt, state.player.minX, state.player.maxX);
    }

    function advanceLoopingClip(dt: number, clipName: SpriteClipName) {
      const clip = getClipDefinition(clipName);
      const animation = state.player.animation;

      if (animation.clip !== clipName) {
        animation.clip = clipName;
        animation.frame = 0;
        animation.elapsed = 0;
      }

      animation.elapsed += dt;
      const frameDuration = 1 / clip.fps;

      while (animation.elapsed >= frameDuration) {
        animation.elapsed -= frameDuration;
        animation.frame = (animation.frame + 1) % clip.frameCount;
      }
    }

    function advanceShootAnimation(dt: number) {
      const clip = getClipDefinition('shoot');
      const animation = state.player.animation;

      animation.elapsed += dt;
      const frameDuration = 1 / clip.fps;

      while (animation.elapsed >= frameDuration) {
        animation.elapsed -= frameDuration;
        animation.frame += 1;
      }

      if (animation.frame >= clip.frameCount - 1) {
        animation.frame = clip.frameCount - 1;
        animation.elapsed = 0;
        animation.locked = false;
      }
    }

    function updatePlayerAnimation(dt: number) {
      if (state.player.animation.locked) {
        advanceShootAnimation(dt);
        return;
      }

      if (state.phase === 'won' || state.phase === 'lost') {
        advanceLoopingClip(dt, 'idle');
        return;
      }

      if (state.aim.aiming) {
        state.player.animation.clip = 'shoot';
        state.player.animation.frame = getAimFrame(state.aim.power);
        state.player.animation.elapsed = 0;
        return;
      }

      if (Math.abs(state.player.vx) > 1) {
        advanceLoopingClip(dt, state.player.isRunning ? 'run' : 'walk');
        return;
      }

      advanceLoopingClip(dt, 'idle');
    }

    function update(dt: number) {
      if (state.phase !== 'won' && state.phase !== 'lost' && !state.runInProgress) {
        state.timer += dt * 1000;
      }

      // Effigy is stationary (no sway)

      if (state.crowdCheer > 0) state.crowdCheer = Math.max(0, state.crowdCheer - dt * 2);

      // Animate clouds
      for (const cloud of state.clouds) {
        cloud.x -= cloud.speed * dt;
        if (cloud.x + cloud.width < 0) {
          cloud.x = dim.width + cloud.width;
          cloud.y = dim.height * (0.05 + Math.random() * 0.25);
        }
      }

      // Run-in entrance
      if (state.runInProgress) {
        const targetX = state.player.minX + (state.player.maxX - state.player.minX) * 0.15;
        const runInSpeed = state.player.runSpeed * 1.2;
        state.player.x += runInSpeed * dt;
        state.player.vx = runInSpeed;
        state.player.isRunning = true;
        state.player.rotation = 0;

        if (state.player.animation.clip !== 'run') {
          state.player.animation.clip = 'run';
          state.player.animation.frame = 0;
          state.player.animation.elapsed = 0;
        }

        if (state.player.x >= targetX) {
          state.player.x = targetX;
          state.player.vx = 0;
          state.player.isRunning = false;
          state.runInProgress = false;
          state.player.animation.clip = 'idle';
          state.player.animation.frame = 0;
          state.player.animation.elapsed = 0;
        }
      }

      updatePlayerMovement(dt);
      updatePlayerAnimation(dt);

      // Player rotation: face aim direction during aiming, otherwise face right
      if (state.aim.aiming && state.phase === 'aiming') {
        state.player.rotation = state.aim.angle;
      } else if (state.player.animation.locked && state.player.animation.clip === 'shoot') {
        // Hold rotation during shoot release animation — don't change it
      } else {
        // Smoothly return to 0 when not aiming
        const returnSpeed = 8;
        if (Math.abs(state.player.rotation) > 0.01) {
          state.player.rotation -= state.player.rotation * returnSpeed * dt;
        } else {
          state.player.rotation = 0;
        }
      }

      if (state.arrow?.active) {
        state.arrow.x += state.arrow.vx * dt;
        state.arrow.y += state.arrow.vy * dt;
        state.arrow.vy += GRAVITY * dt;
        state.arrow.vx += state.wind * 50 * dt;
        state.arrow.rotation = Math.atan2(state.arrow.vy, state.arrow.vx);
        checkCollision();
      }

      if (state.arrow?.stuck) {
        state.arrow.stuckTime += dt;
        if (state.arrow.stuckTime > 0.5 && state.phase === 'hit') {
          state.phase = state.arrowsLeft > 0 ? 'ready' : 'lost';
          state.arrow = null;
        }
      }

      if (state.finalBurn) {
        // Slower burn for dramatic effect (0→1 over ~3.5 seconds)
        state.finalBurnProgress = Math.min(1, state.finalBurnProgress + dt * 0.28);
        // Show victory after burn completes + a brief pause
        if (state.finalBurnProgress >= 1 && !state.showVictory) {
          // Small delay so the full burn is visible
          state.showVictory = true;
          if (state.bestTime === null || state.timer < state.bestTime) {
            state.bestTime = state.timer;
            localStorage.setItem(BEST_TIME_KEY, state.timer.toString());
          }
        }
      }

      spawnFireParticles(dt);
      state.fireParticles = state.fireParticles.filter(p => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy -= 20 * dt;
        p.life -= dt;
        return p.life > 0;
      });
    }

    function render() {
      const ctx = gameCanvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, dim.width, dim.height);

      drawBackground(ctx, dim, state.clouds);
      drawWind(ctx, state.wind, dim);
      const bow = getBowPos();
      drawShadow(ctx, state.player, getGroundY(dim));
      const drewSprite = spritesReady && drawPlayerWithRotation(ctx, state.player, spriteAssets);
      if (!drewSprite) {
        drawBow(ctx, bow.x, bow.y, state.aim, state.arrowsLeft);
      }
      if (DEBUG_PLAYER_ANCHOR && drewSprite) drawPlayerAnchorGuide(ctx, state.player, state.aim.aiming ? 'shoot' : state.player.animation.clip);
      drawEffigy(ctx, state.effigy, state.finalBurnProgress, getGroundY(dim));
      drawFire(ctx, state.fireParticles);

      if (state.arrow?.stuck) drawFlyingArrow(ctx, state.arrow);

      if (state.phase !== 'won' && state.phase !== 'lost') {
        if (state.aim.aiming) drawTrajectoryPreview(ctx, bow.x, bow.y, state.aim, state.wind, POWER_SHOT_THRESHOLD);
      }

      if (state.arrow?.active) drawFlyingArrow(ctx, state.arrow);

      drawHUD(ctx, state, dim);

      if (!state.showVictory && state.phase !== 'lost') drawInstructions(ctx, dim);
      if (state.showVictory) drawVictoryScreen(ctx, state, dim);
      else if (state.phase === 'lost') drawLostScreen(ctx, state, dim);

      ctx.restore();
    }

    function gameLoop(timestamp: number) {
      if (lastTime === 0) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      update(dt);
      render();

      raf = requestAnimationFrame(gameLoop);
    }

    // Pointer handlers
    function handlePointerDown(e: PointerEvent) {
      const rect = gameCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (state.showVictory || state.phase === 'lost') {
        const cx = dim.width / 2;
        const cy = dim.height / 2;

        if (state.phase === 'lost') {
          const lBtnY = cy + 40;
          if (x >= cx - 80 && x <= cx + 80 && y >= lBtnY && y <= lBtnY + 40) {
            resetGame();
            return;
          }
        }
        if (state.showVictory) {
          const btnW = 180;
          const btnX = cx - btnW / 2;
          const btnY = cy + 120;
          if (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + 40) {
            resetGame();
            return;
          }
        }
        return;
      }

      if ((state.phase === 'ready' || state.phase === 'aiming') && state.arrowsLeft > 0 && !state.runInProgress) {
        const bow = getBowPos();
        state.aim.aiming = true;
        state.aim.startX = bow.x;
        state.aim.startY = bow.y;
        state.aim.currentX = x;
        state.aim.currentY = y;
        state.aim.power = 0;
        state.aim.angle = -Math.PI / 5;
        state.phase = 'aiming';
        gameCanvas.setPointerCapture(e.pointerId);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!state.aim.aiming) return;
      const rect = gameCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      state.aim.currentX = x;
      state.aim.currentY = y;

      const dx = state.aim.startX - x;
      const dy = state.aim.startY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      state.aim.power = Math.min(MAX_POWER, dist * 0.8);
      state.aim.angle = Math.atan2(dy, dx);
    }

    function handlePointerUp(e: PointerEvent) {
      if (!state.aim.aiming) return;
      if (gameCanvas.hasPointerCapture(e.pointerId)) {
        gameCanvas.releasePointerCapture(e.pointerId);
      }
      if (state.aim.power > MIN_SHOT_POWER) {
        fireArrow();
      } else {
        state.aim.aiming = false;
        state.phase = 'ready';
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      keys[e.key] = true;

      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (state.showVictory || state.phase === 'lost') {
          resetGame();
          return;
        }
        if (state.phase === 'aiming' && state.aim.aiming && state.aim.power > 5) {
          fireArrow();
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keys[e.key] = false;
    }

    // Init
    resizeCanvas();
    resetGame();
    loadSpriteAssets()
      .then((loadedSprites) => {
        spriteAssets = loadedSprites;
        spritesReady = true;
      })
      .catch(() => {
        spritesReady = false;
      });
    raf = requestAnimationFrame(gameLoop);

    gameCanvas.addEventListener('pointerdown', handlePointerDown);
    gameCanvas.addEventListener('pointermove', handlePointerMove);
    gameCanvas.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(raf);
      gameCanvas.removeEventListener('pointerdown', handlePointerDown);
      gameCanvas.removeEventListener('pointermove', handlePointerMove);
      gameCanvas.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
}
