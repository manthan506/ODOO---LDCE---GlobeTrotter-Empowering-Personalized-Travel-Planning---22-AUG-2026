'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  refetchUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Failed to login' };
      }

      setUser(data.user);
      return {};
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'Network error during sign in' };
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Failed to sign up' };
      }

      setUser(data.user);
      return {};
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: 'Network error during sign up' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/me', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('Sign out error:', err);
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
