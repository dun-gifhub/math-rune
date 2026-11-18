import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../../shared/types.ts';
import { AvatarBadge } from './AvatarBadge.tsx';

interface LeaderboardViewProps {
  onBack: () => void;
  currentUserId?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onBack, currentUserId }) => {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'daily'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?filter=${filter}`)
      .then(res => res.json())
      .then(data => {
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch(e => console.warn('Failed to fetch leaderboard:', e))
      .finally(() => setLoading(false));
  }, [filter]);

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

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md text-xs text-[var(--text-secondary)]">
          <Trophy className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
          <span>Bảng xếp hạng thành tích</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          Bảng xếp hạng học viên
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xl">
          Xếp hạng theo điểm kỷ lục cao nhất và tỉ lệ thắng trong các trận đấu
        </p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'all', label: 'Tất cả thời gian' },
          { id: 'weekly', label: 'Tuần này' },
          { id: 'daily', label: 'Hôm nay' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as 'all' | 'weekly' | 'daily')}
            className={`h-9 px-4 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-fg)]'
                : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--bg-raised)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 bg-[var(--bg-inset)] border-b border-[var(--border-hairline)] text-xs font-medium text-[var(--text-muted)]">
          <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
          <div className="col-span-6 sm:col-span-6">Người chơi</div>
          <div className="col-span-2 sm:col-span-2 text-right">Tỉ lệ thắng</div>
          <div className="col-span-2 sm:col-span-3 text-right">Điểm kỷ lục</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)]">
            Đang đồng bộ thứ hạng...
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)]">
            Chưa có dữ liệu xếp hạng
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-hairline)]">
            {entries.map((entry, idx) => {
              const isCurrentUser = entry.userId === currentUserId;

              return (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-12 items-center px-4 py-3 text-xs ${
                    isCurrentUser
                      ? 'bg-[var(--accent-subtle)]'
                      : 'hover:bg-[var(--bg-raised)]/50'
                  }`}
                >
                  <div className="col-span-2 sm:col-span-1 text-center font-mono tabular-nums">
                    <span
                      className={`text-sm font-semibold ${
                        idx === 0
                          ? 'text-[var(--accent-text)]'
                          : idx < 3
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="col-span-6 sm:col-span-6 flex items-center gap-3 min-w-0">
                    <AvatarBadge avatar={entry.avatar} size="md" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-[var(--text-primary)] flex items-center gap-2 truncate">
                        <span className="truncate">{entry.username}</span>
                        {isCurrentUser && (
                          <span className="text-[11px] font-mono px-1.5 py-0.5 bg-[var(--accent)] text-[var(--accent-fg)] rounded shrink-0">
                            Bạn
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] font-mono tabular-nums">
                        Cấp {entry.level} · {entry.wins} thắng
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-2 text-right font-mono tabular-nums font-medium text-[var(--status-success)]">
                    {entry.winRate}%
                  </div>

                  <div className="col-span-2 sm:col-span-3 text-right font-mono tabular-nums font-semibold text-[var(--text-primary)] text-sm">
                    {entry.score}đ
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
