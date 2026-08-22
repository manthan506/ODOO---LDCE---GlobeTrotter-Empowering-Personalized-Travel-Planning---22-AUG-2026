'use client';

import { Plane, ArrowRight, Sparkles, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export function FlightDealsCard() {
  const deals = [
    {
      from: 'New Delhi (DEL)',
      to: 'Paris (CDG)',
      airline: 'Air France',
      price: 38400,
      discount: '25% OFF',
      dates: 'May – Jun 2025',
    },
    {
      from: 'Mumbai (BOM)',
      to: 'Tokyo (HND)',
      airline: 'ANA Airways',
      price: 42000,
      discount: '20% OFF',
      dates: 'Jul – Aug 2025',
    },
    {
      from: 'Bengaluru (BLR)',
      to: 'Bali (DPS)',
      airline: 'Singapore Airlines',
      price: 24500,
      discount: '30% OFF',
      dates: 'Aug – Sep 2025',
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <TrendingDown size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Flight Deals for You</h3>
            <span className="text-[10px] text-slate-400">Exclusive member airfares</span>
          </div>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
          Curated Deals
        </span>
      </div>

      <div className="space-y-2.5">
        {deals.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3 hover:border-blue-200 transition"
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span>{d.from.split(' ')[0]}</span>
                <ArrowRight size={12} className="text-slate-400" />
                <span>{d.to.split(' ')[0]}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {d.airline} • {d.dates}
              </span>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-xs font-black text-blue-700 block font-mono">
                ₹{d.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {d.discount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
