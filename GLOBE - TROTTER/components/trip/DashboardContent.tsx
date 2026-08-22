'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from '@/components/trip/TripCard';
import {
  MapPin,
  Plus,
  Compass,
  CalendarDays,
  Loader2,
  Search,
  Mic,
  SlidersHorizontal,
  Luggage,
  Sparkles,
  Lightbulb,
  Wallet,
  ArrowRight,
  TrendingUp,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function DashboardContent() {
  const { user } = useAuth();
  const { trips, loading } = useTrips();
  const [search, setSearch] = useState('');

  const userName = user?.name || user?.email?.split('@')[0] || 'Traveler';

  const upcomingTrip = trips.length > 0 ? trips[0] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Top Greeting & Notification matching Screen 3 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Hi, {userName}! 👋
          </h1>
          <p className="text-xs text-slate-500 font-medium">Where will you go next?</p>
        </div>

        <Link
          href="/notifications"
          className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 animate-ping" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
        </Link>
      </div>

      {/* Search Bar with Mic & Filter */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
          placeholder="Search destinations, activities..."
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
          <button
            type="button"
            onClick={() => toast.info('Voice search activated (demo)')}
            className="p-1 hover:text-blue-600 transition"
          >
            <Mic size={17} />
          </button>
        </div>
      </div>

      {/* Quick Action Category Pills (Screen 3) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 mb-8">
        <Link
          href="/trips"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-blue-50/70 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Luggage size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Trips</span>
        </Link>

        <Link
          href="/explore"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Sparkles size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Activities</span>
        </Link>

        <Link
          href="/community"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-100 hover:border-amber-300 hover:bg-amber-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Lightbulb size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Inspiration</span>
        </Link>

        <Link
          href="/trips"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Wallet size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Budget</span>
        </Link>
      </div>

      {/* Upcoming Trips Card with Progress Bar (Screen 3) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Upcoming Trips</h2>
          <Link href="/trips" className="text-xs font-bold text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {upcomingTrip ? (
          <Link
            href={`/trips/${upcomingTrip.id}`}
            className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                    Upcoming
                  </span>
                  <span className="text-xs text-slate-400">
                    {upcomingTrip.start_date} – {upcomingTrip.end_date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                  {upcomingTrip.name}
                </h3>
                <p className="text-xs text-slate-500">4 Cities • 12 Days Planned</p>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Itinerary Planning</span>
                    <span className="text-blue-600">60% Planned</span>
                  </div>
                  <div className="h-2 w-full max-w-xs rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Landmark Graphic Thumbnail */}
              <div className="relative h-28 w-full sm:w-44 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0">
                <img
                  src={
                    upcomingTrip.cover_image_url ||
                    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80'
                  }
                  alt={upcomingTrip.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
            <Compass size={28} className="mx-auto text-blue-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-900">No active trips yet</h4>
            <p className="text-xs text-slate-500 mt-0.5">Start creating your personalized travel plan now.</p>
            <Link
              href="/trips/new"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={14} /> Plan New Trip
            </Link>
          </div>
        )}
      </div>

      {/* Popular Destinations Carousel (Screen 3) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">Popular Destinations</h2>
          <Link href="/explore" className="text-xs font-bold text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              name: 'Bali',
              country: 'Indonesia',
              image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
            },
            {
              name: 'Paris',
              country: 'France',
              image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
            },
            {
              name: 'Tokyo',
              country: 'Japan',
              image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
            },
          ].map((dest) => (
            <Link
              key={dest.name}
              href="/explore"
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm hover:border-blue-300 transition"
            >
              <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="mt-2 text-left">
                <h4 className="text-xs font-bold text-slate-900 truncate">{dest.name}</h4>
                <p className="text-[10px] text-slate-500 truncate">{dest.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
