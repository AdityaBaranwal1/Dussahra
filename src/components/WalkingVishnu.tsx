import { useEffect, useRef, useState } from 'react';
import './WalkingVishnu.css';

type Phase = 'hidden' | 'walking' | 'arrived';

const WALK_DURATION_MS = 2800;

type Props = {
    isActive: boolean;
};

const prefersReducedMotion = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const WalkingVishnu = ({ isActive }: Props) => {
    const [phase, setPhase] = useState<Phase>('hidden');
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (!isActive || hasStartedRef.current) {
            return;
        }

        hasStartedRef.current = true;

        if (prefersReducedMotion()) {
            setPhase('arrived');
            return;
        }

        setPhase('walking');

        const timeoutId = window.setTimeout(() => {
            setPhase('arrived');
        }, WALK_DURATION_MS);

        return () => window.clearTimeout(timeoutId);
    }, [isActive]);

    return (
        <div className={`walking-vishnu walking-vishnu--${phase}`} aria-hidden="true">
            <div className="walking-vishnu__spot" />
            <div className="walking-vishnu__sprite" />
        </div>
    );
};