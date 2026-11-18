import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  Coins,
  HelpCircle,
  Layers,
  Swords,
  Trophy,
  Lightbulb,
  ExternalLink,
  GraduationCap,
  Bot,
  Globe,
  BookOpen,
} from 'lucide-react';
import { MATH_DOMAINS } from '../../shared/cards.ts';
import { ALL_RUNES } from '../../shared/runes.ts';
import { RuneIcon } from './RuneIcon.tsx';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideLink?: string;
}

type TabType = 'rules' | 'domains' | 'runes' | 'modes' | 'tips';

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  guideLink = '',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('rules');

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'rules', label: '1. Luật cốt lõi', icon: HelpCircle },
    { id: 'domains', label: '2. 10 phân môn', icon: Layers },
    { id: 'runes', label: '3. 16 cổ ngữ', icon: ShieldCheck },
    { id: 'modes', label: '4. Chế độ đấu', icon: Swords },
    { id: 'tips', label: '5. Chiến thuật', icon: Lightbulb },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl p-4 sm:p-6 text-[var(--text-primary)] max-h-[92vh] flex flex-col gap-4"
        style={{ boxShadow: 'var(--shadow-panel)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-inset)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--accent-text)] shrink-0">
              <GraduationCap className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                Cẩm nang hướng dẫn Math Rune
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Luật chơi Push-Your-Luck, 10 phân môn toán học và 16 cổ ngữ hỗ trợ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cẩm nang"
            className="w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {guideLink && (
          <div className="p-3 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[var(--accent-text)] shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  Tài liệu hướng dẫn từ ban quản trị
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Xem tài liệu chuyên sâu hoặc hướng dẫn đính kèm bên ngoài
                </div>
              </div>
            </div>
            <a
              href={guideLink}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Xem tài liệu</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        )}

        <div className="flex items-center gap-1 p-1 bg-[var(--bg-inset)] border border-[var(--border-hairline)] rounded-xl overflow-x-auto shrink-0">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`h-8 px-3 text-xs font-medium rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--accent)] flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent)]/40 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Mục tiêu chiến thắng: Đạt 150 điểm an toàn
                  </h3>
                  <p className="mt-1">
                    Hai người chơi thi đấu luân phiên theo lượt. Người đầu tiên tích lũy đủ <span className="font-mono tabular-nums font-medium text-[var(--text-primary)]">150 điểm</span> trong kho lưu trữ an toàn sẽ giành chiến thắng chung cuộc
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-2">
                <h4 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--accent-text)] flex items-center justify-center text-xs font-mono tabular-nums">
                    1
                  </span>
                  <span>Rút thẻ tri thức và xem 2 mặt thẻ</span>
                </h4>
                <p>
                  Khi đến lượt, nhấn nút <span className="font-medium text-[var(--text-primary)]">Rút thẻ tri thức</span> để mở ngẫu nhiên một thẻ từ bộ 60 thẻ toán học. Bạn có thể chạm trực tiếp vào thẻ để lật xem mặt trước và mặt sau kỹ năng
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-2">
                <h4 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--accent-text)] flex items-center justify-center text-xs font-mono tabular-nums">
                    2
                  </span>
                  <span>Giải toán trong thời gian giới hạn</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium text-[var(--status-success)]">Giải đúng:</span> Thẻ được đặt lên bàn và điểm số từ 5 đến 30 được cộng vào điểm tạm thời của lượt
                  </li>
                  <li>
                    <span className="font-medium text-[var(--status-danger)]">Hết giờ hoặc trả lời sai:</span> Mất lượt rút hiện tại và chuyển lượt cho đối thủ (trừ khi có cổ ngữ Sửa sai)
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[var(--status-danger-subtle)] rounded-xl border border-[var(--status-danger)]/50 space-y-2">
                <h4 className="font-semibold text-[var(--status-danger)] text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>Cơ chế BUST (rút trùng phân môn)</span>
                </h4>
                <p className="text-[var(--text-primary)]">
                  Nếu rút phải một thẻ có cùng phân môn toán học với thẻ đã nằm trên bàn trong lượt đó, bạn bị BUST. Toàn bộ điểm tạm thời của lượt này về 0 và quyền đi chuyển sang đối thủ
                </p>
              </div>

              <div className="p-4 bg-[var(--status-success-subtle)] rounded-xl border border-[var(--status-success)]/50 space-y-2">
                <h4 className="font-semibold text-[var(--status-success)] text-sm flex items-center gap-2">
                  <Coins className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>Bấm BANK để chốt điểm an toàn</span>
                </h4>
                <p className="text-[var(--text-primary)]">
                  Sau khi giải đúng ít nhất 1 thẻ và chưa bị BUST, bạn có thể bấm BANK để chuyển toàn bộ điểm lượt vào Kho an toàn vĩnh viễn và nhường lượt cho đối thủ
                </p>
              </div>
            </div>
          )}

          {activeTab === 'domains' && (
            <div className="space-y-3">
              <div className="p-3 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)]">
                Kho bài gồm <span className="font-mono tabular-nums font-medium text-[var(--text-primary)]">60 thẻ</span> chia đều cho 10 phân môn toán học (mỗi phân môn gồm 3 Common, 1 Rare, 1 Epic, 1 Legendary)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(MATH_DOMAINS).map(([key, dom]) => (
                  <div
                    key={key}
                    className="p-3 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] flex items-start gap-3"
                  >
                    <div
                      style={{ borderColor: `${dom.color}66`, color: dom.color }}
                      className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border flex items-center justify-center shrink-0"
                    >
                      <RuneIcon icon={dom.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-[var(--text-primary)] text-xs">
                          {dom.nameVi}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          ({dom.name})
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                        {dom.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'runes' && (
            <div className="space-y-3">
              <div className="p-3 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)]">
                Trước mỗi trận đấu, mỗi bên được chia 2 cổ ngữ ngẫu nhiên để chọn giữ lại 1 cổ ngữ đồng hành suốt trận
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_RUNES.map(r => (
                  <div
                    key={r.id}
                    className="p-3 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] flex items-start gap-3"
                  >
                    <div
                      style={{ borderColor: `${r.color}66`, color: r.color }}
                      className="w-9 h-9 rounded-lg bg-[var(--bg-surface)] border flex items-center justify-center shrink-0"
                    >
                      <RuneIcon icon={r.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[var(--text-primary)] text-xs">
                          {r.name}
                        </span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--accent-text)]">
                          {r.limitType === 'once_per_match'
                            ? '1 lần/trận'
                            : r.limitType === 'once_per_turn'
                            ? '1 lần/lượt'
                            : 'Liên tục'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                        {r.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'modes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <Bot className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                  <h4 className="font-semibold text-sm">Đấu trí cùng AI (4 cấp độ)</h4>
                </div>
                <p>
                  Luyện tập từ cấp độ cơ bản đến nâng cao cùng 4 cấp độ AI: Tập sự, Chiến lược, Học giả và Đại sư
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-2">
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <Globe className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                  <h4 className="font-semibold text-sm">Đấu trực tuyến thời gian thực</h4>
                </div>
                <p>
                  Ghép trận ngẫu nhiên hoặc tạo phòng riêng bằng mã mời để thi đấu trực tiếp cùng bạn bè qua WebSocket
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-1.5">
                <h4 className="font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[var(--accent-text)]" strokeWidth={1.5} />
                  <span>Quan sát thanh rủi ro BUST</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-mono tabular-nums font-medium text-[var(--text-primary)]">0% - 20%</span> (1-2 thẻ trên bàn): Vùng an toàn, có thể rút tiếp để tăng điểm lượt
                  </li>
                  <li>
                    <span className="font-mono tabular-nums font-medium text-[var(--text-primary)]">30% - 40%</span> (3-4 thẻ trên bàn): Bắt đầu có xác suất trùng hệ đáng kể, cân nhắc bấm BANK nếu đã có từ 25 điểm
                  </li>
                  <li>
                    <span className="font-mono tabular-nums font-medium text-[var(--text-primary)]">Từ 50% trở lên</span> (5+ thẻ): Nguy cơ BUST cao, nên bấm BANK trừ khi đang giữ Khiên hộ mệnh
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[var(--bg-inset)] rounded-xl border border-[var(--border-hairline)] space-y-1.5">
                <h4 className="font-semibold text-[var(--text-primary)] text-sm">
                  Giữ nhịp tích lũy ổn định
                </h4>
                <p>
                  Chốt đều 15–25 điểm mỗi lượt thường mang lại tỷ lệ thắng cao hơn so với mạo hiểm kéo dài sang thẻ thứ 5 hoặc thứ 6
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)] hidden sm:block">
            Chọn từng mục ở trên để tra cứu nhanh khi thi đấu
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-9 px-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-medium text-xs rounded-lg transition-colors cursor-pointer ml-auto"
          >
            Đã hiểu hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
