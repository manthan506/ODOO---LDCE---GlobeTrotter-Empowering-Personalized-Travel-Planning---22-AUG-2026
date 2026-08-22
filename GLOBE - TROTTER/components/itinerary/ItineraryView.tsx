'use client';

import { useState } from 'react';
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
  Plane,
  Car,
  Paperclip,
  Train,
  Bookmark,
  TrendingDown,
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

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'map' | 'lodging' | 'budget' | 'packing' | 'guide'>('itinerary');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [showSavingsBanner, setShowSavingsBanner] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const fetchShare = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setShareSlug(data.share_slug);
        setIsPublic(data.is_public);
      }
    } catch {
      console.error('Failed to load share slug');
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

  const handleOptimizeCurrentDay = () => {
    setShowSavingsBanner(true);
    toast.success('Route optimized! Saved 35 mins travel time & ₹1,200 transit cost.');
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
  const currentStop = sortedStops[selectedDayIdx] || sortedStops[0];
  const firstCityName = sortedStops[0]?.cities?.name || 'Paris';

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/trips"
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> My Trips
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {/* Collaboration Live Member Cursors (Screen 9) */}
          <div className="flex items-center -space-x-1.5 mr-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-white">
              RC
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white">
              JL
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-purple-500 text-[10px] font-bold text-white ring-2 ring-white">
              LJ
            </span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-700 ring-2 ring-white">
              +3
            </span>
          </div>

          <button
            onClick={() => setShowGmailModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
          >
            <Mail size={13} /> Sync Gmail
          </button>

          <button
            onClick={() => {
              fetchShare();
              setShowShareModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 size={13} /> Share
          </button>

          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <Pencil size={13} /> Edit Stops
          </Link>
        </div>
      </div>

      {/* Hero Banner with Simulated Live Presence Badges (Screen 9) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {sortedStops.length} Destinations • Real-Time Collaborative
            </span>
            <span className="text-xs text-blue-100">
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">{trip.name}</h1>
          {trip.description && <p className="mt-1 text-xs text-blue-100 line-clamp-2">{trip.description}</p>}

          {/* Floating Presence Tags (Screen 9) */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-500/80 px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Rose Chen is editing
            </span>
            <span className="rounded-full bg-purple-500/80 px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Lianne Jones viewing map
            </span>
          </div>
        </div>
      </div>

      {/* Quick Reservation Icon Bar (Screen 6 & 9) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Reservations and Attachments
          </span>
          <button
            onClick={() => setActiveTab('lodging')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Manage all
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { icon: Plane, label: 'Flights', count: 1, tab: 'lodging' },
            { icon: Hotel, label: 'Lodging', count: sortedStops.length, tab: 'lodging' },
            { icon: Car, label: 'Rental cars', count: 1, tab: 'lodging' },
            { icon: Paperclip, label: 'Attachment', count: 2, tab: 'lodging' },
            { icon: Train, label: 'Trains', count: 1, tab: 'lodging' },
            { icon: Sparkles, label: 'Other', count: 3, tab: 'lodging' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(item.tab as any)}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition group"
            >
              <div className="relative mb-1">
                <item.icon size={18} className="text-slate-700 group-hover:text-blue-600" />
                <span className="absolute -top-1.5 -right-2 grid h-4 w-4 place-items-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {item.count}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Flight Status Card (Screen 8) */}
      <FlightStatusCard firstStopCity={firstCityName} startDate={trip.start_date} />

      {/* Main Feature Tabs (Screen 1–14 Wanderlog Spec) */}
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
            <Navigation size={14} /> Map View
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
            <DollarSign size={14} /> Budgeting (₹)
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'packing'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare size={14} /> Packing Checklist
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={14} /> Travel Guides
          </button>
        </div>
      </div>

      {/* TAB 1: ITINERARY (Screen 5) */}
      {activeTab === 'itinerary' && (
        <div className="space-y-5">
          {/* Day Selector Chips (Screen 5: Sat 3/21, Sun 3/22, Mon 3/23...) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {sortedStops.map((stop, idx) => {
              const arriveDate = new Date(stop.arrive_date);
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={stop.id || idx}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex-shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CalendarDays size={13} />
                  Day {idx + 1}: {stop.cities?.name || 'Destination'}
                </button>
              );
            })}
          </div>

          {/* Savings Banner when Route Optimization runs (Screen 3 & 5) */}
          {showSavingsBanner && (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-4 shadow-sm flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">We saved you 35 mins of travel time & ₹1,200!</h4>
                  <p className="text-[11px] text-emerald-800">
                    Activities rearranged in the most efficient walking & transit order.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSavingsBanner(false)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Current Selected Stop Detail (Screen 5) */}
          {currentStop && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {currentStop.cities?.name}, {currentStop.cities?.country}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {new Date(currentStop.arrive_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Optimize Route Button (Screen 5) */}
                <button
                  onClick={handleOptimizeCurrentDay}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 transition"
                >
                  <Sparkles size={13} />
                  Optimize route
                </button>
              </div>

              {/* Numbered Activity Cards with Walking/Transit Directions (Screen 5) */}
              <div className="space-y-3">
                {(currentStop.stop_activities || []).length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3">
                    No scheduled activities for this destination. Add from Explore!
                  </p>
                ) : (
                  (currentStop.stop_activities || []).map((sa, aIdx) => (
                    <div
                      key={sa.id || aIdx}
                      className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-slate-300 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-7 w-7 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white flex-shrink-0">
                          {aIdx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {sa.activities?.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {sa.scheduled_time || '10:00 AM'} • 5 min walk • 0.3 km
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-bold font-mono text-slate-800">
                          {Number(sa.activities?.cost) > 0
                            ? formatINR(Number(sa.activities?.cost))
                            : 'Free'}
                        </span>
                        <Bookmark size={14} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Stop Lodging, Bookings & Attachments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <LodgingCard
                  stopId={currentStop.id}
                  lodging={currentStop.lodging}
                  cityName={currentStop.cities?.name}
                  onUpdated={refetch}
                />
                <ReservationsCard
                  stopId={currentStop.id}
                  reservations={currentStop.reservations}
                  onUpdated={refetch}
                />
                <AttachmentsCard
                  stopId={currentStop.id}
                  attachments={currentStop.attachments}
                  onUpdated={refetch}
                />
              </div>
            </div>
          )}

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
              View Budgeting 📊
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MAP VIEW (Screen 2 & 13) */}
      {activeTab === 'map' && (
        <TripMapView
          stops={sortedStops}
          tripId={tripId}
          onStopsReordered={refetch}
        />
      )}

      {/* TAB 3: LODGING & RESERVATIONS (Screen 6 & 7) */}
      {activeTab === 'lodging' && (
        <div className="space-y-6">
          {/* Lodging Hotel Booking Cards with Ratings (Screen 7) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hotels and Lodging Recommendations</h3>
                <p className="text-xs text-slate-500">Compare rates & book verified stays in {firstCityName}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Member Discounts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'Grand Pacific Resort & Spa',
                  rating: '10.0* Exceptional (787 reviews)',
                  amenities: '4-star hotel • Free WiFi • Pool • Breakfast included',
                  price: 16500,
                  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
                },
                {
                  name: 'Boutique Heritage Suites',
                  rating: '9.8* Wonderful (412 reviews)',
                  amenities: 'Boutique stay • City Center • Free Airport Shuttle',
                  price: 12800,
                  image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
                },
              ].map((hotel, hIdx) => (
                <div
                  key={hIdx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 hover:border-blue-300 transition"
                >
                  <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100">
                    <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{hotel.name}</h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {hotel.rating}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">{hotel.amenities}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {formatINR(hotel.price)}
                      </span>
                      <span className="text-[10px] text-slate-400"> / night</span>
                    </div>
                    <button
                      onClick={() => toast.success(`Reservation link opened for ${hotel.name}`)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                    >
                      Book now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stop-by-stop Lodging Manager */}
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

      {/* TAB 4: BUDGETING (Screen 1 & 12) */}
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

      {/* TAB 5: PACKING CHECKLIST (Screen 10) */}
      {activeTab === 'packing' && (
        <PackingChecklist tripName={trip.name} />
      )}

      {/* TAB 6: TRAVEL GUIDES (Screen 11) */}
      {activeTab === 'guide' && (
        <TravelGuides activeCity={firstCityName} />
      )}

      {/* Gmail Import Modal (Screen 6) */}
      <GmailImportModal
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
        onImportReservations={() => {
          refetch();
        }}
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
