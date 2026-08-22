'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Utensils,
  Navigation,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  Check,
  ZoomIn,
  ZoomOut,
  Landmark,
  Compass,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Stop } from '@/types';
import { generateGoogleMapsDirectionsUrl } from '@/lib/routeOptimizer';
import { getDestinationInfo } from '@/lib/destinationData';
import { geocodeCity, fetchRealNearbyPlaces, RealPlace } from '@/lib/api/openApis';

interface TripMapViewProps {
  stops?: Stop[];
  tripId: string;
  tripName?: string;
  onStopsReordered?: () => void;
}

export function TripMapView({
  stops = [],
  tripId,
  tripName = 'Japan',
  onStopsReordered,
}: TripMapViewProps) {
  const dest = getDestinationInfo(tripName);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: dest.lat,
    lng: dest.lng,
  });
  const [showPlaces, setShowPlaces] = useState(true);
  const [showFood, setShowFood] = useState(true);
  const [realPlaces, setRealPlaces] = useState<RealPlace[]>([]);
  const [loadingMap, setLoadingMap] = useState(true);

  // Date Checklists
  const [dates, setDates] = useState([
    { id: 'd1', label: 'Day 1', color: '#3B82F6', active: true },
    { id: 'd2', label: 'Day 2', color: '#8B5CF6', active: true },
    { id: 'd3', label: 'Day 3', color: '#10B981', active: true },
  ]);

  useEffect(() => {
    let isMounted = true;
    async function initMapData() {
      setLoadingMap(true);
      const geo = await geocodeCity(tripName || dest.name);
      if (isMounted) {
        setCoords({ lat: geo.lat, lng: geo.lng });
      }

      const places = await fetchRealNearbyPlaces(geo.lat, geo.lng);
      if (isMounted) {
        setRealPlaces(places);
        setLoadingMap(false);
      }
    }

    initMapData();
    return () => {
      isMounted = false;
    };
  }, [tripName, dest.name]);

  const toggleDate = (id: string) => {
    setDates((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleExportGoogleMaps = () => {
    const waypoints =
      realPlaces.length > 0
        ? realPlaces.slice(0, 5).map((p) => ({ name: p.name, country: dest.country }))
        : dest.activities.map((act) => ({ name: act.name, country: dest.country }));

    const url = generateGoogleMapsDirectionsUrl(waypoints as any);
    window.open(url, '_blank');
  };

  const filteredPlaces = realPlaces.filter((p) => {
    if (p.category === 'food' && !showFood) return false;
    if (p.category !== 'food' && !showPlaces) return false;
    return true;
  });

  const bbox = `${coords.lng - 0.08}%2C${coords.lat - 0.05}%2C${coords.lng + 0.08}%2C${coords.lat + 0.05}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Subtitle with dynamic destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Live OpenStreetMap & Itinerary Waypoints for {dest.name}, {dest.country}
        </h2>
      </div>

      {/* Main Map Container with Real OpenStreetMap Embed */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 h-[500px] sm:h-[580px]">
        {/* Real OpenStreetMap Live Tile Engine */}
        <iframe
          title={`OpenStreetMap for ${dest.name}`}
          src={osmEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />

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

        {/* Bottom Destination Info Badge */}
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-md">
          <Compass size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{dest.name} ({coords.lat.toFixed(3)}°, {coords.lng.toFixed(3)}°)</span>
        </div>

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
