'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTrip, useExpenses, useTripMembers } from '@/hooks/useTrips';
import { toast } from 'sonner';
import {
  Loader2,
  MapPin,
  CalendarDays,
  ChevronRight,
  ArrowLeft,
  Users,
  Sparkles,
  Plus,
  X,
  Check,
  Pencil,
  Share2,
  Copy,
  SlidersHorizontal,
  Clock,
  DollarSign,
  Calendar as CalendarIcon,
  List as ListIcon,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import type { TripMember, Expense } from '@/types';
import { BudgetBreakdown } from '@/components/itinerary/BudgetBreakdown';

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function ItineraryView({ tripId }: { tripId: string }) {
  const { trip, loading, refetch } = useTrip(tripId);
  const { expenses, refetch: refetchExpenses } = useExpenses(tripId);
  const { members, refetch: refetchMembers } = useTripMembers(tripId);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'members'>('itinerary');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);

  const fetchShare = async () => {
    setShareLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setShareSlug(data.share_slug);
        setIsPublic(data.is_public);
      }
    } catch {
      console.error('Failed to load share slug');
    } finally {
      setShareLoading(false);
    }
  };

  const handleToggleShare = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic }),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setIsPublic(data.is_public);
        setShareSlug(data.share_slug);
        toast.success(data.is_public ? 'Trip is now public!' : 'Trip is now private.');
      }
    } catch {
      toast.error('Could not update share settings');
    }
  };

  const copyShareLink = () => {
    if (shareSlug) {
      const url = `${window.location.origin}/t/${shareSlug}`;
      navigator.clipboard.writeText(url);
      toast.success('Share link copied to clipboard!');
    }
  };

  const sortedStops = useMemo(() => {
    if (!trip?.stops) return [];
    return [...trip.stops].sort((a, b) => a.order - b.order);
  }, [trip?.stops]);

  // Compute total trip cost
  const totalTripCost = useMemo(() => {
    let sum = 0;
    if (trip?.stops) {
      for (const s of trip.stops) {
        for (const sa of s.stop_activities || []) {
          sum += Number(sa.activities?.cost || 0);
        }
      }
    }
    for (const exp of expenses || []) {
      sum += Number(exp.amount || 0);
    }
    return sum;
  }, [trip?.stops, expenses]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Trip not found</h2>
        <Link href="/trips" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
          Back to Trips
        </Link>
      </div>
    );
  }

  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const coverUrl =
    trip.cover_image_url ||
    sortedStops[0]?.cities?.image_url ||
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Breadcrumb & Share Trigger */}
      <div className="flex items-center justify-between">
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={14} /> My Trips
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <Pencil size={13} /> Edit Stops
          </Link>
          <button
            onClick={() => {
              fetchShare();
              setShowShareModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Share2 size={13} /> Share Itinerary
          </button>
        </div>
      </div>

      {/* Hero Header Card matching Screen 7 */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl h-64 sm:h-72">
        <img
          src={coverUrl}
          alt={trip.name}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span>•</span>
            <span>{sortedStops.length} Stops</span>
            {trip.budget_cap && (
              <>
                <span>•</span>
                <span>Budget: {formatINR(trip.budget_cap)}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{trip.name}</h1>
          {trip.description && (
            <p className="mt-1 max-w-xl text-xs sm:text-sm text-slate-200 line-clamp-2">
              {trip.description}
            </p>
          )}
        </div>
      </div>

      {/* Tabs & View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'itinerary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🗺️ Itinerary Timeline
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'budget'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 Budget Breakdown
          </button>
        </div>

        {activeTab === 'itinerary' && (
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <ListIcon size={12} /> List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <CalendarIcon size={12} /> Calendar View
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: ITINERARY (Screen 7 & Screen 10) */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {sortedStops.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
              <MapPin size={32} className="mx-auto text-blue-600 mb-2" />
              <h3 className="text-base font-bold text-slate-900">No stops in your itinerary</h3>
              <p className="text-xs text-slate-500 mt-1">Add destinations to generate your timeline.</p>
              <Link
                href={`/trips/${tripId}/plan`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus size={16} /> Add Stops
              </Link>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {sortedStops.map((stop, index) => {
                const arrive = new Date(stop.arrive_date);
                const leave = new Date(stop.leave_date);
                const activities = stop.stop_activities || [];

                return (
                  <div
                    key={stop.id}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      {/* Left Numbered Circle & Timeline connector line */}
                      <div className="flex flex-col items-center">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-extrabold text-white shadow-sm">
                          {index + 1}
                        </div>
                        {index < sortedStops.length - 1 && (
                          <div className="w-0.5 h-16 bg-blue-200 mt-2 dashed" />
                        )}
                      </div>

                      {/* City Image Thumbnail */}
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0">
                        <img
                          src={
                            stop.cities?.image_url ||
                            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'
                          }
                          alt={stop.cities?.name || 'City'}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-blue-600">
                          Day {index * 3 + 1}-{index * 3 + 3} •{' '}
                          {arrive.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {stop.cities?.name}, {stop.cities?.country}
                        </h3>

                        {/* Scheduled activities list */}
                        <div className="mt-2 space-y-1.5">
                          {activities.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No scheduled activities yet.</p>
                          ) : (
                            activities.map((sa) => (
                              <div
                                key={sa.id}
                                className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg"
                              >
                                <span className="font-semibold truncate">
                                  {sa.scheduled_time || '10:00 AM'} • {sa.activities?.name}
                                </span>
                                <span className="text-[11px] font-mono text-slate-500 font-bold ml-2">
                                  {formatINR(sa.activities?.cost || 0)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Estimated Cost Bar matching Screen 7 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Estimated Cost</span>
                  <p className="text-xl font-extrabold text-slate-900">{formatINR(totalTripCost)}</p>
                </div>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  View Budget 📊
                </button>
              </div>
            </div>
          ) : (
            /* CALENDAR VIEW (Feature 10) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedStops.map((stop, index) => {
                  const arrive = new Date(stop.arrive_date);
                  const activities = stop.stop_activities || [];

                  return (
                    <div
                      key={stop.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600 text-[11px] font-bold text-white">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{stop.cities?.name}</h4>
                            <span className="text-[10px] text-slate-400">{stop.cities?.country}</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                          {arrive.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activities.length === 0 ? (
                          <div className="py-4 text-center text-xs text-slate-400 italic">
                            No activities scheduled
                          </div>
                        ) : (
                          activities.map((sa) => (
                            <div
                              key={sa.id}
                              className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-blue-600">
                                  {sa.scheduled_time || '10:00 AM'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-700">
                                  {formatINR(sa.activities?.cost || 0)}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                                {sa.activities?.name}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Estimated Cost Bar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Estimated Cost</span>
                  <p className="text-xl font-extrabold text-slate-900">{formatINR(totalTripCost)}</p>
                </div>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                >
                  View Budget 📊
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUDGET BREAKDOWN (Screen 11) */}
      {activeTab === 'budget' && (
        <BudgetBreakdown
          tripId={tripId}
          trip={trip}
          onExpenseAdded={() => {
            refetch();
            refetchExpenses();
          }}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Share Itinerary</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Anyone with this public link can view your itinerary, see your destinations, and copy it to their account.
            </p>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Public Visibility</p>
                <p className="text-[11px] text-slate-400">
                  {isPublic ? 'Publicly viewable & sharable' : 'Private to you and members'}
                </p>
              </div>
              <button
                onClick={handleToggleShare}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  isPublic ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isPublic ? 'Public' : 'Private'}
              </button>
            </div>

            {isPublic && shareSlug && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Shareable URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/t/${shareSlug}`}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 outline-none"
                  />
                  <button
                    onClick={copyShareLink}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
