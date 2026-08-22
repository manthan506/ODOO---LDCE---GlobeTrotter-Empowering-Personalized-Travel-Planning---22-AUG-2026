'use client';

import { useState } from 'react';
import { Clock, DollarSign, Sun, Check, Heart, X, Plus, Sparkles, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Activity } from '@/types';
import { useTrips } from '@/hooks/useTrips';

interface ActivityDetailsSheetProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onAddedToTrip?: () => void;
}

export function ActivityDetailsSheet({
  activity,
  isOpen,
  onClose,
  onAddedToTrip,
}: ActivityDetailsSheetProps) {
  const { trips } = useTrips();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [showTripPicker, setShowTripPicker] = useState(false);
  const [adding, setAdding] = useState(false);

  if (!isOpen || !activity) return null;

  const handleAddToTrip = async () => {
    if (trips.length === 0) {
      toast.error('Please create a trip first!');
      return;
    }

    if (!showTripPicker) {
      setShowTripPicker(true);
      if (trips.length > 0 && !selectedTripId) {
        setSelectedTripId(trips[0].id);
      }
      return;
    }

    if (!selectedTripId) {
      toast.error('Please select a trip');
      return;
    }

    setAdding(true);
    try {
      // First fetch the selected trip's stops
      const tripRes = await fetch(`/api/trips/${selectedTripId}`, { credentials: 'include' });
      if (!tripRes.ok) throw new Error('Could not load trip stops');
      const tripData = await tripRes.json();

      let targetStopId: string;
      if (tripData.stops && tripData.stops.length > 0) {
        targetStopId = tripData.stops[0].id;
      } else {
        // Create a default stop in this trip with the activity's city
        const stopRes = await fetch(`/api/trips/${selectedTripId}/stops`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cityId: activity.city_id,
            arriveDate: tripData.start_date || '2025-05-20',
            leaveDate: tripData.end_date || '2025-05-25',
          }),
          credentials: 'include',
        });
        const stopData = await stopRes.json();
        targetStopId = stopData.id;
      }

      // Add activity to this stop
      const addRes = await fetch(`/api/stops/${targetStopId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          scheduledTime: '10:00 AM',
        }),
        credentials: 'include',
      });

      if (!addRes.ok) throw new Error('Failed to add activity');

      toast.success(`"${activity.name}" added to your trip!`);
      setShowTripPicker(false);
      onClose();
      if (onAddedToTrip) onAddedToTrip();
    } catch (err) {
      console.error(err);
      toast.error('Could not add activity to trip');
    } finally {
      setAdding(false);
    }
  };

  const defaultIncludes = [
    'Hotel pickup & drop-off',
    'Certified local tour guide',
    'All equipment & entrance tickets',
    'Passenger insurance & safety gear',
  ];

  const includesList = (activity as any).includes && (activity as any).includes.length > 0
    ? (activity as any).includes
    : defaultIncludes;

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
        {/* Hero Image Section with Overlay Buttons */}
        <div className="relative h-64 w-full bg-slate-900 flex-shrink-0">
          <img
            src={activity.image_url || 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800&q=80'}
            alt={activity.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top action controls */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                1 / 7
              </span>
              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  toast.success(isLiked ? 'Removed from favorites' : 'Saved to favorites');
                }}
                className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
              >
                <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-white'} />
              </button>
            </div>
          </div>

          {/* Activity Category Badge on bottom left of hero */}
          <div className="absolute bottom-3 left-4">
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider backdrop-blur-sm">
              {activity.category}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{activity.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
              <MapPin size={14} className="text-blue-600" />
              <span>Available in Itinerary</span>
            </div>
          </div>

          {/* Quick Specs Pills (Duration, Cost tier, Best time) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Clock size={18} className="text-blue-600 mb-1" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Duration</span>
              <span className="text-xs font-bold text-slate-800">
                {activity.duration_min ? `${Math.round(activity.duration_min / 60)} - ${Math.round(activity.duration_min / 60) + 1} hrs` : '2-3 hrs'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <DollarSign size={18} className="text-emerald-600 mb-1" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Cost Tier</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {activity.cost > 10000 ? '$$$$' : activity.cost > 4000 ? '$$$' : '$$'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Sun size={18} className="text-amber-500 mb-1" />
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Best Time</span>
              <span className="text-xs font-bold text-slate-800">
                {(activity as any).best_time || 'Morning'}
              </span>
            </div>
          </div>

          {/* About this activity */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">About this activity</h4>
            <p className="text-xs leading-relaxed text-slate-600">
              {(activity as any).description ||
                `Immerse yourself in ${activity.name}. Enjoy guided highlights, memorable photo stops, and an authentic local experience tailored for all travelers.`}
            </p>
          </div>

          {/* Includes list */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2.5">Includes</h4>
            <div className="space-y-2">
              {includesList.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <div className="grid h-4 w-4 place-items-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Picker Dropdown when clicked */}
          {showTripPicker && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <label className="block text-xs font-bold text-blue-900">Select Trip to Add this Activity:</label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.start_date})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Bottom CTA Bar (Screen 10) */}
        <div className="border-t border-slate-100 bg-slate-50/80 p-4 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Estimated Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">{formatINR(activity.cost)}</span>
              <span className="text-xs text-slate-500">/ person</span>
            </div>
          </div>

          <button
            type="button"
            disabled={adding}
            onClick={handleAddToTrip}
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition disabled:opacity-50"
          >
            {adding ? (
              'Adding...'
            ) : showTripPicker ? (
              <>Confirm Add ✨</>
            ) : (
              <>Add to Trip</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
