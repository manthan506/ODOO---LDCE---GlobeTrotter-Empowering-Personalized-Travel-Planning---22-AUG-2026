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
} from 'lucide-react';
import { toast } from 'sonner';
import type { TripWithDetails, Stop } from '@/types';
import { getDestinationInfo } from '@/lib/destinationData';

interface SplitItineraryViewProps {
  trip?: TripWithDetails | null;
  tripId: string;
  destinationCity?: string;
}

export function SplitItineraryView({
  trip,
  tripId,
  destinationCity = 'Delhi',
}: SplitItineraryViewProps) {
  const dest = getDestinationInfo(destinationCity || trip?.name);
  const [selectedDate, setSelectedDate] = useState('Saturday, Sep 1');
  const [activePin, setActivePin] = useState<number | null>(1);

  const activities = dest.activities.map((act, idx) => ({
    id: `act-${idx}`,
    number: idx + 1,
    title: act.name,
    description: act.description,
    image: act.image,
    walkInfo: act.walkInfo,
    x: `${25 + (idx % 2) * 35}%`,
    y: `${30 + idx * 18}%`,
  }));

  const primaryFlight = dest.flights[0] || {
    fromCode: 'BOM',
    toCode: dest.airportCode,
    arrTime: '10:10am',
  };

  const primaryHotel = dest.hotels[0] || {
    name: `Grand Hotel ${dest.name}`,
  };

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
            <h3 className="text-xl font-black text-slate-900">{selectedDate} ({dest.name})</h3>
            <button className="text-slate-400 hover:text-slate-700">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success(`Auto-filled top recommended spots for ${dest.name}`)}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-bold transition"
              >
                <Wand2 size={13} /> Auto-fill day
              </button>

              <button
                onClick={() => toast.success(`Route optimized for ${dest.name}: 1 hr 15 min travel time`)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold transition shadow-xs"
              >
                <Route size={13} className="text-blue-600" /> Optimize route
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              1 hr 15 min, 14.2 km
            </span>
          </div>

          {/* Flight Card */}
          <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Plane size={16} />
              </div>
              <span className="font-bold text-slate-900">
                {primaryFlight.fromCode} ➔ {primaryFlight.toCode}
              </span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">
              Arrives {primaryFlight.arrTime}
            </span>
          </div>

          {/* Hotel Check-in Card */}
          <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Hotel size={16} />
              </div>
              <span className="font-bold text-slate-900">{primaryHotel.name}</span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">Check-in 14:00</span>
          </div>

          {/* Activities List */}
          <div className="space-y-4 pt-1">
            {activities.map((act) => (
              <div key={act.id} className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium pl-2">
                  <span>🚶 {act.walkInfo} • Directions</span>
                </div>

                <div
                  onClick={() => setActivePin(act.number)}
                  className={`rounded-2xl border p-4 flex items-center justify-between gap-4 cursor-pointer transition ${
                    activePin === act.number
                      ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-100 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
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

        {/* RIGHT COLUMN: Interactive Live Map */}
        <div className="lg:col-span-5 relative bg-[#e2e8f0] h-[350px] lg:h-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('${dest.coverImage}')`,
            }}
          />
          <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] pointer-events-none" />

          {/* SVG Synchronized Route Trail */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
            <path
              d="M 120 280 L 220 140 L 160 320 L 270 340"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Synchronized Waypoint Pins for Destination */}
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => setActivePin(act.number)}
              className={`absolute z-20 grid h-7 w-7 place-items-center rounded-full text-white font-black text-xs shadow-lg ring-2 ring-white cursor-pointer transition transform hover:scale-125 ${
                activePin === act.number ? 'bg-blue-600 scale-110 ring-4 ring-blue-200' : 'bg-blue-500'
              }`}
              style={{ left: act.x, top: act.y }}
            >
              {act.number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
