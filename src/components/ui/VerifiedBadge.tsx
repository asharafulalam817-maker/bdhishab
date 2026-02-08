import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VerifiedBadge({ className, size = 'md' }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg 
      viewBox="0 0 22 22" 
      className={cn(sizeClasses[size], 'flex-shrink-0', className)}
      fill="none"
      aria-label="Verified"
    >
      <circle cx="11" cy="11" r="11" fill="#1DA1F2"/>
      <path 
        d="M9.5 12.5L7.5 10.5L6.5 11.5L9.5 14.5L15.5 8.5L14.5 7.5L9.5 12.5Z" 
        fill="white"
      />
    </svg>
  );
}
