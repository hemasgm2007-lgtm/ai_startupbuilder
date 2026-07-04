import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Default avatar used when a new user has no custom avatar yet.
const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=33';

/** Map a Supabase auth user + profile row into our app's User type. */
function mapUser(authId: string, profile: {
  name: string | null;
  avatar_url: string | null;
  role: string | null;
  subscription: string | null;
  bio: string | null;
  created_at: string | null;
}, email: string | undefined): User {
  return {
    id: authId,
    name: profile.name ?? '',
    email: email ?? '',
    avatarUrl: profile.avatar_url ?? DEFAULT_AVATAR,
    role: (profile.role as User['role']) ?? 'user',
    subscription: (profile.subscription as User['subscription']) ?? 'free',
    bio: profile.bio ?? '',
    createdAt: profile.created_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /** Fetch the profile row for a given auth user id and build a User object. */
  const fetchUser = useCallback(async (authId: string, email?: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, avatar_url, role, subscription, bio, created_at')
      .eq('id', authId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load profile:', error.message);
      return null;
    }
    if (!profile) return null;
    return mapUser(authId, profile, email);
  }, []);

  // Restore session on mount and subscribe to auth state changes.
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session?.user) {
        const u = await fetchUser(session.user.id, session.user.email);
        if (mounted && u) setUser(u);
      }
      if (mounted) setLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const u = await fetchUser(session.user.id, session.user.email);
          if (mounted && u) setUser(u);
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) return { success: false, error: 'Email and password are required.' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    },
    [],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (!name || !email || !password) return { success: false, error: 'All fields are required.' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { success: false, error: error.message };
      if (!data.user) return { success: false, error: 'Sign-up failed. Please try again.' };

      // Create the profile row for the new user.
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        avatar_url: DEFAULT_AVATAR,
        role: 'user',
        subscription: 'free',
        bio: '',
      });
      if (profileError) {
        console.error('Failed to create profile:', profileError.message);
        return { success: false, error: 'Account created but profile setup failed. Please contact support.' };
      }

      const u = mapUser(data.user.id, {
        name,
        avatar_url: DEFAULT_AVATAR,
        role: 'user',
        subscription: 'free',
        bio: '',
        created_at: new Date().toISOString(),
      }, email);
      setUser(u);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return;
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatarUrl,
          bio: updates.bio,
          subscription: updates.subscription,
        })
        .eq('id', user.id);
      if (error) {
        console.error('Failed to update profile:', error.message);
        return;
      }
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, loading, login, register, logout, updateUser }),
    [user, loading, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
