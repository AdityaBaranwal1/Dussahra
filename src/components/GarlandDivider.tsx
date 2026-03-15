import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './GarlandDivider.css';

gsap.registerPlugin(ScrollTrigger);

interface GarlandDividerProps {
    width?: number;
    sag?: number;
    flowers?: number;
}

export const GarlandDivider = ({ width = 800, sag = 50, flowers = 7 }: GarlandDividerProps) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const flowerPositions = Array.from({ length: flowers }, (_, i) => {
        const t = (i + 1) / (flowers + 1);
        const x = t * width;
        const y = 4 * sag * t * (1 - t);
        return { x, y };
    });

    useEffect(() => {
        if (!svgRef.current) return;

        const garlandPath = svgRef.current.querySelector('.garland-string') as SVGPathElement | null;
        const flowerEls = svgRef.current.querySelectorAll('.garland-flower');

        if (!garlandPath) return;

        // Manual drawSVG using stroke-dashoffset (free alternative to DrawSVGPlugin)
        const pathLength = garlandPath.getTotalLength();
        gsap.set(garlandPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.set(flowerEls, { opacity: 0, scale: 0, transformOrigin: '50% 0%' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: svgRef.current,
                start: 'top 85%',
                once: true,
            },
        });

        // 1. Draw the string
        tl.to(garlandPath, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.inOut',
        });

        // 2. Flowers swing in
        tl.to(flowerEls, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            ease: 'elastic.out(1, 0.3)',
            stagger: 0.12,
            duration: 1.5,
            onComplete: () => {
                svgRef.current?.classList.add('garland-sway-active');
            },
        }, '-=0.6');

        return () => { tl.kill(); };
    }, []);

    const pathD = `M 0,0 C ${width * 0.25},${sag} ${width * 0.75},${sag} ${width},0`;

    return (
        <svg
            ref={svgRef}
            viewBox={`-10 -10 ${width + 20} ${sag + 60}`}
            className="garland-divider"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
        >
            <path
                className="garland-string"
                d={pathD}
                fill="none"
                stroke="var(--color-accent, #A7754D)"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {flowerPositions.map((pos, i) => (
                <g key={i} className="garland-flower" transform={`translate(${pos.x}, ${pos.y})`}>
                    <line x1="0" y1="0" x2="0" y2="15" stroke="var(--color-decoration, #595B2A)" strokeWidth="1.5" />
                    {i % 3 === 0 ? (
                        <g transform="translate(0, 22)">
                            {[0, 60, 120, 180, 240, 300].map(angle => (
                                <ellipse
                                    key={angle}
                                    cx={Math.cos(angle * Math.PI / 180) * 6}
                                    cy={Math.sin(angle * Math.PI / 180) * 6}
                                    rx="5" ry="3"
                                    fill="var(--color-gold, #D4A843)"
                                    transform={`rotate(${angle}, ${Math.cos(angle * Math.PI / 180) * 6}, ${Math.sin(angle * Math.PI / 180) * 6})`}
                                />
                            ))}
                            <circle cx="0" cy="0" r="3" fill="var(--color-primary, #B85042)" />
                        </g>
                    ) : i % 3 === 1 ? (
                        <g transform="translate(0, 18)">
                            <ellipse cx="0" cy="0" rx="4" ry="8" fill="var(--color-decoration, #595B2A)" opacity="0.8" />
                        </g>
                    ) : (
                        <g transform="translate(0, 20)">
                            {[0, 72, 144, 216, 288].map(angle => (
                                <ellipse
                                    key={angle}
                                    cx={Math.cos(angle * Math.PI / 180) * 4}
                                    cy={Math.sin(angle * Math.PI / 180) * 4}
                                    rx="3.5" ry="2"
                                    fill="var(--color-gold, #D4A843)"
                                    opacity="0.9"
                                    transform={`rotate(${angle}, ${Math.cos(angle * Math.PI / 180) * 4}, ${Math.sin(angle * Math.PI / 180) * 4})`}
                                />
                            ))}
                            <circle cx="0" cy="0" r="2" fill="var(--color-primary, #B85042)" />
                        </g>
                    )}
                </g>
            ))}
        </svg>
    );
};
