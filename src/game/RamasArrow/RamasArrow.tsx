import { useRef, useEffect, useCallback } from 'react';
import { useGameEngine } from './useGameEngine';
import './RamasArrow.css';

interface Props {
  onClose: () => void;
}

export default function RamasArrow({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { start, stop } = useGameEngine(canvasRef);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="ramas-arrow-overlay">
      <button className="ramas-arrow-close" onClick={onClose} aria-label="Close game">
        ✕
      </button>
      <div className="ramas-arrow-hint">Press Escape to close</div>
      <canvas
        ref={canvasRef}
        className="ramas-arrow-canvas"
      />
    </div>
  );
}
