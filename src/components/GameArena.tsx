import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState, Card, PlayerState } from '../../shared/types.ts';
import { ALL_RUNES } from '../../shared/runes.ts';
import { MATH_DOMAINS, DECK_60_CARDS } from '../../shared/cards.ts';
import { HowToPlayModal } from './HowToPlayModal.tsx';
import { RuneIcon } from './RuneIcon.tsx';
import { MathCard } from './MathCard.tsx';
import { RuneStone } from './RuneStone.tsx';
import { DrawButton } from './DrawButton.tsx';
import { FlipCardReveal } from './FlipCardReveal.tsx';
import { BustImpactOverlay } from './BustImpactOverlay.tsx';
import { AnimatedCounter } from './AnimatedCounter.tsx';
import { AvatarBadge } from './AvatarBadge.tsx';
import {
  Shield,
  ShieldAlert,
  Lock,
  Crown,
  Coins,
  Layers,
  Clock,
  AlertTriangle,
  RotateCcw,
  Trophy,
  Award,
  Zap,
  HelpCircle,
  BookOpen,
  X,
  Flag,
  Check,
  Globe,
  Swords,
  Heart,
} from 'lucide-react';

interface GameArenaProps {
  gameState: GameState;
  currentUserId: string;
  onDraw: () => void;
  onSubmitAnswer: (answer: string) => void;
  onBank: () => void;
  onUseRune: (runeId: string) => void;
  onChooseDraftRune: (runeId: string) => void;
  onSurrender: () => void;
  onExit: () => void;
  lastBustAlert: boolean;
  errorMessage: string | null;
  isLandscape?: boolean;
  isWidescreenCompact?: boolean;
}

export const GameArena: React.FC<GameArenaProps> = ({
  gameState,
  currentUserId,
  onDraw,
  onSubmitAnswer,
  onBank,
  onUseRune,
  onChooseDraftRune,
  onSurrender,
  onExit,
  lastBustAlert,
  errorMessage,
  isLandscape = false,
  isWidescreenCompact = false,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showSurrenderModal, setShowSurrenderModal] = useState<boolean>(false);
  const [inspectedTableCard, setInspectedTableCard] = useState<Card | null>(null);

  const you: PlayerState | undefined =
    gameState.players[currentUserId] || Object.values(gameState.players)[0];
  const opponent: PlayerState | undefined = Object.values(gameState.players).find(
    p => p.id !== you?.id
  );

  const isMyTurn = gameState.currentPlayerId === you?.id;
  const isGameOver = gameState.status === 'game_over';
  const isWinner = gameState.winnerId === you?.id;

  const activeCard: Card | undefined =
    gameState.currentCard ||
    (gameState.currentQuestion
      ? DECK_60_CARDS.find(c => c.domainId === gameState.currentQuestion?.category) ||
        DECK_60_CARDS[0]
      : undefined);

  const tableDomains = new Set(gameState.tableCards.map(c => c.domainId));
  const bustRiskPercent = Math.min(100, Math.round((tableDomains.size / 10) * 100));

  useEffect(() => {
    if (!gameState.currentQuestion) {
      setTimeLeft(45);
      return;
    }

    const limit = Math.max(
      gameState.currentQuestion.timeLimit || gameState.questionTimeLimit || 45,
      45
    );
    setTimeLeft(limit);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isMyTurn) {
            onSubmitAnswer('TIMEOUT_NO_ANSWER');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentQuestion?.id, isMyTurn]);

  useEffect(() => {
    if (isGameOver && isWinner) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isGameOver, isWinner]);

  const handleAnswerSubmit = (ans: string) => {
    if (!ans) return;
    onSubmitAnswer(ans);
    setAnswerInput('');
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-56px)] flex flex-col justify-between px-3 sm:px-6 py-3 max-w-5xl mx-auto select-none safe-pb ${
        isLandscape || isWidescreenCompact ? 'widescreen-arena-compact landscape-compact-py' : ''
      }`}
    >
      {lastBustAlert && <BustImpactOverlay />}

      {/* RUNE DRAFTING MODAL */}
      {gameState.status === 'drafting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-y-auto">
          <div
            className="w-full max-w-2xl my-auto p-5 sm:p-6 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl space-y-5"
            style={{ boxShadow: 'var(--shadow-panel)' }}
          >
            <div className="space-y-1 text-center">
              <div className="text-xs font-mono text-[var(--accent-text)]">
                Khởi đầu trận đấu
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
                Chọn 1 trong 2 cổ ngữ Rune
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                Cổ ngữ bạn chọn sẽ có hiệu lực hỗ trợ xuyên suốt toàn bộ trận đấu
              </p>
            </div>

            {!you?.chosenRuneId ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(you?.draftRunes && you.draftRunes.length > 0
                  ? you.draftRunes
                  : ['rune_shield', 'rune_revive']
                ).map(rId => {
                  const rDef = ALL_RUNES.find(r => r.id === rId);
                  if (!rDef) return null;
                  const limitText =
                    rDef.limitType === 'once_per_match'
                      ? '1 lần/trận'
                      : rDef.limitType === 'once_per_turn'
                      ? '1 lần/lượt'
                      : 'Nội tại liên tục';

                  return (
                    <div
                      key={rId}
                      className="p-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] hover:border-[var(--accent)] rounded-xl flex flex-col justify-between gap-4 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <RuneStone rune={rDef} size="lg" isActive={true} />
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                              {rDef.name}
                            </h4>
                            <span className="inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--accent-text)]">
                              {limitText}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {rDef.description}
                        </p>

                        <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs space-y-1">
                          <div className="font-medium text-[var(--accent-text)] flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                            <span>Hiệu lực áp dụng</span>
                          </div>
                          <div className="text-[var(--text-secondary)]">
                            {rDef.persistentEffectDesc || rDef.description}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onChooseDraftRune(rId)}
                        className="w-full h-9 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Chọn cổ ngữ này
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-5 bg-[var(--bg-inset)] border border-[var(--accent)] rounded-xl space-y-3 text-center">
                <div className="w-10 h-10 mx-auto rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)] flex items-center justify-center text-[var(--accent-text)]">
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  Đã chọn cổ ngữ {ALL_RUNES.find(r => r.id === you.chosenRuneId)?.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {ALL_RUNES.find(r => r.id === you.chosenRuneId)?.persistentEffectDesc}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-text)]" strokeWidth={1.5} />
                  <span>Đang chờ đối thủ hoàn tất chọn cổ ngữ...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl text-xs font-mono tabular-nums flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)]">Phòng:</span>
          <span className="font-semibold text-[var(--text-primary)]">{gameState.roomCode}</span>
          <span className="hidden sm:inline text-[var(--text-muted)]">
            · Cấp {gameState.mathLevel}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Layers className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
            <span>
              Bộ bài: <span className="font-semibold text-[var(--text-primary)]">{gameState.deckRemaining}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--accent-text)]">
            <Trophy className="w-4 h-4" strokeWidth={1.5} />
            <span>Mục tiêu: {gameState.targetScore}đ</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="h-7 px-2.5 bg-[var(--bg-inset)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)] rounded-md text-xs font-sans font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Luật chơi</span>
          </button>
          {!isGameOver && (
            <button
              type="button"
              onClick={() => setShowSurrenderModal(true)}
              className="h-7 px-2.5 bg-[var(--status-danger-subtle)] hover:bg-[var(--status-danger)] text-[var(--status-danger)] hover:text-white border border-[var(--status-danger)]/40 rounded-md text-xs font-sans font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Đầu hàng</span>
            </button>
          )}
          <button
            type="button"
            onClick={onExit}
            className="text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-2 ml-1 cursor-pointer"
          >
            Rời trận
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="my-2 p-2.5 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)] text-[var(--status-danger)] text-xs rounded-lg flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. OPPONENT BAR */}
      <div
        className={`mt-2 p-3 rounded-xl border transition-colors ${
          !isMyTurn
            ? 'bg-[var(--bg-raised)] border-[var(--accent)]'
            : 'bg-[var(--bg-surface)] border-[var(--border-hairline)]'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AvatarBadge avatar={opponent?.avatar} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
                  {opponent?.name || 'Đang chờ đối thủ...'}
                </span>
                {!isMyTurn && (
                  <span className="px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-[11px] rounded">
                    {gameState.aiThinkingStatus === 'solving'
                      ? 'Đang giải toán'
                      : gameState.aiThinkingStatus === 'thinking'
                      ? 'Đang tính lượt'
                      : 'Đang lượt'}
                  </span>
                )}
              </div>

              <div className="text-xs text-[var(--text-secondary)] flex items-center gap-4 mt-0.5 font-mono tabular-nums flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-[var(--status-danger)]" strokeWidth={1.5} />
                  <span>HP: {opponent?.hp || 100}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[var(--accent-text)]">
                  <span>Kho an toàn:</span>
                  <AnimatedCounter value={opponent?.safeScore || 0} suffix="đ" />
                </span>
              </div>

              {(() => {
                const oppRuneId = opponent?.chosenRuneId || opponent?.runes?.[0]?.runeId;
                if (!oppRuneId) return null;
                const rDef = ALL_RUNES.find(r => r.id === oppRuneId);
                const isOncePerMatch = rDef?.limitType === 'once_per_match';
                const isOncePerTurn = rDef?.limitType === 'once_per_turn';
                const oppUsed = isOncePerMatch
                  ? opponent?.runeUsedInMatch
                  : isOncePerTurn
                  ? opponent?.runeUsedThisTurn
                  : false;

                return (
                  <div
                    className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1 flex-wrap"
                    title={rDef?.persistentEffectDesc || rDef?.description}
                  >
                    <RuneIcon icon={rDef?.icon || ''} className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-medium text-[var(--text-secondary)]">
                      {rDef?.name}
                    </span>
                    {(isOncePerMatch || isOncePerTurn) && (
                      <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[var(--bg-inset)] border border-[var(--border-hairline)]">
                        {oppUsed
                          ? isOncePerMatch
                            ? 'Đã dùng'
                            : 'Đã dùng lượt này'
                          : isOncePerMatch
                          ? '1 lần/trận'
                          : '1 lần/lượt'}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="text-right font-mono tabular-nums shrink-0">
            <div className="text-[11px] text-[var(--text-muted)]">Điểm lượt</div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">
              <AnimatedCounter value={opponent?.currentTurnScore || 0} prefix="+" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTER TABLE & QUESTION CHAMBER */}
      <div className="my-3 flex-1 flex flex-col items-center justify-center min-h-[240px] relative space-y-3">
        {gameState.nextCardPreview && (
          <div className="w-full p-2.5 bg-[var(--bg-surface)] border border-[var(--accent)] rounded-lg flex items-center justify-center gap-2 text-xs font-mono tabular-nums text-[var(--text-primary)]">
            <span>Tiên tri lá kế tiếp:</span>
            <span className="font-semibold text-[var(--accent-text)]">
              {gameState.nextCardPreview.domainNameVi} (+{gameState.nextCardPreview.pointValue}đ)
            </span>
          </div>
        )}

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[var(--text-muted)] px-1">
            <span>Thẻ trên bàn lượt này ({gameState.tableCards.length} thẻ)</span>
            {gameState.tableCards.length > 0 && (
              <span className="text-[var(--accent-text)] font-medium">
                Tổng bàn: +{gameState.tableCards.reduce((sum, c) => sum + c.pointValue, 0)}đ
              </span>
            )}
          </div>

          <div className="relative flex items-center justify-center gap-3 flex-wrap min-h-[120px] p-4 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl">
            {gameState.tableCards.length === 0 && !activeCard ? (
              <div className="text-xs sm:text-sm text-[var(--text-muted)] py-5 text-center flex flex-col items-center gap-2">
                <Layers className="w-5 h-5 text-[var(--text-muted)]" strokeWidth={1.5} />
                <span>
                  {isMyTurn
                    ? 'Chưa có thẻ trên bàn. Nhấn Rút thẻ tri thức để bắt đầu lượt'
                    : `Đang trong lượt của ${opponent?.name || 'đối thủ'}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {gameState.tableCards.map((c, idx) => (
                  <MathCard
                    key={`${c.id}-${idx}`}
                    card={c}
                    variant="mini"
                    onClick={() => setInspectedTableCard(c)}
                  />
                ))}
                {activeCard && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[11px] font-mono text-[var(--accent-text)]">
                      Đang mở
                    </span>
                    <MathCard
                      card={activeCard}
                      variant="mini"
                      className="ring-2 ring-[var(--accent)]"
                      onClick={() => setInspectedTableCard(activeCard)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {gameState.tableCards.length > 0 && isMyTurn && !gameState.currentQuestion && (
            <div className="p-3 px-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-1.5 font-mono tabular-nums font-semibold px-2.5 py-1 rounded-md border ${
                      bustRiskPercent >= 40
                        ? 'bg-[var(--status-danger-subtle)] border-[var(--status-danger)] text-[var(--status-danger)]'
                        : bustRiskPercent >= 20
                        ? 'bg-[var(--status-warning-subtle)] border-[var(--status-warning)] text-[var(--status-warning)]'
                        : 'bg-[var(--status-success-subtle)] border-[var(--status-success)] text-[var(--status-success)]'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>{bustRiskPercent}%</span>
                  </div>

                  <div>
                    <div className="font-medium text-[var(--text-primary)]">
                      Rủi ro trùng phân môn (BUST)
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                      Đã xuất hiện {tableDomains.size}/10 phân môn trên bàn
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-xs w-full space-y-1.5">
                  <div className="w-full bg-[var(--bg-inset)] h-1.5 rounded-full overflow-hidden border border-[var(--border-hairline)]">
                    <div
                      className="h-full transition-[width] duration-300"
                      style={{
                        width: `${bustRiskPercent}%`,
                        backgroundColor:
                          bustRiskPercent >= 40
                            ? 'var(--status-danger)'
                            : bustRiskPercent >= 20
                            ? 'var(--status-warning)'
                            : 'var(--status-success)',
                      }}
                    />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] sm:text-right font-mono tabular-nums">
                    {bustRiskPercent >= 40
                      ? `Rủi ro cao — cân nhắc bấm BANK (+${you?.currentTurnScore || 0}đ)`
                      : 'Vùng an toàn — có thể rút tiếp hoặc bấm BANK'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isMyTurn && !gameState.currentQuestion && (
          <div className="w-full max-w-lg p-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl text-center text-xs text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">
              {opponent?.name || 'Đối thủ'}
            </span>{' '}
            đang cân nhắc rút thẻ tiếp theo hoặc dừng lượt để lưu điểm
          </div>
        )}

        {gameState.currentQuestion && (
          <div
            className="w-full max-w-2xl p-4 sm:p-5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl space-y-4"
            style={{ boxShadow: 'var(--shadow-panel)' }}
          >
            {activeCard && (
              <div className="p-3.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0">
                  <FlipCardReveal card={activeCard} autoFlip={true} size="md" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0 space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="font-semibold text-base text-[var(--text-primary)]">
                      {activeCard.domainNameVi}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono tabular-nums font-medium bg-[var(--accent-subtle)] text-[var(--accent-text)] border border-[var(--accent)]/40">
                      +{activeCard.pointValue}đ
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded font-mono text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
                      {activeCard.rarity}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--accent-text)] font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <Zap className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>Kỹ năng: {activeCard.skillName}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {activeCard.skillDesc}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-[var(--text-secondary)]">
                Phân môn:{' '}
                <span className="text-[var(--text-primary)]">
                  {MATH_DOMAINS[gameState.currentQuestion.category]?.nameVi ||
                    gameState.currentQuestion.category}
                </span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono tabular-nums font-medium border ${
                  timeLeft <= 5
                    ? 'bg-[var(--status-danger-subtle)] border-[var(--status-danger)] text-[var(--status-danger)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--accent-text)]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <div className="p-4 text-center bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-1.5">
              <div className="text-sm sm:text-base font-medium text-[var(--text-primary)]">
                {gameState.currentQuestion.question}
              </div>
              {gameState.currentQuestion.sourceName && (
                <div className="inline-flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                  <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Nguồn: {gameState.currentQuestion.sourceName}</span>
                </div>
              )}
            </div>

            {isMyTurn ? (
              <div className="space-y-3">
                {gameState.currentQuestion.options &&
                  gameState.currentQuestion.options.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {gameState.currentQuestion.options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAnswerSubmit(opt)}
                          className="min-h-10 py-2 px-3 bg-[var(--bg-inset)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-primary)] font-mono tabular-nums font-medium text-sm rounded-lg transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleAnswerSubmit(answerInput);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    autoFocus
                    value={answerInput}
                    onChange={e => setAnswerInput(e.target.value)}
                    placeholder="Nhập đáp án số"
                    className="flex-1 h-10 bg-[var(--bg-inset)] border border-[var(--border-strong)] focus:border-[var(--accent)] rounded-lg px-3 text-sm font-mono tabular-nums text-[var(--text-primary)] text-center placeholder:text-[var(--text-muted)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-10 px-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Xác nhận
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-lg text-center text-xs font-mono tabular-nums text-[var(--text-secondary)]">
                {gameState.aiThinkingStatus === 'solving'
                  ? `AI đang giải câu hỏi (${timeLeft}s)`
                  : `Đối thủ đang suy nghĩ (${timeLeft}s)`}
              </div>
            )}
          </div>
        )}

        {gameState.lastAnswerResult &&
          !gameState.lastAnswerResult.correct &&
          gameState.lastAnswerResult.explanation && (
            <div className="w-full max-w-2xl p-3 bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 rounded-xl text-xs space-y-1">
              <div className="font-medium text-[var(--status-danger)]">
                Đáp án đúng: {gameState.lastAnswerResult.revealedAnswer}
              </div>
              <div className="text-[var(--text-primary)]">
                {gameState.lastAnswerResult.explanation}
              </div>
            </div>
          )}
      </div>

      {/* 3. CONTROLS & RUNE BAR */}
      <div className="space-y-3">
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs font-mono text-[var(--text-secondary)]">
            Cổ ngữ (1/1)
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {(() => {
              const displaySlots =
                you?.runes && you.runes.length > 0
                  ? you.runes
                  : you?.chosenRuneId
                  ? [
                      {
                        runeId: you.chosenRuneId,
                        usesLeft: 1,
                        active: true,
                        usedThisTurn: you.runeUsedThisTurn,
                        usedInMatch: you.runeUsedInMatch,
                      },
                    ]
                  : [
                      {
                        runeId: 'rune_shield',
                        usesLeft: 1,
                        active: true,
                        usedThisTurn: false,
                        usedInMatch: false,
                      },
                    ];

              return displaySlots.map(slot => {
                const def = ALL_RUNES.find(r => r.id === slot.runeId);
                if (!def) return null;
                const isOncePerMatch = def.limitType === 'once_per_match';
                const isOncePerTurn = def.limitType === 'once_per_turn';

                const isExhausted = isOncePerMatch
                  ? slot.usedInMatch || you?.runeUsedInMatch || slot.usesLeft <= 0
                  : isOncePerTurn
                  ? slot.usedThisTurn || you?.runeUsedThisTurn || slot.usesLeft <= 0
                  : false;

                const isClickablePower = [
                  'rune_swap_question',
                  'rune_purify',
                  'rune_shield',
                  'rune_double',
                ].includes(def.id);
                const canUse =
                  isMyTurn && !isGameOver && !isExhausted && isClickablePower;

                return (
                  <div key={slot.runeId} className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      disabled={!canUse}
                      onClick={() => onUseRune(slot.runeId)}
                      title={`${def.name}: ${def.description}`}
                      className={`h-8 flex items-center gap-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        canUse
                          ? 'bg-[var(--bg-raised)] border-[var(--accent)] text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] cursor-pointer'
                          : isExhausted
                          ? 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-muted)] opacity-55 cursor-not-allowed border-dashed'
                          : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <RuneIcon
                        icon={def.icon}
                        className="w-4 h-4 shrink-0"
                        style={{ color: !isExhausted ? def.color : undefined }}
                      />
                      <span>{def.name}</span>

                      <span className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-muted)]">
                        {isOncePerMatch
                          ? isExhausted
                            ? 'Đã dùng'
                            : '1 lần/trận'
                          : isOncePerTurn
                          ? isExhausted
                            ? 'Đã dùng lượt này'
                            : '1 lần/lượt'
                          : 'Nội tại'}
                      </span>

                      {canUse && (
                        <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[var(--accent)] text-[var(--accent-fg)]">
                          Kích hoạt
                        </span>
                      )}
                    </button>

                    <span
                      className="text-xs text-[var(--text-secondary)] hidden md:inline max-w-sm truncate"
                      title={def.description}
                    >
                      {def.description}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 items-center">
          <DrawButton
            onClick={onDraw}
            disabled={!isMyTurn || isGameOver || !!gameState.currentQuestion}
          />

          <button
            type="button"
            onClick={onBank}
            disabled={
              !isMyTurn ||
              isGameOver ||
              !!gameState.currentQuestion ||
              (you?.currentTurnScore || 0) <= 0
            }
            className={`w-full h-12 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
              isMyTurn &&
              !gameState.currentQuestion &&
              (you?.currentTurnScore || 0) > 0 &&
              !isGameOver
                ? 'bg-[var(--status-success)] hover:opacity-90 text-white cursor-pointer'
                : 'bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
            }`}
          >
            <Coins className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span className="font-mono tabular-nums">
              BANK (+{you?.currentTurnScore || 0}đ)
            </span>
          </button>
        </div>

        {/* 4. PLAYER STATUS BAR */}
        <div
          className={`p-3 rounded-xl border transition-colors ${
            isMyTurn
              ? 'bg-[var(--bg-raised)] border-[var(--accent)]'
              : 'bg-[var(--bg-surface)] border-[var(--border-hairline)]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <AvatarBadge avatar={you?.avatar} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
                    {you?.name || 'Bạn'}
                  </span>
                  {isMyTurn && (
                    <span className="px-2 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] font-medium text-[11px] rounded">
                      Lượt của bạn
                    </span>
                  )}

                  {(() => {
                    const myRuneId =
                      you?.chosenRuneId || you?.runes?.[0]?.runeId || 'rune_shield';
                    const hasShieldRune = myRuneId === 'rune_shield';
                    const hasReviveRune = myRuneId === 'rune_revive';
                    const hasInsuranceRune = myRuneId === 'rune_insurance';
                    const hasRetryRune = myRuneId === 'rune_retry';
                    const hasImmortalRune = myRuneId === 'rune_immortal';

                    const shieldActive =
                      gameState.activeShield || (hasShieldRune && !you?.runeUsedThisTurn);
                    const reviveActive = hasReviveRune && !you?.runeUsedInMatch;
                    const insuranceActive = hasInsuranceRune && !you?.runeUsedThisTurn;
                    const retryActive = hasRetryRune && !you?.runeUsedThisTurn;
                    const immortalActive = hasImmortalRune && !you?.runeUsedInMatch;

                    return (
                      <>
                        {shieldActive && (
                          <span className="px-2 py-0.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--accent-text)] text-[11px] rounded inline-flex items-center gap-1">
                            <Shield className="w-3 h-3" strokeWidth={1.5} />
                            <span>Khiên sẵn sàng</span>
                          </span>
                        )}
                        {reviveActive && (
                          <span className="px-2 py-0.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--accent-text)] text-[11px] rounded inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" strokeWidth={1.5} />
                            <span>Hồi sinh 1/1</span>
                          </span>
                        )}
                        {insuranceActive && (
                          <span className="px-2 py-0.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--accent-text)] text-[11px] rounded inline-flex items-center gap-1">
                            <Lock className="w-3 h-3" strokeWidth={1.5} />
                            <span>Bảo hiểm sẵn sàng</span>
                          </span>
                        )}
                        {retryActive && (
                          <span className="px-2 py-0.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--accent-text)] text-[11px] rounded inline-flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
                            <span>Sửa sai sẵn sàng</span>
                          </span>
                        )}
                        {immortalActive && (
                          <span className="px-2 py-0.5 bg-[var(--bg-inset)] border border-[var(--border-hairline)] text-[var(--accent-text)] text-[11px] rounded inline-flex items-center gap-1">
                            <Crown className="w-3 h-3" strokeWidth={1.5} />
                            <span>Bất tử 1/1</span>
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-4 mt-0.5 font-mono tabular-nums flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[var(--status-danger)]" strokeWidth={1.5} />
                    <span>HP: {you?.hp || 100}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--accent-text)]">
                    <span>Kho an toàn:</span>
                    <AnimatedCounter
                      value={you?.safeScore || 0}
                      suffix="đ"
                      className="text-[var(--text-primary)] text-sm font-semibold"
                      isHighScore={(you?.safeScore || 0) >= 150}
                    />
                  </span>
                </div>

                {(() => {
                  const activeRuneId =
                    you?.chosenRuneId || you?.runes?.[0]?.runeId || 'rune_shield';
                  const rDef = ALL_RUNES.find(r => r.id === activeRuneId);
                  if (!rDef) return null;
                  return (
                    <div
                      className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1"
                      title={rDef.persistentEffectDesc || rDef.description}
                    >
                      <RuneIcon icon={rDef.icon || ''} className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium text-[var(--text-secondary)]">
                        {rDef.name}
                      </span>
                      <span className="hidden sm:inline truncate">
                        — {rDef.persistentEffectDesc}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="text-right font-mono tabular-nums shrink-0">
              <div className="text-[11px] text-[var(--text-muted)]">Điểm lượt</div>
              <div className="text-xl font-semibold text-[var(--accent-text)]">
                <AnimatedCounter value={you?.currentTurnScore || 0} prefix="+" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-medium shrink-0">
            <BookOpen className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
            <span>Tóm tắt luật</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span>1. Rút thẻ & giải toán cộng điểm lượt</span>
            <span>2. Trùng phân môn = BUST (mất điểm lượt)</span>
            <span>3. Bấm BANK để lưu điểm an toàn</span>
          </div>
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="text-[var(--accent-text)] hover:underline font-medium text-xs shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Xem đầy đủ
          </button>
        </div>
      </div>

      <HowToPlayModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />

      {/* GAME OVER MODAL */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div
            className="relative w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl p-6 text-[var(--text-primary)] space-y-5"
            style={{ boxShadow: 'var(--shadow-panel)' }}
          >
            <div className="text-center space-y-2">
              <div
                className={`w-12 h-12 mx-auto rounded-xl border flex items-center justify-center ${
                  isWinner
                    ? 'bg-[var(--accent-subtle)] border-[var(--accent)] text-[var(--accent-text)]'
                    : 'bg-[var(--bg-inset)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
                }`}
              >
                {isWinner ? (
                  <Crown className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Swords className="w-5 h-5" strokeWidth={1.5} />
                )}
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                {isWinner ? 'Chiến thắng trận đấu' : 'Trận đấu kết thúc'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {isWinner
                  ? `Bạn đã đạt ${you?.safeScore} điểm mục tiêu trước đối thủ`
                  : 'Đối thủ đã chạm mốc điểm chiến thắng trước'}
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-3">
              <h4 className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                <span>Thống kê học tập</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono tabular-nums">
                <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg">
                  <div className="text-[11px] text-[var(--text-muted)]">Điểm đạt</div>
                  <div className="text-lg font-semibold text-[var(--accent-text)]">
                    {you?.safeScore || 0}
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg">
                  <div className="text-[11px] text-[var(--text-muted)]">Chính xác</div>
                  <div className="text-lg font-semibold text-[var(--status-success)]">
                    {(() => {
                      const total =
                        (you?.stats.correctCount || 0) + (you?.stats.wrongCount || 0);
                      return total > 0
                        ? Math.round(((you?.stats.correctCount || 0) / total) * 100)
                        : 0;
                    })()}
                    %
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg">
                  <div className="text-[11px] text-[var(--text-muted)]">Câu đúng</div>
                  <div className="text-lg font-semibold text-[var(--text-primary)]">
                    {you?.stats.correctCount || 0}/
                    {(you?.stats.correctCount || 0) + (you?.stats.wrongCount || 0)}
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg">
                  <div className="text-[11px] text-[var(--text-muted)]">Số lần BUST</div>
                  <div className="text-lg font-semibold text-[var(--status-danger)]">
                    {you?.stats.bustCount || 0}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Kinh nghiệm nhận được</span>
                <span className="font-mono tabular-nums font-medium text-[var(--accent-text)]">
                  +{isWinner ? 100 : 40} XP (+{(you?.stats.correctCount || 0) * 5} XP toán)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onExit}
              className="w-full h-10 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-sm rounded-lg transition-colors cursor-pointer"
            >
              Về màn hình chính
            </button>
          </div>
        </div>
      )}

      {/* INSPECTED TABLE CARD MODAL */}
      {inspectedTableCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setInspectedTableCard(null)}
        >
          <div
            className="relative w-full max-w-md flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInspectedTableCard(null)}
              aria-label="Đóng chi tiết thẻ"
              className="self-end w-8 h-8 bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:bg-[var(--bg-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <FlipCardReveal card={inspectedTableCard} autoFlip={false} size="lg" />
            <div className="text-center space-y-2">
              <p className="text-xs text-[var(--text-secondary)]">
                Chạm vào thẻ để lật xem hai mặt
              </p>
              <button
                type="button"
                onClick={() => setInspectedTableCard(null)}
                className="h-9 px-5 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--border-strong)] text-[var(--text-primary)] font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SURRENDER CONFIRMATION MODAL */}
      {showSurrenderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
          onClick={() => setShowSurrenderModal(false)}
        >
          <div
            className="bg-[var(--bg-surface)] border border-[var(--status-danger)] rounded-2xl max-w-md w-full p-6 text-center space-y-4"
            style={{ boxShadow: 'var(--shadow-panel)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-11 mx-auto rounded-xl bg-[var(--status-danger-subtle)] border border-[var(--status-danger)]/50 flex items-center justify-center text-[var(--status-danger)]">
              <Flag className="w-5 h-5" strokeWidth={1.5} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Xác nhận đầu hàng
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Bạn có chắc muốn đầu hàng ván này? Chiến thắng sẽ thuộc về{' '}
                <span className="font-medium text-[var(--text-primary)]">
                  {opponent?.name || 'đối thủ'}
                </span>{' '}
                và trận đấu kết thúc ngay lập tức
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSurrenderModal(false);
                  onSurrender();
                }}
                className="flex-1 h-10 px-4 rounded-lg bg-[var(--status-danger)] hover:opacity-90 text-white font-medium text-xs inline-flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
              >
                <Flag className="w-4 h-4" strokeWidth={1.5} />
                <span>Chấp nhận đầu hàng</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSurrenderModal(false)}
                className="flex-1 h-10 px-4 rounded-lg bg-[var(--bg-inset)] hover:bg-[var(--bg-raised)] text-[var(--text-primary)] font-medium text-xs border border-[var(--border-hairline)] transition-colors cursor-pointer"
              >
                Tiếp tục đấu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
