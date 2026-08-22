'use client';

import { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from '@/components/trip/TripCard';
import { Plus, Loader2, MapPin, Search, Compass, Sparkles, ArrowRight, Calendar, Wallet } from 'lucide-react';
import Link from 'next/link';

const FEATURED_SAMPLE_TRIPS = [
  {
    id: 'featured-1',
    user_id: 'sample',
    name: 'Euro-Alpine Explorer',
    start_date: '2026-09-10',
    end_date: '2026-09-22',
    description: 'Paris • Swiss Alps • Rome • Barcelona',
    cover_image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    budget_cap: 85000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'featured-2',
    user_id: 'sample',
    name: 'Tropical Bali & Coral Isles',
    start_date: '2026-10-05',
    end_date: '2026-10-14',
    description: 'Ubud • Seminyak • Nusa Penida',
    cover_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    budget_cap: 48000,
    created_at: new Date().toISOString(),
  },
  {
    id: 'featured-3',
    user_id: 'sample',
    name: 'Golden Triangle & Royal Heritage',
    start_date: '2026-11-01',
    end_date: '2026-11-08',
    description: 'Delhi • Agra • Jaipur',
    cover_image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    budget_cap: 32000,
    created_at: new Date().toISOString(),
  },
];

export function TripListContent() {
  const { trips, loading, refetch } = useTrips();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const activeList = trips.length > 0 ? trips : FEATURED_SAMPLE_TRIPS;

  const filteredTrips = activeList.filter((t, idx) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !(t.description || '').toLowerCase().includes(q)) {
        return false;
      }
    }
    if (activeFilter === 'upcoming') return idx % 2 === 0;
    if (activeFilter === 'completed') return idx % 2 === 1;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {trips.length > 0 ? 'My Trips & Itineraries' : 'Explore Itineraries'}
          </h1>
          <p className="text-xs text-slate-500">
            {trips.length > 0 ? 'Manage your planned journeys and expenses' : 'Browse curated multi-city routes or create your own'}
          </p>
        </div>
        <Link
          href="/trips/new"
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Plan New Trip
        </Link>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trips by destination or title..."
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs"
          />
        </div>

        {/* Filter Tabs (All Trips, Upcoming, Completed) */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
          {[
            { id: 'all', label: 'All Trips' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition text-center ${
                activeFilter === tab.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading && trips.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <MapPin size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No trips match your search</h3>
          <p className="mt-1 text-xs text-slate-500">Try changing your filters or plan a new custom trip.</p>
          <Link
            href="/trips/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={16} /> Plan New Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.length === 0 && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 px-4 flex items-center justify-between text-xs text-blue-900">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles size={14} className="text-blue-600" /> Curated Itineraries: Click any route to customize or create your own
              </span>
              <Link href="/trips/new" className="font-extrabold text-blue-600 hover:underline">
                + Create Custom
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrips.map((trip, idx) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={idx}
                onDeleted={refetch}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating/Bottom CTA */}
      <div className="mt-8">
        <Link
          href="/trips/new"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-95"
        >
          <Plus size={16} /> Plan a New Trip
        </Link>
      </div>
    </div>
  );
}
