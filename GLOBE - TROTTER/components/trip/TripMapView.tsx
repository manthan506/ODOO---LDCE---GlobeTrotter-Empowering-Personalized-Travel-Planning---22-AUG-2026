'use client';

import { useState } from 'react';
import {
  MapPin,
  Utensils,
  Navigation,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  Check,
  CheckSquare,
  Square,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Stop } from '@/types';
import { generateGoogleMapsDirectionsUrl } from '@/lib/routeOptimizer';

interface TripMapViewProps {
  stops?: Stop[];
  tripId: string;
  onStopsReordered?: () => void;
}

export function TripMapView({ stops = [], tripId, onStopsReordered }: TripMapViewProps) {
  // Layer Toggles matching Screenshot 2
  const [showPlaces, setShowPlaces] = useState(true);
  const [showFood, setShowFood] = useState(true);

  // Date Checklists matching Screenshot 2
  const [dates, setDates] = useState([
    { id: 'd1', label: 'Sat, 3/21', color: '#3B82F6', active: true },
    { id: 'd2', label: 'Sun, 3/22', color: '#8B5CF6', active: true },
    { id: 'd3', label: 'Mon, 3/23', color: '#06B6D4', active: true },
    { id: 'd4', label: 'Tue, 3/24', color: '#10B981', active: true },
  ]);

  const toggleDate = (id: string) => {
    setDates((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleExportGoogleMaps = () => {
    const defaultWaypoints = [
      { name: 'Lincoln Square', country: 'New York' },
      { name: 'Columbus Circle', country: 'New York' },
      { name: 'Central Park East', country: 'New York' },
      { name: 'Lenox Hill', country: 'New York' },
    ];
    const url = generateGoogleMapsDirectionsUrl(stops.length > 0 ? (stops as any) : defaultWaypoints);
    window.open(url, '_blank');
  };

  // Pins rendered on the map matching Screenshot 2
  const mapPins = [
    { id: 1, type: 'place', label: '1', dateId: 'd1', x: '40%', y: '68%', color: '#3B82F6', name: 'Lincoln Square' },
    { id: 2, type: 'place', label: '2', dateId: 'd1', x: '35%', y: '75%', color: '#3B82F6', name: 'Columbus Circle' },
    { id: 3, type: 'place', label: '3', dateId: 'd2', x: '58%', y: '28%', color: '#8B5CF6', name: 'Carnegie Hill' },
    { id: 4, type: 'place', label: '4', dateId: 'd2', x: '44%', y: '45%', color: '#8B5CF6', name: 'Upper West Side' },
    { id: 5, type: 'place', label: '5', dateId: 'd2', x: '47%', y: '62%', color: '#8B5CF6', name: 'Central Park West' },
    { id: 6, type: 'place', label: '6', dateId: 'd4', x: '63%', y: '72%', color: '#10B981', name: 'Midtown East' },
    { id: 7, type: 'place', label: '7', dateId: 'd4', x: '56%', y: '68%', color: '#10B981', name: 'Fifth Avenue' },
    // Food pins (Red with fork/knife)
    { id: 11, type: 'food', label: 'F1', dateId: 'd1', x: '32%', y: '69%', color: '#EF4444', name: 'Café Fiorello' },
    { id: 12, type: 'food', label: 'F2', dateId: 'd2', x: '64%', y: '58%', color: '#EF4444', name: 'Trattoria Dell’Arte' },
    { id: 13, type: 'food', label: 'F3', dateId: 'd4', x: '65%', y: '75%', color: '#EF4444', name: 'Lenox Hill Bistro' },
  ];

  const activePins = mapPins.filter((pin) => {
    if (pin.type === 'place' && !showPlaces) return false;
    if (pin.type === 'food' && !showFood) return false;
    const dateObj = dates.find((d) => d.id === pin.dateId);
    return dateObj ? dateObj.active : true;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 2 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Explore your trip with map view</h2>
      </div>

      {/* Main Map Container matching Screenshot 2 */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-[#e2e8f0] h-[480px] sm:h-[560px]">
        {/* Real Vector Map Canvas Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 transition duration-300"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')`,
            filter: 'contrast(1.05) saturate(1.1)',
          }}
        />

        {/* Soft Map Grid Overlay */}
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] pointer-events-none" />

        {/* Floating Top-Left "Map layers" Card (Screenshot 2) */}
        <div className="absolute top-5 left-5 z-20 w-44 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-slate-200 space-y-2.5 animate-in fade-in">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
            Map layers
          </span>

          <div
            onClick={() => setShowPlaces(!showPlaces)}
            className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-600 fill-blue-600/20" />
              <span>Places to visit</span>
            </div>
            <div
              className={`grid h-4 w-4 place-items-center rounded border transition ${
                showPlaces ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {showPlaces && <Check size={11} strokeWidth={3} />}
            </div>
          </div>

          <div
            onClick={() => setShowFood(!showFood)}
            className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            <div className="flex items-center gap-2">
              <Utensils size={14} className="text-red-500" />
              <span>Food</span>
            </div>
            <div
              className={`grid h-4 w-4 place-items-center rounded border transition ${
                showFood ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {showFood && <Check size={11} strokeWidth={3} />}
            </div>
          </div>
        </div>

        {/* SVG Route Connection Lines */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
          {/* Blue Line (Sat 3/21) */}
          {dates[0].active && (
            <path
              d="M 320 370 L 280 410 L 350 430"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
          {/* Purple Line (Sun 3/22) */}
          {dates[1].active && (
            <path
              d="M 460 150 L 350 240 L 370 330"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          )}
          {/* Green Line (Tue 3/24) */}
          {dates[3].active && (
            <path
              d="M 500 380 L 440 360 L 510 400"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          )}
        </svg>

        {/* Dynamic Pins on Map matching Screenshot 2 */}
        {activePins.map((pin) => (
          <div
            key={pin.id}
            onClick={() => toast.info(`Selected: ${pin.name}`)}
            className="absolute z-15 -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-125 duration-150"
            style={{ left: pin.x, top: pin.y }}
          >
            {pin.type === 'food' ? (
              <div className="grid h-7 w-7 place-items-center rounded-full bg-red-500 text-white shadow-lg ring-2 ring-white">
                <Utensils size={13} />
              </div>
            ) : (
              <div
                className="grid h-7 w-7 place-items-center rounded-full text-white font-black text-xs shadow-lg ring-2 ring-white"
                style={{ backgroundColor: pin.color }}
              >
                {pin.label}
              </div>
            )}
            <div className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
              {pin.name}
            </div>
          </div>
        ))}

        {/* Floating Bottom-Right "Itinerary" Dates Checklist (Screenshot 2) */}
        <div className="absolute bottom-5 right-5 z-20 w-48 rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-xl border border-slate-200 space-y-2.5 animate-in fade-in">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
            Itinerary
          </span>

          <div className="space-y-2">
            {dates.map((d) => (
              <div
                key={d.id}
                onClick={() => toggleDate(d.id)}
                className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.label}</span>
                </div>
                <div
                  className={`grid h-4 w-4 place-items-center rounded border transition ${
                    d.active ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {d.active && <Check size={11} strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Left Google Maps Action */}
        <div className="absolute bottom-5 left-5 z-20">
          <button
            onClick={handleExportGoogleMaps}
            className="flex items-center gap-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 px-3.5 py-2 text-xs font-bold shadow-lg border border-slate-200 transition active:scale-98 backdrop-blur-sm"
          >
            <ExternalLink size={13} />
            Export to Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}
