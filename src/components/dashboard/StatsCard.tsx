import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  primary: 'stats-card-primary',
  success: 'stats-card-success',
  warning: 'stats-card-warning',
  info: 'stats-card-info',
  danger: 'stats-card-danger',
};

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'primary', trend }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('stats-card', variantStyles[variant])}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-80">{subtitle}</p>
          )}
          {trend && (
            <p className={cn('text-sm font-medium', trend.isPositive ? 'opacity-90' : 'opacity-80')}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white/20 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {/* Decorative pattern */}
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-white/10" />
    </motion.div>
  );
}
