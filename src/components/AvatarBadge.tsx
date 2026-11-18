import React from 'react';
import {
  Sparkles,
  Leaf,
  Eye,
  Zap,
  Flame,
  Star,
  Compass,
  Feather,
  Moon,
  Swords,
  Crown,
  Shield,
  Award,
  Gem,
  Sun,
  Key,
  BookOpen,
  User,
} from 'lucide-react';

interface AvatarBadgeProps {
  avatar?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AVATAR_ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  '🧙‍♂️': BookOpen,
  '🧝‍♀️': Leaf,
  '🔮': Eye,
  '⚡': Zap,
  '🐉': Flame,
  '✨': Sparkles,
  '🦊': Compass,
  '🦅': Feather,
  '🦉': Moon,
  '⚔️': Swords,
  '👑': Crown,
  '🦄': Star,
  '🐲': Shield,
  '💎': Gem,
  '🌟': Sun,
  '🔱': Key,
  '🦁': Award,
  '🧞‍♂️': User,
};

const AVATAR_LABEL_MAP: Record<string, string> = {
  '🧙‍♂️': 'Học giả',
  '🧝‍♀️': 'Thảo mộc',
  '🔮': 'Quan sát',
  '⚡': 'Tia chớp',
  '🐉': 'Hỏa long',
  '✨': 'Tinh tú',
  '🦊': 'La bàn',
  '🦅': 'Lông vũ',
  '🦉': 'Cú đêm',
  '⚔️': 'Song kiếm',
  '👑': 'Vương miện',
  '🦄': 'Bắc đẩu',
  '🐲': 'Hộ thuẫn',
  '💎': 'Kim cương',
  '🌟': 'Thái dương',
  '🔱': 'Chìa khóa',
  '🦁': 'Huy chương',
  '🧞‍♂️': 'Ẩn sĩ',
};

export function getAvatarLabel(avatar: string): string {
  return AVATAR_LABEL_MAP[avatar] || 'Học viên';
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatar = '🧙‍♂️',
  size = 'md',
  className = '',
}) => {
  const Icon = AVATAR_ICON_MAP[avatar] || User;

  const boxSize =
    size === 'sm'
      ? 'w-7 h-7 rounded-lg'
      : size === 'md'
      ? 'w-9 h-9 rounded-lg'
      : size === 'lg'
      ? 'w-12 h-12 rounded-xl'
      : 'w-16 h-16 rounded-xl';

  const iconSize =
    size === 'sm'
      ? 'w-4 h-4'
      : size === 'md'
      ? 'w-4 h-4'
      : size === 'lg'
      ? 'w-5 h-5'
      : 'w-7 h-7';

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] ${boxSize} ${className}`}
      aria-label={getAvatarLabel(avatar)}
    >
      <Icon className={iconSize} strokeWidth={1.5} />
    </span>
  );
};
