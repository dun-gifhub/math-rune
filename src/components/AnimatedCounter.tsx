import React, { useEffect, useState, useRef } from 'react';
import { Trophy } from 'lucide-react';

interface AnimatedCounterProps {
  value: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  isHighScore?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  className = '',
  isHighScore = false,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const [showHighScoreBanner, setShowHighScoreBanner] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value === prevValue.current) return;

    const diff = value - prevValue.current;
    if (diff > 0) {
      setDelta(diff);
      setIsHighlighted(true);
      setTimeout(() => setDelta(null), 1100);
      setTimeout(() => setIsHighlighted(false), 450);

      if (isHighScore) {
        setShowHighScoreBanner(true);
        setTimeout(() => setShowHighScoreBanner(false), 2000);
      }
    }

    const start = displayValue;
    const end = value;
    const duration = 350;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animateNumber);
    prevValue.current = value;
  }, [value, isHighScore]);

  return (
    <span className={`relative inline-flex flex-col items-end ${className}`}>
      {showHighScoreBanner && (
        <span className="absolute -top-6 right-0 px-2 py-0.5 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-xs inline-flex items-center gap-1 whitespace-nowrap z-20">
          <Trophy className="w-3 h-3" strokeWidth={1.5} />
          <span>Đạt mục tiêu</span>
        </span>
      )}

      {delta !== null && (
        <span className="absolute -top-5 right-0 font-mono tabular-nums font-medium text-xs text-[var(--accent-text)] pointer-events-none z-20">
          +{delta}
        </span>
      )}

      {label && <span className="text-xs font-mono text-[var(--text-muted)]">{label}</span>}

      <span
        className={`font-mono tabular-nums font-semibold transition-colors duration-150 ${
          isHighlighted ? 'text-[var(--accent-text)]' : ''
        }`}
      >
        {prefix}
        {displayValue.toLocaleString('vi-VN')}
        {suffix}
      </span>
    </span>
  );
};
