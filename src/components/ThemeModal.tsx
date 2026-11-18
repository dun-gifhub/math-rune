import React from 'react';
import { X, Check, Palette } from 'lucide-react';
import { GAME_THEMES, ThemeDef } from '../utils/themeManager.ts';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeDef;
  onSelectTheme: (theme: ThemeDef) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl p-6 text-[var(--text-primary)] space-y-5"
        style={{ boxShadow: 'var(--shadow-panel)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
              <Palette className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
                Giao diện bảng đấu
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Chọn tông nền tối hoặc sáng phù hợp điều kiện ánh sáng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {GAME_THEMES.map(theme => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--bg-raised)] border-[var(--accent)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg border border-[var(--border-strong)] shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: theme.bgHex }}
                  >
                    <span
                      className="w-4 h-4 rounded-sm border border-black/15"
                      style={{ backgroundColor: theme.surfaceHex }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {theme.name}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">
                      {theme.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-6 h-6 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-sm rounded-lg transition-colors cursor-pointer"
        >
          Xong
        </button>
      </div>
    </div>
  );
};
