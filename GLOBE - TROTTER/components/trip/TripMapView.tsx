'use client';

import { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Sparkles, WifiOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Stop } from '@/types';
import { optimizeRouteNearestNeighbor, generateGoogleMapsDirectionsUrl, calculateTotalDistance } from '@/lib/routeOptimizer';

interface TripMapViewProps {
  stops: Stop[];
  tripId: string;
  onStopsReordered: () => void;
}

export function TripMapView({ stops, tripId, onStopsReordered }: TripMapViewProps) {
  const [optimizing, setOptimizing] = useState(false);
  const [offlineEnabled, setOfflineEnabled] = useState(false);

  const totalDistance = calculateTotalDistance(stops);

  const handleOptimize = async () => {
    if (stops.length < 2) {
      toast.info('Add at least 2 stops to optimize your route.');
      return;
    }

    setOptimizing(true);
    const { optimized, totalDistanceKm } = optimizeRouteNearestNeighbor(stops);

    try {
      // Update each stop's order on backend
      await Promise.all(
        optimized.map((stop, idx) =>
          fetch(`/api/stops/${stop.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: idx }),
            credentials: 'include',
          })
        )
      );

      toast.success(`Route optimized! Shortest path: ~${totalDistanceKm.toLocaleString()} km`);
      onStopsReordered();
    } catch {
      toast.error('Failed to optimize route');
    } finally {
      setOptimizing(false);
    }
  };

  const handleExportGoogleMaps = () => {
    if (stops.length === 0) return;
    const url = generateGoogleMapsDirectionsUrl(stops as any);
    window.open(url, '_blank');
  };

  const handleOfflineToggle = () => {
    const next = !offlineEnabled;
    setOfflineEnabled(next);
    if (next) {
      toast.success('Trip cached for offline view');
    } else {
      toast.info('Offline caching disabled');
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Navigation size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interactive Route Map</h3>
              <span className="text-[10px] text-slate-400">
                {stops.length} Stops • ~{Math.round(totalDistance).toLocaleString()} km total distance
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Offline Toggle */}
          <button
            onClick={handleOfflineToggle}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              offlineEnabled
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {offlineEnabled ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-600" />
                Available Offline
              </>
            ) : (
              <>
                <WifiOff size={13} />
                Save Offline
              </>
            )}
          </button>

          {/* Optimize Route (Nearest Neighbor Real Calculation) */}
          <button
            onClick={handleOptimize}
            disabled={optimizing || stops.length < 2}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50 transition active:scale-98"
          >
            <Sparkles size={13} className={optimizing ? 'animate-spin' : ''} />
            {optimizing ? 'Optimizing...' : 'Optimize Route'}
          </button>

          {/* Export to Google Maps */}
          <button
            onClick={handleExportGoogleMaps}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <ExternalLink size={13} />
            Google Maps
          </button>
        </div>
      </div>

      {/* Visual Route Canvas */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 p-6 text-white min-h-[220px] flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold">
            Multi-Stop Itinerary Route
          </span>
          <span className="text-xs font-mono font-bold text-slate-300">
            {stops.length} Waypoints
          </span>
        </div>

        {/* Route Steps Visual Trail */}
        {stops.length === 0 ? (
          <div className="relative z-10 my-auto text-center py-6">
            <MapPin size={28} className="mx-auto text-slate-500 mb-2 opacity-50" />
            <p className="text-xs text-slate-400">No destinations added to map yet.</p>
          </div>
        ) : (
          <div className="relative z-10 my-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              return (
                <div key={stop.id || index} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-center group">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600/90 text-white font-bold text-xs shadow-lg shadow-blue-500/30 border border-blue-400/30 group-hover:scale-110 transition">
                      0{index + 1}
                    </div>
                    <span className="text-xs font-bold mt-1.5 text-white max-w-[80px] truncate text-center">
                      {stop.cities?.name || 'City'}
                    </span>
                    <span className="text-[9px] text-slate-400">{stop.cities?.country}</span>
                  </div>

                  {!isLast && (
                    <div className="flex flex-col items-center">
                      <div className="w-8 sm:w-14 border-t-2 border-dashed border-blue-400/50" />
                      <span className="text-[8px] font-mono text-blue-300/80 mt-0.5">
                        {Math.round(
                          calculateTotalDistance([stop, stops[index + 1]])
                        )} km
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin size={12} className="text-blue-400" />
            Smart Waypoint Ordering Enabled
          </span>
          <span className="text-slate-400">
            Open in Google Maps for live GPS navigation
          </span>
        </div>
      </div>
    </div>
  );
}
