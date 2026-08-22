'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Compass,
  Copy,
  Check,
  Share2,
  Loader2,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

type PublicTrip = {
  id?: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  budget_cap?: number | null;
  stops: any[];
  trip_members: any[];
};

export function PublicTripView({ slug }: { slug: string }) {
  const router = useRouter();
  const [trip, setTrip] = useState<PublicTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetch(`/api/public/trips/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setTrip(data?.trips ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching public trip:', err);
        setLoading(false);
      });
  }, [slug]);

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('Public trip link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyTrip = async () => {
    if (!trip) return;
    setCopying(true);
    try {
      // 1. Create cloned trip
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${trip.name} (Copy)`,
          startDate: trip.start_date,
          endDate: trip.end_date,
          description: trip.description || `Cloned from community trip: ${trip.name}`,
          coverImageUrl: trip.cover_image_url,
          budgetCap: trip.budget_cap || 110000,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.info('Please log in or sign up to save this trip to your account.');
          router.push('/login');
          return;
        }
        throw new Error('Failed to copy trip');
      }

      const newTrip = await res.json();

      // 2. Clone stops
      for (const stop of trip.stops || []) {
        if (stop.cities?.id) {
          const stopRes = await fetch(`/api/trips/${newTrip.id}/stops`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cityId: stop.cities.id,
              arriveDate: stop.arrive_date,
              leaveDate: stop.leave_date,
              order: stop.order,
            }),
          });

          if (stopRes.ok) {
            const newStop = await stopRes.json();
            // Clone activities
            for (const sa of stop.stop_activities || []) {
              if (sa.activities?.id) {
                await fetch(`/api/stops/${newStop.id}/activities`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    activityId: sa.activities.id,
                    scheduledTime: sa.scheduled_time || '10:00 AM',
                  }),
                });
              }
            }
          }
        }
      }

      toast.success('Trip successfully copied to your trips!');
      router.push(`/trips/${newTrip.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Could not copy trip');
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-4 text-center">
        <div>
          <Compass className="mx-auto mb-3 text-blue-600" size={32} />
          <h1 className="text-xl font-bold text-slate-900">Trip not found</h1>
          <p className="mt-1 text-xs text-slate-500">This public itinerary link may have expired or is private.</p>
          <Link href="/" className="mt-4 inline-block font-bold text-xs text-blue-600 hover:underline">
            Go to GlobeTrotter
          </Link>
        </div>
      </div>
    );
  }

  const stops = [...(trip.stops ?? [])].sort((a, b) => a.order - b.order);
  const cover = trip.cover_image_url ?? stops[0]?.cities?.image_url ?? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white">
              <Compass size={18} />
            </span>
            <span className="text-lg font-bold">GlobeTrotter</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              {copiedLink ? 'Copied' : 'Share'}
            </button>
            <button
              onClick={handleCopyTrip}
              disabled={copying}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {copying ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />}
              {copying ? 'Copying...' : 'Copy Trip'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link
          href="/community"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={14} /> Community Trips
        </Link>

        {/* Hero */}
        <div className="relative mb-6 h-60 overflow-hidden rounded-3xl bg-slate-900 sm:h-72">
          <img
            src={cover}
            alt={trip.name}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-200">
              <CalendarDays size={13} />{' '}
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{trip.name}</h1>
            {trip.description && <p className="mt-1 max-w-lg text-xs text-slate-200">{trip.description}</p>}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {stops.length} destinations
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} /> Community Itinerary
            </span>
          </div>

          <button
            onClick={handleCopyTrip}
            disabled={copying}
            className="flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 px-3.5 py-1.5 text-xs font-bold hover:bg-blue-100 transition"
          >
            <Copy size={13} /> Duplicate to My Itineraries
          </button>
        </div>

        {/* Stops list */}
        <div className="space-y-4">
          {stops.map((stop, index) => (
            <section
              key={stop.id || index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3.5 border-b border-slate-100 p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white">
                  0{index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900">{stop.cities?.name}</h3>
                  <p className="text-xs text-slate-400">
                    {stop.cities?.country} •{' '}
                    {new Date(stop.arrive_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                    {new Date(stop.leave_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2">
                {(stop.stop_activities ?? []).length === 0 ? (
                  <p className="py-3 text-xs text-slate-400 italic">No activities listed.</p>
                ) : (
                  (stop.stop_activities ?? []).map((sa: any, i: number) => (
                    <div
                      key={sa.id || i}
                      className="flex items-center gap-3 border-b border-slate-50 py-2.5 last:border-0"
                    >
                      <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <Sparkles size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800">{sa.activities?.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {sa.activities?.category} • {sa.activities?.duration_min}min
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {Number(sa.activities?.cost) > 0 ? `₹${Number(sa.activities.cost).toLocaleString('en-IN')}` : 'Free'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
