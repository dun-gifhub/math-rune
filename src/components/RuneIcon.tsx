import React from 'react';
import {
  ShieldAlert,
  Shield,
  Lock,
  RotateCcw,
  Snowflake,
  Zap,
  Clock,
  Shuffle,
  Sparkles,
  Coins,
  Award,
  Flame,
  Eye,
  Feather,
  Swords,
  Crown,
  HelpCircle,
  Box,
  Compass,
  SquareDot,
  MinusCircle,
  Divide,
  Layers,
  GitFork,
  TrendingUp,
  Activity,
  Key,
  CircleDot,
  Binary,
  Dice6,
} from 'lucide-react';

interface RuneIconProps {
  icon: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties; strokeWidth?: number }>> = {
  ShieldAlert,
  Shield,
  Lock,
  RotateCcw,
  Snowflake,
  Zap,
  Clock,
  Shuffle,
  Sparkles,
  Coins,
  Award,
  Flame,
  Eye,
  Feather,
  Swords,
  Crown,
  Box,
  Compass,
  SquareDot,
  MinusCircle,
  Divide,
  Layers,
  GitFork,
  TrendingUp,
  Activity,
  Key,
  CircleDot,
  Binary,
  Dice6,
};

export const RuneIcon: React.FC<RuneIconProps> = ({
  icon,
  className = 'w-4 h-4',
  size,
  style,
}) => {
  const IconComponent = ICON_MAP[icon] || HelpCircle;
  return <IconComponent className={className} size={size} style={style} strokeWidth={1.5} />;
};
