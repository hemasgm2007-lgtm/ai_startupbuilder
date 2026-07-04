import { Lock, Mail, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { GoogleButton } from '../components/auth/GoogleButton';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; agree?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    if (!agree) e.agree = 'You must accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      showToast('success', 'Account created! Welcome to AI Startup Builder.');
      onNavigate('/dashboard');
    } else {
      showToast('error', result.error || 'Registration failed');
    }
  };

  const handleGoogle = () => {
    showToast('info', 'Google sign-in is a placeholder in this demo.');
  };

  return (
    <AuthLayout onNavigate={onNavigate} title="Create your account" subtitle="Start building your startup for free. No credit card required.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          type="text"
          name="name"
          placeholder="Alex Morgan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          leftIcon={<User className="h-4 w-4" />}
          autoComplete="name"
        />
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirm"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />
        <div>
          <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-primary-500 focus:ring-primary-500/50"
            />
            <span>
              I agree to the{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
            </span>
          </label>
          {errors.agree && <p className="mt-1.5 text-xs text-error-500 dark:text-error-400">{errors.agree}</p>}
        </div>
        <Button type="submit" fullWidth loading={loading}>
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs text-slate-400 dark:text-slate-500">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      <GoogleButton onClick={handleGoogle} label="Sign up with Google" />

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <button onClick={() => onNavigate('/login')} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
