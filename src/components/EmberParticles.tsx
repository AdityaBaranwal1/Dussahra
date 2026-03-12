import { useRef, useEffect, useCallback } from 'react';
import './EmberParticles.css';

interface EmberParticlesProps {
    density?: 'low' | 'medium' | 'high';
    intensity?: number;
    className?: string;
    style?: React.CSSProperties;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    /** Elongation ratio — 1 = dot, >1 = streak/spark */
    elongation: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    maxOpacity: number;
    age: number;
    lifespan: number;
    /** 0 = fade-in, 1 = alive, 2 = fade-out */
    phase: 0 | 1 | 2;
    fadeInDuration: number;
    fadeOutDuration: number;
    /** Sine-wave drift parameters */
    driftAmplitude: number;
    driftFrequency: number;
    driftOffset: number;
    /** Index into the color palette */
    colorIndex: number;
}

const DENSITY_MAP: Record<string, number> = {
    low: 30,
    medium: 50,
    high: 75,
};

/** Parse a CSS color string into { r, g, b } or return a fallback. */
function parseColor(raw: string): { r: number; g: number; b: number } {
    // Handle hex
    const hex = raw.trim();
    if (hex.startsWith('#')) {
        const h = hex.slice(1);
        if (h.length === 3) {
            return {
                r: parseInt(h[0] + h[0], 16),
                g: parseInt(h[1] + h[1], 16),
                b: parseInt(h[2] + h[2], 16),
            };
        }
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
        };
    }

    // Handle rgb(r, g, b) / rgba(r, g, b, a)
    const rgbMatch = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
        };
    }

    // Fallback — warm orange
    return { r: 255, g: 147, b: 41 };
}

/** Default ember palette (used when CSS variables aren't set). */
const DEFAULT_COLORS = ['#FF9329', '#FFD700', '#FF5722'];

export const EmberParticles = ({
    density = 'medium',
    intensity = 0.8,
    className = '',
    style,
}: EmberParticlesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const colorsRef = useRef<{ r: number; g: number; b: number }[]>([]);

    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    const maxParticles = DENSITY_MAP[density] ?? DENSITY_MAP.medium;

    /** Read CSS custom properties and resolve to RGB. */
    const resolveColors = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const cs = getComputedStyle(canvas);
        const raw1 = cs.getPropertyValue('--ember-color-1').trim();
        const raw2 = cs.getPropertyValue('--ember-color-2').trim();
        const raw3 = cs.getPropertyValue('--ember-color-3').trim();

        colorsRef.current = [
            parseColor(raw1 || DEFAULT_COLORS[0]),
            parseColor(raw2 || DEFAULT_COLORS[1]),
            parseColor(raw3 || DEFAULT_COLORS[2]),
        ];
    }, []);

    /** Spawn a single particle within the bottom third of the canvas. */
    const spawnParticle = useCallback(
        (width: number, height: number): Particle => {
            const isSpark = Math.random() < 0.3;
            const lifespan = 2000 + Math.random() * 4000; // 2–6 seconds
            const fadeInDuration = lifespan * (0.1 + Math.random() * 0.15);
            const fadeOutDuration = lifespan * (0.2 + Math.random() * 0.2);

            return {
                x: Math.random() * width,
                y: height - Math.random() * (height * 0.33),
                vx: (Math.random() - 0.5) * 0.3,
                vy: -(0.4 + Math.random() * 1.2),
                size: isSpark ? 1 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
                elongation: isSpark ? 2 + Math.random() * 2.5 : 1 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: 0,
                maxOpacity: (0.4 + Math.random() * 0.6) * clampedIntensity,
                age: 0,
                lifespan,
                phase: 0,
                fadeInDuration,
                fadeOutDuration,
                driftAmplitude: 0.3 + Math.random() * 1.0,
                driftFrequency: 0.001 + Math.random() * 0.003,
                driftOffset: Math.random() * Math.PI * 2,
                colorIndex: Math.floor(Math.random() * 3),
            };
        },
        [clampedIntensity],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        resolveColors();

        /** Resize the canvas to match its parent's layout size. */
        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const { width, height } = parent.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        const resizeObserver = new ResizeObserver(resize);
        if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

        // Re-read CSS variables when the theme might change
        const themeObserver = new MutationObserver(() => resolveColors());
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'data-theme', 'style'],
        });

        let lastTime = performance.now();

        const loop = (now: number) => {
            const dt = now - lastTime;
            lastTime = now;

            const { width: cw, height: ch } = canvas.getBoundingClientRect();
            const particles = particlesRef.current;
            const colors = colorsRef.current;

            // --- Spawn ---
            while (particles.length < maxParticles) {
                particles.push(spawnParticle(cw, ch));
            }

            // --- Update ---
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.age += dt;

                // Phase transitions
                if (p.phase === 0 && p.age >= p.fadeInDuration) {
                    p.phase = 1;
                }
                if (p.phase === 1 && p.age >= p.lifespan - p.fadeOutDuration) {
                    p.phase = 2;
                }

                // Opacity
                if (p.phase === 0) {
                    p.opacity = (p.age / p.fadeInDuration) * p.maxOpacity;
                } else if (p.phase === 2) {
                    const remaining = p.lifespan - p.age;
                    p.opacity = Math.max(0, (remaining / p.fadeOutDuration) * p.maxOpacity);
                } else {
                    p.opacity = p.maxOpacity;
                }

                // Movement — sine drift
                const drift =
                    Math.sin(p.age * p.driftFrequency + p.driftOffset) * p.driftAmplitude;
                p.x += p.vx + drift * 0.05;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Remove dead or off-screen particles
                if (p.age >= p.lifespan || p.y < -20 || p.x < -20 || p.x > cw + 20) {
                    particles.splice(i, 1);
                }
            }

            // --- Draw ---
            ctx.clearRect(0, 0, cw, ch);

            // Bottom glow (fire-light)
            const glowHeight = ch * 0.4;
            const glow = ctx.createRadialGradient(
                cw * 0.5,
                ch + glowHeight * 0.1,
                0,
                cw * 0.5,
                ch + glowHeight * 0.1,
                glowHeight,
            );
            const baseColor = colors[0] ?? { r: 255, g: 147, b: 41 };
            glow.addColorStop(
                0,
                `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${0.12 * clampedIntensity})`,
            );
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, ch - glowHeight, cw, glowHeight);

            // Particles
            for (const p of particles) {
                if (p.opacity <= 0) continue;

                const c = colors[p.colorIndex] ?? baseColor;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = p.opacity;

                // Glow layer (larger, softer)
                const glowRadius = p.size * 3;
                const emberGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
                emberGlow.addColorStop(
                    0,
                    `rgba(${c.r}, ${c.g}, ${c.b}, ${0.3 * clampedIntensity})`,
                );
                emberGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = emberGlow;
                ctx.fillRect(-glowRadius, -glowRadius, glowRadius * 2, glowRadius * 2);

                // Core ember / spark
                ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
                if (p.elongation > 1.5) {
                    // Spark — elongated ellipse
                    ctx.beginPath();
                    ctx.ellipse(
                        0,
                        0,
                        p.size * 0.5,
                        p.size * 0.5 * p.elongation,
                        0,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                } else {
                    // Dot ember
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Bright core highlight
                ctx.globalAlpha = p.opacity * 0.8;
                ctx.fillStyle = `rgba(255, 255, 230, ${0.6 * clampedIntensity})`;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }

            animFrameRef.current = requestAnimationFrame(loop);
        };

        animFrameRef.current = requestAnimationFrame(loop);

        // Handle motion preference changes at runtime
        const onMotionChange = () => {
            if (motionQuery.matches) {
                cancelAnimationFrame(animFrameRef.current);
                ctx.clearRect(0, 0, cw, ch);
                particlesRef.current = [];
            }
        };
        motionQuery.addEventListener('change', onMotionChange);

        let cw = 0;
        let ch = 0;
        const syncSize = () => {
            const rect = canvas.getBoundingClientRect();
            cw = rect.width;
            ch = rect.height;
        };
        syncSize();
        window.addEventListener('resize', syncSize);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            resizeObserver.disconnect();
            themeObserver.disconnect();
            motionQuery.removeEventListener('change', onMotionChange);
            window.removeEventListener('resize', syncSize);
            particlesRef.current = [];
        };
    }, [maxParticles, clampedIntensity, resolveColors, spawnParticle]);

    return (
        <canvas
            ref={canvasRef}
            className={`ember-particles ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
};
