'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type UserProfile = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar?: string;
  additionalInfo?: string;
  role: 'user' | 'admin';
};

export type SignUpPayload = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar?: string;
  additionalInfo?: string;
};

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (payload: SignUpPayload | string, email?: string, password?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

const STORAGE_KEY = 'gt_auth_user';

// Pre-seeded demo accounts — always work, no backend needed
const DEMO_ACCOUNTS: Record<string, UserProfile & { password: string }> = {
  'manthan@globetrotter.io': {
    id: 'demo-manthan',
    name: 'Manthan Saraiya',
    firstName: 'Manthan',
    lastName: 'Saraiya',
    email: 'manthan@globetrotter.io',
    phone: '+91 98765 12345',
    city: 'Ahmedabad',
    country: 'India',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    additionalInfo: 'Love mountain trekking, street food tours, and budget travel.',
    role: 'user',
    password: 'password123',
  },
  'alex@globetrotter.io': {
    id: 'demo-alex',
    name: 'Alex Nomad',
    firstName: 'Alex',
    lastName: 'Nomad',
    email: 'alex@globetrotter.io',
    phone: '+91 98765 12345',
    city: 'Ahmedabad',
    country: 'India',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    additionalInfo: 'Love mountain trekking, street food tours, and budget travel.',
    role: 'user',
    password: 'password123',
  },
  'sarah@globetrotter.io': {
    id: 'demo-sarah',
    name: 'Sarah Explorer',
    firstName: 'Sarah',
    lastName: 'Explorer',
    email: 'sarah@globetrotter.io',
    phone: '+1 415 555 2671',
    city: 'San Francisco',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    additionalInfo: 'Cultural heritage, art museums, luxury stays.',
    role: 'user',
    password: 'password123',
  },
  'admin@globetrotter.io': {
    id: 'demo-admin',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@globetrotter.io',
    phone: '+91 99999 00000',
    city: 'Mumbai',
    country: 'India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    additionalInfo: 'Platform administrator.',
    role: 'admin',
    password: 'admin123',
  },
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  refetchUser: async () => {},
});

function loadUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setUser(loadUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const key = email.trim().toLowerCase();
    const demo = DEMO_ACCOUNTS[key];

    // Check demo accounts first
    if (demo && demo.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...profile } = demo;
      saveUser(profile);
      setUser(profile);
      return {};
    }

    // Try localStorage-persisted registered accounts
    try {
      const allRaw = localStorage.getItem('gt_registered_users');
      const allUsers: Array<UserProfile & { password: string }> = allRaw ? JSON.parse(allRaw) : [];
      const found = allUsers.find((u) => u.email.toLowerCase() === key && u.password === password);
      if (found) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...profile } = found;
        saveUser(profile);
        setUser(profile);
        return {};
      }
    } catch {}

    // Fallback: try real API (if available)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        saveUser(data.user);
        setUser(data.user);
        return {};
      }
    } catch {}

    return { error: 'Invalid email or password. Try demo: alex@globetrotter.io / password123' };
  }, []);

  const signUp = useCallback(
    async (payload: SignUpPayload | string, emailArg?: string, passwordArg?: string) => {
      let profile: UserProfile & { password: string };

      if (typeof payload === 'string') {
        profile = {
          id: `user-${Date.now()}`,
          name: payload,
          email: emailArg || '',
          role: 'user',
          password: passwordArg || '',
        };
      } else {
        profile = {
          id: `user-${Date.now()}`,
          name: payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          city: payload.city,
          country: payload.country,
          avatar: payload.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
          additionalInfo: payload.additionalInfo,
          role: 'user',
          password: payload.password,
        };
      }

      if (!profile.email || !profile.password) {
        return { error: 'Email and password are required' };
      }

      // Persist to localStorage registry
      try {
        const allRaw = localStorage.getItem('gt_registered_users');
        const allUsers: Array<UserProfile & { password: string }> = allRaw ? JSON.parse(allRaw) : [];
        // Check duplicate
        const exists = allUsers.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
        if (exists) {
          return { error: 'An account with this email already exists' };
        }
        allUsers.push(profile);
        localStorage.setItem('gt_registered_users', JSON.stringify(allUsers));
      } catch {}

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...cleanProfile } = profile;
      saveUser(cleanProfile);
      setUser(cleanProfile);
      return {};
    },
    []
  );

  const signOut = useCallback(async () => {
    saveUser(null);
    setUser(null);
    window.location.href = '/login';
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
