'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export function LandingSearchPlanner() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [travelDates, setTravelDates] = useState('Sep 10 – Sep 28, 2026');
  const [travelersCount, setTravelersCount] = useState('2 Travelers');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    toast.success(`Searching customized itineraries for "${destination || 'Popular destinations'}"...`);
    setTimeout(() => {
      router.push(`/explore?q=${encodeURIComponent(destination || 'Paris')}`);
    }, 400);
  };

  return (
    <div id="search-planner" className="relative -mt-8 sm:-mt-12 z-30 mx-auto max-w-5xl px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xl shadow-blue-600/10 backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* 1. WHERE TO FIELD */}
          <div className="md:col-span-4 flex items-center gap-3 rounded-2xl bg-slate-50 hover:bg-blue-50/40 p-3.5 border border-slate-200/70 transition group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100/80 text-blue-600 group-hover:scale-105 transition flex-shrink-0">
              <MapPin size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Where to?
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destinations, cities..."
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          {/* 2. TRAVEL DATES FIELD */}
          <div className="md:col-span-3 flex items-center gap-3 rounded-2xl bg-slate-50 hover:bg-blue-50/40 p-3.5 border border-slate-200/70 transition group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100/80 text-indigo-600 group-hover:scale-105 transition flex-shrink-0">
              <Calendar size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Travel Dates
              </label>
              <input
                type="text"
                value={travelDates}
                onChange={(e) => setTravelDates(e.target.value)}
                placeholder="Add dates"
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          {/* 3. TRAVELERS COUNT FIELD */}
          <div className="md:col-span-3 flex items-center gap-3 rounded-2xl bg-slate-50 hover:bg-blue-50/40 p-3.5 border border-slate-200/70 transition group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100/80 text-teal-600 group-hover:scale-105 transition flex-shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Travelers
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="1 Solo Explorer">1 Solo Explorer</option>
                <option value="2 Travelers">2 Travelers (Couples/Duo)</option>
                <option value="3-4 Group/Family">3-4 Group / Family</option>
                <option value="5+ Large Squad">5+ Large Squad</option>
              </select>
            </div>
          </div>

          {/* 4. SEARCH BUTTON */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSearching}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
