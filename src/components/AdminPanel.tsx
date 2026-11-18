import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  Plus,
  Trash2,
  Users,
  BookOpen,
  CheckCircle,
  RefreshCw,
  Lock,
  KeyRound,
  Settings,
  Crown,
  UserX,
  XCircle,
  Link2,
  Landmark,
  RotateCcw,
  Sparkles,
  Globe,
  ExternalLink,
  BarChart3,
  Zap,
} from 'lucide-react';
import {
  MathLevel,
  MathCategory,
  Question,
  SiteSettings,
  PremiumRequest,
  PremiumPlan,
} from '../../shared/types.ts';
import { MATH_DOMAINS } from '../../shared/cards.ts';
import { AvatarBadge } from './AvatarBadge.tsx';

function formatVnd(n: number) {
  return (n || 0).toLocaleString('vi-VN') + 'đ';
}

interface AdminPanelProps {
  onBack: () => void;
  currentUserRole?: string;
}

const ADMIN_KEY_STORAGE = 'mathrune_admin_key';

const isUserGuest = (u: any) =>
  !!(u.isGuest || u.role === 'guest' || u.accountType === 'guest');
const isUserPro = (u: any) =>
  !!u.isPremium &&
  (!u.premiumExpiresAt || new Date(u.premiumExpiresAt).getTime() > Date.now());

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [adminKey, setAdminKey] = useState<string>(
    () => sessionStorage.getItem(ADMIN_KEY_STORAGE) || ''
  );
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const verifyKey = async (key: string, opts?: { silent?: boolean }) => {
    if (!key) return false;
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: key }),
      });
      if (res.ok) {
        setAuthed(true);
        setAdminKey(key);
        sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
        return true;
      }
      if (!opts?.silent) {
        const d = await res.json().catch(() => ({}));
        setAuthError(d.error || 'Sai mật khẩu quản trị');
      }
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
      return false;
    } catch {
      if (!opts?.silent) setAuthError('Không kết nối được máy chủ');
      return false;
    }
  };

  useEffect(() => {
    if (adminKey) verifyKey(adminKey, { silent: true });
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    await verifyKey(pwInput);
    setAuthLoading(false);
  };

  const adminHeaders = { 'Content-Type': 'application/json', 'x-admin-key': adminKey };

  const [stats, setStats] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    'stats' | 'questions' | 'users' | 'premium' | 'settings'
  >('stats');

  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [premiumActionMsg, setPremiumActionMsg] = useState<string | null>(null);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetAllTimeLoading, setResetAllTimeLoading] = useState(false);
  const [confirmResetWeekly, setConfirmResetWeekly] = useState(false);
  const [confirmResetAllTime, setConfirmResetAllTime] = useState(false);

  const [userFilter, setUserFilter] = useState<'all' | 'registered' | 'guest' | 'pro'>('all');
  const [userSearch, setUserSearch] = useState('');
  const [customGrantUsername, setCustomGrantUsername] = useState('');
  const [customGrantDays, setCustomGrantDays] = useState<number>(30);
  const [customGrantPlan] = useState<'monthly' | 'solution'>('monthly');
  const [grantActionMsg, setGrantActionMsg] = useState<string | null>(null);
  const [grantActionLoading, setGrantActionLoading] = useState(false);
  const [usersMsg, setUsersMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [confirmRevokeUserId, setConfirmRevokeUserId] = useState<string | null>(null);
  const [confirmDeleteAllGuests, setConfirmDeleteAllGuests] = useState(false);
  const [confirmDeleteQId, setConfirmDeleteQId] = useState<string | null>(null);

  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qOptions, setQOptions] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qCategory, setQCategory] = useState<MathCategory>('NGUYEN_TO');
  const [qLevel, setQLevel] = useState<MathLevel>('THCS');
  const [qTimeLimit, setQTimeLimit] = useState(15);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState<MathCategory>('NGUYEN_TO');
  const [aiLevel, setAiLevel] = useState<MathLevel>('THCS');
  const [aiPreferredSource, setAiPreferredSource] = useState(
    'VietJack Chuyên Đề Toán (vietjack.com)'
  );
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedQuestion, setAiGeneratedQuestion] = useState<Question | null>(null);
  const [aiSuccessMsg, setAiSuccessMsg] = useState<string | null>(null);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);
  const [aiSavingToDb, setAiSavingToDb] = useState(false);

  const showUsersStatus = (type: 'ok' | 'err', text: string) => {
    setUsersMsg({ type, text });
    setTimeout(() => setUsersMsg(null), 4000);
  };

  const fetchStats = () => {
    fetch('/api/admin/stats', { headers: adminHeaders })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.warn(e));
  };

  const fetchQuestions = () => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(Array.isArray(data) ? data : []))
      .catch(e => console.warn(e));
  };

  const fetchUsers = () => {
    fetch('/api/admin/users', { headers: adminHeaders })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(e => console.warn(e));
  };

  const fetchPremiumRequests = () => {
    fetch('/api/admin/premium/requests', { headers: adminHeaders })
      .then(res => res.json())
      .then(data => setPremiumRequests(Array.isArray(data) ? data : []))
      .catch(e => console.warn(e));
  };

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setSettingsForm(data);
      })
      .catch(e => console.warn(e));
  };

  useEffect(() => {
    if (!authed) return;
    fetchStats();
    fetchQuestions();
    fetchUsers();
    fetchPremiumRequests();
    fetchSettings();
  }, [authed]);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qAnswer.trim()) {
      setFormMsg('Vui lòng nhập nội dung câu hỏi và đáp án');
      return;
    }

    const optionsArray = qOptions.trim()
      ? qOptions
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : undefined;

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          question: qText,
          answer: qAnswer,
          options: optionsArray,
          explanation: qExplanation,
          category: qCategory,
          level: qLevel,
          timeLimit: Number(qTimeLimit),
        }),
      });

      if (res.ok) {
        setFormMsg('Đã thêm câu hỏi vào ngân hàng đề');
        setQText('');
        setQAnswer('');
        setQOptions('');
        setQExplanation('');
        fetchQuestions();
        fetchStats();
        setTimeout(() => setFormMsg(null), 3000);
      } else {
        const d = await res.json();
        setFormMsg(`Lỗi: ${d.error}`);
      }
    } catch (err: any) {
      setFormMsg(`Lỗi kết nối: ${err.message}`);
    }
  };

  const handleGenerateAiQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAiGenerating(true);
    setAiErrorMsg(null);
    setAiSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/ai/generate-question', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          topic: aiTopic,
          category: aiCategory,
          level: aiLevel,
          preferredSource: aiPreferredSource,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể sinh câu hỏi AI');
      }
      setAiGeneratedQuestion(data.question);
      setAiSuccessMsg('Đã sinh thành công 1 câu hỏi toán học từ nguồn tham chiếu');
    } catch (err: any) {
      setAiErrorMsg(err?.message || 'Lỗi khi sinh câu hỏi AI');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveAiQuestionToBank = async () => {
    if (!aiGeneratedQuestion) return;
    setAiSavingToDb(true);
    setAiErrorMsg(null);
    setAiSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(aiGeneratedQuestion),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi lưu câu hỏi vào ngân hàng');
      }
      setAiSuccessMsg('Đã lưu câu hỏi vào ngân hàng đề thi đấu');
      setAiGeneratedQuestion(null);
      fetchQuestions();
      fetchStats();
    } catch (err: any) {
      setAiErrorMsg(err?.message || 'Lỗi lưu câu hỏi');
    } finally {
      setAiSavingToDb(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      setConfirmDeleteQId(null);
      fetchQuestions();
      fetchStats();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteUser = async (u: any) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      const d = await res.json();
      setConfirmDeleteUserId(null);
      if (res.ok) {
        showUsersStatus('ok', `Đã xóa tài khoản ${u.username}`);
        fetchUsers();
        fetchStats();
      } else {
        showUsersStatus('err', d.error || 'Không thể xóa tài khoản');
      }
    } catch {
      showUsersStatus('err', 'Lỗi kết nối máy chủ');
    }
  };

  const handleDeleteAllGuests = async () => {
    try {
      const res = await fetch('/api/admin/users/guests', {
        method: 'DELETE',
        headers: adminHeaders,
      });
      const d = await res.json();
      setConfirmDeleteAllGuests(false);
      if (res.ok) {
        showUsersStatus('ok', d.message || `Đã xóa ${d.count} tài khoản khách`);
        fetchUsers();
        fetchStats();
      } else {
        showUsersStatus('err', d.error || 'Lỗi xóa tài khoản khách');
      }
    } catch {
      showUsersStatus('err', 'Lỗi kết nối máy chủ');
    }
  };

  const handleGrantPremium = async (
    userId: string,
    plan: PremiumPlan = 'monthly',
    days: number = 30
  ) => {
    try {
      const res = await fetch('/api/admin/premium/grant', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ userId, plan, days }),
      });
      const data = await res.json();
      if (res.ok) {
        showUsersStatus('ok', data.message || `Đã gia hạn gói PRO thêm ${days} ngày`);
        fetchUsers();
        fetchStats();
      } else {
        showUsersStatus('err', data.error || 'Lỗi cấp gói PRO');
      }
    } catch {
      showUsersStatus('err', 'Lỗi kết nối máy chủ');
    }
  };

  const handleRevokePremium = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/premium/revoke', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setConfirmRevokeUserId(null);
      if (res.ok) {
        showUsersStatus('ok', data.message || 'Đã gỡ gói PRO');
        fetchUsers();
        fetchStats();
      } else {
        showUsersStatus('err', data.error || 'Lỗi gỡ gói PRO');
      }
    } catch {
      showUsersStatus('err', 'Lỗi kết nối máy chủ');
    }
  };

  const handleCustomGrantByUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGrantUsername.trim()) return;
    setGrantActionLoading(true);
    setGrantActionMsg(null);
    try {
      const res = await fetch('/api/admin/premium/grant', {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          username: customGrantUsername.trim(),
          plan: customGrantPlan,
          days: customGrantDays,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGrantActionMsg(data.message || 'Đã gia hạn gói PRO thành công');
        setCustomGrantUsername('');
        fetchUsers();
        fetchStats();
      } else {
        setGrantActionMsg(data.error || 'Lỗi gia hạn gói PRO');
      }
    } catch {
      setGrantActionMsg('Lỗi kết nối máy chủ');
    } finally {
      setGrantActionLoading(false);
      setTimeout(() => setGrantActionMsg(null), 5000);
    }
  };

  const handleResolvePremiumRequest = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(
        `/api/admin/premium/requests/${id}/${approve ? 'approve' : 'reject'}`,
        {
          method: 'POST',
          headers: adminHeaders,
        }
      );
      if (res.ok) {
        setPremiumActionMsg(
          approve ? 'Đã duyệt và kích hoạt Premium' : 'Đã từ chối yêu cầu'
        );
        fetchPremiumRequests();
        fetchUsers();
        fetchStats();
        setTimeout(() => setPremiumActionMsg(null), 3000);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: adminHeaders,
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
        setSettingsMsg('Đã lưu cài đặt hệ thống');
      } else {
        setSettingsMsg(`Lỗi: ${data.error}`);
      }
    } catch (err: any) {
      setSettingsMsg(`Lỗi kết nối: ${err.message}`);
    } finally {
      setSettingsSaving(false);
      setTimeout(() => setSettingsMsg(null), 3000);
    }
  };

  const handleResetLeaderboard = async () => {
    setResetLoading(true);
    try {
      const res = await fetch('/api/admin/leaderboard/reset', {
        method: 'POST',
        headers: adminHeaders,
      });
      const d = await res.json();
      setConfirmResetWeekly(false);
      if (res.ok) {
        setSettings(prev =>
          prev ? { ...prev, lastLeaderboardReset: d.settings.lastLeaderboardReset } : prev
        );
        setSettingsMsg('Đã đặt lại bảng xếp hạng tuần về 0đ');
        setTimeout(() => setSettingsMsg(null), 3000);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetAllTimeLeaderboard = async () => {
    setResetAllTimeLoading(true);
    try {
      const res = await fetch('/api/admin/leaderboard/reset-alltime', {
        method: 'POST',
        headers: adminHeaders,
      });
      setConfirmResetAllTime(false);
      if (res.ok) {
        setSettingsMsg('Đã đặt lại bảng xếp hạng toàn thời gian về 0đ');
        setTimeout(() => setSettingsMsg(null), 3000);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setResetAllTimeLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Quay lại sảnh chính</span>
        </button>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Khu vực quản trị
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Nhập mật khẩu quản trị viên để tiếp tục
              </p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <div className="relative">
              <KeyRound
                className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]"
                strokeWidth={1.5}
              />
              <input
                type="password"
                autoFocus
                required
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                placeholder="Mật khẩu quản trị"
                className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
            </div>

            {authError && (
              <div className="p-2.5 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)] text-[var(--status-danger)] text-xs rounded-lg">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {authLoading ? 'Đang kiểm tra...' : 'Mở khóa quản trị'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const adminTabs = [
    { id: 'stats', label: 'Tổng quan', icon: BarChart3 },
    { id: 'questions', label: 'Ngân hàng đề', icon: BookOpen },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'premium', label: 'Gói Premium', icon: Crown },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ] as const;

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

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md text-xs text-[var(--text-secondary)]">
          <Shield className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
          <span>Bảng điều khiển quản trị</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          Quản trị hệ thống Math Rune
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Theo dõi tài nguyên máy chủ, ngân hàng câu hỏi, người dùng và cấu hình thanh toán
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {adminTabs.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`h-9 px-3.5 text-xs font-medium rounded-lg border inline-flex items-center gap-2 transition-colors cursor-pointer ${
                active
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl">
              <div className="text-xs text-[var(--text-muted)]">Tổng người dùng</div>
              <div className="text-2xl font-mono tabular-nums font-semibold text-[var(--text-primary)] mt-1">
                {stats?.totalUsers ?? '—'}
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl">
              <div className="text-xs text-[var(--text-muted)]">Tổng câu hỏi toán</div>
              <div className="text-2xl font-mono tabular-nums font-semibold text-[var(--text-primary)] mt-1">
                {stats?.totalQuestions ?? '—'}
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl">
              <div className="text-xs text-[var(--text-muted)]">Bộ thẻ 10 phân môn</div>
              <div className="text-2xl font-mono tabular-nums font-semibold text-[var(--text-primary)] mt-1">
                {stats?.totalCards ?? 60} thẻ
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl">
              <div className="text-xs text-[var(--text-muted)]">Cổ ngữ hệ thống</div>
              <div className="text-2xl font-mono tabular-nums font-semibold text-[var(--text-primary)] mt-1">
                {stats?.totalRunes ?? 16} cổ ngữ
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl">
              <div className="text-xs text-[var(--text-muted)]">Thành viên Premium</div>
              <div className="text-2xl font-mono tabular-nums font-semibold text-[var(--accent-text)] mt-1">
                {stats?.totalPremiumUsers ?? 0}
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl">
              <div className="text-xs text-[var(--text-muted)]">Yêu cầu chờ duyệt</div>
              <div className="text-2xl font-mono tabular-nums font-semibold text-[var(--accent-text)] mt-1">
                {stats?.pendingPremiumRequests ?? 0}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-2 text-xs font-mono tabular-nums text-[var(--text-secondary)]">
            <div className="flex justify-between">
              <span>Trạng thái máy chủ</span>
              <span className="text-[var(--status-success)] font-medium">Đang hoạt động</span>
            </div>
            <div className="flex justify-between">
              <span>Bộ nhớ đang dùng</span>
              <span className="text-[var(--text-primary)]">
                {stats?.activeMemoryUsage ?? '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Đồng bộ trận đấu</span>
              <span className="text-[var(--text-primary)]">WebSocket Authoritative</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-hairline)] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                  <span>Sinh câu hỏi tự động từ nguồn học liệu</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Tạo câu hỏi kèm đáp án và lời giải từ các nguồn phổ biến như VietJack, VMF, MathVN, Khan Academy
                </p>
              </div>
              <span className="self-start sm:self-auto px-2.5 py-1 bg-[var(--status-success-subtle)] text-[var(--status-success)] border border-[var(--status-success)]/40 rounded-md text-xs font-medium inline-flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Có lời giải kiểm chứng</span>
              </span>
            </div>

            {aiSuccessMsg && (
              <div className="p-3 bg-[var(--status-success-subtle)] border border-[var(--status-success)] text-[var(--status-success)] text-xs rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{aiSuccessMsg}</span>
              </div>
            )}

            {aiErrorMsg && (
              <div className="p-3 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)] text-[var(--status-danger)] text-xs rounded-lg flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                <span>{aiErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleGenerateAiQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)] font-medium">
                    Nguồn tham chiếu ưu tiên
                  </label>
                  <select
                    value={aiPreferredSource}
                    onChange={e => setAiPreferredSource(e.target.value)}
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="VietJack Chuyên Đề Toán (vietjack.com)">
                      VietJack Chuyên Đề Toán (vietjack.com)
                    </option>
                    <option value="Diễn đàn Toán học Việt Nam (diendantoanhoc.org - VMF)">
                      Diễn đàn Toán học VMF (diendantoanhoc.org)
                    </option>
                    <option value="Lời Giải Hay (loigiaihay.com)">
                      Lời Giải Hay (loigiaihay.com)
                    </option>
                    <option value="MathVN Chuyên Toán (mathvn.com)">
                      MathVN Chuyên Toán (mathvn.com)
                    </option>
                    <option value="Khan Academy Math (vi.khanacademy.org)">
                      Khan Academy Math (vi.khanacademy.org)
                    </option>
                    <option value="Bộ GD&ĐT - Đề Thi Tuyển Sinh Chuẩn">
                      Bộ GD&ĐT - Đề thi chuẩn quốc gia
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)] font-medium">
                    Phân môn toán học
                  </label>
                  <select
                    value={aiCategory}
                    onChange={e => setAiCategory(e.target.value as MathCategory)}
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    {Object.entries(MATH_DOMAINS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.nameVi} ({k})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)] font-medium">
                    Cấp độ đối tượng
                  </label>
                  <select
                    value={aiLevel}
                    onChange={e => setAiLevel(e.target.value as MathLevel)}
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="THCS">THCS (Lớp 6 - 9)</option>
                    <option value="THPT">THPT (Lớp 10 - 12)</option>
                    <option value="CO_BAN">Cơ bản (Tiểu học)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[var(--text-secondary)] font-medium">
                  Chủ đề hoặc từ khóa (tùy chọn)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    placeholder="Ví dụ: Số nguyên tố, Định lý Pythagoras, Bất đẳng thức..."
                    className="flex-1 h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    disabled={aiGenerating}
                    className="h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        <span>Đang tạo đề...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                        <span>Tạo câu hỏi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {aiGeneratedQuestion && (
              <div className="p-4 bg-[var(--bg-inset)] border border-[var(--accent)] rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[var(--border-hairline)] text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-text)] font-medium">
                      Câu hỏi vừa tạo
                    </span>
                    {aiGeneratedQuestion.sourceName && (
                      <a
                        href={aiGeneratedQuestion.sourceUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Nguồn: {aiGeneratedQuestion.sourceName}</span>
                        <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                  <span className="font-mono text-[var(--text-muted)]">
                    {aiGeneratedQuestion.level} · {aiGeneratedQuestion.category}
                  </span>
                </div>

                <div className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                  {aiGeneratedQuestion.question}
                </div>

                {aiGeneratedQuestion.options && aiGeneratedQuestion.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {aiGeneratedQuestion.options.map((opt, idx) => {
                      const isCorrect =
                        opt.trim() === aiGeneratedQuestion.answer.trim();
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 font-mono ${
                            isCorrect
                              ? 'bg-[var(--status-success-subtle)] border-[var(--status-success)] text-[var(--status-success)] font-medium'
                              : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                          }`}
                        >
                          <span>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </span>
                          {isCorrect && <span>Đáp án đúng</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg text-xs text-[var(--text-secondary)] space-y-1">
                  <div className="font-medium text-[var(--text-primary)]">Lời giải chi tiết</div>
                  <p className="leading-relaxed">{aiGeneratedQuestion.explanation}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveAiQuestionToBank}
                    disabled={aiSavingToDb}
                    className="flex-1 h-9 bg-[var(--status-success)] hover:opacity-90 text-white font-medium rounded-lg inline-flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                  >
                    {aiSavingToDb ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                        <span>Lưu vào ngân hàng đề</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenerateAiQuestion()}
                    disabled={aiGenerating}
                    className="h-9 px-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] border border-[var(--border-hairline)] rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`}
                      strokeWidth={1.5}
                    />
                    <span>Tạo câu khác</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
              <span>Thêm câu hỏi thủ công</span>
            </h3>

            {formMsg && (
              <div className="p-2.5 bg-[var(--bg-inset)] border border-[var(--accent)] text-[var(--accent-text)] text-xs rounded-lg">
                {formMsg}
              </div>
            )}

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[var(--text-secondary)]">Nội dung câu hỏi</label>
                <input
                  type="text"
                  required
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  placeholder="Ví dụ: Số 29 có phải là số nguyên tố không?"
                  className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">Phân môn</label>
                  <select
                    value={qCategory}
                    onChange={e => setQCategory(e.target.value as MathCategory)}
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    {Object.entries(MATH_DOMAINS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.nameVi} ({k})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">Cấp độ</label>
                  <select
                    value={qLevel}
                    onChange={e => setQLevel(e.target.value as MathLevel)}
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="CO_BAN">Cơ bản</option>
                    <option value="THCS">THCS</option>
                    <option value="THPT">THPT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">
                    Thời gian trả lời (giây)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={qTimeLimit}
                    onChange={e => setQTimeLimit(Number(e.target.value))}
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">Đáp án đúng</label>
                  <input
                    type="text"
                    required
                    value={qAnswer}
                    onChange={e => setQAnswer(e.target.value)}
                    placeholder="Ví dụ: 15"
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">
                    Các lựa chọn (phân tách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={qOptions}
                    onChange={e => setQOptions(e.target.value)}
                    placeholder="Ví dụ: 12, 14, 15, 16"
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[var(--text-secondary)]">Lời giải thích</label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={e => setQExplanation(e.target.value)}
                  placeholder="Giải thích các bước thực hiện"
                  className="w-full bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <button
                type="submit"
                className="h-9 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium rounded-lg transition-colors cursor-pointer"
              >
                Thêm vào ngân hàng đề
              </button>
            </form>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-medium text-[var(--text-secondary)] font-mono tabular-nums">
              Danh sách câu hỏi ({questions.length} câu)
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {questions.map((q, i) => (
                <div
                  key={q.id || i}
                  className="p-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
                      <span>{q.question}</span>
                      {q.sourceName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[11px] text-[var(--text-secondary)] font-mono">
                          <Globe className="w-3 h-3" strokeWidth={1.5} />
                          <span>{q.sourceName}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono mt-1 flex items-center gap-2 flex-wrap">
                      <span>Phân môn: {q.category}</span>
                      <span>·</span>
                      <span>Cấp: {q.level}</span>
                      <span>·</span>
                      <span className="text-[var(--status-success)]">Đáp án: {q.answer}</span>
                    </div>
                  </div>

                  {q.id?.startsWith('ADMIN_') && (
                    <div className="shrink-0">
                      {confirmDeleteQId === q.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="h-7 px-2 bg-[var(--status-danger)] text-white rounded text-[11px] cursor-pointer"
                          >
                            Xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteQId(null)}
                            className="h-7 px-2 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded text-[11px] cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteQId(q.id)}
                          aria-label="Xóa câu hỏi"
                          className="p-1.5 text-[var(--text-muted)] hover:text-[var(--status-danger)] rounded-lg hover:bg-[var(--bg-raised)] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS */}
      {activeTab === 'users' &&
        (() => {
          const registeredUsers = users.filter(
            u => !isUserGuest(u) && u.role !== 'admin'
          );
          const guestUsers = users.filter(u => isUserGuest(u));
          const proUsers = users.filter(u => isUserPro(u));

          const filteredUsers = users.filter(u => {
            if (userFilter === 'registered') {
              if (isUserGuest(u) || u.role === 'admin') return false;
            } else if (userFilter === 'guest') {
              if (!isUserGuest(u)) return false;
            } else if (userFilter === 'pro') {
              if (!isUserPro(u)) return false;
            }

            if (userSearch.trim()) {
              const query = userSearch.toLowerCase();
              const matchName = (u.username || '').toLowerCase().includes(query);
              const matchId = (u.id || '').toLowerCase().includes(query);
              return matchName || matchId;
            }
            return true;
          });

          return (
            <div className="space-y-4">
              {usersMsg && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    usersMsg.type === 'ok'
                      ? 'bg-[var(--status-success-subtle)] border-[var(--status-success)] text-[var(--status-success)]'
                      : 'bg-[var(--status-danger-subtle)] border-[var(--status-danger)] text-[var(--status-danger)]'
                  }`}
                >
                  {usersMsg.type === 'ok' ? (
                    <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  )}
                  <span>{usersMsg.text}</span>
                </div>
              )}

              <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Crown className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                    <span>Cấp hoặc gia hạn gói PRO theo tên tài khoản</span>
                  </h3>
                </div>

                {grantActionMsg && (
                  <div className="p-2.5 bg-[var(--status-success-subtle)] border border-[var(--status-success)] text-[var(--status-success)] text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{grantActionMsg}</span>
                  </div>
                )}

                <form
                  onSubmit={handleCustomGrantByUsername}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2.5"
                >
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={customGrantUsername}
                      onChange={e => setCustomGrantUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập hoặc ID người dùng"
                      className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg px-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <select
                      value={customGrantDays}
                      onChange={e => setCustomGrantDays(Number(e.target.value))}
                      className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg px-2.5 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value={7}>7 ngày</option>
                      <option value={30}>30 ngày</option>
                      <option value={60}>60 ngày</option>
                      <option value={90}>90 ngày</option>
                      <option value={180}>180 ngày</option>
                      <option value={365}>365 ngày</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={grantActionLoading || !customGrantUsername.trim()}
                      className="w-full h-9 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {grantActionLoading ? 'Đang cấp...' : 'Gia hạn PRO'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                    <span className="font-mono tabular-nums">
                      Danh sách tài khoản ({users.length})
                    </span>
                  </h3>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setUserFilter('all')}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer font-mono tabular-nums ${
                        userFilter === 'all'
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                          : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      Tất cả ({users.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserFilter('registered')}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer font-mono tabular-nums ${
                        userFilter === 'registered'
                          ? 'bg-[var(--status-success)] border-[var(--status-success)] text-white'
                          : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      Đã đăng ký ({registeredUsers.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserFilter('guest')}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer font-mono tabular-nums ${
                        userFilter === 'guest'
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                          : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      Khách ({guestUsers.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserFilter('pro')}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer font-mono tabular-nums ${
                        userFilter === 'pro'
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                          : 'bg-[var(--bg-inset)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                      }`}
                    >
                      PRO ({proUsers.length})
                    </button>
                  </div>

                  {guestUsers.length > 0 &&
                    (confirmDeleteAllGuests ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleDeleteAllGuests}
                          className="h-8 px-3 bg-[var(--status-danger)] text-white rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Xác nhận xóa {guestUsers.length} khách
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteAllGuests(false)}
                          className="h-8 px-2.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded-lg text-xs cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteAllGuests(true)}
                        className="h-8 inline-flex items-center gap-1.5 px-3 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 text-[var(--status-danger)] rounded-lg text-xs font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Xóa toàn bộ tài khoản khách</span>
                      </button>
                    ))}
                </div>

                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Tìm kiếm theo tên tài khoản hoặc ID"
                  className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] focus:border-[var(--accent)] rounded-lg px-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />

                <div className="space-y-2.5 pt-1">
                  {filteredUsers.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-inset)] rounded-lg border border-[var(--border-hairline)]">
                      Không tìm thấy tài khoản phù hợp
                    </div>
                  ) : (
                    filteredUsers.map(u => {
                      const activePro = isUserPro(u);
                      const isGuest = isUserGuest(u);
                      const isAdmin = u.role === 'admin';

                      return (
                        <div
                          key={u.id}
                          className="p-3.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <AvatarBadge avatar={u.avatar} size="md" />
                            <div className="space-y-1 min-w-0">
                              <div className="font-medium text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
                                <span className="text-sm">{u.username}</span>

                                {isAdmin ? (
                                  <span className="px-2 py-0.5 bg-[var(--accent-subtle)] border border-[var(--accent)]/40 text-[var(--accent-text)] text-[11px] rounded inline-flex items-center gap-1">
                                    <Shield className="w-3 h-3" strokeWidth={1.5} />
                                    <span>Admin</span>
                                  </span>
                                ) : isGuest ? (
                                  <span className="px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-[11px] rounded inline-flex items-center gap-1">
                                    <Zap className="w-3 h-3" strokeWidth={1.5} />
                                    <span>Khách</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-[var(--status-success-subtle)] border border-[var(--status-success)]/40 text-[var(--status-success)] text-[11px] rounded">
                                    Đã đăng ký
                                  </span>
                                )}

                                {activePro && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--accent-subtle)] border border-[var(--accent)]/40 text-[var(--accent-text)] text-[11px] rounded">
                                    <Crown className="w-3 h-3" strokeWidth={1.5} />
                                    <span>
                                      PRO ({u.premiumPlan === 'monthly' ? 'Tháng' : 'Lời giải'})
                                    </span>
                                  </span>
                                )}
                              </div>

                              <div className="text-xs font-mono tabular-nums text-[var(--text-muted)] flex items-center gap-2.5 flex-wrap">
                                <span>ID: {u.id}</span>
                                <span>·</span>
                                <span>
                                  Tạo: {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                {activePro && u.premiumExpiresAt && (
                                  <>
                                    <span>·</span>
                                    <span className="text-[var(--accent-text)]">
                                      Hạn PRO:{' '}
                                      {new Date(u.premiumExpiresAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {!isAdmin && (
                            <div className="flex items-center gap-1.5 flex-wrap self-end md:self-auto">
                              {activePro ? (
                                <>
                                  {confirmRevokeUserId === u.id ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleRevokePremium(u.id)}
                                        className="h-7 px-2 bg-[var(--status-danger)] text-white rounded text-[11px] cursor-pointer"
                                      >
                                        Xác nhận gỡ
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmRevokeUserId(null)}
                                        className="h-7 px-2 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded text-[11px] cursor-pointer"
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmRevokeUserId(u.id)}
                                      className="h-7 px-2.5 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/40 text-[var(--status-danger)] rounded-md text-[11px] font-medium cursor-pointer"
                                    >
                                      Gỡ PRO
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleGrantPremium(u.id, 'monthly', 30)}
                                    className="h-7 px-2.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--accent-text)] rounded-md text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3 h-3" strokeWidth={1.5} />
                                    <span>+30 ngày</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleGrantPremium(u.id, 'monthly', 30)}
                                  className="h-7 px-2.5 bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--accent-text)] rounded-md text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Crown className="w-3 h-3" strokeWidth={1.5} />
                                  <span>Cấp PRO 30 ngày</span>
                                </button>
                              )}

                              {confirmDeleteUserId === u.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    className="h-7 px-2 bg-[var(--status-danger)] text-white rounded text-[11px] cursor-pointer"
                                  >
                                    Xác nhận xóa
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteUserId(null)}
                                    className="h-7 px-2 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded text-[11px] cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteUserId(u.id)}
                                  title="Xóa tài khoản này"
                                  aria-label="Xóa tài khoản"
                                  className="h-7 px-2 bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--status-danger)] text-[var(--text-muted)] hover:text-[var(--status-danger)] rounded-md inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <UserX className="w-3.5 h-3.5" strokeWidth={1.5} />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      {/* TAB 4: PREMIUM REQUESTS */}
      {activeTab === 'premium' && (
        <div className="space-y-4">
          {premiumActionMsg && (
            <div className="p-3 bg-[var(--status-success-subtle)] border border-[var(--status-success)] text-[var(--status-success)] text-xs rounded-lg">
              {premiumActionMsg}
            </div>
          )}

          <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 font-mono tabular-nums">
              <Crown className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
              <span>
                Yêu cầu nâng cấp Premium (
                {premiumRequests.filter(r => r.status === 'pending').length} chờ duyệt)
              </span>
            </h3>

            {premiumRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                Chưa có yêu cầu nào
              </div>
            ) : (
              <div className="space-y-2">
                {premiumRequests.map(r => (
                  <div
                    key={r.id}
                    className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-medium text-[var(--text-primary)]">
                        {r.username} —{' '}
                        <span className="text-[var(--accent-text)]">
                          {r.plan === 'monthly' ? 'Gói tháng' : 'Gói xem lời giải'}
                        </span>
                      </div>
                      <div className="text-xs font-mono tabular-nums text-[var(--text-muted)] mt-0.5">
                        {formatVnd(r.price)} ·{' '}
                        {new Date(r.createdAt).toLocaleString('vi-VN')} ·{' '}
                        <span
                          className={
                            r.status === 'pending'
                              ? 'text-[var(--accent-text)]'
                              : r.status === 'approved'
                              ? 'text-[var(--status-success)]'
                              : 'text-[var(--status-danger)]'
                          }
                        >
                          {r.status === 'pending'
                            ? 'Chờ duyệt'
                            : r.status === 'approved'
                            ? 'Đã duyệt'
                            : 'Đã từ chối'}
                        </span>
                      </div>
                    </div>

                    {r.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleResolvePremiumRequest(r.id, true)}
                          className="h-8 px-3 bg-[var(--status-success-subtle)] border border-[var(--status-success)]/50 text-[var(--status-success)] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Duyệt</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolvePremiumRequest(r.id, false)}
                          className="h-8 px-3 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 text-[var(--status-danger)] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Từ chối</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="p-5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl space-y-4 text-xs"
          >
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                <span>Liên kết hướng dẫn trang chủ</span>
              </h3>
              <p className="text-[var(--text-muted)]">
                Đường dẫn hiển thị trong mục tài liệu của Cẩm nang hướng dẫn
              </p>
              <input
                type="url"
                value={settingsForm.guideLink || ''}
                onChange={e =>
                  setSettingsForm(f => ({ ...f, guideLink: e.target.value }))
                }
                placeholder="https://..."
                className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Crown className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                <span>Giá gói Premium</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">
                    Gói xem lời giải (30 ngày)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={settingsForm.solutionPackagePrice ?? 0}
                    onChange={e =>
                      setSettingsForm(f => ({
                        ...f,
                        solutionPackagePrice: Number(e.target.value),
                      }))
                    }
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">
                    Gói tháng (30 ngày)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={settingsForm.monthlyPackagePrice ?? 0}
                    onChange={e =>
                      setSettingsForm(f => ({
                        ...f,
                        monthlyPackagePrice: Number(e.target.value),
                      }))
                    }
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                <span>Thông tin tài khoản nhận thanh toán</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">Ngân hàng</label>
                  <input
                    type="text"
                    value={settingsForm.bankName || ''}
                    onChange={e =>
                      setSettingsForm(f => ({ ...f, bankName: e.target.value }))
                    }
                    placeholder="Ví dụ: Vietcombank"
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">Chủ tài khoản</label>
                  <input
                    type="text"
                    value={settingsForm.bankAccountName || ''}
                    onChange={e =>
                      setSettingsForm(f => ({
                        ...f,
                        bankAccountName: e.target.value,
                      }))
                    }
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[var(--text-secondary)]">Số tài khoản</label>
                  <input
                    type="text"
                    value={settingsForm.bankAccountNumber || ''}
                    onChange={e =>
                      setSettingsForm(f => ({
                        ...f,
                        bankAccountNumber: e.target.value,
                      }))
                    }
                    className="w-full h-9 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg px-3 text-[var(--text-primary)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            </div>

            {settingsMsg && (
              <div className="p-2.5 bg-[var(--status-success-subtle)] border border-[var(--status-success)] text-[var(--status-success)] text-xs rounded-lg">
                {settingsMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={settingsSaving}
              className="h-9 px-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {settingsSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </form>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--status-danger)]/40 rounded-xl space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-[var(--status-danger)] flex items-center gap-2">
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              <span>Đặt lại bảng xếp hạng tuần</span>
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Đặt lại điểm bảng xếp hạng tuần về 0đ (không ảnh hưởng điểm kỷ lục toàn thời gian). Lần đặt lại gần nhất:{' '}
              <span className="font-mono">
                {settings?.lastLeaderboardReset
                  ? new Date(settings.lastLeaderboardReset).toLocaleString('vi-VN')
                  : '—'}
              </span>
            </p>
            {confirmResetWeekly ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetLeaderboard}
                  disabled={resetLoading}
                  className="h-9 px-4 bg-[var(--status-danger)] text-white font-medium rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {resetLoading ? 'Đang xử lý...' : 'Xác nhận đặt lại'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetWeekly(false)}
                  className="h-9 px-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetWeekly(true)}
                className="h-9 px-4 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 text-[var(--status-danger)] font-medium rounded-lg cursor-pointer"
              >
                Đặt lại bảng tuần về 0đ
              </button>
            )}
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--status-danger)]/40 rounded-xl space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-[var(--status-danger)] flex items-center gap-2">
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              <span>Đặt lại bảng xếp hạng toàn thời gian</span>
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Đưa điểm kỷ lục toàn thời gian của tất cả người chơi về 0đ. Thao tác này không thể hoàn tác
            </p>
            {confirmResetAllTime ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetAllTimeLeaderboard}
                  disabled={resetAllTimeLoading}
                  className="h-9 px-4 bg-[var(--status-danger)] text-white font-medium rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {resetAllTimeLoading ? 'Đang xử lý...' : 'Xác nhận xóa toàn bộ kỷ lục'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetAllTime(false)}
                  className="h-9 px-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--text-secondary)] rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetAllTime(true)}
                className="h-9 px-4 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 text-[var(--status-danger)] font-medium rounded-lg cursor-pointer"
              >
                Đặt lại bảng toàn thời gian
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
