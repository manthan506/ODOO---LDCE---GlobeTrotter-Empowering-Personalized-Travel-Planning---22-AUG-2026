'use client';

import { useState } from 'react';
import {
  Route,
  Sparkles,
  Zap,
  Clock,
  DollarSign,
  Check,
  X,
  Navigation,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Stop } from '@/types';

interface RouteOptimizerViewProps {
  stops?: Stop[];
  tripId: string;
  onStopsReordered?: () => void;
}

export function RouteOptimizerView({ stops = [], tripId, onStopsReordered }: RouteOptimizerViewProps) {
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [showSavingsBanner, setShowSavingsBanner] = useState(false);

  const handleRunOptimizer = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setIsOptimized(true);
      setShowSavingsBanner(true);
      toast.success('Route optimized with 0 backtracking! Saved 30 mins & $100.');
      if (onStopsReordered) onStopsReordered();
    }, 600);
  };

  const handleReset = () => {
    setIsOptimized(false);
    setShowSavingsBanner(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 5 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Optimize your route</h2>
      </div>

      {/* Main Double Phone / Desktop Comparison Canvas matching Screenshot 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Card: Before Optimization */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-[#e2e8f0] shadow-md h-[460px] flex flex-col justify-between p-4">
          {/* Map Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Top Status Header */}
          <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-800">Before: Original Route</span>
            <span className="text-[10px] font-mono text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
              Criss-cross (42 mi)
            </span>
          </div>

          {/* Unoptimized Criss-Cross SVG Line */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
            <path
              d="M 120 200 L 260 270 L 140 330 L 280 180 L 190 120"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="opacity-80"
            />
          </svg>

          {/* Pins on Left Map (1, 5, 2, 4, 3) */}
          <div className="absolute left-[30%] top-[42%] z-20 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            1
          </div>
          <div className="absolute left-[65%] top-[58%] z-20 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            5
          </div>
          <div className="absolute left-[35%] top-[70%] z-20 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            2
          </div>
          <div className="absolute left-[70%] top-[38%] z-20 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            4
          </div>
          <div className="absolute left-[48%] top-[25%] z-20 grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            3
          </div>

          {/* Floating Action Buttons matching Screenshot 5 (Zoom-in & Optimize route PRO) */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-xl bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-md">
                <ZoomIn size={12} /> Zoom-in
              </button>
              <button
                onClick={handleRunOptimizer}
                disabled={optimizing}
                className="flex items-center gap-1.5 rounded-xl bg-[#ff5a36] hover:bg-[#e04826] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-md transition active:scale-95"
              >
                {optimizing ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                <span>Optimize route</span>
                <span className="rounded bg-black/30 px-1 py-0.2 text-[8px] font-black uppercase">PRO</span>
              </button>
            </div>

            {/* Bottom Place Card matching Screenshot 5: Kaanapali Beach */}
            <div className="rounded-2xl bg-white/95 backdrop-blur-md p-3 border border-slate-200 shadow-lg flex items-center justify-between gap-3 text-xs">
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">Kaanapali Beach</h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  Beach featuring resorts, eateries & shopping, plus a scenic beachwalk...
                </p>
                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-medium pt-0.5">
                  <span>Added to 1 list</span>
                  <span>•</span>
                  <span>8:00am - 10:30pm</span>
                </div>
              </div>
              <div className="h-12 w-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80"
                  alt="Beach"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: After Optimization */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-[#e2e8f0] shadow-md h-[460px] flex flex-col justify-between p-4">
          {/* Map Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Top Status Header */}
          <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-800">After: Optimized Loop</span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <Check size={10} strokeWidth={3} /> Smooth (22 mi)
            </span>
          </div>

          {/* Optimal Smooth Clockwise SVG Route Loop */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
            <path
              d="M 120 200 L 140 330 L 260 270 L 280 180 L 190 120 Z"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeDasharray={isOptimized ? 'none' : '6 4'}
              className="opacity-90"
            />
          </svg>

          {/* Sequential Ordered Pins on Right Map (1 ➔ 2 ➔ 3 ➔ 4 ➔ 5) */}
          <div className="absolute left-[30%] top-[42%] z-20 grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            1
          </div>
          <div className="absolute left-[35%] top-[70%] z-20 grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            2
          </div>
          <div className="absolute left-[65%] top-[58%] z-20 grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            3
          </div>
          <div className="absolute left-[70%] top-[38%] z-20 grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            4
          </div>
          <div className="absolute left-[48%] top-[25%] z-20 grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-[10px] font-black text-white shadow-md ring-2 ring-white">
            5
          </div>

          {/* Bottom Dark Popup Card matching Screenshot 5: "We saved you: 30 mins & $100" */}
          <div className="relative z-10">
            <div className="rounded-2xl bg-slate-950/90 text-white p-4 shadow-xl border border-slate-800 space-y-2.5 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wide text-slate-100">
                  We saved you:
                </span>
                <button
                  onClick={() => setShowSavingsBanner(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <span>⏱️</span>
                  <span>30 mins of travel time</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <span>💵</span>
                  <span>$100 of gas money</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
