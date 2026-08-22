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
import { getDestinationInfo } from '@/lib/destinationData';

interface TripMapViewProps {
  stops?: Stop[];
  tripId: string;
  tripName?: string;
  onStopsReordered?: () => void;
}

export function TripMapView({
  stops = [],
  tripId,
  tripName = 'Delhi',
  onStopsReordered,
}: TripMapViewProps) {
  const dest = getDestinationInfo(tripName);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showFood, setShowFood] = useState(true);

  // Date Checklists
  const [dates, setDates] = useState([
    { id: 'd1', label: 'Day 1', color: '#3B82F6', active: true },
    { id: 'd2', label: 'Day 2', color: '#8B5CF6', active: true },
    { id: 'd3', label: 'Day 3', color: '#06B6D4', active: true },
  ]);

  const toggleDate = (id: string) => {
    setDates((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleExportGoogleMaps = () => {
    const defaultWaypoints = dest.activities.map((act) => ({
      name: `${act.name}, ${dest.name}`,
      country: dest.country,
    }));
    const url = generateGoogleMapsDirectionsUrl(defaultWaypoints as any);
    window.open(url, '_blank');
  };

  // Pins rendered dynamically based on destination sights
  const mapPins = [
    {
      id: 1,
      type: 'place',
      label: '1',
      dateId: 'd1',
      x: '36%',
      y: '60%',
      color: '#3B82F6',
      name: dest.activities[0]?.name || 'Old Delhi Heritage',
    },
    {
      id: 2,
      type: 'place',
      label: '2',
      dateId: 'd1',
      x: '42%',
      y: '68%',
      color: '#3B82F6',
      name: dest.activities[1]?.name || 'Central Monument',
    },
    {
      id: 3,
      type: 'place',
      label: '3',
      dateId: 'd2',
      x: '62%',
      y: '32%',
      color: '#8B5CF6',
      name: dest.activities[2]?.name || 'Garden Oasis',
    },
    {
      id: 4,
      type: 'place',
      label: '4',
      dateId: 'd2',
      x: '52%',
      y: '48%',
      color: '#8B5CF6',
      name: dest.activities[3]?.name || 'Iconic Memorial Walk',
    },
    // Food pin
    {
      id: 11,
      type: 'food',
      label: 'F1',
      dateId: 'd1',
      x: '38%',
      y: '52%',
      color: '#EF4444',
      name: `Local Food Bazaar (${dest.name})`,
    },
  ];

  const activePins = mapPins.filter((pin) => {
    if (pin.type === 'place' && !showPlaces) return false;
    if (pin.type === 'food' && !showFood) return false;
    const dateObj = dates.find((d) => d.id === pin.dateId);
    return dateObj ? dateObj.active : true;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle with dynamic destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Interactive Map & Itinerary Waypoints for {dest.name}, {dest.country}
        </h2>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-[#e2e8f0] h-[480px] sm:h-[560px]">
        {/* Destination Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 transition duration-300"
          style={{
            backgroundImage: `url('${dest.coverImage}')`,
            filter: 'contrast(1.05) saturate(1.1)',
          }}
        />

        {/* Soft Grid Overlay */}
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] pointer-events-none" />

        {/* Floating Top-Left "Map layers" Card */}
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
              <Utensils size={14} className="text-rose-600" />
              <span>Food</span>
            </div>
            <div
              className={`grid h-4 w-4 place-items-center rounded border transition ${
                showFood ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {showFood && <Check size={11} strokeWidth={3} />}
            </div>
          </div>
        </div>

        {/* Floating Top-Right "Itinerary" Checklist Card */}
        <div className="absolute top-5 right-5 z-20 w-36 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-slate-200 space-y-2 animate-in fade-in">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
            Itinerary
          </span>

          <div className="space-y-1.5">
            {dates.map((d) => (
              <div
                key={d.id}
                onClick={() => toggleDate(d.id)}
                className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.label}</span>
                </div>
                <div
                  className={`grid h-4 w-4 place-items-center rounded border transition ${
                    d.active ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {d.active && <Check size={11} strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Route Trails */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
          <path
            d="M 180 340 L 210 380 L 310 180 L 260 270"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3.5"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Numbered & Food Pins on the Map */}
        {activePins.map((pin) => (
          <div
            key={pin.id}
            onClick={() => toast.info(`Waypoint: ${pin.name}`)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition transform hover:scale-125 group"
            style={{ left: pin.x, top: pin.y }}
          >
            {pin.type === 'food' ? (
              <div className="grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-white shadow-md ring-2 ring-white">
                <Utensils size={11} />
              </div>
            ) : (
              <div
                className="grid h-6 w-6 place-items-center rounded-full text-white font-black text-xs shadow-md ring-2 ring-white"
                style={{ backgroundColor: pin.color }}
              >
                {pin.label}
              </div>
            )}

            {/* Hover Tooltip Label */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-7 hidden group-hover:block whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md z-30 pointer-events-none">
              {pin.name}
            </div>
          </div>
        ))}

        {/* Floating Bottom-Right Google Maps Export Button */}
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
          <button
            onClick={handleExportGoogleMaps}
            className="flex items-center gap-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold px-4 py-2.5 text-xs shadow-xl border border-slate-200 transition active:scale-95"
          >
            <Navigation size={14} className="text-blue-600" />
            <span>Open in Google Maps</span>
            <ExternalLink size={12} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
