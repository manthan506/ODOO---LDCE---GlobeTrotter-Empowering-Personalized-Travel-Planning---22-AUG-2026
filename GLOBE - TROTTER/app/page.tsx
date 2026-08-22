'use client';

import { Compass, ArrowRight, Sparkles, MapPin, Shield, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Hero Image matching Screen 1 artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85"
          alt="GlobeTrotter Alpine Landscape"
          className="h-full w-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 mx-auto w-full max-w-5xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600/90 backdrop-blur-md text-white shadow-lg shadow-blue-500/30">
            <Compass size={22} strokeWidth={2.2} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">GlobeTrotter</span>
        </div>

        <Link
          href="/community"
          className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/25 transition"
        >
          Explore Community Trips 🌍
        </Link>
      </header>

      {/* Center / Hero Branding matching Screen 1 (Welcome Screen) */}
      <div className="relative z-10 mx-auto w-full max-w-lg px-6 py-12 text-center my-auto flex flex-col items-center">
        {/* Globe Icon */}
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/40 mb-5 animate-in zoom-in-50 duration-500">
          <Compass size={36} strokeWidth={2.2} className="animate-spin-slow" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          GlobeTrotter
        </h1>
        <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium max-w-sm">
          Empowering Personalized Travel Planning
        </p>

        {/* Feature Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
            ✨ Multi-City Routes
          </span>
          <span className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
            📊 Live ₹ Budget Tracker
          </span>
          <span className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white">
            👥 Split Expenses
          </span>
        </div>

        {/* CTA Buttons (Screen 1: Get Started & Login) */}
        <div className="mt-8 w-full max-w-xs space-y-3">
          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:opacity-95 active:scale-[0.99]"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.99]"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-white/50">
        GlobeTrotter • Hackathon Edition 2026 • Native Next.js & MongoDB
      </footer>
    </main>
  );
}
