import { useRef, useEffect, useCallback, useState } from 'react';
import { useVisibility } from '../../hooks/useVisibility';
import { BowArrowIcon } from '../../components/icons/CulturalIcons';
import './ArrowDash.css';

/*
 * ArrowDash — a tiny "click-to-shoot" inline game (like the Chrome dino).
 * Sits in a 900×200 card on the Events page. Uses site CSS vars for colors.
 *
 * Mechanic: Targets (Ravana heads) drift across from right to left.
 *           Click anywhere to fire a flaming arrow from the left.
 *           Hit 5 targets before they escape. Simple, 30-second round.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

interface Target {
  x: number;
  y: number;
  radius: number;
  speed: number;
  hit: boolean;
  hitTime: number;
}

interface FlyingArrow {
  x: number;
  y: number;
  speed: number;
  active: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

type Phase = 'idle' | 'playing' | 'won' | 'lost';

// ── Constants ──────────────────────────────────────────────────────────────────

const TARGET_COUNT = 3;
const HITS_TO_WIN = 5;
const ROUND_TIME = 30;
const ARROW_SPEED = 500;
const SPARK_COLORS = ['#FFB703', '#E85D04', '#FF8C00', '#D4A843'];

// ── Colors from CSS vars (read once) ───────────────────────────────────────────

function getSiteColors(canvas: HTMLCanvasElement) {
  const cs = getComputedStyle(canvas);
  return {
    bg1: cs.getPropertyValue('--color-bg-dark').trim() || '#1A1A1A',
    bg2: '#21262d',
    ground: '#2d3139',
    gold: cs.getPropertyValue('--color-gold').trim() || '#FFB703',
    primary: cs.getPropertyValue('--color-primary').trim() || '#E85D04',
    accent: cs.getPropertyValue('--color-accent').trim() || '#A71400',
    line: '#c9d1d9',
    dim: '#484f58',
    white: '#f0f6fc',
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ArrowDash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref: visRef, isVisible } = useVisibility<HTMLDivElement>();
  const isVisibleRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try { return parseInt(localStorage.getItem('arrowDash_best') || '0', 10); }
    catch { return 0; }
  });
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const phaseRef = useRef<Phase>('idle');
  const scoreRef = useRef(0);
  const timeRef = useRef(ROUND_TIME);
  const rafRef = useRef(0);
  const targetsRef = useRef<Target[]>([]);
  const arrowsRef = useRef<FlyingArrow[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const colorsRef = useRef<ReturnType<typeof getSiteColors> | null>(null);

  // Sync visibility ref
  useEffect(() => { isVisibleRef.current = isVisible; }, [isVisible]);

  // ── Spawn a target ──
  const spawnTarget = useCallback((w: number, h: number): Target => {
    const groundY = h * 0.82;
    const minY = h * 0.15;
    const y = minY + Math.random() * (groundY - minY - 20);
    return {
      x: w + 20,
      y,
      radius: 10 + Math.random() * 6,
      speed: 40 + Math.random() * 60,
      hit: false,
      hitTime: 0,
    };
  }, []);

  // ── Start game ──
  const startGame = useCallback(() => {
    phaseRef.current = 'playing';
    scoreRef.current = 0;
    timeRef.current = ROUND_TIME;
    targetsRef.current = [];
    arrowsRef.current = [];
    sparksRef.current = [];
    setPhase('playing');
    setScore(0);
    setTimeLeft(ROUND_TIME);
  }, []);

  // ── Handle click → fire arrow ──
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (phaseRef.current === 'idle' || phaseRef.current === 'won' || phaseRef.current === 'lost') {
      startGame();
      return;
    }

    if (phaseRef.current !== 'playing') return;

    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    const clickY = (e.clientY - rect.top) * dpr;

    arrowsRef.current.push({
      x: 30 * dpr,
      y: clickY,
      speed: ARROW_SPEED * dpr,
      active: true,
    });
  }, [startGame]);

  // ── Main game loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resize();

    colorsRef.current = getSiteColors(canvas);
    let lastTime = performance.now();

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);

      if (!isVisibleRef.current) { lastTime = now; return; }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const w = canvas.width;
      const h = canvas.height;
      const dpr = w / canvas.getBoundingClientRect().width;
      const c = colorsRef.current!;
      const groundY = h * 0.82;
      const playing = phaseRef.current === 'playing';

      // ── UPDATE ──
      if (playing) {
        timeRef.current -= dt;
        if (timeRef.current <= 0) {
          timeRef.current = 0;
          phaseRef.current = 'lost';
          setPhase('lost');
        }
        // Sync React state every ~250ms for the display
        if (Math.floor(timeRef.current * 4) !== Math.floor((timeRef.current + dt) * 4)) {
          setTimeLeft(Math.ceil(timeRef.current));
        }

        // Spawn targets
        while (targetsRef.current.filter(t => !t.hit).length < TARGET_COUNT) {
          targetsRef.current.push(spawnTarget(w, h));
        }
      }

      // Update targets
      for (let i = targetsRef.current.length - 1; i >= 0; i--) {
        const t = targetsRef.current[i];
        if (t.hit) {
          t.hitTime += dt;
          if (t.hitTime > 0.5) targetsRef.current.splice(i, 1);
          continue;
        }
        t.x -= t.speed * dpr * dt;
        if (t.x < -30) {
          targetsRef.current.splice(i, 1);
        }
      }

      // Update arrows
      for (let i = arrowsRef.current.length - 1; i >= 0; i--) {
        const a = arrowsRef.current[i];
        if (!a.active) { arrowsRef.current.splice(i, 1); continue; }
        a.x += a.speed * dt;

        // Collision check
        for (const t of targetsRef.current) {
          if (t.hit) continue;
          const dx = a.x - t.x;
          const dy = a.y - t.y;
          if (dx * dx + dy * dy < (t.radius * dpr + 5) * (t.radius * dpr + 5)) {
            t.hit = true;
            a.active = false;
            scoreRef.current++;
            setScore(scoreRef.current);

            // Sparks
            for (let s = 0; s < 8; s++) {
              sparksRef.current.push({
                x: t.x, y: t.y,
                vx: (Math.random() - 0.5) * 150 * dpr,
                vy: (Math.random() - 0.5) * 150 * dpr - 50 * dpr,
                life: 0.3 + Math.random() * 0.4,
                maxLife: 0.3 + Math.random() * 0.4,
                size: (2 + Math.random() * 3) * dpr,
              });
            }

            // Win check
            if (scoreRef.current >= HITS_TO_WIN) {
              phaseRef.current = 'won';
              setPhase('won');
              const best = Math.max(scoreRef.current, bestScore);
              setBestScore(best);
              try { localStorage.setItem('arrowDash_best', String(best)); } catch {}
            }
            break;
          }
        }

        if (a.x > w + 20) a.active = false;
      }

      // Update sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 200 * dpr * dt;
        s.life -= dt;
        if (s.life <= 0) sparksRef.current.splice(i, 1);
      }

      // ── DRAW ──
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, c.bg1);
      grad.addColorStop(0.75, c.bg2);
      grad.addColorStop(1, c.ground);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Ground line
      ctx.strokeStyle = c.dim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Bow (left side, static)
      if (playing) {
        const bowX = 24 * dpr;
        const bowY = h * 0.5;
        const bowR = 18 * dpr;
        ctx.strokeStyle = c.gold;
        ctx.lineWidth = 2.5 * dpr;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(bowX, bowY, bowR, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        // String
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.moveTo(bowX + Math.cos(-Math.PI * 0.4) * bowR, bowY + Math.sin(-Math.PI * 0.4) * bowR);
        ctx.lineTo(bowX, bowY);
        ctx.lineTo(bowX + Math.cos(Math.PI * 0.4) * bowR, bowY + Math.sin(Math.PI * 0.4) * bowR);
        ctx.stroke();
      }

      // Targets (Ravana heads — circles with eyes)
      for (const t of targetsRef.current) {
        const r = t.radius * dpr;
        ctx.save();
        if (t.hit) {
          ctx.globalAlpha = 1 - t.hitTime * 2;
        }
        // Head circle
        ctx.strokeStyle = t.hit ? c.primary : c.line;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.stroke();
        if (t.hit) {
          ctx.fillStyle = c.primary;
          ctx.globalAlpha *= 0.3;
          ctx.fill();
          ctx.globalAlpha = 1 - t.hitTime * 2;
        }
        // Crown (small triangle on top)
        if (!t.hit) {
          ctx.fillStyle = c.gold;
          ctx.beginPath();
          ctx.moveTo(t.x, t.y - r - 5 * dpr);
          ctx.lineTo(t.x - 4 * dpr, t.y - r + 1 * dpr);
          ctx.lineTo(t.x + 4 * dpr, t.y - r + 1 * dpr);
          ctx.closePath();
          ctx.fill();
          // Eyes
          ctx.fillStyle = c.line;
          ctx.fillRect(t.x - 3 * dpr, t.y - 2 * dpr, 2 * dpr, 2 * dpr);
          ctx.fillRect(t.x + 1 * dpr, t.y - 2 * dpr, 2 * dpr, 2 * dpr);
        }
        ctx.restore();
      }

      // Arrows
      ctx.strokeStyle = c.gold;
      ctx.lineWidth = 2 * dpr;
      for (const a of arrowsRef.current) {
        if (!a.active) continue;
        ctx.beginPath();
        ctx.moveTo(a.x - 20 * dpr, a.y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
        // Arrowhead
        ctx.fillStyle = c.gold;
        ctx.beginPath();
        ctx.moveTo(a.x + 4 * dpr, a.y);
        ctx.lineTo(a.x - 3 * dpr, a.y - 3 * dpr);
        ctx.lineTo(a.x - 3 * dpr, a.y + 3 * dpr);
        ctx.closePath();
        ctx.fill();
      }

      // Sparks
      for (const s of sparksRef.current) {
        const lifeRatio = s.life / s.maxLife;
        ctx.globalAlpha = lifeRatio;
        ctx.fillStyle = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * lifeRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Overlay text for idle/won/lost
      if (phaseRef.current !== 'playing') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (phaseRef.current === 'idle') {
          ctx.fillStyle = c.gold;
          ctx.font = `bold ${16 * dpr}px Playfair Display, serif`;
          ctx.fillText('Rama\'s Arrow Dash', w / 2, h * 0.38);
          ctx.fillStyle = c.dim;
          ctx.font = `${11 * dpr}px Inter, sans-serif`;
          ctx.fillText('Click anywhere to shoot — hit 5 targets to win!', w / 2, h * 0.58);
          ctx.fillStyle = c.white;
          ctx.font = `${12 * dpr}px Inter, sans-serif`;
          ctx.fillText('Click to Start', w / 2, h * 0.75);
        } else if (phaseRef.current === 'won') {
          ctx.fillStyle = c.gold;
          ctx.font = `bold ${18 * dpr}px Playfair Display, serif`;
          ctx.fillText('Victory!', w / 2, h * 0.35);
          ctx.fillStyle = c.white;
          ctx.font = `${12 * dpr}px Inter, sans-serif`;
          ctx.fillText(`Time left: ${Math.ceil(timeRef.current)}s`, w / 2, h * 0.55);
          ctx.fillStyle = c.dim;
          ctx.font = `${11 * dpr}px Inter, sans-serif`;
          ctx.fillText('Click to play again', w / 2, h * 0.72);
        } else if (phaseRef.current === 'lost') {
          ctx.fillStyle = c.accent;
          ctx.font = `bold ${16 * dpr}px Playfair Display, serif`;
          ctx.fillText('Time\'s Up!', w / 2, h * 0.35);
          ctx.fillStyle = c.white;
          ctx.font = `${12 * dpr}px Inter, sans-serif`;
          ctx.fillText(`Hits: ${scoreRef.current} / ${HITS_TO_WIN}`, w / 2, h * 0.55);
          ctx.fillStyle = c.dim;
          ctx.font = `${11 * dpr}px Inter, sans-serif`;
          ctx.fillText('Click to retry', w / 2, h * 0.72);
        }
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [spawnTarget, bestScore]);

  return (
    <div className="arrow-dash" ref={visRef}>
      <div className="arrow-dash-header">
        <h3 className="arrow-dash-title">
          <BowArrowIcon size={18} /> Rama's Arrow Dash
        </h3>
        {phase === 'playing' && (
          <div className="arrow-dash-score">
            Hits: <span>{score}/{HITS_TO_WIN}</span>
            &nbsp;&middot;&nbsp;
            Time: <span>{timeLeft}s</span>
            {bestScore > 0 && <>&nbsp;&middot;&nbsp;Best: <span>{bestScore}</span></>}
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className={`arrow-dash-canvas${phase === 'idle' || phase === 'won' || phase === 'lost' ? ' idle' : ''}`}
        onClick={handleCanvasClick}
      />
      <div className="arrow-dash-footer">
        Click to shoot &middot; Hit {HITS_TO_WIN} targets in {ROUND_TIME}s
      </div>
    </div>
  );
}
