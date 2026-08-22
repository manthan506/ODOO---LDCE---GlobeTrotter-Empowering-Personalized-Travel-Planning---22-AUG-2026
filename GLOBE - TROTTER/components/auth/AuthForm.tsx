'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Compass, Loader2, ArrowRight, Mail, Lock, User as UserIcon, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const { signIn, signUp, refetchUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }
        const res = await signUp(name, email, password);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success('Account created — welcome to GlobeTrotter!');
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success('Welcome back!');
      }
      router.push(redirectTarget);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'demo') => {
    setSocialLoading(provider);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Logged in as ${data.user.name} via ${provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : 'Demo'}!`);
        await refetchUser();
        router.push(redirectTarget);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-slate-50 px-4 py-8">
      <div className="w-full max-w-[420px]">
        {/* Header / Brand */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
              <Compass size={28} strokeWidth={2.2} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              GlobeTrotter
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
            {isSignup ? 'Create your account' : 'Welcome back, traveler'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {isSignup
              ? 'Start designing your personalized multi-city journey'
              : 'Sign in to access your itineraries and budgets'}
          </p>
        </div>

        {/* 1-Click Instant Demo Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin('demo')}
          disabled={!!socialLoading}
          className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-60"
        >
          {socialLoading === 'demo' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Zap size={16} className="fill-current text-slate-950" />
              ⚡ Instant 1-Click Demo Login (Alex Traveler)
            </>
          )}
        </button>

        {/* Auth Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <UserIcon size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="Alex Traveler"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="alex@globetrotter.io"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {!isSignup && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Password reset instructions sent to email (Demo)');
                    }}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Get Started' : 'Login'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Auth 1-Click Action Buttons */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400">
              <span className="bg-white px-2">or 1-click continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <Loader2 size={14} className="animate-spin text-blue-600" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.55 0 2.95.55 4.04 1.45l3.03-3.03C17.24 1.7 14.78 1 12 1 7.42 1 3.52 3.61 1.63 7.42l3.67 2.85C6.18 7.37 8.84 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.69 2.86c2.16-1.99 3.41-4.92 3.41-8.67z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.73c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13L1.63 7.62C.59 9.69 0 12.02 0 14.5s.59 4.81 1.63 6.88l3.67-2.85c-.23-.6-.35-1.2-.35-1.8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.69-2.86c-1.07.72-2.45 1.16-4.24 1.16-3.16 0-5.82-2.37-6.7-5.27L1.63 15.97C3.52 19.79 7.42 22.4 12 22.4z"
                  />
                </svg>
              )}
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              disabled={!!socialLoading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
            >
              {socialLoading === 'apple' ? (
                <Loader2 size={14} className="animate-spin text-slate-900" />
              ) : (
                <svg className="h-4 w-4 fill-current text-slate-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.77-.98 2.82 1.07.08 2.15-.56 2.77-1.39z" />
                </svg>
              )}
              Apple
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              href={isSignup ? '/login' : '/signup'}
              className="font-bold text-blue-600 hover:underline"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
