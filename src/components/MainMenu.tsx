import React, { useState, useEffect } from 'react';
import {
  Globe,
  Layers,
  Sparkles,
  UserCheck,
  Trophy,
  Settings,
  Bot,
  BookOpen,
  Play,
  ArrowRight,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { MathLevel, AiDifficulty, UserProfile } from '../../shared/types.ts';
import { DomainArt } from './DomainArt.tsx';
import { MATH_DOMAINS } from '../../shared/cards.ts';
import { Hero3DCard } from './Hero3DCard.tsx';
import { DailyChallengeWidget } from './DailyChallengeWidget.tsx';
import { AvatarBadge } from './AvatarBadge.tsx';
import { sound } from '../utils/soundEffects.ts';

interface MainMenuProps {
  onStartAi: (diff: AiDifficulty, level: MathLevel) => void;
  onOpenOnline: () => void;
  onOpenDeck: () => void;
  onOpenRunes: () => void;
  onOpenProfile: () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin: () => void;
  onOpenHowToPlay: () => void;
  mathLevel: MathLevel;
  onSetMathLevel: (level: MathLevel) => void;
  user?: { id: string; username: string; avatar: string; role: string } | null;
  profile?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onDeleteGuestAccount?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartAi,
  onOpenOnline,
  onOpenDeck,
  onOpenRunes,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenAdmin,
  onOpenHowToPlay,
  mathLevel,
  onSetMathLevel,
  user,
  profile,
  onOpenAuth,
  onLogout,
  onDeleteGuestAccount,
}) => {
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiDiff, setAiDiff] = useState<AiDifficulty>('medium');
  const [guideLink, setGuideLink] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setGuideLink(data?.guideLink || ''))
      .catch(() => {});
  }, []);

  const diffLabels: Record<AiDifficulty, { label: string; desc: string; tag: string }> = {
    easy: {
      label: 'Tân thủ (Dễ)',
      desc: 'AI tính toán cẩn trọng, chốt điểm sớm, độ chính xác toán 55%.',
      tag: '55%',
    },
    medium: {
      label: 'Pháp sư (Vừa)',
      desc: 'AI đánh giá rủi ro cơ bản, độ chính xác toán 75%.',
      tag: '75%',
    },
    hard: {
      label: 'Đại pháp sư (Khó)',
      desc: 'Tính tỷ lệ Bust và dùng Rune hợp lý, độ chính xác 90%.',
      tag: '90%',
    },
    expert: {
      label: 'Hiền triết (Cực khó)',
      desc: 'Tính toán điểm kỳ vọng, hiếm khi sai sót, độ chính xác 98%.',
      tag: '98%',
    },
  };

  const handlePlayNow = () => {
    sound.playCorrect();
    setShowAiModal(true);
  };

  const isGuest = !!user && /^Pháp Sư #\d{4}$/.test(user.username);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
      {/* User Status Bar */}
      {user && (
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AvatarBadge avatar={user.avatar} size="lg" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--text-primary)] text-sm">
                  {user.username}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {isGuest ? 'Tài khoản khách' : 'Đã xác thực'}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
                Cấp {profile?.level || 1} • {profile?.xp || 0} XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isGuest ? (
              <>
                {onOpenAuth && (
                  <button
                    onClick={onOpenAuth}
                    className="flex-1 sm:flex-initial px-4 h-9 bg-[var(--bg-raised)] hover:bg-[var(--bg-inset)] border border-[var(--border-strong)] text-[var(--text-primary)] font-medium text-xs rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <User className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                    <span>Đăng nhập hoặc đăng ký</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Bạn có muốn đăng xuất khỏi tài khoản khách này để đổi tài khoản khác?')) {
                      if (onDeleteGuestAccount) onDeleteGuestAccount();
                      else if (onLogout) onLogout();
                    }
                  }}
                  className="px-3 h-9 bg-transparent hover:bg-[var(--status-danger-subtle)] text-[var(--text-secondary)] hover:text-[var(--status-danger)] border border-[var(--border-hairline)] rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-2 whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenProfile}
                  className="px-3 h-9 bg-[var(--bg-raised)] hover:bg-[var(--bg-inset)] text-[var(--text-primary)] border border-[var(--border-hairline)] rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-2 whitespace-nowrap"
                >
                  <UserCheck className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                  <span>Hồ sơ</span>
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3 h-9 bg-transparent hover:bg-[var(--status-danger-subtle)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--status-danger)] text-xs font-medium rounded-lg transition-colors duration-150 flex items-center gap-2 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span>Đăng xuất</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 1. Hero Section (Asymmetric Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[var(--accent-text)]">
              Đấu trường thẻ bài toán học
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-[var(--text-primary)]">
              Math Rune: Rút thẻ, giải toán và giữ điểm
            </h1>
          </div>

          <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Rèn luyện tư duy toán học qua cơ chế tính toán xác suất rủi ro Push-Your-Luck. Giải đúng bài toán để tích điểm từ 60 thẻ bài 10 phân môn, chọn thời điểm Bank hợp lý và sử dụng 16 cổ ngữ Rune chiến thuật.
          </p>

          {/* 10 Domain Glyphs Showcase Strip */}
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(MATH_DOMAINS).slice(0, 10).map(([key, d]) => (
              <div
                key={key}
                title={`${d.nameVi}: ${d.description}`}
                className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] flex items-center justify-center p-1"
              >
                <DomainArt category={key} size="sm" className="w-full h-full" />
              </div>
            ))}
          </div>

          {/* Math Level Selector */}
          <div className="space-y-2 max-w-md">
            <div className="text-xs font-medium text-[var(--text-secondary)]">
              Cấp độ câu hỏi toán học
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl">
              {(['CO_BAN', 'THCS', 'THPT'] as MathLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => onSetMathLevel(lvl)}
                  className={`h-8 px-3 text-xs font-medium rounded-lg transition-colors duration-150 ${
                    mathLevel === lvl
                      ? 'bg-[var(--bg-raised)] text-[var(--text-primary)] border border-[var(--border-strong)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  {lvl === 'CO_BAN' ? 'Cơ bản' : lvl === 'THCS' ? 'Cấp 2 (THCS)' : 'Cấp 3 (THPT)'}
                </button>
              ))}
            </div>
          </div>

          {/* One Primary Action + One Secondary Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              onClick={handlePlayNow}
              className="h-11 px-6 rounded-lg font-medium text-sm text-[var(--accent-fg)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-current" strokeWidth={1.5} />
              <span>Bắt đầu đấu AI</span>
            </button>

            <button
              onClick={onOpenOnline}
              className="h-11 px-6 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-strong)] rounded-lg text-sm font-medium text-[var(--text-primary)] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Globe className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
              <span>Đấu trực tuyến</span>
            </button>
          </div>

          {guideLink && (
            <div>
              <a
                href={guideLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent-text)] hover:underline"
              >
                <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                <span>Tài liệu hướng dẫn từ quản trị viên</span>
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Tactile 3D Card Moment */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <Hero3DCard />
        </div>
      </div>

      {/* 2. Sub-Portals & Daily Quests */}
      <div className="pt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 w-full">
          <DailyChallengeWidget />
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          <button
            onClick={onOpenDeck}
            className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl text-left transition-colors duration-150 space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-secondary)]">
              <Layers className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Kho thẻ toán</div>
              <div className="text-xs text-[var(--text-muted)]">60 thẻ • 10 phân môn</div>
            </div>
          </button>

          <button
            onClick={onOpenRunes}
            className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl text-left transition-colors duration-150 space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-secondary)]">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">16 cổ ngữ Rune</div>
              <div className="text-xs text-[var(--text-muted)]">Trang bị nội tại</div>
            </div>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl text-left transition-colors duration-150 space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-secondary)]">
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Cẩm nang</div>
              <div className="text-xs text-[var(--text-muted)]">Luật thi đấu</div>
            </div>
          </button>

          <button
            onClick={onOpenProfile}
            className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl text-left transition-colors duration-150 space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-secondary)]">
              <UserCheck className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Hồ sơ</div>
              <div className="text-xs text-[var(--text-muted)]">Cấp độ và lịch sử</div>
            </div>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl text-left transition-colors duration-150 space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-secondary)]">
              <Trophy className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Bảng xếp hạng</div>
              <div className="text-xs text-[var(--text-muted)]">Thành tích cao nhất</div>
            </div>
          </button>

          <button
            onClick={onOpenAdmin}
            className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-2xl text-left transition-colors duration-150 space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-secondary)]">
              <Settings className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Quản trị</div>
              <div className="text-xs text-[var(--text-muted)]">Ngân hàng đề</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. AI Difficulty Selection Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl p-6 shadow-[var(--shadow-panel)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-raised)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)]">
                  <Bot className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    Thiết lập trận đấu AI
                  </h3>
                  <div className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
                    Mục tiêu 150 điểm an toàn
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2 py-1 rounded-lg hover:bg-[var(--bg-raised)] transition-colors duration-150"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-2">
              {(['easy', 'medium', 'hard', 'expert'] as AiDifficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setAiDiff(d)}
                  className={`w-full p-3 rounded-xl border text-left transition-colors duration-150 ${
                    aiDiff === d
                      ? 'bg-[var(--accent-subtle)] border-[var(--accent)]'
                      : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] hover:bg-[var(--bg-raised)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-[var(--text-primary)]">
                      {diffLabels[d].label}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
                      Chính xác {diffLabels[d].tag}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {diffLabels[d].desc}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowAiModal(false);
                onStartAi(aiDiff, mathLevel);
              }}
              className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-sm rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
            >
              <span>Vào bàn đấu</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
