import React from 'react';
import { Card, CardRarity } from '../../shared/types.ts';
import { DomainArt } from './DomainArt.tsx';
import { Zap, Info, ArrowRight } from 'lucide-react';

interface MathCardProps {
  card: Card;
  variant?: 'mini' | 'standard' | 'hero';
  onClick?: () => void;
  className?: string;
  isDrawCard?: boolean;
}

export const MathCard: React.FC<MathCardProps> = ({
  card,
  variant = 'standard',
  onClick,
  className = '',
}) => {
  const rarityConfig: Record<CardRarity, { label: string; dotColor: string }> = {
    Common: { label: 'Phổ biến', dotColor: '#8f8d86' },
    Rare: { label: 'Hiếm', dotColor: '#5b87c4' },
    Epic: { label: 'Cực hiếm', dotColor: '#8874bd' },
    Legendary: { label: 'Huyền thoại', dotColor: '#d4963a' },
  };

  const rInfo = rarityConfig[card.rarity] || rarityConfig.Common;

  // 1. MINI VARIANT: Table cards in Arena
  if (variant === 'mini') {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`${card.domainNameVi} (+${card.pointValue}đ): ${card.skillName} - ${card.skillDesc}`}
        style={{ borderColor: `${card.elementColor}88` }}
        className={`relative w-24 p-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] rounded-xl border flex flex-col items-center text-center transition-colors duration-150 cursor-pointer select-none overflow-hidden ${className}`}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: card.elementColor }}
        />

        <div className="mt-1 mb-1">
          <DomainArt category={card.domainId} size="sm" className="w-8 h-8" />
        </div>

        <div
          className="text-xs font-medium truncate w-full"
          style={{ color: card.elementColor }}
        >
          {card.domainNameVi}
        </div>

        <div className="text-sm font-semibold text-[var(--accent-text)] font-mono tabular-nums">
          +{card.pointValue}đ
        </div>

        <div className="text-xs text-[var(--text-muted)] truncate w-full">
          {card.skillName}
        </div>

        <div
          className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: rInfo.dotColor }}
        />
      </button>
    );
  }

  // 2. HERO VARIANT
  if (variant === 'hero') {
    return (
      <div
        style={{ borderColor: `${card.elementColor}88` }}
        className={`relative w-full max-w-lg bg-[var(--bg-surface)] border rounded-2xl p-5 text-[var(--text-primary)] space-y-4 overflow-hidden ${className}`}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: card.elementColor }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl border flex items-center justify-center bg-[var(--bg-inset)]"
              style={{ borderColor: `${card.elementColor}66` }}
            >
              <DomainArt category={card.domainId} size="md" className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {card.domainNameVi}
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono rounded-md border border-[var(--border-hairline)] text-[var(--text-secondary)]">
                  {card.domainName}
                </span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">
                Phân môn {card.domainNameVi}
              </div>
            </div>
          </div>

          <div className="text-right px-3 py-1.5 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-hairline)]">
            <div className="text-xs text-[var(--text-muted)]">Điểm thẻ</div>
            <div className="font-mono tabular-nums text-lg font-semibold text-[var(--accent-text)]">
              +{card.pointValue}đ
            </div>
          </div>
        </div>

        <div className="relative py-5 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex flex-col items-center justify-center">
          <DomainArt category={card.domainId} size="lg" className="w-24 h-24" />
          <span className="mt-3 text-xs font-mono text-[var(--text-secondary)]">
            Phẩm chất: {rInfo.label}
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl space-y-1">
          <div className="text-xs font-semibold text-[var(--accent-text)] flex items-center gap-2">
            <Zap className="w-4 h-4" strokeWidth={1.5} />
            <span>Kỹ năng: {card.skillName}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {card.skillDesc}
          </p>
        </div>

        <div className="p-3 bg-[var(--bg-raised)] border border-[var(--border-hairline)] rounded-xl flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span>Giải đúng câu hỏi toán để giữ lá bài này trên bàn và cộng điểm lượt.</span>
        </div>
      </div>
    );
  }

  // 3. STANDARD VARIANT: For DeckViewer & Inspection
  return (
    <div
      onClick={onClick}
      className={`group relative bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl p-3 flex flex-col justify-between transition-colors duration-150 cursor-pointer select-none overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: card.elementColor }}
      />

      <div>
        <div className="flex items-center justify-between gap-2 mb-2 pt-1">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-md border truncate"
            style={{
              backgroundColor: `${card.elementColor}14`,
              borderColor: `${card.elementColor}44`,
              color: card.elementColor,
            }}
          >
            {card.domainNameVi}
          </span>
          <span className="font-mono tabular-nums text-xs font-semibold text-[var(--accent-text)] shrink-0">
            +{card.pointValue}đ
          </span>
        </div>

        <div className="my-2 py-3 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] flex items-center justify-center">
          <DomainArt category={card.domainId} size="md" className="w-16 h-16" />
        </div>

        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
          {card.domainName}
        </div>

        <div className="mt-2 p-2.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl space-y-1">
          <div className="text-xs font-medium text-[var(--accent-text)] flex items-center gap-1.5 truncate">
            <Zap className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{card.skillName}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {card.skillDesc}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rInfo.dotColor }} />
          <span>{rInfo.label}</span>
        </span>
        <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] inline-flex items-center gap-1">
          <span>Chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
};
