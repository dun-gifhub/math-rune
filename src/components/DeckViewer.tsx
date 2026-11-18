import React, { useState } from 'react';
import { ArrowLeft, Search, Layers, X } from 'lucide-react';
import { DECK_60_CARDS, MATH_DOMAINS } from '../../shared/cards.ts';
import { Card, CardRarity } from '../../shared/types.ts';
import { MathCard } from './MathCard.tsx';
import { FlipCardReveal } from './FlipCardReveal.tsx';
import { RuneIcon } from './RuneIcon.tsx';
import { sound } from '../utils/soundEffects.ts';

interface DeckViewerProps {
  onBack: () => void;
}

export const DeckViewer: React.FC<DeckViewerProps> = ({ onBack }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);

  const filteredCards = DECK_60_CARDS.filter(card => {
    if (selectedDomain !== 'all' && card.domainId !== selectedDomain) return false;
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.skillName.toLowerCase().includes(q) ||
        card.domainNameVi.toLowerCase().includes(q) ||
        card.skillDesc.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const rarityLabels: Record<CardRarity, string> = {
    Common: 'Phổ biến',
    Rare: 'Hiếm',
    Epic: 'Cực hiếm',
    Legendary: 'Huyền thoại',
  };

  const handleInspectCard = (card: Card) => {
    sound.playCardFlip();
    setInspectedCard(card);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 select-none">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md text-xs font-mono tabular-nums text-[var(--text-secondary)]">
          <Layers className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
          <span>{filteredCards.length}/60 thẻ tri thức</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          Kho 60 thẻ tri thức toán học
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
          Mỗi thẻ đại diện cho một phân môn toán học kèm điểm cộng và kỹ năng học thuật. Chọn thẻ bất kỳ để xem chi tiết hai mặt
        </p>
      </div>

      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên kỹ năng, phân môn hoặc mô tả"
              className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedRarity('all')}
              className={`h-9 px-3 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                selectedRarity === 'all'
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                  : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              Tất cả phẩm
            </button>
            {(['Common', 'Rare', 'Epic', 'Legendary'] as CardRarity[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRarity(r)}
                className={`h-9 px-3 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRarity === r
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
                }`}
              >
                {rarityLabels[r]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedDomain('all')}
            className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap border transition-colors cursor-pointer ${
              selectedDomain === 'all'
                ? 'bg-[var(--bg-raised)] border-[var(--border-strong)] text-[var(--text-primary)]'
                : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Tất cả (10 phân môn)
          </button>
          {Object.entries(MATH_DOMAINS).map(([key, dom]) => {
            const isActive = selectedDomain === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDomain(key)}
                style={{
                  borderColor: isActive ? dom.color : undefined,
                }}
                className={`h-8 px-3 rounded-lg text-xs font-medium whitespace-nowrap border inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-raised)] text-[var(--text-primary)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <RuneIcon icon={dom.icon} className="w-4 h-4 shrink-0" style={{ color: dom.color }} />
                <span>{dom.nameVi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="p-10 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl text-center text-sm text-[var(--text-secondary)]">
          Không tìm thấy thẻ phù hợp với bộ lọc hiện tại
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredCards.map(card => (
            <MathCard
              key={card.id}
              card={card}
              variant="standard"
              onClick={() => handleInspectCard(card)}
            />
          ))}
        </div>
      )}

      {inspectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setInspectedCard(null)}
        >
          <div
            className="relative w-full max-w-md flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInspectedCard(null)}
              aria-label="Đóng chi tiết thẻ"
              className="self-end w-8 h-8 bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <FlipCardReveal card={inspectedCard} autoFlip={false} size="lg" />
            <div className="text-center space-y-2">
              <p className="text-xs text-[var(--text-secondary)]">
                Chạm trực tiếp vào thẻ để lật xem mặt trước và mặt sau
              </p>
              <button
                type="button"
                onClick={() => setInspectedCard(null)}
                className="h-9 px-5 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-strong)] text-[var(--text-primary)] font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Đóng chi tiết thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
