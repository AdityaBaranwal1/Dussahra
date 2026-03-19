import { useRef, useEffect, useCallback } from 'react';
import { useVisibility } from '../hooks/useVisibility';
import './EmberParticles.css';

interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    hue: number;
    baseHue: number;
    opacity: number;
    drift: number;
    life: number;
    maxLife: number;
    elongation: number;
    rotation: number;
    rotationSpeed: number;
    isFlame: boolean;
    wobblePhase: number;
    wobbleSpeed: number;
}

/** Teardrop flame path — tip at top (0,-h), bulge at bottom (0,h) */
function drawFlameShape(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w, -h * 0.4, w * 0.8, h * 0.6, 0, h);
    ctx.bezierCurveTo(-w * 0.8, h * 0.6, -w, -h * 0.4, 0, -h);
    ctx.closePath();
}

const MAX_PARTICLES = 80;

export const EmberParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const { ref: visRef, isVisible } = useVisibility<HTMLDivElement>();
    const isVisibleRef = useRef(false);

    const createEmber = useCallback(
        (cw: number, ch: number, scattered = false): Particle => {
            const roll = Math.random();
            const isFlame = roll < 0.20;
            const isSpark = !isFlame && roll < 0.55;
            const baseHue = Math.random() * 40 + 15;

            let x: number, y: number;
            if (scattered) {
                x = Math.random() * cw;
                y = Math.random() * ch;
            } else {
                const edge = Math.random();
                if (edge < 0.6) {
                    x = Math.random() * cw;
                    y = ch + Math.random() * 60;
                } else if (edge < 0.8) {
                    x = -10 - Math.random() * 30;
                    y = Math.random() * ch;
                } else {
                    x = cw + 10 + Math.random() * 30;
                    y = Math.random() * ch;
                }
            }

            return {
                x, y,
                size: isFlame
                    ? 5 + Math.random() * 5
                    : isSpark ? 1 + Math.random() * 1.5 : 1.5 + Math.random() * 3,
                speed: isFlame
                    ? Math.random() * 0.8 + 0.3
                    : Math.random() * 2.0 + 0.6,
                hue: baseHue,
                baseHue,
                opacity: isFlame
                    ? Math.random() * 0.3 + 0.6
                    : Math.random() * 0.8 + 0.2,
                drift: isFlame
                    ? (Math.random() - 0.5) * 0.3
                    : (Math.random() - 0.5) * 0.7,
                life: scattered ? Math.random() * 400 : 0,
                maxLife: isFlame
                    ? Math.random() * 300 + 500
                    : Math.random() * 500 + 350,
                elongation: isSpark ? 2 + Math.random() * 3 : 1 + Math.random() * 0.3,
                rotation: isFlame
                    ? (Math.random() - 0.5) * 0.15
                    : Math.random() * Math.PI * 2,
                rotationSpeed: isFlame ? 0 : (Math.random() - 0.5) * 0.03,
                isFlame,
                wobblePhase: Math.random() * Math.PI * 2,
                wobbleSpeed: isFlame ? 0.2 + Math.random() * 0.15 : 0,
            };
        },
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- Magnetic zone ---
        const zone = { x: 0, y: 0, w: 0, h: 0, active: false };
        let zoneEl: Element | null = null;
        let zoneVisible = false;
        let zoneIO: IntersectionObserver | null = null;

        const setupZoneIO = () => {
            zoneIO?.disconnect();
            if (!zoneEl) { zoneVisible = false; return; }
            zoneIO = new IntersectionObserver(
                ([entry]) => { zoneVisible = entry.isIntersecting; },
                { threshold: 0.05, rootMargin: '200px' },
            );
            zoneIO.observe(zoneEl);
        };

        const findZone = () => {
            const el = document.querySelector('[data-ember-zone]');
            if (el !== zoneEl) { zoneEl = el; setupZoneIO(); }
        };
        findZone();
        const zoneMO = new MutationObserver(findZone);
        zoneMO.observe(document.body, { childList: true, subtree: true });

        // Seed across full viewport
        const cw0 = window.innerWidth;
        const ch0 = window.innerHeight;
        const count = Math.min(MAX_PARTICLES, Math.floor(cw0 / 16));
        particlesRef.current = Array.from({ length: count }, () => createEmber(cw0, ch0, true));

        const animate = () => {
            if (!isVisibleRef.current) {
                animFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const cw = window.innerWidth;
            const ch = window.innerHeight;
            const particles = particlesRef.current;

            // Update zone rect
            if (zoneVisible && zoneEl) {
                const r = zoneEl.getBoundingClientRect();
                zone.x = r.left; zone.y = r.top;
                zone.w = r.width; zone.h = r.height;
                zone.active = true;
            } else {
                zone.active = false;
            }

            ctx.clearRect(0, 0, cw, ch);

            // Bottom fire glow — wide, very soft, no hard edges
            const glowH = ch * 0.4;
            for (const xOff of [-0.2, 0, 0.2]) {
                const glow = ctx.createRadialGradient(
                    cw * (0.5 + xOff), ch + 20, 0,
                    cw * (0.5 + xOff), ch + 20, glowH,
                );
                glow.addColorStop(0, 'rgba(255, 80, 10, 0.07)');
                glow.addColorStop(0.4, 'rgba(255, 50, 0, 0.03)');
                glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = glow;
                ctx.fillRect(0, ch - glowH, cw, glowH + 20);
            }

            // Maintain count
            while (particles.length < count) {
                particles.push(createEmber(cw, ch));
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                // Mouse repulsion
                {
                    const dx = p.x - mouseRef.current.x;
                    const dy = p.y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120 && dist > 0) {
                        const force = (120 - dist) / 120;
                        p.x += (dx / dist) * force * 3;
                        p.y += (dy / dist) * force * 3;
                    }
                }

                // Teal hue shift near EventLocation zone
                if (zone.active) {
                    const zoneCx = zone.x + zone.w / 2;
                    const zoneCy = zone.y + zone.h / 2;
                    const zdx = zoneCx - p.x;
                    const zdy = zoneCy - p.y;
                    const zdist = Math.sqrt(zdx * zdx + zdy * zdy);
                    const hueRadius = 400;

                    if (zdist < hueRadius) {
                        const t = 1 - zdist / hueRadius;
                        p.hue = p.baseHue + (185 - p.baseHue) * t;
                    }
                } else {
                    // Zone inactive: drift hue back to fire
                    p.hue += (p.baseHue - p.hue) * 0.03;
                }

                // Movement
                p.y -= p.speed;
                p.x += Math.sin(p.y / 30) * 0.5 + p.drift;
                p.rotation += p.rotationSpeed;
                p.wobblePhase += p.wobbleSpeed;
                p.life++;

                const lifeRatio = p.life / p.maxLife;
                const fadeOpacity = lifeRatio > 0.7
                    ? p.opacity * (1 - (lifeRatio - 0.7) / 0.3)
                    : p.opacity;

                if (fadeOpacity <= 0.01) {
                    particles[i] = createEmber(cw, ch);
                    continue;
                }

                // --- Draw ---
                const inTeal = p.hue > 100;

                if (p.isFlame) {
                    // Flame particle: layered teardrop with wobble
                    const wobbleRot = Math.sin(p.wobblePhase) * 0.04;
                    const wobbleScale = 1 + Math.sin(p.wobblePhase * 1.3) * 0.015;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation + wobbleRot);
                    ctx.scale(wobbleScale, wobbleScale);

                    const fw = p.size * 0.7;
                    const fh = p.size * 1.3;

                    // Soft circular glow
                    ctx.globalAlpha = fadeOpacity * 0.12;
                    ctx.fillStyle = `hsla(${p.hue - 5}, 100%, 50%, 1)`;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
                    ctx.fill();

                    // Outer body (red / deep teal)
                    ctx.globalAlpha = fadeOpacity * 0.9;
                    ctx.fillStyle = inTeal
                        ? `hsla(${p.hue}, 90%, 40%, 1)`
                        : `hsla(${p.hue}, 100%, 50%, 1)`;
                    drawFlameShape(ctx, fw, fh);
                    ctx.fill();

                    // Mid layer (orange / lighter teal)
                    ctx.globalAlpha = fadeOpacity * 0.85;
                    ctx.fillStyle = inTeal
                        ? `hsla(${p.hue - 10}, 80%, 55%, 1)`
                        : `hsla(${p.hue + 15}, 100%, 58%, 1)`;
                    drawFlameShape(ctx, fw * 0.65, fh * 0.7);
                    ctx.fill();

                    // Inner bright (yellow / cyan)
                    ctx.globalAlpha = fadeOpacity * 0.75;
                    ctx.fillStyle = inTeal
                        ? `hsla(${p.hue - 15}, 70%, 72%, 1)`
                        : `hsla(${p.hue + 25}, 100%, 68%, 1)`;
                    drawFlameShape(ctx, fw * 0.4, fh * 0.5);
                    ctx.fill();

                    // Hot core (white-yellow / white-cyan)
                    ctx.globalAlpha = fadeOpacity * 0.6;
                    ctx.fillStyle = inTeal
                        ? 'rgba(200, 255, 255, 0.9)'
                        : 'rgba(255, 255, 230, 0.9)';
                    drawFlameShape(ctx, fw * 0.2, fh * 0.28);
                    ctx.fill();

                    ctx.restore();
                } else {
                    // Spark / ember: circles and ellipses
                    const glowRadius = inTeal ? p.size * 5 : p.size * 4;
                    const lightness = inTeal ? 65 : 60;

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);

                    ctx.globalAlpha = fadeOpacity * 0.2;
                    ctx.fillStyle = `hsla(${p.hue}, 100%, ${lightness - 10}%, 1)`;
                    ctx.beginPath();
                    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.globalAlpha = fadeOpacity;
                    ctx.fillStyle = `hsla(${p.hue}, 100%, ${lightness}%, 1)`;
                    if (p.elongation > 1.5) {
                        ctx.beginPath();
                        ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.5 * p.elongation, 0, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.globalAlpha = fadeOpacity * 0.8;
                    ctx.fillStyle = inTeal
                        ? 'rgba(200, 255, 255, 0.7)'
                        : 'rgba(255, 255, 230, 0.7)';
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }

                // Reset dead or off-screen
                if (p.life > p.maxLife || p.y < -40 || p.x < -40 || p.x > cw + 40) {
                    particles[i] = createEmber(cw, ch);
                }
            }

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);

        const onMotionChange = () => {
            if (motionQuery.matches) {
                cancelAnimationFrame(animFrameRef.current);
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                particlesRef.current = [];
            }
        };
        motionQuery.addEventListener('change', onMotionChange);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            motionQuery.removeEventListener('change', onMotionChange);
            zoneMO.disconnect();
            zoneIO?.disconnect();
            particlesRef.current = [];
        };
    }, [createEmber]);

    useEffect(() => {
        isVisibleRef.current = isVisible;
    }, [isVisible]);

    return (
        <div ref={visRef} className="ember-particles-wrapper" aria-hidden="true">
            <canvas ref={canvasRef} className="ember-particles" />
        </div>
    );
};
