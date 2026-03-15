import { useRef, useEffect, useCallback } from 'react';
import { useVisibility } from '../hooks/useVisibility';
import './EmberParticles.css';

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
    /** HSL hue in the fire range (15-55) */
    hue: number;
}

const MAX_PARTICLES = 50;

export const EmberParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const { ref: visRef, isVisible } = useVisibility<HTMLDivElement>();
    const isVisibleRef = useRef(false);

    /** Spawn a single particle within the bottom third of the canvas. */
    const spawnParticle = useCallback(
        (width: number, height: number): Particle => {
            const isSpark = Math.random() < 0.3;
            const lifespan = 2000 + Math.random() * 4000; // 2-6 seconds
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
                maxOpacity: 0.4 + Math.random() * 0.6,
                age: 0,
                lifespan,
                phase: 0,
                fadeInDuration,
                fadeOutDuration,
                driftAmplitude: 0.3 + Math.random() * 1.0,
                driftFrequency: 0.001 + Math.random() * 0.003,
                driftOffset: Math.random() * Math.PI * 2,
                hue: Math.random() * 40 + 15, // 15-55: deep red to yellow
            };
        },
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Respect prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        /** Resize the canvas to match the window. */
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

        // Mouse tracking for repulsion
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        let lastTime = performance.now();

        const loop = (now: number) => {
            // Skip work when off-screen
            if (!isVisibleRef.current) {
                animFrameRef.current = requestAnimationFrame(loop);
                return;
            }

            const dt = now - lastTime;
            lastTime = now;

            const cw = window.innerWidth;
            const ch = window.innerHeight;
            const particles = particlesRef.current;

            // --- Spawn ---
            while (particles.length < MAX_PARTICLES) {
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

                // Mouse repulsion
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && dist > 0) {
                    const force = (120 - dist) / 120;
                    p.x += (dx / dist) * force * 3;
                    p.y += (dy / dist) * force * 3;
                }

                // Remove dead or off-screen particles
                if (p.age >= p.lifespan || p.y < -20 || p.x < -20 || p.x > cw + 20) {
                    particles.splice(i, 1);
                }
            }

            // --- Draw ---
            ctx.clearRect(0, 0, cw, ch);

            // Particles
            for (const p of particles) {
                if (p.opacity <= 0) continue;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                // Glow layer — simple arc at 3x radius
                ctx.globalAlpha = p.opacity * 0.15;
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, 1)`;
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core ember / spark
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, 1)`;
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
                ctx.fillStyle = `rgba(255, 255, 230, 0.6)`;
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
                const cw = window.innerWidth;
                const ch = window.innerHeight;
                ctx.clearRect(0, 0, cw, ch);
                particlesRef.current = [];
            }
        };
        motionQuery.addEventListener('change', onMotionChange);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            motionQuery.removeEventListener('change', onMotionChange);
            particlesRef.current = [];
        };
    }, [spawnParticle]);

    // Keep ref in sync with state (ref is readable inside RAF without re-renders)
    useEffect(() => {
        isVisibleRef.current = isVisible;
    }, [isVisible]);

    return (
        <div ref={visRef} className="ember-particles-wrapper" aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="ember-particles"
            />
        </div>
    );
};
