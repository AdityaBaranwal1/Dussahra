import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollReveal = () => {
    const location = useLocation();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    // We only want the animation to happen once per page load to avoid distraction
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Small timeout to ensure DOM is ready after route change
        const timeoutId = setTimeout(() => {
            const revealElements = document.querySelectorAll('.reveal');
            revealElements.forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [location.pathname]);
};
