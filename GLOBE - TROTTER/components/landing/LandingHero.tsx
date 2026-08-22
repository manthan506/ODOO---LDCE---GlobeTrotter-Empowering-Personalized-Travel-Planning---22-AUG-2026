'use client';

import Link from 'next/link';
import { ArrowRight, Compass, Star, MapPin, Sparkles, Plane, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export function LandingHero() {
  const scrollToPlanner = () => {
    const el = document.getElementById('search-planner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDestinations = () => {
    const el = document.getElementById('destinations');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-blue-200/30 via-indigo-100/20 to-teal-100/20 blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ============================================================ */}
          {/* LEFT COLUMN: HERO HEADLINE, VALUE COPY & CTAS                */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left pt-2 lg:pt-0">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs backdrop-blur-sm">
              <Plane size={14} className="text-blue-600 rotate-45" />
              <span>Plan Smarter. Travel Better.</span>
            </div>

            {/* Large Typography matching Reference Image */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Your Journey,
              <br />
              <span className="relative inline-block text-blue-600">
                Perfectly
                {/* Yellow/Orange Hand-drawn Accent Underline matching Figma design */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full text-amber-400"
                  viewBox="0 0 240 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 11.5C45.5 4.5 125 3 237 9.5"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Planned
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              GlobeTrotter helps you plan multi-city trips, discover amazing places, build personalized itineraries, manage budgets in Indian Rupees (₹), and share your adventures with the world.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/trips/new"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40 transition active:scale-95 cursor-pointer"
              >
                <span>Plan Your Trip</span>
                <ArrowRight size={17} />
              </Link>

              <button
                type="button"
                onClick={scrollToDestinations}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-800 shadow-2xs hover:border-slate-400 transition active:scale-95 cursor-pointer"
              >
                <span>Explore Destinations</span>
                <ExternalLink size={15} className="text-slate-400" />
              </button>
            </div>

            {/* Social Proof Strip */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 border-t border-slate-200/70">
              {/* Traveler Avatars */}
              <div className="flex -space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                  alt="Traveler Sarah"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80"
                  alt="Traveler Michael"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80"
                  alt="Traveler Priya"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Traveler Kenji"
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-xs"
                />
                <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-blue-600 text-white text-[11px] font-black shadow-xs">
                  25k+
                </div>
              </div>

              {/* Copy */}
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="text-xs font-extrabold text-slate-800 ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Join <strong className="text-slate-900">25,000+ happy travelers</strong> who plan smarter with GlobeTrotter.
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: ARTWORK BLENDED WITH WORLD LANDMARKS           */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Atmospheric Blue Glow Behind Landmark Graphic */}
            <div className="absolute inset-0 bg-blue-400/15 rounded-full blur-3xl scale-95 -z-10" />

            {/* Main Composite Graphic with Organic Blending */}
            <div className="relative w-full max-w-lg lg:max-w-none group">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-sky-400/10 via-transparent to-white/40 p-2 border border-slate-200/80 shadow-2xl shadow-blue-500/10 backdrop-blur-xs">
                <img
                  src="/images/hero-landmarks.jpg"
                  alt="GlobeTrotter World Landmarks — Eiffel Tower, Statue of Liberty, Taj Mahal, Rome Colosseum"
                  className="w-full h-auto object-cover rounded-[2.2rem] scale-[1.01] transition duration-700 hover:scale-105"
                />

                {/* Subtle Gradient Fade at the bottom for seamless blending */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />
              </div>

              {/* Dotted Airplane Route Decorative Curve */}
              <div className="absolute -top-6 -right-6 hidden sm:block pointer-events-none opacity-85">
                <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 110C60 90 90 20 170 15"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                  <polygon points="170,10 178,16 168,20" fill="#3B82F6" />
                </svg>
              </div>

              {/* FLOATING DESTINATION CARD: ROME, ITALY (Matching Reference Visual) */}
              <div className="absolute bottom-6 right-4 sm:right-8 z-20 flex items-center gap-3.5 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-xl border border-slate-200/90 max-w-xs animate-in slide-in-from-bottom-4 duration-700 hover:scale-105 transition">
                <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&q=80"
                    alt="Rome Colosseum"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      Rome, Italy
                    </h3>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-50 text-blue-600">
                      <Sparkles size={11} />
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={11} fill="currentColor" />
                    ))}
                    <span className="text-[11px] font-black text-slate-800 ml-1">4.9</span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    3.2k travelers planned this month
                  </span>
                </div>
              </div>

              {/* SECOND FLOATING BADGE: MULTI-CITY ROUTE LIVE */}
              <div className="absolute -top-3 -left-3 sm:top-6 sm:left-4 z-20 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md px-4 py-2.5 shadow-xl text-white border border-slate-800 animate-in slide-in-from-top-4 duration-700">
                <div className="grid h-7 w-7 place-items-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                  🌍
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Trip Route
                  </span>
                  <p className="text-xs font-extrabold text-white">
                    Paris → Swiss Alps → Rome
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
