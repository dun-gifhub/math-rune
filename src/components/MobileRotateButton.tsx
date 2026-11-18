import React from 'react';
import { Smartphone, ExternalLink } from 'lucide-react';

interface MobileRotateButtonProps {
  isLandscape: boolean;
  isInIframe?: boolean;
  onToggle: () => void;
  onOpenExternal?: () => void;
}

export const MobileRotateButton: React.FC<MobileRotateButtonProps> = ({
  isLandscape,
  isInIframe = false,
  onToggle,
  onOpenExternal,
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 md:hidden flex flex-col items-end gap-2 pointer-events-auto select-none">
      {isInIframe && !isLandscape && onOpenExternal && (
        <button
          onClick={onOpenExternal}
          title="Mở tab mới trên trình duyệt để xoay toàn màn hình"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs font-medium transition-colors duration-150 hover:bg-[var(--bg-raised)] active:scale-[0.99]"
        >
          <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
          <span>Mở tab trình duyệt</span>
        </button>
      )}

      <button
        onClick={onToggle}
        title={isLandscape ? 'Màn hình đang ở góc ngang' : 'Xem hướng dẫn xoay ngang màn hình'}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors duration-150 active:scale-[0.99] ${
          isLandscape
            ? 'bg-[var(--bg-surface)] border-[var(--border-strong)] text-[var(--text-secondary)]'
            : 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
        }`}
      >
        <Smartphone
          className={`w-4 h-4 transition-transform duration-150 ${isLandscape ? 'rotate-90' : ''}`}
          strokeWidth={1.5}
        />
        <span>{isLandscape ? 'Góc ngang' : 'Xoay ngang'}</span>
      </button>
    </div>
  );
};
