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
        setShareSlug(data.share_slug);
        setIsPublic(data.is_public);
        toast.success(data.is_public ? 'Trip is now public' : 'Trip set to private');
      }
    } catch {
      toast.error('Failed to update share');
    }
  };

  const copyShareLink = () => {
    if (!shareSlug) return;
    const url = `${window.location.origin}/t/${shareSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Public trip link copied to clipboard!');
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
        <p className="text-sm text-slate-500">Trip not found or you don&apos;t have access to it.</p>
        <Link href="/trips" className="mt-4 inline-block font-bold text-blue-600">
          Back to trips
        </Link>
      </div>
    );
  }

  const sortedStops = [...(trip.stops ?? [])].sort((a, b) => a.order - b.order);
  const totalActivityCost = sortedStops.reduce(
    (sum, stop) =>
      sum +
      (stop.stop_activities?.reduce(
        (s, sa) => s + Number(sa.activities?.cost ?? 0),
        0
      ) ?? 0),
    0
  );

  const totalTripCost = expenses.reduce((acc, curr) => acc + curr.amount, 0) || totalActivityCost || 154000;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Top Breadcrumb and Actions matching Screen 7 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/trips"
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> My Trips
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchShare();
              setShowShareModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 size={14} /> Share
          </button>
          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <Pencil size={14} /> Edit Stops
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg mb-6">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {sortedStops.length} Cities • In Progress
            </span>
            <span className="text-xs text-blue-100">
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">{trip.name}</h1>
          {trip.description && <p className="mt-1 text-xs text-blue-100 line-clamp-2">{trip.description}</p>}
        </div>
      </div>

      {/* Main Tabs (Itinerary, Budget Breakdown, Trip Members) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'itinerary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Itinerary Timeline
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'budget'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Budget Breakdown
          </button>
        </div>

        {/* List View / Calendar View toggle (Screen 7 top pill) */}
        {activeTab === 'itinerary' && (
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
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

      {/* TAB 1: ITINERARY (Screen 7) */}
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
          ) : (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Share This Trip</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Anyone with this link can view this itinerary and discover your travel stops.
            </p>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Make trip public</span>
              <button
                onClick={handleToggleShare}
                className={`h-6 w-11 rounded-full p-1 transition ${
                  isPublic ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {shareSlug && isPublic && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Public Link</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/t/${shareSlug}`}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono outline-none"
                  />
                  <button
                    onClick={copyShareLink}
                    className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
