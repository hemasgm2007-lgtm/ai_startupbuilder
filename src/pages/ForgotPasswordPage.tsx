import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError(undefined);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    showToast('success', 'Reset link sent to your email.');
  };

  return (
    <AuthLayout onNavigate={onNavigate} title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex rounded-2xl bg-success-500/10 p-4 text-success-500 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white">Check your email</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We've sent a password reset link to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>.
            The link will expire in 30 minutes.
          </p>
          <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-left">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Demo: your reset link</p>
            <p className="text-sm font-mono text-primary-600 dark:text-primary-400 break-all">
              https://aistartupbuilder.app/reset?token=mock_reset_token_xyz123
            </p>
          </div>
          <Button variant="outline" fullWidth className="mt-6" onClick={() => onNavigate('/login')}>
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leftIcon={<Mail className="h-4 w-4" />}
            autoComplete="email"
          />
          <Button type="submit" fullWidth loading={loading}>
            Send reset link
          </Button>
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="w-full text-center text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Back to sign in
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
