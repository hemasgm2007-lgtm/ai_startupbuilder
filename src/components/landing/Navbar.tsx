import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  onNavigate: (path: string) => void;
  onLogin: () => void;
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({ onNavigate, onLogin }: NavbarProps) {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass border-b border-white/10 dark:border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate('/')} className="focus-ring rounded-lg">
          <Logo size="md" />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onLogin} className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button size="sm" onClick={() => onNavigate('/register')} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Get Started
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
