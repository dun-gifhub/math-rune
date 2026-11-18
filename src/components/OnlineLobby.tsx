import React, { useState } from 'react';
import { Globe, ArrowLeft, Users, Zap, Loader2 } from 'lucide-react';
import { MathLevel } from '../../shared/types.ts';

interface OnlineLobbyProps {
  onBack: () => void;
  onQuickMatch: (level: MathLevel) => void;
  onCancelQuickMatch: () => void;
  searchingMatch: boolean;
  onCreateRoom: (level: MathLevel) => void;
  onJoinRoom: (code: string) => void;
  mathLevel: MathLevel;
  onSetMathLevel: (level: MathLevel) => void;
}

export const OnlineLobby: React.FC<OnlineLobbyProps> = ({
  onBack,
  onQuickMatch,
  onCancelQuickMatch,
  searchingMatch,
  onCreateRoom,
  onJoinRoom,
  mathLevel,
  onSetMathLevel,
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    onJoinRoom(roomCodeInput.trim().toUpperCase());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md text-xs text-[var(--text-secondary)]">
          <Globe className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
          <span>Đấu trực tuyến thời gian thực</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          Đấu trường trực tuyến PvP
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Ghép trận ngẫu nhiên hoặc tạo phòng riêng bằng mã mời để thi đấu cùng bạn bè
        </p>
      </div>

      <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-3">
        <div className="text-xs font-medium text-[var(--text-secondary)]">
          Cấp độ câu hỏi cho trận đấu
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['CO_BAN', 'THCS', 'THPT'] as MathLevel[]).map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => onSetMathLevel(lvl)}
              className={`h-9 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                mathLevel === lvl
                  ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent-text)]'
                  : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              {lvl === 'CO_BAN' ? 'Cơ bản (Dễ)' : lvl === 'THCS' ? 'THCS (Vừa)' : 'THPT (Nâng cao)'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)]">
              <Zap className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Ghép trận nhanh
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Tự động tìm đối thủ đang trực tuyến cùng cấp độ toán đã chọn
            </p>
          </div>

          {searchingMatch ? (
            <div className="space-y-2">
              <div className="h-10 px-3 bg-[var(--bg-inset)] border border-[var(--accent)] rounded-lg text-xs text-[var(--text-primary)] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 text-[var(--accent-text)] animate-spin" strokeWidth={1.5} />
                <span>Đang tìm đối thủ...</span>
              </div>
              <button
                type="button"
                onClick={onCancelQuickMatch}
                className="w-full h-9 bg-[var(--bg-raised)] hover:bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Hủy tìm trận
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onQuickMatch(mathLevel)}
              className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-sm rounded-lg transition-colors cursor-pointer"
            >
              Tìm trận ngay
            </button>
          )}
        </div>

        <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)]">
              <Users className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Phòng đấu riêng
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Tạo mã phòng gồm 6 ký tự hoặc nhập mã bạn bè gửi để vào đấu tay đôi
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onCreateRoom(mathLevel)}
              className="w-full h-10 bg-[var(--bg-raised)] hover:bg-[var(--bg-inset)] border border-[var(--border-strong)] text-[var(--text-primary)] font-medium text-sm rounded-lg transition-colors cursor-pointer"
            >
              Tạo phòng mới
            </button>

            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                maxLength={8}
                value={roomCodeInput}
                onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="Nhập mã phòng"
                className="flex-1 h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg px-3 text-xs font-mono tracking-wider text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Vào phòng
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
