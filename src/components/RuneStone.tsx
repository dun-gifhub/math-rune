import React from 'react';
import { RuneDef } from '../../shared/types.ts';
import { RuneIcon } from './RuneIcon.tsx';
import { Zap } from 'lucide-react';

interface RuneStoneProps {
  rune: RuneDef;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  isExhausted?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  className?: string;
  showDetails?: boolean;
}

export const RuneStone: React.FC<RuneStoneProps> = ({
  rune,
  size = 'md',
  isActive = false,
  isExhausted = false,
  isClickable = false,
  onClick,
  className = '',
  showDetails = false,
}) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-lg',
    lg: 'w-14 h-14 rounded-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const limitLabel =
    rune.limitType === 'once_per_match'
      ? '1 lần / trận'
      : rune.limitType === 'once_per_turn'
      ? '1 lần / lượt'
      : 'Nội tại liên tục';

  if (showDetails) {
    return (
      <div
        onClick={isClickable ? onClick : undefined}
        style={{
          borderColor: !isExhausted && isActive ? rune.color : undefined,
        }}
        className={`relative p-4 bg-[var(--bg-surface)] border rounded-xl flex flex-col justify-between gap-3 transition-colors duration-150 ${
          isActive
            ? 'border-[var(--accent)]'
            : 'border-[var(--border-hairline)]'
        } ${
          isClickable ? 'cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--bg-raised)]' : ''
        } ${isExhausted ? 'opacity-50 border-dashed' : ''} ${className}`}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-inset)] flex items-center justify-center shrink-0"
              style={{
                borderColor: !isExhausted ? `${rune.color}66` : undefined,
                color: !isExhausted ? rune.color : 'var(--text-muted)',
              }}
            >
              <RuneIcon icon={rune.icon} className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                  {rune.name}
                </h4>
                <span className="px-2 py-0.5 text-[11px] font-mono tabular-nums rounded bg-[var(--bg-inset)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
                  {limitLabel}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {rune.categoryNameVi}
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {rune.description}
          </p>

          <div className="p-3 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-[var(--accent-text)]">
              <Zap className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span>Hiệu lực áp dụng</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {rune.persistentEffectDesc || rune.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      style={{
        borderColor: !isExhausted ? `${rune.color}80` : undefined,
      }}
      className={`relative inline-flex items-center justify-center bg-[var(--bg-inset)] border border-[var(--border-hairline)] ${containerSizes[size]} ${
        isClickable
          ? 'cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--bg-raised)] transition-colors duration-150'
          : ''
      } ${isExhausted ? 'opacity-45 border-dashed' : ''} ${className}`}
      title={`${rune.name}: ${rune.description}`}
    >
      <RuneIcon
        icon={rune.icon}
        className={iconSizes[size]}
        style={{ color: !isExhausted ? rune.color : 'var(--text-muted)' }}
      />
      {isActive && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--status-success)] border border-[var(--bg-surface)] rounded-full" />
      )}
    </div>
  );
};
