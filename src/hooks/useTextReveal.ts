import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

export const useTextReveal = () => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const split = new SplitText(ref.current, {
            type: 'words',
            wordsClass: 'reveal-word',
        });

        gsap.from(split.words, {
            opacity: 0,
            y: 30,
            stagger: 0.06,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                once: true,
            },
        });

        return () => split.revert();
    }, []);

    return ref;
};
