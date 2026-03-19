import { useRef } from 'react';
import { useGameEngine } from './useGameEngine';
import './RamasArrow.css';

interface Props {
  onClose: () => void;
}

export default function RamasArrow({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useGameEngine(canvasRef, onClose);

  return (
    <div className="ramas-arrow-backdrop" onClick={onClose}>
      <div className="ramas-arrow-modal" onClick={e => e.stopPropagation()}>
        <div className="ramas-arrow-header">
          <span className="ramas-arrow-title">Rama's Arrow</span>
          <button
            className="ramas-arrow-close"
            onClick={onClose}
            aria-label="Close game"
          >
            ✕
          </button>
        </div>
        <div className="ramas-arrow-canvas-wrap">
          <canvas ref={canvasRef} className="ramas-arrow-canvas" />
        </div>
      </div>
    </div>
  );
}
