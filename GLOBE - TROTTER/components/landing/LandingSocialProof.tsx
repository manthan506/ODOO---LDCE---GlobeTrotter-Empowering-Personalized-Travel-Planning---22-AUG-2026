'use client';

import { Compass, Globe, MapPin, Sparkles, Shield, Heart } from 'lucide-react';

export function LandingSocialProof() {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-6">
          Trusted By Modern Travelers & Global Planning Communities
        </span>

        {/* Restrained illustrative partner badges matching Reference */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-black text-sm sm:text-base grayscale opacity-75 hover:grayscale-0 transition duration-300">
          <div className="flex items-center gap-2 hover:text-blue-600 transition">
            <Globe size={20} className="text-blue-600" />
            <span className="font-extrabold tracking-tight">GlobalWanderers</span>
          </div>

          <div className="flex items-center gap-2 hover:text-indigo-600 transition">
            <Compass size={20} className="text-indigo-600" />
            <span className="font-extrabold tracking-tight">NomadGuild</span>
          </div>

          <div className="flex items-center gap-2 hover:text-emerald-600 transition">
            <MapPin size={20} className="text-emerald-600" />
            <span className="font-extrabold tracking-tight">AlpineExplorers</span>
          </div>

          <div className="flex items-center gap-2 hover:text-amber-600 transition">
            <Sparkles size={20} className="text-amber-500" />
            <span className="font-extrabold tracking-tight">BackpackerRoute</span>
          </div>

          <div className="flex items-center gap-2 hover:text-rose-600 transition">
            <Heart size={20} className="text-rose-500" />
            <span className="font-extrabold tracking-tight">TravelCulture</span>
          </div>
        </div>
      </div>
    </section>
  );
}
