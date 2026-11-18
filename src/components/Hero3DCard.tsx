import React, { useState, useRef } from 'react';
import { Crown, RotateCw } from 'lucide-react';
import { DomainArt } from './DomainArt.tsx';
import { DECK_60_CARDS, MATH_DOMAINS } from '../../shared/cards.ts';
import { sound } from '../utils/soundEffects.ts';

export const Hero3DCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const showcaseCards = DECK_60_CARDS.filter(c => c.rarity === 'Legendary' || c.pointValue >= 25);
  const currentCard = showcaseCards[cardIndex % showcaseCards.length] || DECK_60_CARDS[0];
  const domainInfo = MATH_DOMAINS[currentCard.domainId] || MATH_DOMAINS.NGUYEN_TO;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(-((y - centerY) / centerY) * 10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(-((y - centerY) / centerY) * 10);
    setRotateY(((x - centerX) / centerX) * 10);
    setIsHovered(true);
  };

  const handleReset = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleNextShowcase = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    sound.playCardFlip();
    setCardIndex(prev => (prev + 1) % showcaseCards.length);
  };

  return (
    <div className="relative flex flex-col items-center justify-center perspective-1000 py-2 select-none">
      {/* Printed Tactile Card Object */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleReset}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleReset}
        onClick={handleNextShowcase}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
            : 'rotateX(0deg) rotateY(0deg)',
          transition: isHovered
            ? 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 0.45s cubic-bezier(0.2, 0, 0, 1)',
        }}
        className="relative w-[272px] sm:w-80 h-[396px] sm:h-[436px] max-w-[88vw] rounded-2xl cursor-pointer transform-style-3d bg-[var(--bg-surface)] border border-[var(--border-strong)] p-4 shadow-[var(--shadow-panel)] flex flex-col justify-between overflow-hidden"
      >
        {/* Top Accent Domain Rule */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: domainInfo.color }}
        />

        {/* Corner Registration Marks (Signature Detail) */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[var(--border-strong)] pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-[var(--border-strong)] pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-[var(--border-strong)] pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[var(--border-strong)] pointer-events-none" />

        {/* Card Top Metadata */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)]">
            <Crown className="w-3.5 h-3.5 text-[var(--accent-text)]" strokeWidth={1.5} />
            <span>{currentCard.rarity}</span>
          </div>

          <div
            className="px-2 py-0.5 rounded-md border text-xs font-mono font-medium"
            style={{
              backgroundColor: `${domainInfo.color}18`,
              borderColor: `${domainInfo.color}55`,
              color: domainInfo.color,
            }}
          >
            {domainInfo.nameVi}
          </div>
        </div>

        {/* Center Geometric Artwork Plate */}
        <div className="my-3 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-hairline)] p-5 flex flex-col items-center justify-center flex-1">
          <div className="w-28 h-28 flex items-center justify-center">
            <DomainArt category={currentCard.domainId} size="lg" className="w-full h-full" />
          </div>

          <div className="mt-4 px-3 py-1 rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] font-mono tabular-nums font-semibold text-base">
            +{currentCard.pointValue} điểm
          </div>
        </div>

        {/* Card Bottom Skill Plate */}
        <div className="p-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-hairline)] space-y-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {currentCard.skillName}
            </span>
            <span className="text-xs font-mono tabular-nums text-[var(--text-muted)] shrink-0">
              #{currentCard.id}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {currentCard.skillDesc}
          </p>
        </div>
      </div>

      {/* Interactive Caption */}
      <button
        type="button"
        onClick={handleNextShowcase}
        className="mt-3 inline-flex items-center gap-2 text-xs font-mono tabular-nums text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
      >
        <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Chạm thẻ để xem mẫu khác ({cardIndex + 1}/{showcaseCards.length})</span>
      </button>
    </div>
  );
};
