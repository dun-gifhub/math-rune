import React, { useState } from 'react';
import { Card, CardRarity, MathCategory } from '../../shared/types.ts';
import {
  Zap,
  Flame,
  Box,
  Compass,
  SquareDot,
  MinusCircle,
  Divide,
  Layers,
  Shield,
  Crown,
} from 'lucide-react';

export interface MagicCardProps {
  card: Card;
  isFlipped?: boolean;
  isProFoil?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  animateDeal?: boolean;
  showDetails?: boolean;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  card,
  isFlipped = true,
  isProFoil = false,
  size = 'md',
  onClick,
  className = '',
  showDetails = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const rarityLabels: Record<CardRarity, string> = {
    Common: 'Phổ biến',
    Rare: 'Hiếm',
    Epic: 'Cực hiếm',
    Legendary: 'Huyền thoại',
  };

  const getDomainIcon = (cat: MathCategory, iconClass = 'w-4 h-4') => {
    switch (cat) {
      case 'NGUYEN_TO':
        return <Flame className={iconClass} strokeWidth={1.5} />;
      case 'CHINH_PHUONG':
        return <Box className={iconClass} strokeWidth={1.5} />;
      case 'DAI_SO':
        return <Compass className={iconClass} strokeWidth={1.5} />;
      case 'KHAI_CAN':
        return <SquareDot className={iconClass} strokeWidth={1.5} />;
      case 'LUY_THUA':
        return <Zap className={iconClass} strokeWidth={1.5} />;
      case 'AM_SO':
        return <MinusCircle className={iconClass} strokeWidth={1.5} />;
      case 'CHIA_HET':
        return <Divide className={iconClass} strokeWidth={1.5} />;
      case 'PHAN_SO':
        return <Layers className={iconClass} strokeWidth={1.5} />;
      case 'TUYET_DOI':
        return <Shield className={iconClass} strokeWidth={1.5} />;
      default:
        return <Zap className={iconClass} strokeWidth={1.5} />;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (size === 'sm') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setTilt({
      x: -((y - cy) / cy) * 8,
      y: ((x - cx) / cx) * 8,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'w-24 h-32 text-xs',
    md: 'w-40 sm:w-44 h-56 sm:h-60 text-xs',
    lg: 'w-60 sm:w-64 h-80 sm:h-88 text-sm',
  }[size];

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 select-none cursor-pointer ${sizeClasses} ${className}`}
      style={{
        transform: isHovered && size !== 'sm' ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
        transition: isHovered ? 'transform 0.1s cubic-bezier(0.2, 0, 0, 1)' : 'transform 0.35s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      <div
        className={`w-full h-full relative transform-style-3d transition-transform duration-500 ${
          isFlipped ? '' : 'rotate-y-180'
        }`}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl border bg-[var(--bg-surface)] flex flex-col justify-between overflow-hidden shadow-[var(--shadow-panel)]"
          style={{
            borderColor: isProFoil ? 'var(--accent)' : `${card.elementColor}88`,
          }}
        >
          <div className="p-2.5 flex items-center justify-between border-b border-[var(--border-hairline)] bg-[var(--bg-inset)]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span style={{ color: card.elementColor }}>
                {getDomainIcon(card.domainId, 'w-4 h-4')}
              </span>
              <span className="font-medium truncate" style={{ color: card.elementColor }}>
                {card.domainNameVi}
              </span>
            </div>

            <span className="font-mono tabular-nums font-semibold text-[var(--accent-text)] shrink-0">
              +{card.pointValue}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-3 text-center">
            <div
              className="rounded-xl flex items-center justify-center border p-3 bg-[var(--bg-inset)]"
              style={{
                borderColor: `${card.elementColor}55`,
                color: card.elementColor,
              }}
            >
              {getDomainIcon(card.domainId, size === 'sm' ? 'w-5 h-5' : 'w-8 h-8')}
            </div>

            <div className="mt-2 w-full">
              <div className="font-semibold text-[var(--text-primary)] truncate">
                {card.skillName}
              </div>
              {size !== 'sm' && showDetails && (
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1 leading-snug">
                  {card.skillDesc}
                </p>
              )}
            </div>
          </div>

          <div className="px-2.5 py-2 bg-[var(--bg-inset)] border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{rarityLabels[card.rarity]}</span>
            {isProFoil ? (
              <span className="inline-flex items-center gap-1 text-[var(--accent-text)] font-medium">
                <Crown className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Pro</span>
              </span>
            ) : (
              <span className="text-[var(--text-muted)] font-mono tabular-nums">#{card.id}</span>
            )}
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-inset)] flex flex-col items-center justify-center p-4 overflow-hidden">
          <div className="w-16 h-16 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--accent-text)]">
            <Layers className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="mt-3 text-center">
            <div className="font-semibold text-xs text-[var(--text-primary)]">Math Rune</div>
            <div className="text-xs font-mono text-[var(--text-muted)]">Draw &amp; Solve</div>
          </div>
        </div>
      </div>
    </div>
  );
};
