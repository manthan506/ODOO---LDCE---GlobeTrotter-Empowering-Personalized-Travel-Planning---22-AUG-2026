'use client';

import { useState, useMemo } from 'react';
import { useTrip, useCities, useCityActivities } from '@/hooks/useTrips';
import { toast } from 'sonner';
import {
  Loader2,
  Plus,
  MapPin,
  ChevronDown,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Sparkles,
  Trash2,
  Hotel,
  Camera,
  Luggage,
  User,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import type { City, Activity, Stop } from '@/types';

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function ItineraryBuilder({ tripId }: { tripId: string }) {
  const { trip, loading, refetch } = useTrip(tripId);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [expandedStops, setExpandedStops] = useState<string[]>([]);

  const totalActivityCost = useMemo(() => {
    if (!trip?.stops) return 0;
    return trip.stops.reduce(
      (sum, stop) =>
        sum +
        (stop.stop_activities?.reduce(
          (s, sa) => s + Number(sa.activities?.cost ?? 0),
          0
        ) ?? 0),
      0
    );
  }, [trip]);

  const toggleStop = (id: string) =>
    setExpandedStops((cur) =>
      cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]
    );

  const handleReorder = async (stopId: string, direction: 'up' | 'down') => {
    if (!trip?.stops) return;
    const stops = [...trip.stops].sort((a, b) => a.order - b.order);
    const idx = stops.findIndex((s) => s.id === stopId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === stops.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const a = stops[idx];
    const b = stops[swapIdx];

    try {
      await Promise.all([
        fetch(`/api/stops/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: b.order }),
          credentials: 'include',
        }),
        fetch(`/api/stops/${b.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: a.order }),
          credentials: 'include',
        }),
      ]);
      refetch();
    } catch {
      toast.error('Failed to reorder stop');
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Stop removed from itinerary');
        refetch();
      }
    } catch {
      toast.error('Failed to remove stop');
    }
  };

  const handleRemoveActivity = async (stopId: string, stopActivityId: string) => {
    try {
      const res = await fetch(`/api/stops/${stopId}/activities?id=${stopActivityId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Activity removed');
        refetch();
      }
    } catch {
      toast.error('Failed to remove activity');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
        <p className="text-sm text-slate-500">Trip not found or access denied.</p>
        <Link href="/trips" className="mt-4 inline-block font-bold text-blue-600">
          Back to trips
        </Link>
      </div>
    );
  }

  const sortedStops = [...(trip.stops ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Top Breadcrumb & Header matching Screen 6 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/trips/${tripId}`}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Itinerary Builder
        </Link>
        <Link
          href={`/trips/${tripId}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          View Live Itinerary →
        </Link>
      </div>

      {/* Trip Banner Title */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{trip.name}</h1>
            <p className="text-xs text-blue-100 mt-0.5">
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-blue-200 uppercase font-semibold">Planned Stops</span>
            <p className="text-lg font-bold">{sortedStops.length} Cities</p>
          </div>
        </div>
      </div>

      {/* Stops list */}
      <div className="space-y-4">
        {sortedStops.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <MapPin size={32} className="mx-auto text-blue-600 mb-2" />
            <h3 className="text-base font-bold text-slate-900">No stops added yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Start by adding your first city stop to build out this trip itinerary.
            </p>
            <button
              onClick={() => setShowStopDialog(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus size={16} /> Add First Stop
            </button>
          </div>
        ) : (
          sortedStops.map((stop, index) => {
            const isExpanded = expandedStops.includes(stop.id);
            const arrive = new Date(stop.arrive_date);
            const leave = new Date(stop.leave_date);
            const daysCount = Math.max(1, Math.round((leave.getTime() - arrive.getTime()) / (1000 * 60 * 60 * 24)));
            const activities = stop.stop_activities || [];

            return (
              <div
                key={stop.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
              >
                {/* Main Stop Card Header matching Screen 6 */}
                <div
                  onClick={() => toggleStop(stop.id)}
                  className="flex cursor-pointer items-center justify-between p-4 gap-3 select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Numbered stop circle badge (1, 2, 3, 4) */}
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-xs font-extrabold text-white flex-shrink-0">
                      {index + 1}
                    </div>

                    {/* City Thumbnail */}
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                      <img
                        src={stop.cities?.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                        alt={stop.cities?.name || 'City'}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {stop.cities?.name}, {stop.cities?.country}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {arrive.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                        {leave.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({daysCount} {daysCount === 1 ? 'Day' : 'Days'})
                      </p>

                      {/* Small Action Icons (Hotel, Camera, Luggage, User) */}
                      <div className="flex items-center gap-2.5 mt-2 text-slate-400">
                        <Hotel size={13} className="hover:text-blue-600 transition" />
                        <Camera size={13} className="hover:text-blue-600 transition" />
                        <Luggage size={13} className="hover:text-blue-600 transition" />
                        <User size={13} className="hover:text-blue-600 transition" />
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reorder and expand actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      disabled={index === 0}
                      onClick={() => handleReorder(stop.id, 'up')}
                      className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      disabled={index === sortedStops.length - 1}
                      onClick={() => handleReorder(stop.id, 'down')}
                      className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteStop(stop.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete Stop"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div onClick={() => toggleStop(stop.id)} className="cursor-pointer pl-1 text-slate-400">
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Activity Section */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Scheduled Activities:</span>
                    </div>

                    {activities.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No activities added to this stop yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {activities.map((sa) => (
                          <div
                            key={sa.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <Sparkles size={16} className="text-blue-600" />
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{sa.activities?.name}</h5>
                                <span className="text-[10px] text-slate-400">
                                  {sa.scheduled_time || '10:00 AM'} • {formatINR(sa.activities?.cost || 0)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveActivity(stop.id, sa.id)}
                              className="text-slate-400 hover:text-red-600 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Activity Picker */}
                    <ActivityPicker
                      stopId={stop.id}
                      cityId={stop.city_id}
                      onAdded={refetch}
                      existingActivityIds={activities.map((sa) => sa.activity_id)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom CTA Buttons matching Screen 6 (+ Add Stop and View Itinerary) */}
      <div className="mt-6 space-y-3">
        <button
          onClick={() => setShowStopDialog(true)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 py-3.5 text-xs font-bold text-blue-700 transition"
        >
          <Plus size={16} /> Add Stop
        </button>

        <Link
          href={`/trips/${tripId}`}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition"
        >
          <Eye size={16} /> View Itinerary
        </Link>
      </div>

      {/* Add Stop Modal */}
      {showStopDialog && (
        <AddStopModal
          tripId={tripId}
          onClose={() => setShowStopDialog(false)}
          onAdded={() => {
            setShowStopDialog(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function ActivityPicker({
  stopId,
  cityId,
  onAdded,
  existingActivityIds,
}: {
  stopId: string;
  cityId: string;
  onAdded: () => void;
  existingActivityIds: string[];
}) {
  const { activities, loading } = useCityActivities(cityId);
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAdd = async (activity: Activity) => {
    setAddingId(activity.id);
    try {
      const res = await fetch(`/api/stops/${stopId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          scheduledTime: '10:00 AM',
        }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success(`Added ${activity.name}`);
        onAdded();
      }
    } catch {
      toast.error('Failed to add activity');
    } finally {
      setAddingId(null);
    }
  };

  const available = activities.filter((a) => !existingActivityIds.includes(a.id));

  if (loading) {
    return <div className="text-xs text-slate-400 py-2">Loading city activities...</div>;
  }

  if (available.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <span className="text-[11px] font-bold text-slate-500 mb-2 block">Quick Add Activities:</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {available.slice(0, 4).map((act) => (
          <button
            key={act.id}
            disabled={addingId === act.id}
            onClick={() => handleAdd(act)}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left text-xs hover:border-blue-300 hover:bg-blue-50/30 transition disabled:opacity-50"
          >
            <div className="min-w-0 pr-2">
              <span className="font-semibold text-slate-900 block truncate">{act.name}</span>
              <span className="text-[10px] text-slate-400">{formatINR(act.cost)}</span>
            </div>
            <Plus size={14} className="text-blue-600 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AddStopModal({
  tripId,
  onClose,
  onAdded,
}: {
  tripId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { cities } = useCities();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [arriveDate, setArriveDate] = useState('2025-05-20');
  const [leaveDate, setLeaveDate] = useState('2025-05-24');
  const [saving, setSaving] = useState(false);

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedCity) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCity.id,
          arriveDate,
          leaveDate,
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to create stop');
      toast.success(`${selectedCity.name} added to itinerary!`);
      onAdded();
    } catch {
      toast.error('Failed to add stop');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Add Destination Stop</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {!selectedCity ? (
          <div>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
              placeholder="Search cities (e.g. Paris, Rome, Tokyo)..."
            />
            <div className="mt-3 max-h-60 space-y-2 overflow-y-auto pr-1">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c)}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-white p-2.5 text-left hover:border-blue-200 hover:bg-blue-50/50 transition"
                >
                  <img
                    src={c.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                    alt={c.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{c.name}</h5>
                    <span className="text-[10px] text-slate-500">{c.country}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={selectedCity.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                alt={selectedCity.name}
                className="h-11 w-11 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-900">{selectedCity.name}</h5>
                <span className="text-[10px] text-slate-500">{selectedCity.country}</span>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Arrive</label>
                <input
                  type="date"
                  value={arriveDate}
                  onChange={(e) => setArriveDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Leave</label>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : `Add ${selectedCity.name} to Itinerary`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
