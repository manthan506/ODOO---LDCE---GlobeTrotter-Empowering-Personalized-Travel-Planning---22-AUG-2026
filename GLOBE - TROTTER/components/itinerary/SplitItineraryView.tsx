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

interface SplitItineraryViewProps {
  trip?: TripWithDetails | null;
  tripId: string;
}

export function SplitItineraryView({ trip, tripId }: SplitItineraryViewProps) {
  const [selectedDate, setSelectedDate] = useState('Saturday, 9/21');
  const [activePin, setActivePin] = useState<number | null>(1);

  const activities = [
    {
      id: 'a1',
      number: 1,
      title: 'Byodo-In Temple',
      description: 'Replica of a historic Japanese Buddhist temple featuring manicured grounds & meditation sit...',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
      walkInfo: '2 min walk • 0.1 mi • Directions',
      x: '30%',
      y: '58%',
    },
    {
      id: 'a2',
      number: 2,
      title: 'Ho‘omaluhia Botanical Garden',
      description: '400 acres of tropical plants along with a man-made freshwater lake, hiking trails & camping.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
      walkInfo: '15 min drive • 8.4 mi • Directions',
      x: '62%',
      y: '28%',
    },
    {
      id: 'a3',
      number: 3,
      title: 'Lanikai Beach & Pillbox Trail',
      description: 'Iconic turquoise bay with fine white sand and ridge hike offering panoramic windward views.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      walkInfo: '8 min drive • 3.2 mi • Directions',
      x: '45%',
      y: '65%',
    },
    {
      id: 'a4',
      number: 4,
      title: 'Diamond Head State Monument',
      description: 'Historic volcanic crater trail with breathtaking Pacific coastline lookout summit.',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
      walkInfo: '12 min drive • 5.1 mi • Directions',
      x: '75%',
      y: '68%',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Subtitle matching Screenshot 6 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Plan the best group itinerary</h2>
      </div>

      {/* Main Split-Screen Browser Canvas matching Screenshot 6 */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* LEFT COLUMN: Itinerary Timeline (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto max-h-[640px]">
          {/* Header Row: Saturday, 9/21 with 3-dots */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xl font-black text-slate-900">{selectedDate}</h3>
            <button className="text-slate-400 hover:text-slate-700">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Quick Action Buttons: Auto-fill day & Optimize route (Screenshot 6) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('Auto-filled best spots for Saturday')}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 px-3 py-1.5 text-xs font-bold transition"
              >
                <Wand2 size={13} /> Auto-fill day
              </button>

              <button
                onClick={() => toast.success('Route optimized: 1 hr 30 min, 19.8 mi')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold transition shadow-xs"
              >
                <Route size={13} className="text-blue-600" /> Optimize route
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              1 hr 30 min, 19.8 mi
            </span>
          </div>

          {/* Flight Card (Screenshot 6: SFO -> HNL Arrives 9:30am) */}
          <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Plane size={16} />
              </div>
              <span className="font-bold text-slate-900">SFO ➔ HNL</span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">Arrives 9:30am</span>
          </div>

          {/* Hotel Check-in Card (Screenshot 6: Waikiki Grand Hotel Check in) */}
          <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Hotel size={16} />
              </div>
              <span className="font-bold text-slate-900">Waikiki Grand Hotel</span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">Check in</span>
          </div>

          {/* Activities List with Walking Direction Badges */}
          <div className="space-y-4 pt-1">
            {activities.map((act) => (
              <div key={act.id} className="space-y-2">
                {/* Walking directions pill (Screenshot 6) */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium pl-2">
                  <span>🚶 {act.walkInfo}</span>
                </div>

                {/* Activity Card */}
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

        {/* RIGHT COLUMN: Interactive Live Map (5 cols) */}
        <div className="lg:col-span-5 relative bg-[#e2e8f0] h-[350px] lg:h-auto overflow-hidden">
          {/* Map Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80')`,
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

          {/* Synchronized Waypoint Pins (Screenshot 6: Pins 1, 2, 3, 4, 5) */}
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

          {/* Additional Map Waypoint 5 */}
          <div
            className="absolute z-20 grid h-7 w-7 place-items-center rounded-full bg-blue-500 text-white font-black text-xs shadow-lg ring-2 ring-white cursor-pointer"
            style={{ left: '55%', top: '48%' }}
          >
            5
          </div>
        </div>
      </div>
    </div>
  );
}
