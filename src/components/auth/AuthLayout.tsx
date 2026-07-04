import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
  onNavigate: (path: string) => void;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, onNavigate, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <button onClick={() => onNavigate('/')} className="focus-ring rounded-lg w-fit">
            <Logo size="md" showText={false} />
          </button>
          <div>
            <h2 className="text-4xl font-display font-bold leading-tight max-w-md">
              Turn your idea into an investor-ready business plan.
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-md">
              14 AI-generated modules. Financial forecasts. Pitch decks. All in minutes.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[47, 15, 32, 20].map((id) => (
                  <img
                    key={id}
                    src={`https://i.pravatar.cc/150?img=${id}`}
                    alt=""
                    className="h-10 w-10 rounded-full ring-2 ring-white/50"
                    loading="lazy"
                  />
                ))}
              </div>
              <p className="text-sm text-white/80">Joined by 12,000+ founders</p>
            </div>
          </div>
          <p className="text-sm text-white/60">© {new Date().getFullYear()} AI Startup Builder</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus-ring rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </button>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-8 flex justify-center">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
