'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Wallet,
  MapPin,
  Plus,
  Clock,
  Star,
  Layers,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

export function LandingProductShowcase() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50/60 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ============================================================ */}
          {/* LEFT: TEXT CONTENT & VALUE CHECKLIST                         */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
                Plan Your Perfect Trip
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Everything you need, all in one place
              </h2>
            </div>

            <p className="text-base text-slate-600 font-normal leading-relaxed">
              From inspiration to itinerary, GlobeTrotter makes travel planning simple, smart, and exciting.
            </p>

            {/* Checklist matching Figma specification */}
            <div className="space-y-3.5 pt-2">
              {[
                'Create & manage unlimited multi-city trips',
                'Add cities, dates & activities effortlessly',
                'Get budget estimates & real-time cost breakdowns (₹ INR)',
                'Beautiful day-wise itinerary views & timelines',
                'Share plans with friends or make them public',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 mt-0.5 shadow-2xs">
                    <CheckCircle2 size={15} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-bold text-slate-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/trips"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <span>Explore All Features</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: REALISTIC SAAS PRODUCT UI MOCKUP                      */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-indigo-300/10 to-transparent blur-3xl -z-10" />

            {/* MAIN CARD: MY EUROPE TRIP ITINERARY */}
            <div className="relative rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-md">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      My Europe Grand Tour
                    </h3>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-700">
                      ✓ Published
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    May 10 – May 25, 2026 • 15 Days • 5 Stops
                  </p>
                </div>

                <Link
                  href="/trips"
                  className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 text-xs font-bold transition"
                >
                  Edit Itinerary
                </Link>
              </div>

              {/* Stop Timeline Items with Images matching Reference */}
              <div className="space-y-4">
                {[
                  {
                    day: 'Day 1–3',
                    city: 'Paris, France',
                    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
                    hotel: 'Le Marais Boutique Hotel',
                    budget: '₹42,000',
                  },
                  {
                    day: 'Day 4–6',
                    city: 'Rome, Italy',
                    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80',
                    hotel: 'Trastevere Heritage Suites',
                    budget: '₹38,500',
                  },
                  {
                    day: 'Day 7–9',
                    city: 'Barcelona, Spain',
                    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80',
                    hotel: 'Gothic Quarter Design Stay',
                    budget: '₹34,000',
                  },
                  {
                    day: 'Day 10–12',
                    city: 'Swiss Alps, Switzerland',
                    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80',
                    hotel: 'Interlaken Alpine Chalet',
                    budget: '₹55,000',
                  },
                  {
                    day: 'Day 13–15',
                    city: 'Amsterdam, Netherlands',
                    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80',
                    hotel: 'Canal View Residence',
                    budget: '₹36,000',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 sm:p-3 hover:bg-white hover:border-slate-200 transition duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-12 w-14 sm:h-14 sm:w-16 rounded-xl overflow-hidden flex-shrink-0 shadow-2xs">
                        <img src={item.image} alt={item.city} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">
                          {item.day}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          {item.city}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium truncate hidden sm:block">
                          {item.hotel}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Allocated</span>
                      <p className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                        {item.budget}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Add Stop Button */}
                <Link
                  href="/trips"
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  <Plus size={15} /> + Add New City Stop
                </Link>
              </div>

              {/* FLOATING CARD 1: BUDGET OVERVIEW (Indian Rupees ₹ INR) */}
              <div className="absolute -bottom-8 -left-4 sm:-left-8 z-20 w-64 sm:w-72 rounded-3xl bg-slate-900 p-4 sm:p-5 text-white shadow-2xl border border-slate-800 animate-in slide-in-from-left-4 duration-500 hover:scale-105 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Budget Overview
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-400">
                    Safe Cap
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <h4 className="text-xl sm:text-2xl font-black text-white">₹2,85,000</h4>
                  <span className="text-[10px] text-slate-400">INR</span>
                </div>

                {/* Donut / Category breakdown items */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-500" /> Flights & Transport
                    </span>
                    <strong className="text-white font-mono">₹99,000</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" /> Accommodation
                    </span>
                    <strong className="text-white font-mono">₹91,000</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Activities & Tours
                    </span>
                    <strong className="text-white font-mono">₹54,000</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" /> Meals & Food
                    </span>
                    <strong className="text-white font-mono">₹23,000</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-400" /> Misc & Shopping
                    </span>
                    <strong className="text-white font-mono">₹18,000</strong>
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 2: TOP ACTIVITIES IN ROME */}
              <div className="absolute -top-6 -right-4 sm:-right-8 z-20 w-60 sm:w-68 rounded-3xl bg-white p-4 shadow-2xl border border-slate-200/90 animate-in slide-in-from-right-4 duration-500 hover:scale-105 transition hidden sm:block">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900">Top Activities in Rome</h4>
                  <span className="text-[10px] text-blue-600 font-bold">4.9 ★</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50">
                    <span className="font-semibold truncate">Colosseum Tour</span>
                    <strong className="font-mono text-[11px] text-slate-900">₹3,800</strong>
                  </div>
                  <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50">
                    <span className="font-semibold truncate">Vatican Museum</span>
                    <strong className="font-mono text-[11px] text-slate-900">₹3,200</strong>
                  </div>
                  <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50">
                    <span className="font-semibold truncate">Trevi Fountain</span>
                    <strong className="font-mono text-[11px] text-emerald-600">Free</strong>
                  </div>
                  <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50">
                    <span className="font-semibold truncate">Roman Forum</span>
                    <strong className="font-mono text-[11px] text-slate-900">₹2,100</strong>
                  </div>
                </div>

                <Link
                  href="/explore"
                  className="mt-3 flex items-center justify-center gap-1 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-1.5 text-[11px] font-black text-white shadow-xs"
                >
                  <Plus size={13} /> + Add Activity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
