import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { EmberParticles } from './EmberParticles';
import './Hero.css';

gsap.registerPlugin(SplitText);

export const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    const titleRef = useRef<HTMLHeadingElement>(null);
    const editionRef = useRef<HTMLSpanElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        // Target date: October 10, 2026, Midnight ET
        const targetDate = new Date('2026-10-10T00:00:00-04:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // C2: SplitText character reveal on hero title
    useEffect(() => {
        if (!titleRef.current) return;

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

        tl.from(subtitleRef.current, {
            opacity: 0,
            y: 15,
            duration: 0.6,
            ease: 'power2.out',
        }, '-=0.2');

        return () => {
            split.revert();
        };
    }, []);

    return (
        <section className="hero-container">
            <div className="hero-overlay"></div>
            <EmberParticles density="medium" intensity={0.7} style={{ zIndex: 2 }} />
            <div className="hero-content container">
                <span ref={editionRef} className="hero-edition text-shimmer">28th Annual Edition</span>
                <h1 ref={titleRef} className="hero-title">Dushahra 2026</h1>
                <p ref={subtitleRef} className="hero-subtitle">October 10th | New Jersey</p>
                <p className="hero-rain-date">Rain Date: October 24th</p>

                <div className="countdown-container">
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

                <div className="hero-ctas">
                    <Link to="/booth-booking" className="btn btn-primary hero-btn btn-ripple btn-glow">Book a Booth</Link>
                    <Link to="/events" className="btn btn-secondary hero-btn hero-btn-outline btn-ripple">View Schedule</Link>
                </div>
            </div>
        </section>
    );
};
