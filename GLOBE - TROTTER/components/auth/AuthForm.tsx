'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Compass, Loader2, ArrowRight, Mail, Lock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-slate-50 px-4 py-8">
      <div className="w-full max-w-[420px]">
        {/* Header / Brand */}
        <Link href="/" className="mb-6 flex flex-col items-center justify-center gap-2 group">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Compass size={26} strokeWidth={2.2} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">GlobeTrotter</span>
          <span className="text-xs text-slate-500 font-medium -mt-1">Empowering Personalized Travel Planning</span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/60">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isSignup ? 'Create Account ✨' : 'Welcome Back! 👋'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isSignup
                ? 'Join thousands of smart travelers worldwide.'
                : 'Login to continue your adventures.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full name</label>
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
                    placeholder="Jane Traveler"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email address</label>
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
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                {!isSignup && (
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); toast.info('Password reset instructions sent to email (Demo)'); }} className="text-xs font-medium text-blue-600 hover:underline">
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
