import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Target } from 'lucide-react';
import { sound } from '../utils/soundEffects.ts';

interface Quest {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export const DailyChallengeWidget: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'q1',
      title: 'Giải đúng 5 câu hỏi toán học',
      target: 5,
      current: 3,
      rewardXp: 120,
      completed: false,
      claimed: false,
    },
    {
      id: 'q2',
      title: 'Đạt mốc 250 điểm trong một ván',
      target: 250,
      current: 180,
      rewardXp: 200,
      completed: false,
      claimed: false,
    },
    {
      id: 'q3',
      title: 'Hoàn thành 3 lần Bank an toàn',
      target: 3,
      current: 3,
      rewardXp: 150,
      completed: true,
      claimed: false,
    },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mathrune_daily_quests_v1');
      if (saved) {
        setQuests(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleClaim = (questId: string) => {
    sound.playCorrect();
    setQuests(prev => {
      const updated = prev.map(q => (q.id === questId ? { ...q, claimed: true } : q));
      try {
        localStorage.setItem('mathrune_daily_quests_v1', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-2xl p-4 select-none">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
            <Target className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              Nhiệm vụ trong ngày
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              Hoàn thành mục tiêu để nhận thêm XP
            </div>
          </div>
        </div>

        <span className="text-[var(--text-muted)] p-1">
          {collapsed ? (
            <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronUp className="w-4 h-4" strokeWidth={1.5} />
          )}
        </span>
      </button>

      {!collapsed && (
        <div className="mt-4 space-y-2 pt-3 border-t border-[var(--border-hairline)]">
          {quests.map(quest => {
            const progress = Math.min(100, Math.round((quest.current / quest.target) * 100));
            return (
              <div
                key={quest.id}
                className="p-3 rounded-xl bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                    {quest.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--status-success)] shrink-0" strokeWidth={1.5} />
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" strokeWidth={1.5} />
                    )}
                    <span className="truncate">{quest.title}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${progress}%`,
                          backgroundColor: quest.completed ? 'var(--status-success)' : 'var(--accent)',
                        }}
                        className="h-full rounded-full transition-[width] duration-300"
                      />
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[var(--text-muted)]">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {quest.completed ? (
                    quest.claimed ? (
                      <span className="text-xs font-mono text-[var(--text-muted)]">Đã nhận</span>
                    ) : (
                      <button
                        onClick={() => handleClaim(quest.id)}
                        className="px-2.5 py-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-mono tabular-nums font-medium text-xs rounded-lg transition-colors duration-150"
                      >
                        Nhận +{quest.rewardXp} XP
                      </button>
                    )
                  ) : (
                    <span className="text-xs font-mono tabular-nums text-[var(--text-secondary)]">
                      +{quest.rewardXp} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
