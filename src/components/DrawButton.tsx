import React from 'react';
import { Layers } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface DrawButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const DrawButton: React.FC<DrawButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (disabled) return;
    sound.playDraw();
    onClick();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`w-full h-12 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-150 select-none ${
        disabled
          ? 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
          : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] cursor-pointer active:scale-[0.99]'
      } ${className}`}
    >
      <Layers className="w-4 h-4 shrink-0" strokeWidth={1.5} />
      <span className="whitespace-nowrap">Rút thẻ tri thức</span>
    </button>
  );
};
