'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function LandingCTA({ onOpenAuth }: { onOpenAuth?: (mode?: 'signin' | 'signup') => void }) {
  const { user } = useAuth();

  const handleCtaClick = (e: React.MouseEvent) => {
    if (!user && onOpenAuth) {
      e.preventDefault();
      onOpenAuth('signup');
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cinematic Mountain Backdrop Card matching Reference Visual */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-6 py-16 sm:px-12 sm:py-24 lg:px-16 text-center text-white shadow-2xl">
          {/* Background Travel Photography */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85"
              alt="GlobeTrotter Alpine Traveler Experience"
              className="h-full w-full object-cover opacity-45 scale-105 transition duration-700 hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/80 to-blue-900/85" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/25 border border-blue-400/30 px-4 py-1.5 text-xs font-bold text-blue-200 backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" />
              <span>Join 25,000+ Smart Travelers</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Ready to plan your dream trip?
            </h2>

            <p className="text-base sm:text-lg text-slate-200 font-normal max-w-lg mx-auto">
              Turn your travel ideas into a perfectly organized journey with customized stops, live ₹ INR budgets, and interactive timelines.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                onClick={handleCtaClick}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-white hover:bg-blue-50 px-8 py-4 text-sm font-black text-slate-900 shadow-xl shadow-black/20 hover:scale-105 transition active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <span>Start Planning Now</span>
                <ArrowRight size={17} className="text-blue-600" />
              </Link>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Free to get started • No credit card required • Instant access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
