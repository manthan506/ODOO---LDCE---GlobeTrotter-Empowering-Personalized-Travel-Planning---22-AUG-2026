'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wallet, Plane, Hotel, Sparkles, Utensils, ShoppingBag, AlertTriangle, ArrowRight, ShieldCheck, PieChart } from 'lucide-react';

const CATEGORIES = [
  { name: 'Transport & Flights', amount: 99000, percentage: 35, color: '#3B82F6', icon: Plane },
  { name: 'Stay & Accommodation', amount: 91000, percentage: 32, color: '#6366F1', icon: Hotel },
  { name: 'Activities & Tours', amount: 54000, percentage: 19, color: '#F59E0B', icon: Sparkles },
  { name: 'Meals & Dining', amount: 23000, percentage: 8, color: '#10B981', icon: Utensils },
  { name: 'Shopping & Misc', amount: 18000, percentage: 6, color: '#8B5CF6', icon: ShoppingBag },
];

export function LandingBudgeting() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const totalCost = 285000;
  const plannedCap = 300000;
  const avgPerDay = 19000;

  return (
    <section className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ============================================================ */}
          {/* LEFT: FINANCIAL DASHBOARD VISUALIZATION                      */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            {/* Top KPI Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-blue-500/20 text-blue-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
                    Live Cost Tracker
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Europe Discovery</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl sm:text-4xl font-black text-white font-mono">
                    ₹2,85,000
                  </h3>
                  <span className="text-xs text-slate-400">/ Planned: ₹3,00,000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900/80 p-3 border border-slate-700/80 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Average / Day
                  </span>
                  <p className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5">
                    ₹19,000 <span className="text-[10px] font-normal text-slate-400">/ day</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Over-Budget Alert Badge Simulation */}
            <div className="rounded-2xl bg-amber-500/15 border border-amber-500/30 p-3 px-4 flex items-center justify-between gap-3 text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={17} className="text-amber-400 flex-shrink-0" />
                <span className="text-xs font-bold">
                  Day 1 & Day 3 Peak Alert: Glacier Express Pass exceeded standard daily cap.
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-md flex-shrink-0">
                Safe Buffer: ₹15,000
              </span>
            </div>

            {/* Category Breakdown Progress Bars */}
            <div className="space-y-3.5">
              {CATEGORIES.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveCategory(idx)}
                    onMouseLeave={() => setActiveCategory(null)}
                    className={`rounded-2xl p-3 border transition cursor-pointer ${
                      activeCategory === idx
                        ? 'bg-slate-700/80 border-blue-400/60 shadow-md'
                        : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-700/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="grid h-6 w-6 place-items-center rounded-lg text-white text-[11px]"
                          style={{ backgroundColor: cat.color }}
                        >
                          <IconComponent size={13} />
                        </div>
                        <span className="font-bold text-white">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-white text-xs sm:text-sm">
                          ₹{cat.amount.toLocaleString('en-IN')}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">
                          ({cat.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: VALUE COPY & PROBLEM SOLVING NARRATIVE                */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2 block">
              Smart Budgeting & Cost Breakdown
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Know what your trip will cost before you go.
            </h2>

            <p className="text-base text-slate-300 font-normal leading-relaxed">
              Stay in complete financial control without sacrificing the magic of your experience. GlobeTrotter computes automatic expenditure forecasts in Indian Rupees (₹) with categorized charts and overbudget warnings.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck size={15} />
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  Itemized splits for transport, stays, excursions, and dining
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck size={15} />
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  Automatic daily average calculations across your full calendar
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                  <ShieldCheck size={15} />
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  Over-budget alert triggers before booking high-cost passes
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/budget"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition active:scale-95"
              >
                <span>Try Budget Calculator</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
