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
  Calendar,
  Sparkles,
  Trash2,
  Hotel,
  Plane,
  Eye,
  CheckCircle2,
  Clock,
  Wallet,
  Compass,
  Edit3,
} from 'lucide-react';
import Link from 'next/link';
import type { City, Activity, Stop } from '@/types';

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function ItineraryBuilder({ tripId }: { tripId: string }) {
  const { trip, loading, refetch } = useTrip(tripId);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Calculate total budget across sections
  const totalSectionsBudget = useMemo(() => {
    if (!trip?.stops) return 0;
    return trip.stops.reduce((sum, stop) => {
      const stopActivityCost =
        stop.stop_activities?.reduce((s, sa) => s + Number(sa.activities?.cost ?? 0), 0) ?? 0;
      return sum + (stop.budget && stop.budget > 0 ? stop.budget : stopActivityCost);
    }, 0);
  }, [trip]);

  const toggleSection = (id: string) =>
    setExpandedSections((cur) =>
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
      toast.success('Section reordered successfully');
      refetch();
    } catch {
      toast.error('Failed to reorder section');
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Section removed from itinerary');
        refetch();
      }
    } catch {
      toast.error('Failed to remove section');
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
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-slate-500">Trip not found or access denied.</p>
        <Link href="/trips" className="mt-4 inline-block font-bold text-blue-600">
          Back to trips
        </Link>
      </div>
    );
  }

  const sortedStops = [...(trip.stops ?? [])].sort((a, b) => a.order - b.order);

  // Auto-expand all sections by default if not set
  const isAllExpanded = expandedSections.length === sortedStops.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 pb-24">
      {/* Top Header Breadcrumbs */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/trips/${tripId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={15} /> Back to Trip Details
        </Link>
        <Link
          href={`/trips/${tripId}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition"
        >
          <Eye size={14} /> Preview Live Itinerary
        </Link>
      </div>

      {/* Main Trip Header Ribbon */}
      <div className="mb-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-400/20 mb-2">
              <Compass size={13} /> Day-Wise Itinerary Plan
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{trip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 rounded-2xl p-3 px-4 border border-slate-700/50">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Sections</span>
              <p className="text-base font-extrabold text-blue-400">{sortedStops.length} Planned</p>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Budget</span>
              <p className="text-base font-extrabold text-emerald-400">
                {formatINR(totalSectionsBudget > 0 ? totalSectionsBudget : (trip.budget_cap || 75000))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS LIST (Matching Wireframe Screen 5: Section 1, Section 2, Section 3...) */}
      <div className="space-y-6">
        {sortedStops.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
            <MapPin size={36} className="mx-auto text-blue-600 mb-2.5" />
            <h3 className="text-base font-bold text-slate-900">No sections added yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Construct your day-wise trip plan by adding travel sections, hotel bookings, or city exploration stops.
            </p>
            <button
              onClick={() => setShowSectionModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              <Plus size={15} /> Add First Section
            </button>
          </div>
        ) : (
          sortedStops.map((stop, index) => {
            const isExpanded = !expandedSections.includes(stop.id); // default expanded
            const arrive = new Date(stop.arrive_date);
            const leave = new Date(stop.leave_date);
            const activities = stop.stop_activities || [];
            const activitiesCost = activities.reduce((sum, a) => sum + (a.activities?.cost || 0), 0);
            const sectionBudget = stop.budget && stop.budget > 0 ? stop.budget : activitiesCost;

            const sectionTitle = stop.title || `Section ${index + 1}: ${stop.cities?.name || 'Destination Stop'}`;
            const sectionDesc =
              stop.description ||
              `All the necessary information about this section (travel transfers, hotel accommodation, and ${activities.length} planned activities in ${stop.cities?.name || 'the city'}).`;

            return (
              <div
                key={stop.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:border-blue-300"
              >
                {/* SECTION CARD MAIN (Matching Screen 5) */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Top Bar: Section Title & Controls */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white uppercase tracking-wider">
                          Section {index + 1}
                        </span>
                        {stop.cities && (
                          <span className="text-xs font-bold text-slate-500">
                            📍 {stop.cities.name}, {stop.cities.country}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">{sectionTitle}</h2>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleReorder(stop.id, 'up')}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition"
                        title="Move Section Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        disabled={index === sortedStops.length - 1}
                        onClick={() => handleReorder(stop.id, 'down')}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition"
                        title="Move Section Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Section Description / Info text */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sectionDesc}
                  </p>

                  {/* TWO WIREFRAME PILLS: [Date Range: xxx to yyy] [Budget of this section] */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Box 1: Date Range */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 px-4 shadow-2xs">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Date Range:
                        </span>
                        <p className="text-xs font-bold text-slate-900">
                          {arrive.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to{' '}
                          {leave.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Box 2: Budget of this section */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 px-4 shadow-2xs">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
                        <Wallet size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Budget of this section:
                        </span>
                        <p className="text-xs font-extrabold text-emerald-700">
                          {formatINR(sectionBudget > 0 ? sectionBudget : 15000)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activities Accordion & Management */}
                  <div className="pt-3 border-t border-slate-100">
                    <div
                      onClick={() => toggleSection(stop.id)}
                      className="flex items-center justify-between cursor-pointer py-1 text-xs font-bold text-slate-700 hover:text-blue-600 transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={14} className="text-blue-600" />
                        Planned Activities ({activities.length})
                      </span>
                      <span className="text-[11px] text-blue-600 flex items-center gap-1">
                        {isExpanded ? 'Hide Activities' : 'Show Activities'}
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 animate-in fade-in">
                        {activities.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 italic">
                            No activities assigned to this section yet. Pick recommended experiences below:
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {activities.map((sa) => (
                              <div
                                key={sa.id}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:border-slate-300 transition"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <h5 className="text-xs font-bold text-slate-900 truncate">
                                      {sa.activities?.name}
                                    </h5>
                                    <span className="text-[10px] text-slate-500 block">
                                      {sa.scheduled_time || 'Morning'} • {formatINR(sa.activities?.cost || 0)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveActivity(stop.id, sa.id)}
                                  className="text-slate-400 hover:text-red-600 p-1 transition"
                                  title="Remove activity"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick Activity Picker */}
                        <ActivityPicker
                          stopId={stop.id}
                          cityId={stop.city_id}
                          onAdded={refetch}
                          existingActivityIds={activities.map((sa) => sa.activity_id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PRIMARY CTA: "+ Add another Section" (Directly matching wireframe Screen 5 bottom button) */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setShowSectionModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-900 hover:text-white transition active:scale-95 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add another Section
        </button>
      </div>

      {/* ADD SECTION MODAL POPUP */}
      {showSectionModal && (
        <AddSectionModal
          tripId={tripId}
          onClose={() => setShowSectionModal(false)}
          onAdded={() => {
            setShowSectionModal(false);
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
    return <div className="text-xs text-slate-400 py-2">Loading curated experiences...</div>;
  }

  if (available.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <span className="text-[11px] font-bold text-slate-500 mb-2 block">
        + Add More Experiences to this Section:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {available.slice(0, 4).map((act) => (
          <button
            key={act.id}
            disabled={addingId === act.id}
            onClick={() => handleAdd(act)}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left text-xs hover:border-blue-400 hover:bg-blue-50/40 transition disabled:opacity-50"
          >
            <div className="min-w-0 pr-2">
              <span className="font-semibold text-slate-900 block truncate">{act.name}</span>
              <span className="text-[10px] text-emerald-700 font-bold">{formatINR(act.cost)}</span>
            </div>
            <Plus size={14} className="text-blue-600 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AddSectionModal({
  tripId,
  onClose,
  onAdded,
}: {
  tripId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { cities } = useCities();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'city' | 'hotel' | 'travel' | 'activity'>('city');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(25000);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [arriveDate, setArriveDate] = useState('2026-09-18');
  const [leaveDate, setLeaveDate] = useState('2026-09-22');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedCity) {
      toast.error('Please select a destination city for this section');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCity.id,
          title: title || `Stop: ${selectedCity.name}`,
          description: description || `All the necessary information about this section (travel, accommodation, and activities in ${selectedCity.name}).`,
          budget: Number(budget) || 0,
          category,
          arriveDate,
          leaveDate,
        }),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to create section');
      toast.success(`Section for ${selectedCity.name} added to itinerary!`);
      onAdded();
    } catch {
      toast.error('Failed to add section');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Itinerary Section</h3>
            <p className="text-xs text-slate-500">Configure section title, dates, budget and destination</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* Section Type & Title */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Section Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flight to Rome & Hotel Check-in, Swiss Mountain Tour..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Destination City:</label>
            {!selectedCity ? (
              <div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  placeholder="Search city (e.g. Paris, Rome, Bali, Tokyo)..."
                />
                <div className="mt-2 max-h-36 space-y-1 overflow-y-auto pr-1">
                  {filtered.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCity(c);
                        if (!title) setTitle(`Exploration & Activities in ${c.name}`);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg border border-slate-100 p-2 text-left hover:bg-blue-50 transition"
                    >
                      <img
                        src={c.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                        alt={c.name}
                        className="h-8 w-8 rounded-md object-cover"
                      />
                      <span className="text-xs font-bold text-slate-900">{c.name}, {c.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedCity.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                    alt={selectedCity.name}
                    className="h-9 w-9 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{selectedCity.name}</h5>
                    <span className="text-[10px] text-slate-500">{selectedCity.country}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCity(null)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Start Date:</label>
              <input
                type="date"
                value={arriveDate}
                onChange={(e) => setArriveDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">End Date:</label>
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section Budget */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Section Budget:</span>
              <span className="text-emerald-600 font-extrabold">{formatINR(budget)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={2000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Section Information text */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Section Information & Notes:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="All the necessary information about this section (travel, hotel, or activity notes)..."
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Adding...' : '+ Add Section'}
          </button>
        </div>
      </div>
    </div>
  );
}
