import React, { useEffect } from 'react';
import { ShieldAlert, Shield } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface BustImpactOverlayProps {
  onDismiss?: () => void;
}

export const BustImpactOverlay: React.FC<BustImpactOverlayProps> = ({ onDismiss }) => {
  useEffect(() => {
    sound.playBust();
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/75">
      <div
        className="relative w-full max-w-md bg-[var(--bg-surface)] border border-[var(--status-danger)] rounded-2xl p-6 text-center space-y-4 select-none"
        style={{ boxShadow: 'var(--shadow-panel)' }}
      >
        <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 flex items-center justify-center text-[var(--status-danger)]">
          <ShieldAlert className="w-5 h-5" strokeWidth={1.5} />
        </div>

        <div className="space-y-1">
          <div className="font-mono text-2xl font-semibold text-[var(--status-danger)] tracking-tight">
            BUST — Trùng phân môn
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Thẻ vừa rút trùng phân môn toán học với thẻ đã có trên bàn. Điểm tạm thời của lượt này trở về 0 và quyền đi chuyển sang đối thủ
          </p>
        </div>

        <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-xs text-[var(--text-secondary)] flex items-start gap-2.5 text-left">
          <Shield className="w-4 h-4 text-[var(--accent-text)] shrink-0 mt-0.5" strokeWidth={1.5} />
          <span>
            Mẹo chiến thuật: Chốt điểm sớm bằng nút BANK khi đã có 2–3 thẻ điểm cao, hoặc dùng cổ ngữ Khiên chắn để chặn một lần BUST
          </span>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="w-full h-10 bg-[var(--status-danger)] hover:opacity-90 text-white font-medium text-sm rounded-lg transition-opacity cursor-pointer"
          >
            Tiếp tục trận đấu
          </button>
        )}
      </div>
    </div>
  );
};
