import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 'h-7 w-7', text: 'text-base', padding: 'p-1.5' },
  md: { icon: 'h-9 w-9', text: 'text-lg', padding: 'p-2' },
  lg: { icon: 'h-12 w-12', text: 'text-2xl', padding: 'p-3' },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 ${s.padding} shadow-lg shadow-primary-500/30`}>
        <Sparkles className={`${s.icon} text-white`} />
      </div>
      {showText && (
        <span className={`font-display font-bold ${s.text} text-slate-900 dark:text-white tracking-tight`}>
          AI Startup<span className="gradient-text-static"> Builder</span>
        </span>
      )}
    </div>
  );
}
