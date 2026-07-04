import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, hover, glass, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border ${glass ? 'glass' : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'} ${hover ? 'card-hover' : ''} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-display font-semibold text-slate-900 dark:text-white ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>{children}</p>;
}
