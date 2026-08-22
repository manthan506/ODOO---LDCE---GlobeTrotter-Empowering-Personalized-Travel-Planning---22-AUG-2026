'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Compass, Loader2, MapPin, Search, Users, Sparkles } from 'lucide-react';

type SharedTrip = {
  share_slug: string;
  trips: {
    id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    cover_image_url: string | null;
    stops: {
      cities: {
        name: string;
        country: string;
        image_url: string | null;
      } | null;
    }[];
  } | null;
};

export function CommunityContent() {
  const [items, setItems] = useState<SharedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/public/trips')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching public trips:', err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const trip = item.trips;
        return (
          trip?.name.toLowerCase().includes(search.toLowerCase()) ||
          trip?.stops.some((stop) =>
            stop.cities?.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      }),
    [items, search]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-100">
            <Compass size={16} /> Community Trips
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Inspiring Travel Itineraries ✨
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-blue-100">
            Browse public itineraries curated by travelers worldwide and plan your own perfect route.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Search shared trips or destinations..."
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-14 text-center">
            <Users className="mx-auto mb-2 text-blue-600" size={32} />
            <h3 className="text-sm font-bold text-slate-900">No public trips shared yet</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first to publish and share an itinerary!</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const trip = item.trips;
              if (!trip) return null;
              const cover = trip.cover_image_url ?? trip.stops[0]?.cities?.image_url ?? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

              return (
                <Link
                  key={item.share_slug}
                  href={`/t/${item.share_slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={cover}
                      alt={trip.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-base font-bold text-white truncate">{trip.name}</h3>
                      <p className="text-[11px] text-white/80">
                        {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                        {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 text-xs text-slate-500">
                      {trip.description || 'A curated GlobeTrotter travel itinerary.'}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {trip.stops.length} destinations
                      </span>
                      <span>View route →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
