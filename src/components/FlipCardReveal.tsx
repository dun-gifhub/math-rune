import React, { useState, useEffect } from 'react';
import { Card } from '../../shared/types.ts';
import { MathCard } from './MathCard.tsx';
import { sound } from '../utils/soundEffects.ts';
import { RotateCcw, Layers } from 'lucide-react';

interface FlipCardRevealProps {
  card: Card;
  autoFlip?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}

export const FlipCardReveal: React.FC<FlipCardRevealProps> = ({
  card,
  autoFlip = true,
  size = 'md',
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(!autoFlip);

  useEffect(() => {
    if (autoFlip) {
      setIsFlipped(false);
      const timer = setTimeout(() => {
        setIsFlipped(true);
        sound.playCardFlip();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [card.id, autoFlip]);

  const handleManualFlip = () => {
    setIsFlipped(prev => !prev);
    sound.playCardFlip();
  };

  const dimensions =
    size === 'lg'
      ? 'w-52 sm:w-56 h-76 sm:h-80'
      : 'w-40 sm:w-44 h-56 sm:h-60';

  return (
    <div
      className={`relative group cursor-pointer select-none perspective-1000 ${dimensions} ${className}`}
      onClick={handleManualFlip}
      title="Nhấp để lật thẻ"
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-0' : 'rotate-y-180'
        }`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl">
          <MathCard card={card} variant="standard" className="w-full h-full" />
          <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <RotateCcw className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] p-4 flex flex-col items-center justify-between overflow-hidden shadow-[var(--shadow-panel)]">
          <div className="w-full flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <span>Math Rune</span>
            <span>#{card.id}</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)]">
              <Layers className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-mono text-[var(--text-secondary)]">Thẻ tri thức</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Nhấp để lật</span>
          </div>
        </div>
      </div>
    </div>
  );
};
