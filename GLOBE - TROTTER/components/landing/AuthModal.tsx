'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTripSync } from '@/context/TripSyncContext';
import { Compass, X, ArrowRight, Lock, Mail, User, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  redirectPath?: string;
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin', redirectPath = '/dashboard' }: AuthModalProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { updateUserProfile } = useTripSync();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'signup') {
      const res = await signUp(name || 'Traveler', email, password);
      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      updateUserProfile({ name: name || 'Traveler', email });
      toast.success('Account created successfully! Welcome to GlobeTrotter.');
    } else {
      const res = await signIn(email, password);
      if (res?.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      toast.success('Signed in successfully!');
    }

    setLoading(false);
    onClose();
    router.push(redirectPath);
  };

  const handleDemoQuickLogin = async () => {
    setLoading(true);
    // Instant demo login
    updateUserProfile({
      name: 'Manthan Saraiya',
      email: 'manthan@globetrotter.io',
      location: 'Ahmedabad, India',
    });
    const res = await signIn('manthan@globetrotter.io', 'demo123456');
    toast.success('Signed in as Demo Traveler: Manthan Saraiya! 🚀');
    setLoading(false);
    onClose();
    router.push(redirectPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Top Logo & Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
            <Compass size={26} strokeWidth={2.2} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            {mode === 'signin' ? 'Sign In to GlobeTrotter' : 'Create Your Travel Account'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {mode === 'signin'
              ? 'Access your personalized multi-city trips & ₹ INR budget tracker.'
              : 'Join 25,000+ travelers planning unforgettable journeys.'}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Sign Up) */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition cursor-pointer ${
              mode === 'signin' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition cursor-pointer ${
              mode === 'signup' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                <User size={15} className="text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manthan Saraiya"
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Mail size={15} className="text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Lock size={15} className="text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/25 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <span>Create Account & Continue</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Login for Video Recording */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoQuickLogin}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>⚡ 1-Click Instant Demo Login (Manthan)</span>
          </button>

          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            Demo mode automatically connects all 13 synchronized features.
          </p>
        </div>
      </div>
    </div>
  );
}
