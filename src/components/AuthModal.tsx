import React, { useState } from 'react';
import { X, User, Key, Mail, ShieldAlert, LogIn } from 'lucide-react';
import { BASIC_AVATARS } from '../../shared/avatars.ts';
import { AvatarBadge, getAvatarLabel } from './AvatarBadge.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (u: string, p: string) => Promise<any>;
  onRegister: (u: string, e: string, p: string, a: string) => Promise<any>;
  onGuestLogin: () => Promise<any>;
}

const AVATARS = BASIC_AVATARS;

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onGuestLogin,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await onLogin(username, password);
      } else {
        await onRegister(username, email, password, selectedAvatar);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError(null);
    setLoading(true);
    try {
      await onGuestLogin();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập tài khoản khách');
    } finally {
      setLoading(false);
    }
  };

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
              <LogIn className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Tài khoản Math Rune
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Lưu hồ sơ, lịch sử trận đấu, cấp độ và bảng xếp hạng
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

        <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--bg-inset)] rounded-lg border border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`h-8 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              tab === 'login'
                ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`h-8 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              tab === 'register'
                ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Đăng ký mới
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[var(--status-danger-subtle)] border border-[var(--status-danger)] text-[var(--status-danger)] text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">
                Chọn biểu tượng hồ sơ
              </label>
              <div className="flex flex-wrap gap-2 p-2.5 bg-[var(--bg-inset)] rounded-lg border border-[var(--border-hairline)]">
                {AVATARS.map(av => {
                  const selected = selectedAvatar === av;
                  return (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      title={getAvatarLabel(av)}
                      className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                        selected
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                          : 'border-transparent hover:bg-[var(--bg-raised)] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <AvatarBadge avatar={av} size="sm" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">
              Tên tài khoản
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" strokeWidth={1.5} />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản"
                className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">
                Email (tùy chọn)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">
              Mật khẩu
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" strokeWidth={1.5} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading
              ? 'Đang xử lý...'
              : tab === 'login'
              ? 'Đăng nhập'
              : 'Hoàn tất đăng ký'}
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--border-hairline)] text-center">
          <button
            type="button"
            onClick={handleGuest}
            disabled={loading}
            className="text-xs text-[var(--accent-text)] hover:underline underline-offset-4 font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Chơi nhanh với tài khoản khách (không cần mật khẩu)
          </button>
        </div>
      </div>
    </div>
  );
};
