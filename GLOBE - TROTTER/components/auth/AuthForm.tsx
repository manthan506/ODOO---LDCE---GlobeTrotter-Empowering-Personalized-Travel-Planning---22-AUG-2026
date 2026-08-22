'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight, Loader2, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    if (isSignup && !name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signUp(email.trim(), password, name.trim());
        toast.success('Account created successfully! Welcome to GlobeTrotter.');
      } else {
        await signIn(email.trim(), password);
        toast.success('Welcome back!');
      }
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || (isSignup ? 'Signup failed' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      // Demo credentials for judges / video exhibition
      try {
        await signIn('demo@globetrotter.io', 'DemoPass123!');
        toast.success('Logged in with Exhibition Demo Account ✨');
      } catch {
        // If demo user doesn't exist yet in DB, sign them up automatically
        await signUp('demo@globetrotter.io', 'DemoPass123!', 'Exhibition Demo Traveler');
        toast.success('Created & logged into Exhibition Demo Account ✨');
      }
      router.push('/dashboard');
    } catch (err: any) {
      toast.error('Demo login error. Please create a standard account.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            <Compass size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            GlobeTrotter
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Empowering Personalized Travel Planning
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isSignup ? 'Create Your Account ✨' : 'Welcome Back! 👋'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isSignup
                ? 'Sign up for a clean, personalized travel planner'
                : 'Login to access your saved trips and workspaces'}
            </p>
          </div>

          {/* Exhibition / Judges 1-Click Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/60 hover:bg-blue-50 p-3 text-xs font-bold text-blue-700 transition active:scale-98 disabled:opacity-50"
          >
            {demoLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} className="text-blue-600" />
            )}
            <span>✨ Exhibition & Judges Demo Account (1-Click)</span>
          </button>

          <div className="relative flex items-center justify-center text-xs text-slate-400">
            <div className="w-full border-t border-slate-100" />
            <span className="bg-white px-2 uppercase tracking-wider text-[10px] font-bold text-slate-400">
              or use your credentials
            </span>
            <div className="w-full border-t border-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. Manthan Saraiya"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  placeholder={isSignup ? 'At least 6 characters' : 'Enter your password'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
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
