import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { useVisibility } from '../hooks/useVisibility';
import { EVENT_INFO } from '../data/event-info';
import { BowArrowIcon } from './icons/CulturalIcons';
import './Hero.css';

const RamasArrow = lazy(() => import('../game/RamasArrow/RamasArrow'));

gsap.registerPlugin(SplitText);

export const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    const [gameOpen, setGameOpen] = useState(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const editionRef = useRef<HTMLSpanElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const { ref: heroVisRef, isVisible } = useVisibility<HTMLElement>();

    // Gate the countdown interval — only tick when hero is visible
    useEffect(() => {
        const targetDate = new Date(EVENT_INFO.targetDateISO).getTime();

        if (!isVisible) return;

        const tick = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        };

        tick(); // immediate tick on becoming visible
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [isVisible]);

    // C2: SplitText character reveal on hero title
    useEffect(() => {
        if (!titleRef.current) return;

        let ctx = gsap.context(() => {
            const split = new SplitText(titleRef.current, {
                type: 'chars',
                charsClass: 'hero-char',
            });

            gsap.set(split.chars, { opacity: 0, y: 50 });

            const tl = gsap.timeline({ delay: 0.3 });

            tl.from(editionRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power3.out',
            });

            tl.to(split.chars, {
                opacity: 1,
                y: 0,
                stagger: 0.04,
                duration: 0.6,
                ease: 'power3.out',
            }, '-=0.3');

            tl.from(taglineRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: 'power2.out',
            }, '-=0.1');

            tl.from(subtitleRef.current, {
                opacity: 0,
                y: 15,
                duration: 0.6,
                ease: 'power2.out',
            }, '-=0.4');
        });

        return () => ctx.revert();
    }, []);

    return (
        <section className="hero-container" ref={heroVisRef}>
            <div className={`hero-overlay${isVisible ? '' : ' hero-overlay-paused'}`}></div>
            <div className="hero-content container">
                <span ref={editionRef} className="hero-edition">{EVENT_INFO.editionLabel}</span>
                <h1 ref={titleRef} className="hero-title">Dushahra 2026</h1>
                <p ref={taglineRef} className="hero-tagline">The Night of Triumph</p>
                <p ref={subtitleRef} className="hero-subtitle">{EVENT_INFO.eventDateShort} | New Jersey</p>
                <p className="hero-rain-date">Rain Date: {EVENT_INFO.rainDate}</p>

                <div className="hero-ctas">
                    <Link to="/booth-booking" className="btn btn-primary hero-btn btn-ripple btn-glow">Book a Booth</Link>
                    <Link to="/events" className="btn btn-secondary hero-btn hero-btn-outline btn-ripple">View Schedule</Link>
                </div>

                <button
                    className="hero-game-link"
                    onClick={() => setGameOpen(true)}
                >
                    <BowArrowIcon size={16} />
                    <span>Play Rama's Arrow</span>
                </button>

                {gameOpen && (
                    <Suspense fallback={null}>
                        <RamasArrow onClose={() => setGameOpen(false)} />
                    </Suspense>
                )}

                <div className="countdown-container" aria-live="polite" aria-label="Countdown to Dushahra 2026">
                    <div className="countdown-box">
                        <span className="countdown-num">{timeLeft.days}</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-box">
                        <span className="countdown-num">{timeLeft.hours}</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-box">
                        <span className="countdown-num">{timeLeft.minutes}</span>
                        <span className="countdown-label">Mins</span>
                    </div>
                    <div className="countdown-box">
                        <span className="countdown-num">{timeLeft.seconds}</span>
                        <span className="countdown-label">Secs</span>
                    </div>
                </div>
            </div>

        </section>
    );
};
