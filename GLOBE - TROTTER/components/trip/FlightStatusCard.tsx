'use client';

import { useState } from 'react';
import { Plane, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface FlightStatusCardProps {
  firstStopCity?: string;
  startDate?: string;
}

export function FlightStatusCard({
  firstStopCity = 'Paris',
  startDate = 'May 20, 2025',
}: FlightStatusCardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Flight status up to date: On Time');
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <Plane size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">Flight Status</span>
            <span className="text-[10px] text-slate-400 block">Air India • AI 202</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            On Time
          </span>
          <button
            onClick={handleRefresh}
            className={`p-1 text-slate-400 hover:text-slate-700 transition ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh status"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-center px-2">
        <div className="text-left">
          <span className="text-lg font-black text-slate-900">DEL</span>
          <span className="text-[10px] text-slate-400 block">New Delhi</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">14:30</span>
        </div>

        <div className="flex-1 px-4 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-medium">8h 45m Non-stop</span>
          <div className="relative w-full flex items-center my-1">
            <div className="w-full h-0.5 bg-slate-200" />
            <Plane size={12} className="absolute left-1/2 -translate-x-1/2 text-blue-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">Gate B12 • Terminal 3</span>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-slate-900">{firstStopCity === 'Paris' ? 'CDG' : 'HND'}</span>
          <span className="text-[10px] text-slate-400 block">{firstStopCity}</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">18:15</span>
        </div>
      </div>
    </div>
  );
}
