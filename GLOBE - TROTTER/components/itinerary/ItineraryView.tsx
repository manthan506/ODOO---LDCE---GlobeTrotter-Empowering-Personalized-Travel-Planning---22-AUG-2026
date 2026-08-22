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
  Route,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import type { TripMember, Expense, Stop } from '@/types';
import { BudgetBreakdown } from '@/components/itinerary/BudgetBreakdown';
import { TripMapView } from '@/components/trip/TripMapView';
import { FlightStatusCard } from '@/components/trip/FlightStatusCard';
import { PackingChecklist } from '@/components/trip/PackingChecklist';
import { TravelGuides } from '@/components/trip/TravelGuides';
import { CollaborationWorkspace } from '@/components/trip/CollaborationWorkspace';
import { RouteOptimizerView } from '@/components/trip/RouteOptimizerView';
import { SplitItineraryView } from '@/components/itinerary/SplitItineraryView';
import { ReservationsHub } from '@/components/itinerary/ReservationsHub';
import { LodgingComparisonView } from '@/components/itinerary/LodgingComparisonView';
import { WeatherStrip } from '@/components/trip/WeatherStrip';

export function ItineraryView({ tripId }: { tripId: string }) {
  const { trip, loading, refetch } = useTrip(tripId);
  const { expenses, refetch: refetchExpenses } = useExpenses(tripId);
  const { members, refetch: refetchMembers } = useTripMembers(tripId);

  // Active top navigation tab (10 core tools, offline access removed)
  const [activeTab, setActiveTab] = useState<
    | 'budgeting'
    | 'map'
    | 'collaboration'
    | 'flight_status'
    | 'route_optimization'
    | 'itinerary'
    | 'reservations'
    | 'lodging'
    | 'packing'
    | 'guides'
  >('budgeting');

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [showShareModal, setShowShareModal] = useState(false);
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
  const destinationCity = trip.name || sortedStops[0]?.cities?.name || 'Japan';

  // 10 Core Features
  const topTabs = [
    { id: 'budgeting', label: 'Budgeting', icon: DollarSign },
    { id: 'map', label: 'Map view', icon: Navigation },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'flight_status', label: 'Flight status', icon: Plane },
    { id: 'route_optimization', label: 'Route optimization', icon: Route },
    { id: 'itinerary', label: 'Itinerary', icon: ListIcon },
    { id: 'reservations', label: 'Reservations', icon: Ticket },
    { id: 'lodging', label: 'Lodging', icon: Hotel },
    { id: 'packing', label: 'Packing checklists', icon: CheckSquare },
    { id: 'guides', label: 'Travel guides', icon: BookOpen },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <Link
          href="/trips"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> My Trips
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchShare();
              setShowShareModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 size={13} /> Share
          </button>

          <Link
            href={`/trips/${tripId}/plan`}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            <Pencil size={13} /> Edit Stops
          </Link>
        </div>
      </div>

      {/* Live Open-Meteo Weather Strip */}
      <WeatherStrip cityName={destinationCity} />

      {/* 10-Icon Feature Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {topTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl transition flex-shrink-0 group ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div
                className={`grid h-8 w-8 place-items-center rounded-xl mb-1 transition ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                }`}
              >
                <tab.icon size={16} />
              </div>
              <span className="text-[11px] font-bold whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE TAB CONTENT */}

      {/* 1. Budgeting */}
      {activeTab === 'budgeting' && (
        <BudgetBreakdown
          tripId={tripId}
          trip={trip}
          onExpenseAdded={() => {
            refetch();
            refetchExpenses();
          }}
        />
      )}

      {/* 2. Map view */}
      {activeTab === 'map' && (
        <TripMapView
          stops={sortedStops}
          tripId={tripId}
          tripName={destinationCity}
          onStopsReordered={refetch}
        />
      )}

      {/* 3. Collaboration */}
      {activeTab === 'collaboration' && (
        <CollaborationWorkspace trip={trip} tripId={tripId} destinationCity={destinationCity} />
      )}

      {/* 4. Flight status */}
      {activeTab === 'flight_status' && (
        <FlightStatusCard firstStopCity={destinationCity} startDate={trip.start_date} />
      )}

      {/* 5. Route optimization */}
      {activeTab === 'route_optimization' && (
        <RouteOptimizerView
          stops={sortedStops}
          tripId={tripId}
          destinationCity={destinationCity}
          onStopsReordered={refetch}
        />
      )}

      {/* 6. Itinerary */}
      {activeTab === 'itinerary' && (
        <SplitItineraryView trip={trip} tripId={tripId} destinationCity={destinationCity} />
      )}

      {/* 7. Reservations */}
      {activeTab === 'reservations' && (
        <ReservationsHub trip={trip} tripId={tripId} destinationCity={destinationCity} />
      )}

      {/* 8. Lodging */}
      {activeTab === 'lodging' && (
        <LodgingComparisonView trip={trip} tripId={tripId} destinationCity={destinationCity} />
      )}

      {/* 9. Packing */}
      {activeTab === 'packing' && (
        <PackingChecklist tripName={trip.name} />
      )}

      {/* 10. Travel Guides */}
      {activeTab === 'guides' && (
        <TravelGuides activeCity={destinationCity} />
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
