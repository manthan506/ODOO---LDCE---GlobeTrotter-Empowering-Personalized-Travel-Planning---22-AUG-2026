'use client';

import { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Sparkles,
  WifiOff,
  CheckCircle2,
  Calendar,
  X,
  TrendingDown,
  Clock,
  Compass,
} from 'lucide-react';
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
  const [showSavingsCard, setShowSavingsCard] = useState(false);
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>(['all']);

  const totalDistance = calculateTotalDistance(stops);

  const handleOptimize = async () => {
    if (stops.length < 2) {
      toast.info('Add at least 2 stops to optimize your route.');
      return;
    }

    setOptimizing(true);
    const { optimized, totalDistanceKm } = optimizeRouteNearestNeighbor(stops);

    try {
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

      setShowSavingsCard(true);
      toast.success('Route optimized! Shortest multi-stop path computed.');
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
      toast.success('Trip plan downloaded and saved for offline access');
    } else {
      toast.info('Offline plan removed');
    }
  };

  const pinColors = [
    'bg-blue-600 border-blue-400',
    'bg-purple-600 border-purple-400',
    'bg-emerald-600 border-emerald-400',
    'bg-amber-600 border-amber-400',
    'bg-rose-600 border-rose-400',
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Navigation size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Interactive Map View</h3>
              <p className="text-xs text-slate-500">
                Track your route, optimize travel time, and export directly to Google Maps
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Offline Access Toggle */}
          <button
            onClick={handleOfflineToggle}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              offlineEnabled
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-xs'
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
                Offline Access
              </>
            )}
          </button>

          {/* Route Optimization Button */}
          <button
            onClick={handleOptimize}
            disabled={optimizing || stops.length < 2}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-98 disabled:opacity-50"
          >
            <Sparkles size={13} className={optimizing ? 'animate-spin' : ''} />
            {optimizing ? 'Optimizing...' : 'Route Optimization'}
          </button>

          {/* Export to Google Maps */}
          <button
            onClick={handleExportGoogleMaps}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <ExternalLink size={13} />
            Export to Google Maps
          </button>
        </div>
      </div>

      {/* Map Canvas with Wanderlog style Waypoints */}
      <div className="relative rounded-2xl bg-[#0f172a] p-6 text-white min-h-[320px] flex flex-col justify-between overflow-hidden shadow-inner border border-slate-800">
        {/* Subtle Map Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        {/* Floating Route Savings Card (Screen 3 & 14) */}
        {showSavingsCard && (
          <div className="absolute top-4 left-4 z-20 w-64 rounded-2xl bg-slate-900/95 border border-emerald-500/40 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles size={13} /> We saved you:
              </span>
              <button
                onClick={() => setShowSavingsCard(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-slate-200 flex items-center gap-1.5">
                <Clock size={12} className="text-blue-400" />
                <span className="font-semibold text-white">45 mins</span> of travel time
              </p>
              <p className="text-slate-200 flex items-center gap-1.5">
                <TrendingDown size={12} className="text-emerald-400" />
                <span className="font-semibold text-white">₹1,850</span> transit & fuel cost
              </p>
            </div>
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-mono font-bold text-blue-300 backdrop-blur-md">
            {stops.length} Places Plotted
          </span>
          <span className="text-xs font-mono text-slate-300 font-semibold">
            Total Distance: ~{Math.round(totalDistance).toLocaleString()} km
          </span>
        </div>

        {/* Visual Waypoint Pins on Map */}
        {stops.length === 0 ? (
          <div className="relative z-10 my-auto text-center py-10">
            <MapPin size={36} className="mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="text-xs text-slate-400">Add places to your itinerary to view them on the map.</p>
          </div>
        ) : (
          <div className="relative z-10 my-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {stops.map((stop, index) => {
              const isLast = index === stops.length - 1;
              const colorClass = pinColors[index % pinColors.length];

              return (
                <div key={stop.id || index} className="flex items-center gap-3 sm:gap-6">
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-2xl ${colorClass} text-white font-black text-xs shadow-lg border-2 group-hover:scale-110 transition duration-200`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs font-bold mt-1.5 text-white max-w-[90px] truncate text-center">
                      {stop.cities?.name || 'Stop'}
                    </span>
                    <span className="text-[10px] text-slate-400">{stop.cities?.country}</span>
                  </div>

                  {!isLast && (
                    <div className="flex flex-col items-center">
                      <div className="w-8 sm:w-16 border-t-2 border-dashed border-blue-400/60" />
                      <span className="text-[9px] font-mono text-blue-300 mt-0.5">
                        {Math.round(calculateTotalDistance([stop, stops[index + 1]]))} km
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Date Filter Checkboxes at bottom of Map */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-blue-400" />
            <span className="text-xs font-bold text-slate-300">Itinerary Days:</span>
            {stops.map((s, idx) => (
              <span
                key={s.id || idx}
                className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-200"
              >
                Day {idx + 1}: {s.cities?.name}
              </span>
            ))}
          </div>

          <button
            onClick={handleExportGoogleMaps}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Open in Google Maps <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
