import React from 'react';
import { Smartphone, X, ExternalLink, Monitor, AlertTriangle, Info } from 'lucide-react';

interface RotateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInIframe?: boolean;
  isWidescreenCompact?: boolean;
  onToggleCompact?: () => void;
  onOpenExternal?: () => void;
}

export const RotateDeviceModal: React.FC<RotateDeviceModalProps> = ({
  isOpen,
  onClose,
  isInIframe = false,
  isWidescreenCompact = false,
  onToggleCompact,
  onOpenExternal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative w-full max-w-sm p-6 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl text-left space-y-4 shadow-[var(--shadow-panel)]">
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-raised)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
            <Smartphone className="w-4 h-4 rotate-90" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Xoay ngang bàn đấu
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Mở rộng không gian quan sát thẻ bài và đề toán
            </p>
          </div>
        </div>

        {isInIframe ? (
          <div className="p-3 bg-[var(--accent-subtle)] border border-[var(--border-hairline)] rounded-xl text-xs text-[var(--text-primary)] space-y-1">
            <div className="font-medium flex items-center gap-2 text-[var(--accent-text)]">
              <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span>Đang mở trong khung xem trước</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Khung xem trước giữ cố định chiều dọc. Để xoay ngang tự nhiên trên thiết bị, hãy mở trang trong tab trình duyệt riêng.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl text-xs text-[var(--text-secondary)] space-y-1">
            <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
              <Info className="w-4 h-4 text-[var(--text-secondary)] shrink-0" strokeWidth={1.5} />
              <span>Hướng dẫn xoay ngang</span>
            </div>
            <p className="text-xs leading-relaxed">
              Mở bảng điều khiển thiết bị, bật chế độ tự động xoay màn hình và xoay ngang điện thoại.
            </p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          {onOpenExternal && (
            <button
              onClick={() => {
                onOpenExternal();
                onClose();
              }}
              className="w-full py-2 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              <span>Mở tab mới trên trình duyệt</span>
            </button>
          )}

          {onToggleCompact && (
            <button
              onClick={() => {
                onToggleCompact();
                onClose();
              }}
              className="w-full py-2 px-4 bg-[var(--bg-raised)] hover:bg-[var(--bg-inset)] border border-[var(--border-strong)] text-[var(--text-primary)] font-medium text-xs rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <Monitor className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
              <span>
                {isWidescreenCompact ? 'Tắt chế độ bàn đấu gọn' : 'Bật chế độ bàn đấu gọn'}
              </span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] rounded-lg transition-colors duration-150"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
