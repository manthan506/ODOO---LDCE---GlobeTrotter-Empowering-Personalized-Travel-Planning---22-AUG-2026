'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/hooks/useTrips';
import {
  Compass,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  MapPin,
  Calendar,
  Wallet,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const REGIONS = [
  {
    id: 'asia',
    name: 'Southeast Asia',
    emoji: '🌴',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    count: '18 Trips',
  },
  {
    id: 'europe',
    name: 'Alpine Europe',
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    count: '24 Trips',
  },
  {
    id: 'east_asia',
    name: 'East Asia',
    emoji: '⛩️',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    count: '15 Trips',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    count: '20 Trips',
  },
  {
    id: 'himalayas',
    name: 'Himalayas & North',
    emoji: '❄️',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    count: '12 Trips',
  },
];

interface DashboardTripItem {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget_limit: number;
  cover_image_url: string;
  stops_count: number;
  cities: string;
  progress: number;
  isSample?: boolean;
}

const SAMPLE_PREVIOUS_TRIPS: DashboardTripItem[] = [
  {
    id: 'sample-1',
    name: 'Euro-Alpine Explorer',
    start_date: '2026-09-10',
    end_date: '2026-09-22',
    budget_limit: 85000,
    cover_image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    stops_count: 4,
    cities: 'Paris • Swiss Alps • Rome • Barcelona',
    progress: 80,
    isSample: true,
  },
  {
    id: 'sample-2',
    name: 'Tropical Bali & Coral Isles',
    start_date: '2026-10-05',
    end_date: '2026-10-14',
    budget_limit: 48000,
    cover_image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    stops_count: 3,
    cities: 'Ubud • Seminyak • Nusa Penida',
    progress: 65,
    isSample: true,
  },
  {
    id: 'sample-3',
    name: 'Golden Triangle & Royal Heritage',
    start_date: '2026-11-01',
    end_date: '2026-11-08',
    budget_limit: 32000,
    cover_image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    stops_count: 3,
    cities: 'Delhi • Agra • Jaipur',
    progress: 90,
    isSample: true,
  },
];

export function DashboardContent() {
  const { user } = useAuth();
  const { trips, loading } = useTrips();

  // Wireframe Filter & Control States
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'all' | 'budget' | 'duration'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'budget_asc' | 'budget_desc'>('recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxBudgetFilter, setMaxBudgetFilter] = useState(100000);

  const userName =
    user?.firstName ||
    user?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Traveler';

  // Normalize user trips and combine with sample trips if empty
  const displayedTrips = useMemo(() => {
    let list: DashboardTripItem[] = [];

    if (trips && trips.length > 0) {
      list = trips.map((t) => ({
        id: t.id,
        name: t.name,
        start_date: t.start_date,
        end_date: t.end_date,
        budget_limit: t.budget_cap || 50000,
        cover_image_url:
          t.cover_image_url ||
          'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        stops_count: 3,
        cities: t.description || 'Personalized multi-city route',
        progress: 75,
        isSample: false,
      }));
    } else {
      list = SAMPLE_PREVIOUS_TRIPS;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.cities.toLowerCase().includes(q)
      );
    }

    if (maxBudgetFilter < 100000) {
      list = list.filter((t) => t.budget_limit <= maxBudgetFilter);
    }

    if (sortBy === 'budget_asc') {
      return [...list].sort((a, b) => a.budget_limit - b.budget_limit);
    } else if (sortBy === 'budget_desc') {
      return [...list].sort((a, b) => b.budget_limit - a.budget_limit);
    }

    return list;
  }, [trips, search, maxBudgetFilter, sortBy]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 relative pb-28">
      {/* 1. HERO BANNER IMAGE (Screen 3) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl mb-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=85"
            alt="Travel Hero Banner"
            className="h-full w-full object-cover opacity-60 scale-105 transition duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/25 border border-blue-400/30 px-3 py-1 text-xs font-bold text-blue-200 backdrop-blur-md mb-3">
            <Sparkles size={13} className="text-yellow-400" />
            Empowering Personalized Travel Planning
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, {userName}! 🌍
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
            Dream, design, and manage customized multi-city journeys with intelligent budget tracking and interactive itineraries.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 active:scale-95"
            >
              <Plus size={15} /> Plan a new trip
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
            >
              Explore Cities & Activities
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CONTROL BAR: [Search bar ......] [Group by] [Filter] [Sort by...] */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
              placeholder="Search bar (cities, destinations, activities)..."
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Action Buttons: Group by, Filter, Sort by */}
          <div className="flex items-center gap-2">
            {/* Group By Dropdown */}
            <div className="relative">
              <select
                value={groupBy}
                onChange={(e) => {
                  setGroupBy(e.target.value as 'all' | 'budget' | 'duration');
                  toast.info(`Group by: ${e.target.value}`);
                }}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs outline-none transition hover:bg-slate-50 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Group by: All</option>
                <option value="budget">Group by: Budget</option>
                <option value="duration">Group by: Duration</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex h-11 items-center gap-1.5 rounded-2xl border px-3.5 text-xs font-bold transition shadow-xs ${
                filterOpen || maxBudgetFilter < 100000
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={14} />
              Filter
              {maxBudgetFilter < 100000 && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'recent' | 'budget_asc' | 'budget_desc');
                }}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs outline-none transition hover:bg-slate-50 focus:border-blue-500 cursor-pointer"
              >
                <option value="recent">Sort by: Recent</option>
                <option value="budget_asc">Sort by: Budget (Low to High)</option>
                <option value="budget_desc">Sort by: Budget (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {filterOpen && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full max-w-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Max Trip Budget:</span>
                  <span className="text-blue-600">₹{maxBudgetFilter.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={100000}
                  step={5000}
                  value={maxBudgetFilter}
                  onChange={(e) => setMaxBudgetFilter(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMaxBudgetFilter(100000);
                    setSelectedRegion(null);
                    setSearch('');
                    toast.success('Filters reset');
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. TOP REGIONAL SELECTIONS (5 Regional Cards matching Wireframe) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Top Regional Selections</h2>
            <p className="text-xs text-slate-500">Curated global destinations for multi-city travel</p>
          </div>
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Clear selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {REGIONS.map((region) => {
            const isSelected = selectedRegion === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setSelectedRegion(null);
                  } else {
                    setSelectedRegion(region.id);
                    setSearch(region.name);
                    toast.info(`Selected region: ${region.name}`);
                  }
                }}
                className={`group relative overflow-hidden rounded-2xl border p-2 text-left transition duration-300 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative h-24 sm:h-28 w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-sm">{region.emoji}</span>
                </div>

                <div className="mt-2 px-1">
                  <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                    {region.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    {region.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. PREVIOUS / RECENT TRIPS (3 Tall Cards matching Wireframe) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Previous Trips</h2>
            <p className="text-xs text-slate-500">Your personalized multi-city itineraries & travel plans</p>
          </div>
          <Link href="/trips" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all trips <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {displayedTrips.slice(0, 3).map((trip) => {
            const isSample = 'isSample' in trip && trip.isSample;
            const tripLink = isSample ? `/trips/new` : `/trips/${trip.id}`;

            return (
              <div
                key={trip.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:border-blue-300 hover:shadow-lg"
              >
                {/* Tall Cover Image */}
                <div>
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={
                        trip.cover_image_url ||
                        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
                      }
                      alt={trip.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                    {/* Top Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-blue-700 shadow-xs">
                        {isSample ? 'Featured Route' : 'Saved Itinerary'}
                      </span>
                    </div>

                    {/* Estimated Budget Pill */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                        <Wallet size={12} className="text-emerald-400" />
                        ₹{(trip.budget_limit || 45000).toLocaleString('en-IN')}
                      </span>
                      <span className="bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px]">
                        {'stops_count' in trip ? `${trip.stops_count} Stops` : 'Multi-city'}
                      </span>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Calendar size={12} />
                      <span>
                        {trip.start_date || 'Flexible Dates'} – {trip.end_date || '2026'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                      {trip.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {trip.cities || 'Personalized multi-city route'}
                    </p>
                  </div>
                </div>

                {/* Bottom Planning Status & CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2 text-[11px] font-bold">
                    <span className="text-slate-500">Planning Progress</span>
                    <span className="text-blue-600">
                      {'progress' in trip ? `${trip.progress}%` : '75%'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${'progress' in trip ? trip.progress : 75}%` }}
                    />
                  </div>

                  <Link
                    href={tripLink}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-xs font-bold text-white transition group-hover:bg-blue-600"
                  >
                    {isSample ? 'Customize Route' : 'View Itinerary'}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FLOATING BOTTOM-RIGHT "+ Plan a trip" BUTTON (matching Wireframe Screen 3) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/trips/new"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/35 transition hover:scale-105 hover:shadow-blue-500/50 active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          Plan a trip
        </Link>
      </div>
    </div>
  );
}
