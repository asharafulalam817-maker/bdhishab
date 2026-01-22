import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'primary';
}

export function QuickActionButton({ label, icon: Icon, onClick, variant = 'default' }: QuickActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'quick-action-btn w-full justify-center sm:justify-start',
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </motion.button>
  );
}
