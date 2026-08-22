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
  Navigation,
  Hotel,
  CheckSquare,
  BookOpen,
  Mail,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import type { TripMember, Expense, Stop } from '@/types';
import { BudgetBreakdown } from '@/components/itinerary/BudgetBreakdown';
import { LodgingCard } from '@/components/itinerary/LodgingCard';
import { ReservationsCard } from '@/components/itinerary/ReservationsCard';
import { AttachmentsCard } from '@/components/itinerary/AttachmentsCard';
import { TripMapView } from '@/components/trip/TripMapView';
import { FlightStatusCard } from '@/components/trip/FlightStatusCard';
import { GmailImportModal } from '@/components/trip/GmailImportModal';
import { PackingChecklist } from '@/components/trip/PackingChecklist';
import { TravelGuides } from '@/components/trip/TravelGuides';

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function ItineraryView({ tripId }: { tripId: string }) {
  const { trip, loading, refetch } = useTrip(tripId);
  const { expenses, refetch: refetchExpenses } = useExpenses(tripId);
  const { members, refetch: refetchMembers } = useTripMembers(tripId);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'lodging' | 'budget' | 'packing'>('itinerary');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);
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

  const handleImportedReservations = async (foundReservations: any[]) => {
    if (!trip?.stops || trip.stops.length === 0) {
      toast.info('Add a stop to attach reservations.');
      return;
    }
    const firstStopId = trip.stops[0].id;
    const existing = trip.stops[0].reservations || [];
    const formatted = foundReservations.map((r) => ({
      type: r.type === 'flight' ? 'Train' : r.type === 'hotel' ? 'Hotel' : 'Museum',
      name: r.title,
      time: r.date.split('·')[1]?.trim() || '14:30',
      confirmationCode: r.code,
    }));

    try {
      await fetch(`/api/stops/${firstStopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations: [...existing, ...formatted] }),
        credentials: 'include',
      });
      refetch();
    } catch {
      console.error('Error attaching imported reservations');
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

  const totalTripCost = expenses.reduce((acc, curr) => acc + curr.amount, 0) || totalActivityCost || 110000;
  const firstCityName = sortedStops[0]?.cities?.name || 'Paris';

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Breadcrumb and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/trips"
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> My Trips
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {/* Gmail Scanner trigger button */}
          <button
            onClick={() => setShowGmailModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
          >
            <Mail size={14} /> Sync Gmail
          </button>

          {/* Share button */}
          <button
            onClick={() => {
              fetchShare();
              setShowShareModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 size={14} /> Share
          </button>

          {/* Edit stops */}
          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <Pencil size={14} /> Edit Stops
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg">
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

      {/* Flight Status Widget tied to first stop */}
      <FlightStatusCard firstStopCity={firstCityName} startDate={trip.start_date} />

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'itinerary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListIcon size={14} /> Itinerary
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Navigation size={14} /> Route Map
          </button>

          <button
            onClick={() => setActiveTab('lodging')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'lodging'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Hotel size={14} /> Lodging & Bookings
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <DollarSign size={14} /> Budget (₹)
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'packing'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare size={14} /> Packing & Guide
          </button>
        </div>

        {/* List View / Calendar View toggle */}
        {activeTab === 'itinerary' && (
          <div className="hidden sm:flex rounded-xl bg-slate-100 p-1 border border-slate-200 ml-2 flex-shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Calendar
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: ITINERARY TIMELINE */}
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
                const activities = stop.stop_activities || [];

                return (
                  <div
                    key={stop.id}
                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
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

                    {/* Integrated Stop Mini-Cards: Lodging, Reservations, Attachments */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                      <LodgingCard
                        stopId={stop.id}
                        lodging={stop.lodging}
                        cityName={stop.cities?.name}
                        onUpdated={refetch}
                      />
                      <ReservationsCard
                        stopId={stop.id}
                        reservations={stop.reservations}
                        onUpdated={refetch}
                      />
                      <AttachmentsCard
                        stopId={stop.id}
                        attachments={stop.attachments}
                        onUpdated={refetch}
                      />
                    </div>
                  </div>
                );
              })}

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

      {/* TAB 2: ROUTE MAP & OPTIMIZATION */}
      {activeTab === 'map' && (
        <TripMapView
          stops={sortedStops}
          tripId={tripId}
          onStopsReordered={refetch}
        />
      )}

      {/* TAB 3: LODGING & BOOKINGS OVERVIEW */}
      {activeTab === 'lodging' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Accommodations & Reservations</h3>
            <button
              onClick={() => setShowGmailModal(true)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Mail size={13} /> Scan from Gmail
            </button>
          </div>

          {sortedStops.map((stop) => (
            <div key={stop.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin size={16} className="text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  {stop.cities?.name}, {stop.cities?.country}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <LodgingCard
                  stopId={stop.id}
                  lodging={stop.lodging}
                  cityName={stop.cities?.name}
                  onUpdated={refetch}
                />
                <ReservationsCard
                  stopId={stop.id}
                  reservations={stop.reservations}
                  onUpdated={refetch}
                />
                <AttachmentsCard
                  stopId={stop.id}
                  attachments={stop.attachments}
                  onUpdated={refetch}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: BUDGET BREAKDOWN */}
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

      {/* TAB 5: PACKING & TRAVEL GUIDE */}
      {activeTab === 'packing' && (
        <div className="space-y-6">
          <PackingChecklist tripName={trip.name} />
          <TravelGuides activeCity={firstCityName} />
        </div>
      )}

      {/* Gmail Import Modal */}
      <GmailImportModal
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
        onImportReservations={handleImportedReservations}
      />

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
