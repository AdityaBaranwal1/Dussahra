import { getClipAnchor, getClipDefinition, getClipDrawSize } from './spriteManifest';
import type { Arrow, Cloud, Effigy, FireParticle, AimState, CanvasDimensions, GameState, Player, SpriteAssets, SpriteClipName } from './types';

const GROUND_Y_RATIO = 0.85;

const COLORS = {
  skyTop: '#8bd6ff',
  skyMid: '#d7f0ff',
  skyBottom: '#fff7d1',
  hillFar: '#a8c77c',
  hillNear: '#87b364',
  grass: '#5c8d3a',
  grassEdge: '#f7e1a0',
  treeLeaf: '#4f8b4a',
  treeLeafDark: '#356335',
  treeTrunk: '#6e4d2c',
  sunCore: '#ffd451',
  sunGlow: 'rgba(255, 212, 81, 0.32)',
  stroke: '#2d3a2a',
  strokeDim: '#587162',
  fire1: '#D4A843',
  fire2: '#B85042',
  fire3: '#ff6b35',
  fire4: '#ffd700',
  headSkin: '#2ecc71',
  headDetail: '#c0392b',
  headCrown: '#f1c40f',
  headMouth: '#1a1a2e',
};

export function drawBackground(ctx: CanvasRenderingContext2D, dim: CanvasDimensions, clouds: Cloud[] = []) {
  const { width, height } = dim;
  const groundY = height * GROUND_Y_RATIO;

  // Dark dusk sky gradient (from vanilla)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#2b0f4c');
  grad.addColorStop(1, '#e25822');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Sun
  ctx.fillStyle = '#ffb732';
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.4, Math.min(width, height) * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Clouds (warm-tinted for dusk)
  for (const cloud of clouds) {
    ctx.fillStyle = `rgba(230, 150, 100, ${cloud.opacity})`;
    ctx.fillRect(Math.floor(cloud.x), Math.floor(cloud.y), Math.floor(cloud.width), Math.floor(cloud.height));
  }

  // Mountains — simple triangles (from vanilla)
  ctx.fillStyle = '#210b38';
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width * 0.2, height * 0.6);
  ctx.lineTo(width * 0.5, groundY);
  ctx.fill();

  ctx.fillStyle = '#170529';
  ctx.beginPath();
  ctx.moveTo(width * 0.3, groundY);
  ctx.lineTo(width * 0.7, height * 0.55);
  ctx.lineTo(width, groundY);
  ctx.fill();

  // Ground
  ctx.fillStyle = '#1a0b2e';
  ctx.fillRect(0, groundY, width, height - groundY);
}

export function drawBow(
  ctx: CanvasRenderingContext2D,
  bowX: number,
  bowY: number,
  aim: AimState,
  arrowsLeft: number
) {
  const drawBack = aim.aiming ? aim.power / 100 : 0;
  const angle = aim.aiming ? aim.angle : 0;
  const bowH = 80;

  ctx.save();
  ctx.translate(bowX, bowY);
  ctx.rotate(angle);
  ctx.strokeStyle = COLORS.stroke;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  const bowBend = 20 + drawBack * 15;
  ctx.beginPath();
  ctx.moveTo(0, -bowH / 2);
  ctx.quadraticCurveTo(bowBend, 0, 0, bowH / 2);
  ctx.stroke();

  const stringPullX = -Math.max(0, aim.power) * 0.55;
  const stringPullY = 0;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -bowH / 2);
  ctx.lineTo(stringPullX, stringPullY);
  ctx.lineTo(0, bowH / 2);
  ctx.stroke();

  if (arrowsLeft > 0) {
    const arrowLen = 58;
    const startX = stringPullX;
    const startY = stringPullY;

    ctx.strokeStyle = COLORS.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(arrowLen, 0);
    ctx.stroke();

    ctx.fillStyle = COLORS.fire1;
    ctx.beginPath();
    ctx.moveTo(arrowLen + 8, 0);
    ctx.lineTo(arrowLen - 2, -4);
    ctx.lineTo(arrowLen - 2, 4);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = COLORS.strokeDim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX + 6, 0);
    ctx.lineTo(startX - 4, -5);
    ctx.moveTo(startX + 6, 0);
    ctx.lineTo(startX - 4, 5);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawPlayerSprite(
  ctx: CanvasRenderingContext2D,
  player: Player,
  sprites: SpriteAssets,
  clipOverride?: SpriteClipName
): boolean {
  const clipName = clipOverride ?? player.animation.clip;
  const image = sprites[clipName] ?? sprites.idle;
  if (!image) return false;

  const clip = getClipDefinition(clipName);
  const drawSize = getClipDrawSize(clipName, player.displayScale);
  const safeFrame = Math.max(0, Math.min(player.animation.frame, clip.frameCount - 1));
  const sourceX = safeFrame * clip.frameWidth;
  const sourceY = clip.rowIndex * clip.frameHeight;
  const topLeftX = player.x - drawSize.width / 2;
  const topLeftY = player.y - drawSize.height;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    clip.frameWidth,
    clip.frameHeight,
    topLeftX,
    topLeftY,
    drawSize.width,
    drawSize.height,
  );
  ctx.restore();
  return true;
}

export function drawPlayerWithRotation(
  ctx: CanvasRenderingContext2D,
  player: Player,
  sprites: SpriteAssets,
  clipOverride?: SpriteClipName
): boolean {
  const clipName = clipOverride ?? player.animation.clip;
  const image = sprites[clipName] ?? sprites.idle;
  if (!image) return false;

  const clip = getClipDefinition(clipName);
  const drawSize = getClipDrawSize(clipName, player.displayScale);
  const anchor = getClipAnchor(clipName, player.displayScale);
  const safeFrame = Math.max(0, Math.min(player.animation.frame, clip.frameCount - 1));
  const sourceX = safeFrame * clip.frameWidth;
  const sourceY = clip.rowIndex * clip.frameHeight;

  // Top-left of sprite in world coords (un-rotated)
  const topLeftX = player.x - drawSize.width / 2;
  const topLeftY = player.y - drawSize.height;

  // Pivot = anchor point in world space (bow hand)
  const pivotX = topLeftX + anchor.x;
  const pivotY = topLeftY + anchor.y;

  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(player.rotation);
  ctx.imageSmoothingEnabled = false;

  // Draw sprite so anchor is at origin
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    clip.frameWidth,
    clip.frameHeight,
    -anchor.x,
    -anchor.y,
    drawSize.width,
    drawSize.height,
  );

  ctx.restore();
  return true;
}

export function drawShadow(
  ctx: CanvasRenderingContext2D,
  player: Player,
  groundY: number
) {
  const shadowWidth = 40 * player.displayScale;
  const shadowHeight = 8 * player.displayScale;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(
    player.x,
    groundY + 2,
    shadowWidth / 2,
    shadowHeight / 2,
    0, 0, Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

export function drawPlayerAnchorGuide(
  ctx: CanvasRenderingContext2D,
  player: Player,
  clipName: SpriteClipName,
) {
  const drawSize = getClipDrawSize(clipName, player.displayScale);
  const anchor = getClipAnchor(clipName, player.displayScale);
  const topLeftX = player.x - drawSize.width / 2;
  const topLeftY = player.y - drawSize.height;

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 214, 10, 0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(topLeftX, topLeftY, drawSize.width, drawSize.height);

  ctx.fillStyle = '#ffd60a';
  ctx.beginPath();
  ctx.arc(topLeftX + anchor.x, topLeftY + anchor.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawTrajectoryPreview(
  ctx: CanvasRenderingContext2D,
  bowX: number,
  bowY: number,
  aim: AimState,
  wind: number,
  powerShotThreshold: number
) {
  if (!aim.aiming || aim.power < 5) return;

  const isPowerShot = aim.power >= powerShotThreshold;
  const speed = aim.power * 9.6;
  const vx = Math.cos(aim.angle) * speed;
  const vy = Math.sin(aim.angle) * speed;
  const gravity = 800;
  const dt = 0.05;

  for (let i = 1; i <= 7; i++) {
    const t = i * dt;
    const px = bowX + vx * t + wind * 50 * t * t;
    const py = bowY + vy * t + 0.5 * gravity * t * t;
    const dotSize = isPowerShot ? 4 - i * 0.3 : 3 - i * 0.3;

    if (isPowerShot) {
      // Glow behind dot
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = (1 - i * 0.12) * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(dotSize + 3, 2), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = isPowerShot ? '#fff' : '#f1c40f';
    ctx.globalAlpha = 1 - i * 0.12;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(dotSize, 1), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawFlyingArrow(ctx: CanvasRenderingContext2D, arrow: Arrow) {
  if (!arrow.active && !arrow.stuck) return;

  const len = 40;
  const isPower = arrow.piercing;

  ctx.save();
  ctx.translate(arrow.x, arrow.y);
  ctx.rotate(arrow.rotation);

  // Power shot outer glow
  if (isPower && arrow.active) {
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 12;
  }

  // Shaft
  ctx.strokeStyle = isPower ? '#fff' : COLORS.stroke;
  ctx.lineWidth = isPower ? 3 : 2;
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.lineTo(len / 2, 0);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Tip
  ctx.fillStyle = isPower ? '#fff' : COLORS.fire1;
  ctx.beginPath();
  ctx.moveTo(len / 2 + 6, 0);
  ctx.lineTo(len / 2 - 3, -3);
  ctx.lineTo(len / 2 - 3, 3);
  ctx.closePath();
  ctx.fill();

  // Flame trail
  if (arrow.active) {
    const t = Date.now() * 0.01;
    const trailCount = isPower ? 8 : 4;
    for (let i = 0; i < trailCount; i++) {
      const fx = len / 2 - 5 - i * 4 + Math.sin(t + i) * (isPower ? 4 : 2);
      const fy = Math.sin(t * 2 + i * 1.5) * (isPower ? 6 : 3);
      const fs = (isPower ? 5 : 3) - i * (isPower ? 0.4 : 0.5);
      if (isPower) {
        ctx.fillStyle = i < 3 ? '#fff' : i < 5 ? COLORS.fire4 : COLORS.fire1;
      } else {
        ctx.fillStyle = i < 2 ? COLORS.fire4 : COLORS.fire1;
      }
      ctx.globalAlpha = 0.8 - i * (isPower ? 0.08 : 0.15);
      ctx.beginPath();
      ctx.arc(fx, fy, Math.max(fs, 1), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Fletch
  ctx.strokeStyle = isPower ? 'rgba(255,255,255,0.5)' : COLORS.strokeDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.lineTo(-len / 2 - 5, -4);
  ctx.moveTo(-len / 2, 0);
  ctx.lineTo(-len / 2 - 5, 4);
  ctx.stroke();

  ctx.restore();
}

export function drawEffigy(ctx: CanvasRenderingContext2D, effigy: Effigy, finalBurnProgress: number, groundY: number) {
  const burnAlpha = finalBurnProgress;
  const effigyX = effigy.x;

  // Simple wooden pole + crossbar (vanilla style, world coordinates)
  let poleColor = '#5c4033';
  if (burnAlpha > 0) {
    poleColor = lerpColor('#5c4033', COLORS.fire2, burnAlpha);
    ctx.globalAlpha = Math.max(1 - burnAlpha * 0.5, 0.3);
  }
  ctx.strokeStyle = poleColor;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(effigyX, groundY);
  ctx.lineTo(effigyX, groundY - effigy.height);
  ctx.moveTo(effigyX - effigy.width, effigy.y);
  ctx.lineTo(effigyX + effigy.width, effigy.y);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Heads (pixel-art faces, drawn at world positions)
  for (const head of effigy.heads) {
    const hx = head.x;
    const hy = head.y;
    const r = head.radius;

    if (head.hit && burnAlpha <= 0) {
      // Head destroyed during normal play — hidden (fire particles show instead)
      continue;
    }

    ctx.save();

    if (burnAlpha > 0) {
      ctx.globalAlpha = Math.max(1 - burnAlpha * 0.5, 0.3);
    }

    // Head base (square)
    const headColor = burnAlpha > 0
      ? lerpColor(COLORS.headSkin, COLORS.fire2, Math.min(burnAlpha, 1))
      : head.hit ? COLORS.fire2 : COLORS.headSkin;
    ctx.fillStyle = headColor;
    ctx.fillRect(hx - r, hy - r, r * 2, r * 2);

    // Crown on top
    const crownColor = burnAlpha > 0
      ? lerpColor(COLORS.headCrown, COLORS.fire2, Math.min(burnAlpha, 1))
      : COLORS.headCrown;
    ctx.fillStyle = crownColor;
    ctx.fillRect(hx - r, hy - r - r * 0.45, r * 2, r * 0.45);

    // Crown points
    const pointW = r * 0.4;
    const pointH = r * 0.3;
    for (let i = 0; i < 3; i++) {
      const px = hx - r + r * 0.3 + i * r * 0.6;
      const py = hy - r - r * 0.45;
      ctx.beginPath();
      ctx.moveTo(px - pointW / 2, py);
      ctx.lineTo(px, py - pointH);
      ctx.lineTo(px + pointW / 2, py);
      ctx.closePath();
      ctx.fill();
    }

    // Eyes
    ctx.fillStyle = burnAlpha > 0 ? COLORS.fire1 : COLORS.headDetail;
    ctx.fillRect(hx - r * 0.6, hy - r * 0.3, r * 0.4, r * 0.4);
    ctx.fillRect(hx + r * 0.2, hy - r * 0.3, r * 0.4, r * 0.4);

    // Pupils
    ctx.fillStyle = burnAlpha > 0 ? '#fff' : '#1a1a2e';
    ctx.fillRect(hx - r * 0.45, hy - r * 0.15, r * 0.15, r * 0.15);
    ctx.fillRect(hx + r * 0.35, hy - r * 0.15, r * 0.15, r * 0.15);

    // Mouth
    ctx.fillStyle = COLORS.headMouth;
    ctx.fillRect(hx - r * 0.4, hy + r * 0.3, r * 0.8, r * 0.25);

    // Outline
    ctx.strokeStyle = burnAlpha > 0 ? COLORS.fire1 : COLORS.stroke;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hx - r, hy - r, r * 2, r * 2);

    ctx.restore();
  }
}

export function drawFire(ctx: CanvasRenderingContext2D, particles: FireParticle[]) {
  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    const alpha = lifeRatio * 0.9;
    const size = p.size * lifeRatio;

    if (lifeRatio > 0.6) {
      ctx.fillStyle = COLORS.fire4;
    } else if (lifeRatio > 0.3) {
      ctx.fillStyle = COLORS.fire1;
    } else {
      ctx.fillStyle = COLORS.fire2;
    }

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(size, 0.5), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawWind(ctx: CanvasRenderingContext2D, wind: number, dim: CanvasDimensions) {
  const cx = dim.width / 2;
  const y = 30;
  const arrowLen = Math.abs(wind) * 30;

  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Wind', cx, y - 8);

  if (Math.abs(wind) < 0.1) {
    ctx.fillText('calm', cx, y + 12);
    return;
  }

  const dir = wind > 0 ? 1 : -1;
  const startX = cx - dir * arrowLen / 2;
  const endX = cx + dir * arrowLen / 2;

  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(endX, y);
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(endX, y);
  ctx.lineTo(endX - dir * 6, y - 4);
  ctx.lineTo(endX - dir * 6, y + 4);
  ctx.closePath();
  ctx.fill();
}

export function drawHUD(ctx: CanvasRenderingContext2D, state: GameState, dim: CanvasDimensions) {
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';

  // Timer (top right)
  ctx.textAlign = 'right';
  const secs = (state.timer / 1000).toFixed(1);
  ctx.fillText(`Time: ${secs}s`, dim.width - 20, 25);

  // Best time
  if (state.bestTime !== null) {
    ctx.fillStyle = COLORS.fire4;
    ctx.fillText(`Best: ${(state.bestTime / 1000).toFixed(1)}s`, dim.width - 20, 45);
  }

  // Streak
  if (state.consecutiveHits > 1) {
    ctx.fillStyle = COLORS.fire4;
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`${state.consecutiveHits} hit streak!`, dim.width / 2, dim.height * 0.15);
  }

  // Heads hit
  ctx.fillStyle = '#f1c40f';
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Heads: ${state.headsHit}/${state.totalHeads}`, 20, 25);
  ctx.fillStyle = '#fff';
  ctx.fillText(`Arrows: ${state.arrowsLeft}/${state.totalArrows}`, 20, 45);
}

export function drawVictoryScreen(ctx: CanvasRenderingContext2D, state: GameState, dim: CanvasDimensions) {
  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, dim.width, dim.height);

  const cx = dim.width / 2;
  const cy = dim.height / 2;

  // Victory text
  ctx.fillStyle = COLORS.fire1;
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VICTORY!', cx, cy - 60);

  // Stats
  ctx.fillStyle = COLORS.stroke;
  ctx.font = '18px monospace';
  const timeTaken = (state.timer / 1000).toFixed(1);
  ctx.fillText(`Time: ${timeTaken}s`, cx, cy);

  const arrowsUsed = state.totalArrows - state.arrowsLeft;
  ctx.fillText(`Arrows used: ${arrowsUsed}/${state.totalArrows}`, cx, cy + 30);

  if (state.bestStreak > 1) {
    ctx.fillText(`Best streak: ${state.bestStreak}`, cx, cy + 60);
  }

  if (state.bestTime !== null) {
    ctx.fillStyle = COLORS.fire4;
    ctx.fillText(`Best time: ${(state.bestTime / 1000).toFixed(1)}s`, cx, cy + 95);
  }

  // Play again
  ctx.fillStyle = COLORS.fire1;
  ctx.strokeStyle = COLORS.fire1;
  ctx.lineWidth = 2;
  const btnW = 180;
  const btnH = 40;
  const btnX = cx - btnW / 2;
  const btnY = cy + 120;
  roundRect(ctx, btnX, btnY, btnW, btnH, 8);
  ctx.stroke();
  ctx.fillStyle = COLORS.skyMid;
  ctx.fill();
  ctx.fillStyle = COLORS.fire1;
  ctx.font = 'bold 16px monospace';
  ctx.fillText('Play Again', cx, btnY + 26);
}

export function drawLostScreen(ctx: CanvasRenderingContext2D, state: GameState, dim: CanvasDimensions) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, dim.width, dim.height);

  const cx = dim.width / 2;
  const cy = dim.height / 2;

  ctx.fillStyle = COLORS.fire2;
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Out of Arrows!', cx, cy - 30);

  ctx.fillStyle = COLORS.stroke;
  ctx.font = '18px monospace';
  ctx.fillText(`Heads hit: ${state.headsHit}/${state.totalHeads}`, cx, cy + 10);

  // Retry button
  ctx.strokeStyle = COLORS.fire2;
  ctx.lineWidth = 2;
  const btnW = 160;
  const btnH = 40;
  const btnX = cx - btnW / 2;
  const btnY = cy + 40;
  roundRect(ctx, btnX, btnY, btnW, btnH, 8);
  ctx.stroke();
  ctx.fillStyle = COLORS.skyMid;
  ctx.fill();
  ctx.fillStyle = COLORS.fire2;
  ctx.font = 'bold 16px monospace';
  ctx.fillText('Try Again', cx, btnY + 26);
}

export function drawInstructions(ctx: CanvasRenderingContext2D, dim: CanvasDimensions) {
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('A/D or Left/Right to move  |  Hold Shift to run  |  Drag back to aim, release to fire  |  Esc to close', dim.width / 2, dim.height - 15);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function lerpColor(a: string, b: string, t: number): string {
  const parseHex = (c: string) => {
    const hex = c.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parseHex(a);
  const [r2, g2, b2] = parseHex(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}
