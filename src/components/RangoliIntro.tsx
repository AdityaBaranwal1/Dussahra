import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RangoliIntro.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Programmatic rangoli with 8-fold radial symmetry.
 * Uses sine/cosine petal curves — geometric and clean.
 * Animates with stroke-dashoffset (free, no DrawSVGPlugin needed).
 */

const CX = 200;
const CY = 200;

// Generate a petal path from center outward at a given angle
const petalPath = (angle: number, innerR: number, outerR: number, spread: number): string => {
    const rad = (angle * Math.PI) / 180;
    const radL = ((angle - spread) * Math.PI) / 180;
    const radR = ((angle + spread) * Math.PI) / 180;

    const tipX = CX + outerR * Math.cos(rad);
    const tipY = CY + outerR * Math.sin(rad);
    const baseX = CX + innerR * Math.cos(rad);
    const baseY = CY + innerR * Math.sin(rad);

    // Control points for the curved petal edges
    const cpDist = (outerR - innerR) * 0.7;
    const cp1X = baseX + cpDist * Math.cos(radL);
    const cp1Y = baseY + cpDist * Math.sin(radL);
    const cp2X = baseX + cpDist * Math.cos(radR);
    const cp2Y = baseY + cpDist * Math.sin(radR);

    return `M ${baseX},${baseY} Q ${cp1X},${cp1Y} ${tipX},${tipY} Q ${cp2X},${cp2Y} ${baseX},${baseY} Z`;
};

// Generate 8 petals at evenly spaced angles
const generatePetals = (innerR: number, outerR: number, spread: number) =>
    Array.from({ length: 8 }, (_, i) => petalPath(i * 45, innerR, outerR, spread));

// Concentric decorative circles
const circles = [180, 140, 95, 55, 30];

// Dot positions along a circle
const generateDots = (radius: number, count: number) =>
    Array.from({ length: count }, (_, i) => {
        const angle = (i * 360) / count;
        const rad = (angle * Math.PI) / 180;
        return { cx: CX + radius * Math.cos(rad), cy: CY + radius * Math.sin(rad) };
    });

export const RangoliIntro = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const allPaths = svgRef.current.querySelectorAll('.rangoli-path') as NodeListOf<SVGGeometryElement>;
        const allDots = svgRef.current.querySelectorAll('.rangoli-dot');

        // Set up stroke-dashoffset for draw-in effect
        allPaths.forEach((path) => {
            try {
                const length = path.getTotalLength();
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            } catch {
                // rect/circle may not support getTotalLength in all browsers
            }
        });
        gsap.set(allDots, { scale: 0, transformOrigin: '50% 50%' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: svgRef.current,
                start: 'top 80%',
                once: true,
            },
        });

        // Layer 0: outer circles
        const layer0 = svgRef.current.querySelectorAll('.rangoli-layer-0');
        tl.to(layer0, { strokeDashoffset: 0, duration: 1.4, stagger: 0.15, ease: 'power2.inOut' });

        // Layer 1: outer petals
        const layer1 = svgRef.current.querySelectorAll('.rangoli-layer-1');
        tl.to(layer1, { strokeDashoffset: 0, duration: 1.2, stagger: 0.06, ease: 'power2.inOut' }, '-=0.8');

        // Layer 2: inner petals
        const layer2 = svgRef.current.querySelectorAll('.rangoli-layer-2');
        tl.to(layer2, { strokeDashoffset: 0, duration: 1.0, stagger: 0.06, ease: 'power2.inOut' }, '-=0.6');

        // Layer 3: innermost petals + center
        const layer3 = svgRef.current.querySelectorAll('.rangoli-layer-3');
        tl.to(layer3, { strokeDashoffset: 0, duration: 0.8, stagger: 0.06, ease: 'power2.inOut' }, '-=0.5');

        // Dots pop in
        tl.to(allDots, { scale: 1, duration: 0.5, stagger: 0.02, ease: 'back.out(2)' }, '-=0.4');

        // Fade in subtle fills
        tl.to(allPaths, {
            fillOpacity: 0.06,
            duration: 1.2,
            ease: 'power1.in',
        }, '-=0.3');

        return () => { tl.kill(); };
    }, []);

    const outerPetals = generatePetals(100, 170, 14);
    const midPetals = generatePetals(60, 125, 11);
    const innerPetals = generatePetals(30, 80, 9);
    const outerDots = generateDots(160, 16);
    const midDots = generateDots(115, 8);

    return (
        <div className="rangoli-container">
            <svg ref={svgRef} viewBox="0 0 400 400" className="rangoli-svg" aria-hidden="true">
                {/* Concentric circles */}
                {circles.map((r, i) => (
                    <circle
                        key={`c-${r}`}
                        className={`rangoli-path rangoli-layer-${Math.min(i, 3)}`}
                        cx={CX} cy={CY} r={r}
                        fill="none"
                        stroke={i % 2 === 0 ? 'var(--color-accent, #A7754D)' : 'var(--color-gold, #D4A843)'}
                        strokeWidth={i === 0 ? 2 : 1.5}
                        fillOpacity="0"
                    />
                ))}

                {/* Outer petals */}
                {outerPetals.map((d, i) => (
                    <path
                        key={`op-${i}`}
                        className="rangoli-path rangoli-layer-1"
                        d={d}
                        fill="var(--color-primary, #B85042)"
                        fillOpacity="0"
                        stroke="var(--color-primary, #B85042)"
                        strokeWidth="1.8"
                    />
                ))}

                {/* Mid petals (offset 22.5deg) */}
                {midPetals.map((_, i) => (
                    <path
                        key={`mp-${i}`}
                        className="rangoli-path rangoli-layer-2"
                        d={petalPath(i * 45 + 22.5, 60, 125, 11)}
                        fill="var(--color-gold, #D4A843)"
                        fillOpacity="0"
                        stroke="var(--color-gold, #D4A843)"
                        strokeWidth="1.5"
                    />
                ))}

                {/* Inner petals */}
                {innerPetals.map((d, i) => (
                    <path
                        key={`ip-${i}`}
                        className="rangoli-path rangoli-layer-3"
                        d={d}
                        fill="var(--color-accent, #A7754D)"
                        fillOpacity="0"
                        stroke="var(--color-accent, #A7754D)"
                        strokeWidth="1.2"
                    />
                ))}

                {/* Decorative dots */}
                {outerDots.map((dot, i) => (
                    <circle
                        key={`od-${i}`}
                        className="rangoli-dot"
                        cx={dot.cx} cy={dot.cy} r="3"
                        fill="var(--color-gold, #D4A843)"
                    />
                ))}
                {midDots.map((dot, i) => (
                    <circle
                        key={`md-${i}`}
                        className="rangoli-dot"
                        cx={dot.cx} cy={dot.cy} r="2.5"
                        fill="var(--color-primary, #B85042)"
                    />
                ))}

                {/* Center lotus motif */}
                <circle
                    className="rangoli-path rangoli-layer-3"
                    cx={CX} cy={CY} r="15"
                    fill="var(--color-gold, #D4A843)"
                    fillOpacity="0"
                    stroke="var(--color-gold, #D4A843)"
                    strokeWidth="2"
                />
                <circle
                    className="rangoli-dot"
                    cx={CX} cy={CY} r="6"
                    fill="var(--color-primary, #B85042)"
                />
            </svg>
        </div>
    );
};
