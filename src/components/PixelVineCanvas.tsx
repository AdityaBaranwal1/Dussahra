import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
const PIXEL_SIZE = 8;
const PALETTE = {
  bg: '#2b2b2b',
  stemDark: '#0a3b0a',
  stemMid: '#1a6b1a',
  stemLight: '#2db32d',
  highlight: '#5cd65c',
  flowerGreen: '#ccffcc'
};
const FLOWER_COLORS = [
  '#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#ffffff', '#c8d6e5'
];
interface VineNode {
  x: number; y: number; angle: number; thickness: number;
  type: 'main' | 'branch' | 'tendril';
  life: number; maxLife: number; turnRate: number; hasFlower: boolean;
}
export default function PixelVineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resetCount, setResetCount] = useState(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    let width = window.innerWidth || 800;
    let height = window.innerHeight || 600;
    let animationId: number;
    let activeNodes: VineNode[] = [];
    const init = () => {
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);
      activeNodes = [];
      const numVines = Math.max(1, Math.floor(width / 450));
      for (let i = 0; i < numVines; i++) {
        activeNodes.push({
          x: width * ((i + 1) / (numVines + 1)) + (Math.random() - 0.5) * 80,
          y: height + 10,
          angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.4,
          thickness: 2.5 + Math.random() * 1.5,
          type: 'main', life: 0, maxLife: 400 + Math.random() * 400,
          turnRate: (Math.random() - 0.5) * 0.015, hasFlower: false
        });
      }
    };
    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width || window.innerWidth || 800;
      height = rect.height || window.innerHeight || 600;
      canvas.width = width;
      canvas.height = height;
      init();
    };
    const resizeObserver = new ResizeObserver(() => resize());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    else window.addEventListener('resize', resize);

    resize();
    const drawPixel = (x: number, y: number, color: string) => {
      const px = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE;
      const py = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE;
      ctx.fillStyle = color;
      ctx.fillRect(px, py, PIXEL_SIZE, PIXEL_SIZE);
    };
    const drawThickPixel = (x: number, y: number, thickness: number, color: string) => {
      const radius = Math.max(0.5, thickness / 2);
      const rSq = radius * radius;
      const start = Math.floor(-radius);
      const end = Math.ceil(radius);
      for (let dx = start; dx <= end; dx++) {
        for (let dy = start; dy <= end; dy++) {
          if (dx * dx + dy * dy <= rSq) {
            drawPixel(x + dx * PIXEL_SIZE, y + dy * PIXEL_SIZE, color);
          }
        }
      }
    };
    const drawFlower = (x: number, y: number) => {
      const px = Math.floor(x / PIXEL_SIZE) * PIXEL_SIZE;
      const py = Math.floor(y / PIXEL_SIZE) * PIXEL_SIZE;
      const p = PIXEL_SIZE;
      const type = Math.random();
      const color = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
      if (type > 0.6) {
        ctx.fillStyle = color;
        ctx.fillRect(px, py - p, p, p); ctx.fillRect(px, py + p, p, p);
        ctx.fillRect(px - p, py, p, p); ctx.fillRect(px + p, py, p, p);
        ctx.fillStyle = PALETTE.flowerGreen; ctx.fillRect(px, py, p, p);
      } else if (type > 0.3) {
        ctx.fillStyle = color; ctx.fillRect(px, py, p * 2, p * 2);
        ctx.fillStyle = PALETTE.flowerGreen; ctx.fillRect(px - p, py + p, p, p);
      } else {
        ctx.fillStyle = color; ctx.fillRect(px, py, p, p);
        ctx.fillStyle = PALETTE.flowerGreen; ctx.fillRect(px, py + p, p, p);
      }
    };
    const update = () => {
      if (activeNodes.length === 0) {
        animationId = requestAnimationFrame(update);
        return;
      }
      const newNodes: VineNode[] = [];
      for (let i = activeNodes.length - 1; i >= 0; i--) {
        const node = activeNodes[i];
        node.life++;
        const speed = node.type === 'main' ? 1.5 : node.type === 'branch' ? 1 : 0.8;
        node.x += Math.cos(node.angle) * speed;
        node.y += Math.sin(node.angle) * speed;
        node.angle += node.turnRate;
        if (node.type === 'main') {
          node.turnRate += (Math.random() - 0.5) * 0.005;
          if (node.angle < -Math.PI / 2 - 0.5) node.turnRate += 0.005;
          if (node.angle > -Math.PI / 2 + 0.5) node.turnRate -= 0.005;
        } else if (node.type === 'tendril') {
          node.turnRate *= 1.03;
        } else {
          node.turnRate += (Math.random() - 0.5) * 0.01;
        }
        let color = PALETTE.stemMid;
        if (node.thickness > 2.5) color = PALETTE.stemDark;
        else if (node.thickness < 1.2) color = PALETTE.stemLight;
        if (Math.random() < 0.15) color = PALETTE.highlight;
        drawThickPixel(node.x, node.y, node.thickness, color);
        if (node.type === 'main' && Math.random() < 0.025 && node.life > 40) {
          newNodes.push({
            x: node.x, y: node.y,
            angle: node.angle + (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5),
            thickness: node.thickness * 0.65, type: 'branch', life: 0,
            maxLife: 100 + Math.random() * 200, turnRate: (Math.random() - 0.5) * 0.04,
            hasFlower: Math.random() > 0.1
          });
        } else if (node.type === 'branch' && Math.random() < 0.02 && node.life > 20) {
          newNodes.push({
            x: node.x, y: node.y,
            angle: node.angle + (Math.random() > 0.5 ? 1 : -1) * 1.2,
            thickness: 0.8, type: 'tendril', life: 0,
            maxLife: 40 + Math.random() * 60, turnRate: (Math.random() > 0.5 ? 1 : -1) * 0.04,
            hasFlower: Math.random() > 0.3
          });
        }
        node.thickness *= 0.997;
        if (node.life >= node.maxLife || node.thickness < 0.4 || node.x < -100 || node.x > width + 100 || node.y < -100) {
          if (node.hasFlower || node.type === 'tendril') drawFlower(node.x, node.y);
          activeNodes.splice(i, 1);
        }
      }
      activeNodes.push(...newNodes);
      animationId = requestAnimationFrame(update);
    };
    update();
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [resetCount]);
  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />
      <button
        onClick={() => setResetCount(c => c + 1)}
        style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 20px', background: '#1a1a1a', color: 'white',
          borderRadius: 9999, border: '1px solid #444',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <RefreshCw size={16} color="#5cd65c" />
        <span style={{ fontWeight: 500, fontSize: 14, letterSpacing: '0.025em' }}>Regrow Vines</span>
      </button>
    </>
  );
}
