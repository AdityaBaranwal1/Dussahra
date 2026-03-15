import type { GameState, Arrow, Effigy, BowState, FireParticle } from './types';
import { ARROW_SPEED_MULTIPLIER, GRAVITY } from './types';

const COLORS = {
  bg1: '#0d1117',
  bg2: '#161b22',
  ground: '#21262d',
  line: '#c9d1d9',
  lineDim: '#484f58',
  fire1: '#D4A843',
  fire2: '#B85042',
  fire3: '#ff6b35',
  white: '#f0f6fc',
  star: '#8b949e',
};

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Night sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, COLORS.bg1);
  grad.addColorStop(0.7, COLORS.bg2);
  grad.addColorStop(1, COLORS.ground);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Stars
  const starSeed = 42;
  for (let i = 0; i < 40; i++) {
    const sx = ((starSeed * (i + 1) * 7) % w);
    const sy = ((starSeed * (i + 1) * 13) % (h * 0.6));
    const size = (i % 3 === 0) ? 2 : 1;
    ctx.fillStyle = COLORS.star;
    ctx.globalAlpha = 0.4 + (i % 5) * 0.12;
    ctx.fillRect(Math.floor(sx), Math.floor(sy), size, size);
  }
  ctx.globalAlpha = 1;

  // Ground line
  const groundY = h * 0.85;
  ctx.strokeStyle = COLORS.lineDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  // Crowd silhouettes
  drawCrowd(ctx, w, h, groundY);
}

function drawCrowd(ctx: CanvasRenderingContext2D, w: number, h: number, groundY: number) {
  ctx.fillStyle = COLORS.bg1;
  const crowdY = groundY + 2;
  for (let i = 0; i < 20; i++) {
    const cx = (w * 0.1) + (i / 20) * (w * 0.8);
    const headR = 3 + (i % 3);
    const bodyH = 8 + (i % 4) * 2;
    // Head
    ctx.beginPath();
    ctx.arc(cx, crowdY + (h - crowdY) * 0.3 - bodyH - headR, headR, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillRect(cx - 3, crowdY + (h - crowdY) * 0.3 - bodyH, 6, bodyH);
  }
}

export function drawBow(ctx: CanvasRenderingContext2D, bow: BowState) {
  const { x, y, angle, power, drawing, maxPower } = bow;
  const bowLen = 60;

  ctx.save();
  ctx.translate(x, y);

  // Bow arc
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, bowLen * 0.5, angle - Math.PI * 0.4, angle + Math.PI * 0.4);
  ctx.stroke();

  // Bowstring
  const stringTopX = Math.cos(angle - Math.PI * 0.4) * bowLen * 0.5;
  const stringTopY = Math.sin(angle - Math.PI * 0.4) * bowLen * 0.5;
  const stringBotX = Math.cos(angle + Math.PI * 0.4) * bowLen * 0.5;
  const stringBotY = Math.sin(angle + Math.PI * 0.4) * bowLen * 0.5;

  const pullBack = drawing ? (power / maxPower) * 25 : 0;
  const stringMidX = Math.cos(angle + Math.PI) * pullBack;
  const stringMidY = Math.sin(angle + Math.PI) * pullBack;

  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(stringTopX, stringTopY);
  ctx.lineTo(stringMidX, stringMidY);
  ctx.lineTo(stringBotX, stringBotY);
  ctx.stroke();

  // Arrow on bowstring
  if (drawing) {
    const arrowLen = 35;
    const tipX = Math.cos(angle) * (arrowLen - pullBack);
    const tipY = Math.sin(angle) * (arrowLen - pullBack);
    const tailX = stringMidX;
    const tailY = stringMidY;

    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // Arrowhead
    const headLen = 8;
    ctx.fillStyle = COLORS.line;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - Math.cos(angle - 0.3) * headLen,
      tipY - Math.sin(angle - 0.3) * headLen
    );
    ctx.lineTo(
      tipX - Math.cos(angle + 0.3) * headLen,
      tipY - Math.sin(angle + 0.3) * headLen
    );
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export function drawTrajectoryPreview(
  ctx: CanvasRenderingContext2D,
  bow: BowState
) {
  if (!bow.drawing || bow.power < 5) return;

  const vx = Math.cos(bow.angle) * bow.power * ARROW_SPEED_MULTIPLIER;
  const vy = Math.sin(bow.angle) * bow.power * ARROW_SPEED_MULTIPLIER;

  ctx.fillStyle = COLORS.lineDim;
  for (let i = 1; i <= 5; i++) {
    const t = i * 0.12;
    const px = bow.x + vx * t;
    const py = bow.y + vy * t + 0.5 * GRAVITY * t * t;
    const size = 3 - i * 0.4;
    ctx.globalAlpha = 0.6 - i * 0.08;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(size, 1), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawArrow(ctx: CanvasRenderingContext2D, arrow: Arrow) {
  const len = 30;
  ctx.save();
  ctx.translate(arrow.x, arrow.y);
  ctx.rotate(arrow.rotation);

  // Shaft
  ctx.strokeStyle = COLORS.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-len, 0);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // Head
  ctx.fillStyle = COLORS.line;
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(-6, -4);
  ctx.lineTo(-6, 4);
  ctx.closePath();
  ctx.fill();

  // Fletching
  ctx.strokeStyle = COLORS.lineDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-len, 0);
  ctx.lineTo(-len - 4, -4);
  ctx.moveTo(-len, 0);
  ctx.lineTo(-len - 4, 4);
  ctx.stroke();

  ctx.restore();
}

export function drawEffigy(ctx: CanvasRenderingContext2D, effigy: Effigy) {
  const { x, y, width, height, heads, burning, burnProgress } = effigy;

  // Body color shifts when burning
  const bodyColor = burning
    ? lerpColor(COLORS.line, COLORS.fire2, Math.min(burnProgress * 2, 1))
    : COLORS.line;

  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Main body (rectangle)
  const bodyTop = y - height * 0.5;
  const bodyBot = y + height * 0.35;
  const bodyLeft = x - width * 0.3;
  const bodyRight = x + width * 0.3;

  ctx.strokeRect(bodyLeft, bodyTop, bodyRight - bodyLeft, bodyBot - bodyTop);

  // Arms
  ctx.lineWidth = 3;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(bodyLeft, bodyTop + (bodyBot - bodyTop) * 0.2);
  ctx.lineTo(bodyLeft - width * 0.4, bodyTop + (bodyBot - bodyTop) * 0.05);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(bodyRight, bodyTop + (bodyBot - bodyTop) * 0.2);
  ctx.lineTo(bodyRight + width * 0.4, bodyTop + (bodyBot - bodyTop) * 0.05);
  ctx.stroke();

  // Legs
  const legSpread = width * 0.2;
  ctx.beginPath();
  ctx.moveTo(x - legSpread * 0.5, bodyBot);
  ctx.lineTo(x - legSpread, y + height * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + legSpread * 0.5, bodyBot);
  ctx.lineTo(x + legSpread, y + height * 0.5);
  ctx.stroke();

  // Heads
  for (const head of heads) {
    const headColor = head.hit
      ? lerpColor(COLORS.fire1, COLORS.fire2, 0.5)
      : bodyColor;
    ctx.strokeStyle = headColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(head.x, head.y, head.radius, 0, Math.PI * 2);
    ctx.stroke();

    if (head.hit) {
      ctx.fillStyle = COLORS.fire1;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Eyes (two dots)
    if (!head.hit) {
      ctx.fillStyle = bodyColor;
      ctx.fillRect(head.x - 3, head.y - 1, 2, 2);
      ctx.fillRect(head.x + 1, head.y - 1, 2, 2);
    }
  }
}

export function drawFireParticles(ctx: CanvasRenderingContext2D, particles: FireParticle[]) {
  for (const p of particles) {
    const lifeRatio = p.life / p.maxLife;
    ctx.globalAlpha = lifeRatio * 0.8;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  state: GameState
) {
  const { arrowsLeft, timer, bestTime, hitStreak, phase } = state;
  const w = state.canvasWidth;

  ctx.font = '14px Inter, monospace';
  ctx.textBaseline = 'top';

  // Arrows left
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = 'left';
  ctx.fillText(`Arrows: ${arrowsLeft}`, 16, 16);

  // Timer
  const timeStr = timer.toFixed(1) + 's';
  ctx.textAlign = 'center';
  ctx.fillText(timeStr, w / 2, 16);

  // Best time
  if (bestTime !== null) {
    ctx.fillStyle = COLORS.fire1;
    ctx.textAlign = 'right';
    ctx.fillText(`Best: ${bestTime.toFixed(1)}s`, w - 16, 16);
  }

  // Hit streak
  if (hitStreak >= 2) {
    ctx.fillStyle = COLORS.fire1;
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px Inter, monospace';
    ctx.fillText(`${hitStreak} hit streak!`, w / 2, 36);
  }

  // Phase-specific messages
  if (phase === 'ready') {
    ctx.fillStyle = COLORS.lineDim;
    ctx.textAlign = 'center';
    ctx.font = '16px Inter, monospace';
    ctx.fillText('Click & drag to aim, release to fire', w / 2, state.canvasHeight * 0.5);
    ctx.font = '13px Inter, monospace';
    ctx.fillText('Or use Arrow keys + Space', w / 2, state.canvasHeight * 0.5 + 24);
  }
}

export function drawWinScreen(
  ctx: CanvasRenderingContext2D,
  state: GameState
) {
  const w = state.canvasWidth;
  const h = state.canvasHeight;

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = COLORS.fire1;
  ctx.font = 'bold 48px Playfair Display, serif';
  ctx.fillText('Victory!', w / 2, h * 0.35);

  ctx.fillStyle = COLORS.white;
  ctx.font = '20px Inter, monospace';
  ctx.fillText(`Time: ${state.timer.toFixed(1)}s`, w / 2, h * 0.48);

  const arrowsUsed = state.maxArrows - state.arrowsLeft;
  ctx.fillText(`Arrows used: ${arrowsUsed}`, w / 2, h * 0.55);

  if (state.bestTime !== null) {
    ctx.fillStyle = COLORS.fire1;
    ctx.fillText(`Best: ${state.bestTime.toFixed(1)}s`, w / 2, h * 0.62);
  }

  ctx.fillStyle = COLORS.lineDim;
  ctx.font = '16px Inter, monospace';
  ctx.fillText('Click or press Space to play again', w / 2, h * 0.75);
}

export function drawLoseScreen(
  ctx: CanvasRenderingContext2D,
  state: GameState
) {
  const w = state.canvasWidth;
  const h = state.canvasHeight;

  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = COLORS.fire2;
  ctx.font = 'bold 36px Playfair Display, serif';
  ctx.fillText('Out of Arrows!', w / 2, h * 0.4);

  ctx.fillStyle = COLORS.white;
  ctx.font = '18px Inter, monospace';
  ctx.fillText(`Hits: ${state.totalHits}`, w / 2, h * 0.52);

  ctx.fillStyle = COLORS.lineDim;
  ctx.font = '16px Inter, monospace';
  ctx.fillText('Click or press Space to retry', w / 2, h * 0.65);
}

function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}
