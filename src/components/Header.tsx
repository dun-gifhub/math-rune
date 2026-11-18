import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  User,
  LogOut,
  Palette,
  Sun,
  Moon,
  Smartphone,
  BookOpen,
  X,
  Layers,
} from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';
import { UserProfile } from '../../shared/types.ts';
import { ThemeDef } from '../utils/themeManager.ts';
import { AvatarBadge } from './AvatarBadge.tsx';

interface HeaderProps {
  user: { id: string; username: string; avatar: string; role: string } | null;
  profile: UserProfile | null;
  connected: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  currentView: string;
  currentTheme: ThemeDef;
  onOpenThemeModal: () => void;
  onToggleLightMode?: () => void;
  onOpenHowToPlay?: () => void;
  onDeleteGuestAccount?: () => void;
  isLandscape?: boolean;
  onToggleLandscape?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  profile,
  connected,
  onOpenAuth,
  onLogout,
  onNavigateHome,
  currentTheme,
  onOpenThemeModal,
  onToggleLightMode,
  onOpenHowToPlay,
  onDeleteGuestAccount,
  isLandscape = false,
  onToggleLandscape,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isBgmOn, setIsBgmOn] = useState(sound.getIsBgmPlaying());
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBgm = () => {
    const bgm = sound.toggleBgm();
    setIsBgmOn(bgm);
  };

  const isGuest = !!user && /^Pháp Sư #\d{4}$/.test(user.username);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-4 sm:px-6 py-2 safe-pt landscape-compact-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Quiet Wordmark */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-left rounded-lg px-1 py-1 hover:bg-[var(--bg-surface)] transition-colors duration-150"
        >
          <span className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
            <Layers className="w-4 h-4" strokeWidth={1.5} />
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Math Rune
            </span>
            <span className="hidden sm:inline text-xs font-mono text-[var(--text-muted)]">
              Draw &amp; Solve
            </span>
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className="hidden md:flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-mono border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)]">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: connected ? 'var(--status-success)' : 'var(--status-danger)',
              }}
            />
            <span>{connected ? 'Trực tuyến' : 'Mất kết nối'}</span>
          </div>

          {/* Sound Controls */}
          <div className="flex items-center h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-0.5 gap-0.5">
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150 ${
                !isMuted
                  ? 'text-[var(--accent-text)] bg-[var(--bg-raised)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Volume2 className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
            <button
              onClick={handleToggleBgm}
              title={isBgmOn ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150 ${
                isBgmOn
                  ? 'text-[var(--accent-text)] bg-[var(--bg-raised)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Music className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Toggle Light / Dark Mode */}
          {onToggleLightMode && (
            <button
              onClick={onToggleLightMode}
              title={currentTheme.isLight ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
              className="flex items-center gap-2 px-3 h-8 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
            >
              {currentTheme.isLight ? (
                <>
                  <Moon className="w-4 h-4" strokeWidth={1.5} />
                  <span className="hidden lg:inline">Nền tối</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" strokeWidth={1.5} />
                  <span className="hidden lg:inline">Nền sáng</span>
                </>
              )}
            </button>
          )}

          {/* Theme Background Changer */}
          <button
            onClick={onOpenThemeModal}
            title="Chọn màu nền"
            className="flex items-center gap-2 px-3 h-8 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
          >
            <Palette className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden lg:inline">Bảng màu</span>
          </button>

          {/* Orientation Toggle (Mobile / Tablet) */}
          {onToggleLandscape && (
            <button
              onClick={onToggleLandscape}
              title={isLandscape ? 'Xoay lại màn hình dọc' : 'Xoay ngang màn hình bàn đấu'}
              className={`md:hidden flex items-center gap-2 px-3 h-8 rounded-lg text-xs font-medium border transition-colors duration-150 ${
                isLandscape
                  ? 'bg-[var(--bg-raised)] border-[var(--border-strong)] text-[var(--text-primary)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Smartphone
                className={`w-4 h-4 transition-transform duration-150 ${isLandscape ? 'rotate-90' : ''}`}
                strokeWidth={1.5}
              />
              <span>{isLandscape ? 'Dọc' : 'Ngang'}</span>
            </button>
          )}

          {/* How To Play Guide */}
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              title="Mở cẩm nang hướng dẫn"
              className="flex items-center gap-2 px-3 h-8 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden sm:inline">Hướng dẫn</span>
            </button>
          )}

          {/* User Account */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUserMenu(true)}
                title="Xem thông tin tài khoản"
                className="flex items-center gap-2 px-2 h-8 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] rounded-lg transition-colors duration-150 text-left"
              >
                <AvatarBadge avatar={user.avatar} size="sm" className="w-6 h-6 rounded-md border-0 bg-transparent" />
                <span className="hidden sm:inline text-xs font-medium text-[var(--text-primary)] truncate max-w-[110px]">
                  {user.username}
                </span>
                <span className="hidden md:inline text-xs font-mono tabular-nums text-[var(--text-muted)]">
                  Cấp {profile?.level || 1}
                </span>
              </button>

              {isGuest ? (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-3 h-8 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap"
                >
                  <User className="w-4 h-4" strokeWidth={1.5} />
                  <span>Đăng nhập</span>
                </button>
              ) : (
                <button
                  onClick={onLogout}
                  title="Đăng xuất tài khoản"
                  className="flex items-center gap-2 px-3 h-8 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 h-8 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap"
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>

      {/* User Quick Sheet Modal */}
      {showUserMenu && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-xs p-5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-[var(--shadow-panel)] space-y-4">
            <button
              onClick={() => setShowUserMenu(false)}
              aria-label="Đóng"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors duration-150"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <AvatarBadge avatar={user.avatar} size="lg" />
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">
                  {user.username}
                </h3>
                <div className="text-xs font-mono tabular-nums text-[var(--text-secondary)]">
                  Cấp {profile?.level || 1} • {isGuest ? 'Tài khoản khách' : 'Đã xác thực'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-2">
              <div className="flex justify-between text-xs font-mono tabular-nums text-[var(--text-secondary)]">
                <span>Kinh nghiệm tích lũy</span>
                <span className="text-[var(--text-primary)] font-medium">{profile?.xp || 0} XP</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.round(((profile?.xp || 0) % 500) / 5))}%` }}
                  className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-300"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {isGuest ? (
                <>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" strokeWidth={1.5} />
                    <span>Đăng nhập hoặc đăng ký</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (confirm('Bạn có muốn đăng xuất khỏi tài khoản khách này không?')) {
                        if (onDeleteGuestAccount) onDeleteGuestAccount();
                        else onLogout();
                      }
                    }}
                    className="w-full py-2 px-4 bg-[var(--status-danger-subtle)] border border-[var(--border-hairline)] text-[var(--status-danger)] font-medium text-xs rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span>Xóa phiên khách</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full py-2 px-4 bg-[var(--status-danger-subtle)] border border-[var(--border-hairline)] text-[var(--status-danger)] font-medium text-xs rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  <span>Đăng xuất tài khoản</span>
                </button>
              )}

              <button
                onClick={() => setShowUserMenu(false)}
                className="w-full py-2 px-4 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] rounded-lg transition-colors duration-150"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
