import { Lock, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { GoogleButton } from '../components/auth/GoogleButton';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      showToast('success', 'Welcome back! Redirecting to dashboard...');
      onNavigate('/dashboard');
    } else {
      showToast('error', result.error || 'Login failed');
    }
  };

  const handleGoogle = () => {
    showToast('info', 'Google sign-in is a placeholder in this demo.');
  };

  return (
    <AuthLayout onNavigate={onNavigate} title="Welcome back" subtitle="Sign in to your account to continue building.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-primary-500 focus:ring-primary-500/50" />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => onNavigate('/forgot-password')}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <Button type="submit" fullWidth loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs text-slate-400 dark:text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      <GoogleButton onClick={handleGoogle} label="Continue with Google" />

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <button onClick={() => onNavigate('/register')} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Sign up free
        </button>
      </p>
    </AuthLayout>
  );
}
