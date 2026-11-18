import React, { useState } from 'react';
import { ArrowLeft, Check, Zap, Info, Layers } from 'lucide-react';
import { ALL_RUNES } from '../../shared/runes.ts';
import { RuneDef } from '../../shared/types.ts';
import { RuneStone } from './RuneStone.tsx';

interface RuneGrimoireProps {
  equippedRunes: string[];
  onUpdateRunes: (runes: string[]) => void;
  onBack: () => void;
}

export const RuneGrimoire: React.FC<RuneGrimoireProps> = ({
  equippedRunes,
  onUpdateRunes,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const initialRuneId = equippedRunes && equippedRunes.length > 0 ? equippedRunes[0] : 'rune_shield';
  const [selectedRuneId, setSelectedRuneId] = useState<string>(initialRuneId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories: { id: string; name: string }[] = [
    { id: 'all', name: 'Tất cả (16 cổ ngữ)' },
    { id: 'DEFENSE', name: 'Phòng thủ & hồi sinh' },
    { id: 'TIME', name: 'Kéo dài thời gian' },
    { id: 'POINTS', name: 'Nhân điểm & combo' },
    { id: 'MAGIC', name: 'Chiến thuật đặc biệt' },
  ];

  const handleSelectRune = (runeId: string) => {
    setSelectedRuneId(runeId);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    if (!selectedRuneId) return;
    onUpdateRunes([selectedRuneId]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredRunes = ALL_RUNES.filter(r => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory || r.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const activeRuneDef = ALL_RUNES.find(r => r.id === selectedRuneId);

  const getActivationGuide = (rune: RuneDef) => {
    switch (rune.id) {
      case 'rune_revive':
        return 'Tự động kích hoạt khi BUST: giữ lại 50% điểm lượt vào kho an toàn (1 lần/trận)';
      case 'rune_shield':
        return 'Tự động kích hoạt khi rút trùng hệ: vô hiệu hóa cú nổ BUST đầu tiên trong mỗi lượt';
      case 'rune_insurance':
        return 'Tự động kích hoạt: khóa lá điểm cao nhất trên bàn vào kho an toàn khi gom từ 2 lá (1 lần/lượt)';
      case 'rune_retry':
        return 'Tự động kích hoạt khi trả lời sai: cho phép làm lại câu hỏi với thêm 15 giây (1 lần/lượt)';
      case 'rune_freeze':
        return 'Nội tại liên tục: tự động cộng thêm 20 giây suy nghĩ cho mọi câu hỏi trong trận';
      case 'rune_haste':
        return 'Nội tại áp chế: giảm 8 giây thời gian suy nghĩ của đối thủ trong mọi lượt';
      case 'rune_time_plus':
        return 'Nội tại liên tục: có 60 giây tư duy và nhận thưởng 3 điểm khi trả lời dưới 12 giây';
      case 'rune_swap_question':
        return 'Chủ động bấm (1 lần/lượt): đổi câu hỏi hiện tại sang một câu hỏi khác cùng hệ';
      case 'rune_double':
        return 'Chủ động bấm (1 lần/lượt): nhân 1,5 lần điểm cho 1 lá bài giải đúng trong lượt';
      case 'rune_bank_bonus':
        return 'Tự động khi bấm BANK: thưởng thêm 15 điểm vào kho an toàn (1 lần/lượt)';
      case 'rune_harvest':
        return 'Tự động khi gom đủ 3 lá trên bàn: thưởng thêm 15 điểm vào lượt (1 lần/lượt)';
      case 'rune_siphon':
        return 'Tự động khi trả lời đúng: hút 3 điểm an toàn từ đối thủ sang kho của bạn (1 lần/lượt)';
      case 'rune_foresight':
        return 'Nội tại thấu thị: nhìn thấy trước hệ và điểm của lá trên đỉnh bộ bài';
      case 'rune_purify':
        return 'Chủ động bấm (1 lần/lượt): làm mới các hệ trên bàn, đưa nguy cơ BUST về 0%';
      case 'rune_curse':
        return 'Chủ động bấm: trừ điểm an toàn của đối thủ ngay trong trận đấu';
      case 'rune_immortal':
        return 'Tự động kích hoạt khi HP về 0: hồi phục ngay với 20 HP (1 lần/trận)';
      default:
        return 'Kích hoạt trong lượt của bạn để tạo lợi thế chiến thuật';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md text-xs font-mono tabular-nums text-[var(--text-secondary)]">
          <Layers className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
          <span>Trang bị 1/1 cổ ngữ</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          Thư viện 16 cổ ngữ Rune
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
          Mỗi trận đấu bạn mang theo duy nhất một cổ ngữ hỗ trợ. Chọn cổ ngữ bên dưới và lưu vào hồ sơ
        </p>
      </div>

      <div className="p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--accent)] rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              Cổ ngữ đang chọn cho trận đấu (1/1)
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {saveSuccess && <Check className="w-4 h-4" strokeWidth={1.5} />}
            <span>{saveSuccess ? 'Đã lưu vào hồ sơ' : 'Lưu trang bị này'}</span>
          </button>
        </div>

        {activeRuneDef ? (
          <div className="p-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <RuneStone rune={activeRuneDef} size="lg" isActive={true} />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {activeRuneDef.name}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-raised)] text-[var(--text-secondary)] border border-[var(--border-hairline)]">
                  {activeRuneDef.categoryNameVi}
                </span>
                <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-[var(--bg-raised)] text-[var(--accent-text)] border border-[var(--border-hairline)]">
                  Tối đa {activeRuneDef.maxUses} lần/trận
                </span>
              </div>
              <div className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                <Zap className="w-4 h-4 text-[var(--accent-text)] shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{activeRuneDef.description}</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                <Info className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>{getActivationGuide(activeRuneDef)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[var(--text-muted)] p-3">
            Chưa chọn cổ ngữ nào
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={`h-9 px-3.5 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === c.id
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRunes.map(rune => {
          const isSelected = selectedRuneId === rune.id;

          return (
            <div
              key={rune.id}
              onClick={() => handleSelectRune(rune.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors duration-150 flex flex-col justify-between gap-4 select-none ${
                isSelected
                  ? 'bg-[var(--bg-raised)] border-[var(--accent)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <RuneStone rune={rune} size="md" isActive={isSelected} />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {rune.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono tabular-nums mt-0.5">
                        <span>{rune.categoryNameVi}</span>
                        <span>·</span>
                        <span>{rune.maxUses} lần/trận</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--accent)] text-[var(--accent-fg)] text-[11px] font-medium shrink-0">
                      <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Đang chọn</span>
                    </span>
                  )}
                </div>

                <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg space-y-1">
                  <div className="text-xs font-medium text-[var(--accent-text)] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>Tác dụng chính</span>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {rune.description}
                  </p>
                </div>

                <div className="text-xs text-[var(--text-secondary)] flex items-start gap-1.5 leading-relaxed">
                  <Info className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>{getActivationGuide(rune)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-[var(--text-muted)] truncate">{rune.id}</span>
                <span
                  className={`px-3 py-1 rounded-md font-medium ${
                    isSelected
                      ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                      : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border border-[var(--border-hairline)]'
                  }`}
                >
                  {isSelected ? 'Đang dùng' : 'Chọn cổ ngữ'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
