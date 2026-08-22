'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Compass, Loader2, ArrowRight, Mail, Lock, User as UserIcon, Zap, Camera, Phone, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const { signIn, refetchUser } = useAuth();

  // Registration Screen (Screen 2) fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
  );

  // Login Screen (Screen 1) fields
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            country,
            additionalInfo,
            photoUrl,
            password,
          }),
          credentials: 'include',
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || 'Registration failed');
          return;
        }

        toast.success('Registration successful — welcome to GlobeTrotter!');
        await refetchUser();
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50/60 via-slate-50 to-white px-4 py-10">
      <div className={`w-full ${isSignup ? 'max-w-[560px]' : 'max-w-[420px]'}`}>
        
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
              <Compass size={24} strokeWidth={2.3} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              GlobeTrotter
            </span>
          </Link>
          <h2 className="mt-3 text-xl font-black tracking-tight text-slate-900">
            {isSignup ? 'Registration Screen (Screen 2)' : 'Login Screen (Screen 1)'}
          </h2>
          <p className="text-xs text-slate-500">
            {isSignup
              ? 'Create your personalized travel profile and itinerary planner'
              : 'Sign in to access your itineraries, budgets, and saved journeys'}
          </p>
        </div>

        {/* 1-Click Instant Demo Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin('demo')}
          disabled={!!socialLoading}
          className="mb-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-60"
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

        {/* Auth Card matching Excalidraw Wireframe */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">
          
          {/* Top Avatar Photo Circle (Excalidraw Photo Circle) */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full border-2 border-slate-300 overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white text-[10px] font-bold border border-white shadow-xs">
                <Camera size={12} />
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-1.5 uppercase tracking-wider">Photo</span>

            {isSignup && (
              <div className="flex items-center gap-2 mt-2">
                {sampleAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    className={`h-7 w-7 rounded-full border-2 overflow-hidden transition ${
                      photoUrl === url ? 'border-blue-600 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="avatar" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* SCREEN 2: REGISTRATION SCREEN 2-COLUMN INPUT BOX */}
            {isSignup ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3.5">
                
                {/* First Name & Last Name (Row 1) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name</label>
                    <input
                      required
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      required
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Email Address & Phone Number (Row 2) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* City & Country (Row 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password (min 6 chars)"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Additional Information .... (Row 4) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Additional Information ....</label>
                  <textarea
                    rows={3}
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Travel preferences, dietary restrictions, preferred destinations..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
              </div>
            ) : (
              /* SCREEN 1: LOGIN SCREEN */
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username / Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Username / Email"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info('Demo password reset: Enter email to receive instructions');
                      }}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button matching Excalidraw ("Login Button" or "Register Users") */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-blue-500/25 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {isSignup ? 'Register Users' : 'Login Button'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
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
