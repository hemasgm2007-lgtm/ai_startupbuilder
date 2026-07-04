import type { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'accent';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
  success: 'bg-success-500/10 text-success-600 dark:text-success-400 border-success-500/20',
  warning: 'bg-warning-500/10 text-warning-600 dark:text-warning-400 border-warning-500/20',
  error: 'bg-error-500/10 text-error-600 dark:text-error-400 border-error-500/20',
  neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  accent: 'bg-accent-500/10 text-accent-600 dark:text-accent-400 border-accent-500/20',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
