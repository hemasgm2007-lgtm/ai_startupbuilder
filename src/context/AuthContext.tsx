import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { SAMPLE_USER } from '../data/mockData';
import { STORAGE_KEYS } from '../utils/constants';
import { uid } from '../utils/helpers';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock auth: any email + password (min 6 chars) succeeds. The sample user is
// returned so the dashboard has realistic data to render. Replace with a real
// Supabase auth call later — the context contract stays the same.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    }
  }, []);

  const persist = useCallback((u: User | null) => {
    if (u) localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUser(u);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await new Promise((r) => setTimeout(r, 600));
      if (!email || !password) return { success: false, error: 'Email and password are required.' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
      const loggedIn: User = { ...SAMPLE_USER, email, id: uid() };
      persist(loggedIn);
      return { success: true };
    },
    [persist],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await new Promise((r) => setTimeout(r, 800));
      if (!name || !email || !password) return { success: false, error: 'All fields are required.' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
      const newUser: User = {
        ...SAMPLE_USER,
        name,
        email,
        id: uid(),
        role: 'user',
        subscription: 'free',
        createdAt: new Date().toISOString(),
      };
      persist(newUser);
      return { success: true };
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const updateUser = useCallback(
    (updates: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...updates };
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, register, logout, updateUser }),
    [user, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
