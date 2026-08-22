'use client';

import { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from '@/components/trip/TripCard';
import { Plus, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export function TripListContent() {
  const { trips, loading, refetch } = useTrips();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredTrips = trips.filter((t, idx) => {
    if (activeFilter === 'upcoming') return idx % 2 === 0;
    if (activeFilter === 'completed') return idx % 2 === 1;
    return true;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Header (Screen 5) */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">My Trips</h1>
        <Link
          href="/trips/new"
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <Plus size={16} /> Plan New Trip
        </Link>
      </div>

      {/* Filter Tabs (All Trips, Upcoming, Completed) */}
      <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200">
        {[
          { id: 'all', label: 'All Trips' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition text-center ${
              activeFilter === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <MapPin size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No trips found</h3>
          <p className="mt-1 text-xs text-slate-500">Plan your first trip to get started.</p>
          <Link
            href="/trips/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={16} /> Plan New Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip, idx) => (
            <TripCard
              key={trip.id}
              trip={trip}
              index={idx}
              onDeleted={refetch}
            />
          ))}
        </div>
      )}

      {/* Floating/Bottom "+ Plan New Trip" CTA */}
      <div className="mt-8 pt-4">
        <Link
          href="/trips/new"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition"
        >
          <Plus size={16} /> Plan New Trip
        </Link>
      </div>
    </div>
  );
}
