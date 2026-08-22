'use client';

import { useState } from 'react';
import {
  Sparkles,
  Route,
  Plane,
  Hotel,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Wand2,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { TripWithDetails, Stop, StopActivity } from '@/types';
import { getDestinationInfo } from '@/lib/destinationData';
import { generateGoogleMapsDirectionsUrl } from '@/lib/routeOptimizer';

interface SplitItineraryViewProps {
  trip?: TripWithDetails | null;
  tripId: string;
  destinationCity?: string;
}

interface DisplayActivity {
  id: string;
  number: number;
  title: string;
  description: string;
  image: string;
  walkInfo: string;
  cost: number;
}

export function SplitItineraryView({
  trip,
  tripId,
  destinationCity = 'Japan',
}: SplitItineraryViewProps) {
  const dest = getDestinationInfo(destinationCity || trip?.name);
  const sortedStops = [...(trip?.stops ?? [])].sort((a, b) => a.order - b.order);
  const [selectedStopIdx, setSelectedStopIdx] = useState<number>(0);
  const currentStop = sortedStops[selectedStopIdx] || sortedStops[0];

  const startDateStr = trip?.start_date
    ? new Date(trip.start_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : 'Saturday, Sep 1';

  // Real activities assigned to this stop in database
  const stopActivities: DisplayActivity[] = (currentStop?.stop_activities ?? []).map(
    (sa: StopActivity, idx: number) => ({
      id: sa.id || `act-${idx}`,
      number: idx + 1,
      title: sa.activities?.name || `Activity ${idx + 1}`,
      description: sa.activities?.description || 'Custom activity in itinerary',
      image: sa.activities?.image_url || dest.coverImage,
      walkInfo: sa.scheduled_time
        ? `${sa.scheduled_time} • Directions`
        : `Stop #${idx + 1} • Directions`,
      cost: sa.activities?.cost || 0,
    })
  );

  // If user hasn't added activities to this stop yet, provide clean suggested highlights for this destination
  const displayActivities: DisplayActivity[] =
    stopActivities.length > 0
      ? stopActivities
      : dest.activities.map((act, idx: number) => ({
          id: `dest-act-${idx}`,
          number: idx + 1,
          title: act.name,
          description: act.description,
          image: act.image,
          walkInfo: act.walkInfo,
          cost: act.cost,
        }));

  const handleOpenGoogleMaps = () => {
    const waypoints = displayActivities.map((act: DisplayActivity) => ({
      name: `${act.title}, ${dest.name}`,
      country: dest.country,
    }));
    const url = generateGoogleMapsDirectionsUrl(waypoints as any);
    window.open(url, '_blank');
  };

  const bbox = `${dest.lng - 0.08}%2C${dest.lat - 0.05}%2C${dest.lng + 0.08}%2C${dest.lat + 0.05}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${dest.lat}%2C${dest.lng}`;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Subtitle with dynamic destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Daily Itinerary & Timelines for {dest.name}, {dest.country}
        </h2>
      </div>

      {/* Main Split-Screen Browser Canvas */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* LEFT COLUMN: Itinerary Timeline (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto max-h-[640px]">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">{startDateStr}</h3>
              <p className="text-xs text-slate-500">{dest.name} Itinerary Schedule</p>
            </div>
            <Link
              href={`/trips/${tripId}/plan`}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus size={14} /> Add activities
            </Link>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Link
                href={`/trips/${tripId}/plan`}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-bold transition"
              >
                <Wand2 size={13} /> Edit Day Plan
              </Link>

              <button
                onClick={handleOpenGoogleMaps}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold transition shadow-xs"
              >
                <Navigation size={13} className="text-blue-600" /> Open in Google Maps
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              {displayActivities.length} Places Scheduled
            </span>
          </div>

          {/* Hotel Check-in Card */}
          <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Hotel size={16} />
              </div>
              <span className="font-bold text-slate-900">
                {currentStop?.lodging?.name || `Grand Hotel ${dest.name}`}
              </span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">
              {currentStop?.lodging?.checkIn ? `Check-in ${currentStop.lodging.checkIn}` : 'Check-in 14:00'}
            </span>
          </div>

          {/* Activities List */}
          <div className="space-y-4 pt-1">
            {displayActivities.map((act: DisplayActivity) => (
              <div key={act.id} className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium pl-2">
                  <span>🚶 {act.walkInfo}</span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4 transition hover:border-slate-300 shadow-xs">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white flex-shrink-0">
                        {act.number}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {act.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 pl-8 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="h-16 w-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={act.image} alt={act.title} className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live OpenStreetMap Tile Map */}
        <div className="lg:col-span-5 relative bg-slate-100 h-[350px] lg:h-auto overflow-hidden">
          <iframe
            title={`OpenStreetMap for ${dest.name}`}
            src={osmEmbedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />

          {/* Floating Top-Right Google Maps Export */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleOpenGoogleMaps}
              className="flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-slate-900 shadow-lg border border-slate-200 hover:bg-white transition"
            >
              <Navigation size={13} className="text-blue-600" />
              <span>Google Maps ➔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
