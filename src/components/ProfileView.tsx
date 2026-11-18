import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  History,
  CheckCircle,
  Crown,
  Lock,
  Landmark,
  Copy,
  Check,
  Trash2,
  Pencil,
  Zap,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { UserProfile, SiteSettings, PremiumPlan } from '../../shared/types.ts';
import { BASIC_AVATARS, VIP_AVATARS } from '../../shared/avatars.ts';
import { ALL_RUNES } from '../../shared/runes.ts';
import { RuneStone } from './RuneStone.tsx';
import { AvatarBadge, getAvatarLabel } from './AvatarBadge.tsx';

interface ProfileViewProps {
  profile: UserProfile | null;
  onBack: () => void;
  onUpdateAvatar?: (avatar: string) => Promise<{ success: boolean; error?: string }>;
  onRefreshProfile?: () => void;
  isGuest?: boolean;
  onDeleteGuestAccount?: () => void;
}

function formatVnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onBack,
  onUpdateAvatar,
  onRefreshProfile,
  isGuest,
  onDeleteGuestAccount,
}) => {
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan | null>(null);
  const [showSelfRenew, setShowSelfRenew] = useState(false);
  const [targetGiftUsername, setTargetGiftUsername] = useState('');
  const [giftPlan, setGiftPlan] = useState<PremiumPlan>('monthly');
  const [giftMode, setGiftMode] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestRecipient, setRequestRecipient] = useState('');
  const [requestMsg, setRequestMsg] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [cancellingPro, setCancellingPro] = useState(false);
  const [confirmCancelPro, setConfirmCancelPro] = useState(false);
  const [confirmDeleteGuest, setConfirmDeleteGuest] = useState(false);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    setLoadingHistory(true);
    fetch(`/api/profile/${profile.id}/history`)
      .then(res => res.json())
      .then(data => {
        setMatchHistory(Array.isArray(data) ? data : []);
      })
      .catch(e => console.warn('Failed to load history:', e))
      .finally(() => setLoadingHistory(false));
  }, [profile?.id]);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(e => console.warn('Failed to load settings:', e));
  }, []);

  const isPremiumActive =
    !!profile?.isPremium &&
    (!profile.premiumExpiresAt || new Date(profile.premiumExpiresAt).getTime() > Date.now());

  const handlePickAvatar = async (av: string) => {
    if (!onUpdateAvatar || avatarSaving) return;
    setAvatarSaving(true);
    setAvatarMsg(null);
    const result = await onUpdateAvatar(av);
    if (result.success) {
      setAvatarMsg('Đã cập nhật biểu tượng hồ sơ');
      setAvatarPickerOpen(false);
    } else {
      setAvatarMsg(result.error || 'Không thể cập nhật biểu tượng');
    }
    setAvatarSaving(false);
    setTimeout(() => setAvatarMsg(null), 3000);
  };

  const handleCopyBank = () => {
    if (!settings?.bankAccountNumber) return;
    navigator.clipboard
      ?.writeText(settings.bankAccountNumber)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };

  const handleSendPremiumRequest = async (isGift: boolean = false) => {
    if (!profile?.id) return;
    const planToUse = isGift ? giftPlan : selectedPlan;
    if (!planToUse) return;

    if (isGift && !targetGiftUsername.trim()) {
      setRequestMsg('Vui lòng nhập chính xác tên đăng nhập người nhận');
      return;
    }

    setRequestLoading(true);
    setRequestMsg(null);
    try {
      const res = await fetch('/api/premium/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          plan: planToUse,
          targetUsername: isGift ? targetGiftUsername.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRequestSent(true);
        setRequestRecipient(
          data.recipientName || (isGift ? targetGiftUsername.trim() : profile.username)
        );
      } else {
        setRequestMsg(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      setRequestMsg('Lỗi kết nối máy chủ');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCancelMyPro = async () => {
    if (!profile?.id) return;
    setCancellingPro(true);
    setCancelMsg(null);
    try {
      const res = await fetch('/api/premium/cancel-my-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmCancelPro(false);
        setCancelMsg('Đã gỡ bỏ gói PRO khỏi tài khoản của bạn');
        if (onRefreshProfile) {
          onRefreshProfile();
        }
      } else {
        setCancelMsg(data.error || 'Không thể gỡ gói PRO');
      }
    } catch {
      setCancelMsg('Lỗi kết nối máy chủ');
    } finally {
      setCancellingPro(false);
      setTimeout(() => setCancelMsg(null), 4000);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-[var(--text-secondary)] space-y-4">
        <p className="text-sm">Vui lòng đăng nhập hoặc chơi một trận để kích hoạt hồ sơ</p>
        <button
          type="button"
          onClick={onBack}
          className="h-9 px-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] text-xs font-medium rounded-lg cursor-pointer"
        >
          Quay lại sảnh chính
        </button>
      </div>
    );
  }

  const xpCurrentLevel = profile.xp % 300;
  const xpPercent = Math.min(100, Math.round((xpCurrentLevel / 300) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Quay lại sảnh chính</span>
        </button>

        <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
          ID: {profile.id.substring(0, 10)}
        </span>
      </div>

      {isGuest && onDeleteGuestAccount && (
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--status-danger)]/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/40 flex items-center justify-center text-[var(--status-danger)] shrink-0">
              <Zap className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)] text-sm">
                Tài khoản khách (chơi nhanh)
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Bạn có thể đăng ký tài khoản chính thức để lưu hồ sơ lâu dài hoặc đặt lại tài khoản khách mới
              </p>
            </div>
          </div>

          {confirmDeleteGuest ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onDeleteGuestAccount();
                  onBack();
                }}
                className="h-8 px-3 bg-[var(--status-danger)] text-white text-xs font-medium rounded-lg cursor-pointer"
              >
                Xác nhận xóa
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteGuest(false)}
                className="h-8 px-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-xs font-medium rounded-lg cursor-pointer"
              >
                Hủy
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDeleteGuest(true)}
              className="h-9 px-3.5 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 text-[var(--status-danger)] hover:bg-[var(--status-danger)] hover:text-white text-xs font-medium rounded-lg transition-colors shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              <span>Xóa tài khoản khách</span>
            </button>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative">
            <AvatarBadge avatar={profile.avatar} size="xl" />
            {onUpdateAvatar && (
              <button
                type="button"
                onClick={() => setAvatarPickerOpen(v => !v)}
                title="Đổi biểu tượng hồ sơ"
                aria-label="Đổi biểu tượng hồ sơ"
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] flex items-center justify-center hover:bg-[var(--bg-raised)] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {profile.username}
              </h2>
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--accent-text)] text-xs font-medium self-center sm:self-auto">
                {profile.rankTitle}
              </span>
              {isPremiumActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[var(--accent-subtle)] border border-[var(--accent)]/50 text-[var(--accent-text)] text-xs font-medium self-center sm:self-auto">
                  <Crown className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Premium</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
              Cấp độ {profile.level} · Tổng điểm tích lũy: {profile.xp} XP
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono tabular-nums text-[var(--text-muted)]">
                <span>Tiến độ cấp {profile.level + 1}</span>
                <span>
                  {xpCurrentLevel}/300 XP ({xpPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[var(--bg-inset)] rounded-full overflow-hidden border border-[var(--border-hairline)]">
                <div
                  style={{ width: `${xpPercent}%` }}
                  className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {avatarPickerOpen && (
          <div className="p-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl space-y-3">
            {avatarMsg && (
              <div className="text-xs text-[var(--accent-text)] font-medium">{avatarMsg}</div>
            )}
            <div className="space-y-2">
              <div className="text-xs font-medium text-[var(--text-secondary)]">
                Biểu tượng cơ bản (miễn phí)
              </div>
              <div className="flex flex-wrap gap-2">
                {BASIC_AVATARS.map(av => (
                  <button
                    key={av}
                    type="button"
                    disabled={avatarSaving}
                    onClick={() => handlePickAvatar(av)}
                    title={getAvatarLabel(av)}
                    className={`p-1 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
                      profile.avatar === av
                        ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                        : 'border-transparent hover:bg-[var(--bg-raised)]'
                    }`}
                  >
                    <AvatarBadge avatar={av} size="md" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-[var(--accent-text)] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Biểu tượng VIP (thành viên Premium)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VIP_AVATARS.map(av => {
                  const locked = !isPremiumActive;
                  return (
                    <button
                      key={av}
                      type="button"
                      disabled={avatarSaving || locked}
                      onClick={() => handlePickAvatar(av)}
                      title={
                        locked
                          ? 'Nâng cấp gói Premium để mở khóa'
                          : getAvatarLabel(av)
                      }
                      className={`relative p-1 rounded-lg border transition-colors disabled:cursor-not-allowed ${
                        profile.avatar === av
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)]'
                          : locked
                          ? 'border-transparent opacity-40'
                          : 'border-transparent hover:bg-[var(--bg-raised)] cursor-pointer'
                      }`}
                    >
                      <AvatarBadge avatar={av} size="md" />
                      {locked && (
                        <Lock
                          className="w-3 h-3 absolute -top-1 -right-1 text-[var(--text-muted)]"
                          strokeWidth={1.5}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--border-hairline)]">
          <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-center space-y-0.5">
            <div className="text-xs text-[var(--text-muted)]">Tổng trận</div>
            <div className="text-lg font-mono tabular-nums font-semibold text-[var(--text-primary)]">
              {profile.totalGames}
            </div>
            <div className="text-xs font-mono tabular-nums text-[var(--text-secondary)]">
              {profile.wins} thắng / {profile.losses} thua
            </div>
          </div>

          <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-center space-y-0.5">
            <div className="text-xs text-[var(--text-muted)]">Tỉ lệ thắng</div>
            <div className="text-lg font-mono tabular-nums font-semibold text-[var(--status-success)]">
              {profile.winRate}%
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Đấu xếp hạng</div>
          </div>

          <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-center space-y-0.5">
            <div className="text-xs text-[var(--text-muted)]">Điểm kỷ lục</div>
            <div className="text-lg font-mono tabular-nums font-semibold text-[var(--accent-text)]">
              {profile.highestScore}đ
            </div>
            <div className="text-xs text-[var(--text-secondary)]">Trong một trận</div>
          </div>

          <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-center flex flex-col items-center justify-center gap-1">
            <div className="text-xs text-[var(--text-muted)]">Cổ ngữ trang bị</div>
            {(() => {
              const rId = profile.equippedRunes?.[0] || 'rune_shield';
              const rDef = ALL_RUNES.find(r => r.id === rId);
              if (!rDef) {
                return (
                  <div className="text-sm font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                    1/1
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-2 max-w-full" title={rDef.description}>
                  <RuneStone rune={rDef} size="sm" isActive={true} />
                  <span className="text-xs font-medium text-[var(--text-primary)] truncate max-w-[96px]">
                    {rDef.name}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Crown className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
            <span>Gói PRO & quyền lợi VIP</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setGiftMode(false);
                setSelectedPlan(null);
                setRequestSent(false);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                !giftMode
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)] border-[var(--accent)]'
                  : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              Gói của tôi
            </button>
            <button
              type="button"
              onClick={() => {
                setGiftMode(true);
                setRequestSent(false);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                giftMode
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-text)] border-[var(--accent)]'
                  : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:text-[var(--text-primary)]'
              }`}
            >
              Gia hạn cho người khác
            </button>
          </div>
        </div>

        {cancelMsg && (
          <div className="p-3 bg-[var(--status-success-subtle)] border border-[var(--status-success)] text-[var(--status-success)] text-xs rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>{cancelMsg}</span>
          </div>
        )}

        {giftMode ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-xs space-y-1">
              <div className="font-medium text-[var(--text-primary)]">
                Gia hạn hoặc tặng gói PRO cho tài khoản khác
              </div>
              <p className="text-[var(--text-secondary)]">
                Nhập chính xác tên đăng nhập người nhận. Sau khi xác nhận chuyển khoản, quản trị viên sẽ kích hoạt gói trực tiếp cho tài khoản đó
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">
                Tên đăng nhập người nhận
              </label>
              <input
                type="text"
                value={targetGiftUsername}
                onChange={e => setTargetGiftUsername(e.target.value)}
                placeholder="Nhập tên tài khoản người nhận"
                className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg px-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGiftPlan('monthly')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  giftPlan === 'monthly'
                    ? 'bg-[var(--accent-subtle)] border-[var(--accent)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  Gói tháng (30 ngày)
                </div>
                <div className="text-base font-mono tabular-nums font-semibold text-[var(--accent-text)] mt-1">
                  {formatVnd(settings?.monthlyPackagePrice ?? 15000)}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  Đầy đủ quyền lợi lời giải và VIP
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGiftPlan('solution')}
                className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  giftPlan === 'solution'
                    ? 'bg-[var(--accent-subtle)] border-[var(--accent)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  Gói xem lời giải (30 ngày)
                </div>
                <div className="text-base font-mono tabular-nums font-semibold text-[var(--accent-text)] mt-1">
                  {formatVnd(settings?.solutionPackagePrice ?? 20000)}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  Mở khóa toàn bộ lời giải chi tiết
                </div>
              </button>
            </div>

            {requestSent ? (
              <div className="p-4 bg-[var(--status-success-subtle)] border border-[var(--status-success)] rounded-lg text-xs text-[var(--text-primary)] space-y-1">
                <div className="font-medium text-[var(--status-success)] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>Đã gửi yêu cầu gia hạn cho {requestRecipient}</span>
                </div>
                <p className="text-[var(--text-secondary)]">
                  Quản trị viên sẽ kiểm tra giao dịch chuyển khoản và kích hoạt gói sớm nhất
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl space-y-3 text-xs">
                <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                  <span>Thông tin chuyển khoản</span>
                </div>
                {settings?.bankAccountNumber ? (
                  <div className="space-y-1 font-mono tabular-nums text-[var(--text-secondary)]">
                    <div>
                      Ngân hàng: <span className="text-[var(--text-primary)]">{settings.bankName || '—'}</span>
                    </div>
                    <div>
                      Chủ TK: <span className="text-[var(--text-primary)]">{settings.bankAccountName || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        Số TK: <span className="text-[var(--text-primary)] font-semibold">{settings.bankAccountNumber}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyBank}
                        aria-label="Sao chép số tài khoản"
                        className="text-[var(--accent-text)] hover:opacity-80 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />}
                      </button>
                    </div>
                    <div>
                      Số tiền:{' '}
                      <span className="text-[var(--accent-text)] font-semibold">
                        {formatVnd(
                          giftPlan === 'monthly'
                            ? settings?.monthlyPackagePrice ?? 15000
                            : settings?.solutionPackagePrice ?? 20000
                        )}
                      </span>
                    </div>
                    <div>
                      Nội dung CK:{' '}
                      <span className="text-[var(--status-success)] font-semibold">
                        PREMIUM {targetGiftUsername.trim() || '[TEN_NGUOI_NHAN]'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[var(--text-muted)]">
                    Quản trị viên chưa cấu hình tài khoản ngân hàng
                  </div>
                )}

                {requestMsg && <div className="text-[var(--status-danger)]">{requestMsg}</div>}

                <button
                  type="button"
                  onClick={() => handleSendPremiumRequest(true)}
                  disabled={requestLoading || !targetGiftUsername.trim()}
                  className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {requestLoading
                    ? 'Đang gửi yêu cầu...'
                    : `Xác nhận đã chuyển khoản cho ${targetGiftUsername.trim() || 'người nhận'}`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {isPremiumActive && (
              <div className="p-4 bg-[var(--accent-subtle)] border border-[var(--accent)]/50 rounded-xl text-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-sm text-[var(--accent-text)]">
                      <Crown className="w-4 h-4" strokeWidth={1.5} />
                      <span>Tài khoản đang kích hoạt PRO</span>
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      Gói hiện tại:{' '}
                      <span className="font-medium text-[var(--text-primary)]">
                        {profile.premiumPlan === 'monthly' ? 'Gói tháng' : 'Gói xem lời giải'}
                      </span>
                    </div>
                    {profile.premiumExpiresAt && (
                      <div className="text-[var(--text-muted)] font-mono tabular-nums">
                        Hết hạn: {new Date(profile.premiumExpiresAt).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowSelfRenew(v => !v)}
                      className="h-8 px-3 bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{showSelfRenew ? 'Đóng gia hạn' : 'Gia hạn thêm'}</span>
                    </button>

                    {confirmCancelPro ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleCancelMyPro}
                          disabled={cancellingPro}
                          className="h-8 px-3 bg-[var(--status-danger)] text-white font-medium rounded-lg cursor-pointer disabled:opacity-50"
                        >
                          {cancellingPro ? 'Đang gỡ...' : 'Xác nhận gỡ'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancelPro(false)}
                          className="h-8 px-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded-lg cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmCancelPro(true)}
                        className="h-8 px-3 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 text-[var(--status-danger)] font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Gỡ gói PRO
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] border-t border-[var(--border-hairline)] pt-2.5 flex items-center gap-4 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[var(--status-success)]" strokeWidth={1.5} />
                    Xem lời giải chi tiết
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[var(--status-success)]" strokeWidth={1.5} />
                    Mở khóa biểu tượng VIP
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[var(--status-success)]" strokeWidth={1.5} />
                    Danh hiệu thành viên
                  </span>
                </div>
              </div>
            )}

            {(!isPremiumActive || showSelfRenew) && (
              <>
                {requestSent ? (
                  <div className="p-4 bg-[var(--bg-inset)] border border-[var(--accent)] rounded-xl text-xs space-y-1">
                    <div className="font-medium text-[var(--accent-text)] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                      <span>Yêu cầu kích hoạt hoặc gia hạn đang chờ quản trị viên duyệt</span>
                    </div>
                    <div className="text-[var(--text-secondary)]">
                      Sau khi xác nhận chuyển khoản, gói PRO sẽ được kích hoạt cho tài khoản {profile.username}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Mở khóa xem lời giải chi tiết từng bước cho câu hỏi toán học và bộ biểu tượng VIP
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('solution')}
                        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                          selectedPlan === 'solution'
                            ? 'bg-[var(--accent-subtle)] border-[var(--accent)]'
                            : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="text-xs font-medium text-[var(--text-primary)]">
                          Gói xem lời giải
                        </div>
                        <div className="text-lg font-mono tabular-nums font-semibold text-[var(--accent-text)] mt-1">
                          {formatVnd(settings?.solutionPackagePrice ?? 20000)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">Hiệu lực 30 ngày</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPlan('monthly')}
                        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                          selectedPlan === 'monthly'
                            ? 'bg-[var(--accent-subtle)] border-[var(--accent)]'
                            : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-[var(--text-primary)]">
                            Gói tháng
                          </span>
                          <span className="px-2 py-0.5 bg-[var(--status-success-subtle)] text-[var(--status-success)] text-[11px] font-medium rounded">
                            Tiết kiệm hơn
                          </span>
                        </div>
                        <div className="text-lg font-mono tabular-nums font-semibold text-[var(--status-success)] mt-1">
                          {formatVnd(settings?.monthlyPackagePrice ?? 15000)}
                          <span className="text-xs text-[var(--text-muted)] font-normal">/tháng</span>
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Hiệu lực 30 ngày mỗi lần đăng ký
                        </div>
                      </button>
                    </div>

                    {selectedPlan && (
                      <div className="p-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl space-y-3 text-xs">
                        <div className="font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                          <Landmark className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                          <span>Chuyển khoản để kích hoạt gói PRO</span>
                        </div>
                        {settings?.bankAccountNumber ? (
                          <div className="space-y-1 font-mono tabular-nums text-[var(--text-secondary)]">
                            <div>
                              Ngân hàng: <span className="text-[var(--text-primary)]">{settings.bankName || '—'}</span>
                            </div>
                            <div>
                              Chủ TK: <span className="text-[var(--text-primary)]">{settings.bankAccountName || '—'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>
                                Số TK: <span className="text-[var(--text-primary)] font-semibold">{settings.bankAccountNumber}</span>
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyBank}
                                aria-label="Sao chép số tài khoản"
                                className="text-[var(--accent-text)] hover:opacity-80 cursor-pointer"
                              >
                                {copied ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />}
                              </button>
                            </div>
                            <div>
                              Số tiền:{' '}
                              <span className="text-[var(--accent-text)] font-semibold">
                                {formatVnd(
                                  selectedPlan === 'monthly'
                                    ? settings?.monthlyPackagePrice ?? 15000
                                    : settings?.solutionPackagePrice ?? 20000
                                )}
                              </span>
                            </div>
                            <div>
                              Nội dung CK:{' '}
                              <span className="text-[var(--status-success)] font-semibold">
                                PREMIUM {profile.username}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[var(--text-muted)]">
                            Quản trị viên chưa cập nhật thông tin chuyển khoản
                          </div>
                        )}

                        {requestMsg && <div className="text-[var(--status-danger)]">{requestMsg}</div>}

                        <button
                          type="button"
                          onClick={() => handleSendPremiumRequest(false)}
                          disabled={requestLoading}
                          className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {requestLoading ? 'Đang gửi...' : 'Xác nhận đã chuyển khoản'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <History className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
          <span>Lịch sử thi đấu gần đây</span>
        </h3>

        {loadingHistory ? (
          <div className="p-6 text-center text-xs text-[var(--text-muted)]">
            Đang tải lịch sử đấu...
          </div>
        ) : matchHistory.length === 0 ? (
          <div className="p-6 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-hairline)] text-center text-xs text-[var(--text-secondary)]">
            Chưa có trận đấu nào được ghi nhận
          </div>
        ) : (
          <div className="space-y-2">
            {matchHistory.map(m => (
              <div
                key={m.id}
                className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium shrink-0 border ${
                      m.isWin
                        ? 'bg-[var(--status-success-subtle)] text-[var(--status-success)] border-[var(--status-success)]/40'
                        : 'bg-[var(--status-danger-subtle)] text-[var(--status-danger)] border-[var(--status-danger)]/40'
                    }`}
                  >
                    {m.isWin ? 'Thắng' : 'Thua'}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[var(--text-primary)] truncate">
                      Đấu với {m.opponentName} ({m.mode})
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums flex items-center gap-3 flex-wrap mt-0.5">
                      <span>Điểm: {m.score}đ</span>
                      <span>
                        Chính xác: {m.accuracy}% ({m.correctAnswers}/{m.totalQuestions})
                      </span>
                      <span>BUST: {m.busts} lần</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-[var(--text-muted)] font-mono tabular-nums shrink-0">
                  {new Date(m.timestamp).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
