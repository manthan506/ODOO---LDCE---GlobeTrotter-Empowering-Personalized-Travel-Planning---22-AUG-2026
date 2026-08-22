'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  Wallet,
  ArrowUp,
  ArrowDown,
  Trash2,
  Sparkles,
  MapPin,
  X,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  Share2,
  FolderPlus,
  ListTree,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  MASTER_ACTIVITIES,
  MASTER_SECTIONS,
  MASTER_TRIP,
  ActivityItem,
  SectionItem,
} from '@/lib/tripDataSync';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

import { useTripSync } from '@/context/TripSyncContext';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export function TripListContent() {
  const { masterTrip, sections, addSection, removeSection, reorderSections, daySchedule } = useTripSync();

  // Mode switcher: 'view' (Screen 6 / 7) vs 'builder' (Screen 5)
  const [activeScreen, setActiveScreen] = useState<'view' | 'builder'>('view');
  const [showAddModal, setShowAddModal] = useState(false);

  // Screen 6/7 View State
  const [selectedPlaceKey, setSelectedPlaceKey] = useState<string>('paris');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'day' | 'category'>('day');
  const [sortBy, setSortBy] = useState<'chrono' | 'costHigh' | 'costLow'>('chrono');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxCostFilter, setMaxCostFilter] = useState<number>(20000);

  // Shared Detail Preview Modal
  const [previewActivity, setPreviewActivity] = useState<ActivityItem | null>(null);

  // Reordering in Screen 5
  const handleReorder = (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === sections.length - 1) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    reorderSections(idx, targetIdx);
  };

  const handleDeleteSection = (id: string) => {
    removeSection(id);
  };

  const handleAddSection = (newSec: SectionItem) => {
    addSection(newSec);
    setShowAddModal(false);
  };

  const totalSectionsBudget = sections.reduce((sum, s) => sum + s.budget, 0);

  // City-specific activities from synchronized MASTER_ACTIVITIES
  const placeActivities = useMemo(() => {
    const cityMap: Record<string, { name: string; country: string; acts: ActivityItem[] }> = {
      paris: {
        name: 'Paris',
        country: 'France',
        acts: MASTER_ACTIVITIES.filter((a) => a.city === 'Paris'),
      },
      swiss: {
        name: 'Swiss Alps',
        country: 'Switzerland',
        acts: MASTER_ACTIVITIES.filter((a) => a.city === 'Interlaken'),
      },
      rome: {
        name: 'Rome',
        country: 'Italy',
        acts: MASTER_ACTIVITIES.filter((a) => a.city === 'Rome'),
      },
    };
    return cityMap[selectedPlaceKey] || cityMap.paris;
  }, [selectedPlaceKey]);

  // Day 1 & Day 2 grouping for selected place
  const dayGroups = useMemo(() => {
    const half = Math.ceil(placeActivities.acts.length / 2);
    const day1Acts = placeActivities.acts.slice(0, half);
    const day2Acts = placeActivities.acts.slice(half);

    const filterList = (list: ActivityItem[]) => {
      let filtered = list.filter((act) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (!act.name.toLowerCase().includes(q) && !act.category.toLowerCase().includes(q) && !act.description.toLowerCase().includes(q)) {
            return false;
          }
        }
        if (selectedCategory !== 'all' && act.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (act.cost > maxCostFilter) {
          return false;
        }
        return true;
      });

      if (sortBy === 'costHigh') filtered.sort((a, b) => b.cost - a.cost);
      if (sortBy === 'costLow') filtered.sort((a, b) => a.cost - b.cost);
      return filtered;
    };

    return [
      { dayNumber: 1, date: selectedPlaceKey === 'paris' ? 'Sep 10, 2026' : selectedPlaceKey === 'swiss' ? 'Sep 14, 2026' : 'Sep 19, 2026', activities: filterList(day1Acts) },
      { dayNumber: 2, date: selectedPlaceKey === 'paris' ? 'Sep 11, 2026' : selectedPlaceKey === 'swiss' ? 'Sep 15, 2026' : 'Sep 20, 2026', activities: filterList(day2Acts) },
    ];
  }, [placeActivities, searchQuery, selectedCategory, maxCostFilter, sortBy, selectedPlaceKey]);

  const totalFilteredExpense = useMemo(() => {
    return dayGroups.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + a.cost, 0), 0);
  }, [dayGroups]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28">
      {/* ============================================================ */}
      {/* SCREEN MODE SWITCHER TABS (Builder vs View Screen with Budget) */}
      {/* ============================================================ */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveScreen('view')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeScreen === 'view'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ListTree size={15} /> Itinerary View Screen (Screen 6 / 7)
          </button>
          <button
            type="button"
            onClick={() => setActiveScreen('builder')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeScreen === 'builder'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FolderPlus size={15} /> Build Itinerary Screen (Screen 5)
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 hidden md:inline-block">
          Synchronized data with Master Trip: {MASTER_TRIP.name}
        </span>
      </div>

      {/* ============================================================ */}
      {/* SCREEN 6 / 7: ITINERARY VIEW SCREEN WITH BUDGET SECTION       */}
      {/* ============================================================ */}
      {activeScreen === 'view' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bar ...... (e.g. Louvre, Cruise, Train, Colosseum)"
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition"
              />
            </div>

            <div className="relative">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
              >
                <option value="day">Group by: Day</option>
                <option value="category">Group by: Category</option>
              </select>
              <Layers size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex h-11 items-center justify-center gap-2 rounded-2xl border px-5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                showFilterDrawer
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={14} /> Filter
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
              >
                <option value="chrono">Sort by: Chronological</option>
                <option value="costHigh">Sort by: Highest Expense</option>
                <option value="costLow">Sort by: Lowest Expense</option>
              </select>
              <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Filter Drawer */}
          {showFilterDrawer && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                  Filter Criteria
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setMaxCostFilter(20000);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Category Filter:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'Transfer', 'Museum & Art', 'Cruise & Dining', 'Cultural Walk', 'Landmark', 'Gastronomy'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cat === 'all' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>Max Activity Expense:</span>
                    <span className="text-emerald-700 font-extrabold">{formatINR(maxCostFilter)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={20000}
                    step={1000}
                    value={maxCostFilter}
                    onChange={(e) => setMaxCostFilter(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Card: "Itinerary for a selected place" */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Itinerary for a selected place
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visual timeline representation of scheduled physical activities and expense breakdown.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200">
                {[
                  { key: 'paris', label: '📍 Paris, France' },
                  { key: 'swiss', label: '🏔️ Swiss Alps, Switzerland' },
                  { key: 'rome', label: '🏛️ Rome, Italy' },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPlaceKey(p.key)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      selectedPlaceKey === p.key
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TWO COLUMN HEADERS */}
            <div className="grid grid-cols-12 gap-4 border-b border-slate-200 pb-3 mb-6">
              <div className="col-span-3 sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Day</span>
              </div>
              <div className="col-span-6 sm:col-span-7">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Physical Activity</h2>
              </div>
              <div className="col-span-3 sm:col-span-3 text-right sm:text-center">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Expense</h2>
              </div>
            </div>

            {/* DAY-WISE TIMELINE WITH CONNECTOR ARROWS (↓) */}
            <div className="space-y-10">
              {dayGroups.map((day) => (
                <div key={day.dayNumber} className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-3 sm:col-span-2">
                      <div className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs sm:text-sm font-extrabold text-blue-800 shadow-2xs">
                        Day {day.dayNumber}
                      </div>
                      <span className="block text-[11px] font-semibold text-slate-400 mt-1.5 pl-1">
                        {day.date}
                      </span>
                    </div>

                    <div className="col-span-9 sm:col-span-10 space-y-3">
                      {day.activities.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-400 italic">
                          No activities match your filters for Day {day.dayNumber}.
                        </div>
                      ) : (
                        day.activities.map((act, actIdx) => (
                          <div key={act.id} className="space-y-3">
                            <div className="grid grid-cols-10 gap-3 items-center">
                              <div
                                onClick={() => setPreviewActivity(act)}
                                className="col-span-7 flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 px-4 shadow-2xs hover:border-blue-400 hover:shadow-md hover:bg-blue-50/20 transition-all group"
                              >
                                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                  <img
                                    src={act.imageUrl}
                                    alt={act.name}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = FALLBACK_IMG;
                                    }}
                                    className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-cover flex-shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
                                  />
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                                      {act.time} • {act.duration}
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                      {act.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                                      {act.description}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-slate-400 group-hover:text-blue-600 font-bold flex-shrink-0 pl-1">
                                  Details →
                                </span>
                              </div>

                              <div className="col-span-3 flex items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 px-3 text-center shadow-2xs">
                                <div>
                                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">
                                    Cost
                                  </span>
                                  <p className="text-xs sm:text-sm font-black text-emerald-800">
                                    {formatINR(act.cost)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {actIdx < day.activities.length - 1 && (
                              <div className="flex justify-center my-1">
                                <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 shadow-2xs">
                                  <ArrowDown size={14} strokeWidth={2.5} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-b border-slate-100 pt-3" />
                </div>
              ))}
            </div>

            {/* Footer Total Expense */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 px-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800 shadow-2xs">
                  <Wallet size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                    Total Selected Itinerary Expense ({placeActivities.name})
                  </span>
                  <p className="text-lg sm:text-xl font-black text-emerald-700">
                    {formatINR(totalFilteredExpense)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const url = typeof window !== 'undefined' ? window.location.href : '';
                  navigator.clipboard.writeText(url);
                  toast.success('Itinerary link copied to clipboard!');
                }}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer"
              >
                <Share2 size={13} /> Share Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SCREEN 5: BUILD ITINERARY SCREEN (SECTIONS 1, 2, 3...)        */}
      {/* ============================================================ */}
      {activeScreen === 'builder' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-400/20 mb-2">
                  <Compass size={13} /> Day-Wise Sections Planner
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {MASTER_TRIP.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Construct your trip in an interactive modular section format.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/90 rounded-2xl p-3.5 px-4 border border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sections</span>
                  <p className="text-base font-extrabold text-blue-400">{sections.length} Planned</p>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Budget</span>
                  <p className="text-base font-extrabold text-emerald-400">{formatINR(totalSectionsBudget)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* STACK OF SECTION CARDS */}
          <div className="space-y-5">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={sec.imageUrl}
                      alt={sec.city}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-lg bg-slate-900 px-2.5 py-0.5 text-xs font-black text-white uppercase tracking-wider shadow-2xs">
                          Section {idx + 1}:
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          📍 {sec.city}, {sec.country}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                        {sec.title}
                      </h2>
                    </div>
                  </div>

                  {/* Reorder and Delete controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleReorder(idx, 'up')}
                      className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleReorder(idx, 'down')}
                      className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(sec.id)}
                      className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-400 bg-slate-50 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Section Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {sec.description}
                </p>

                {/* Two Badges: [ Date Range ] and [ Budget of this section ] */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 px-4 shadow-2xs">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-blue-800 flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Date Range:
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {sec.startDate} to {sec.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 px-4 shadow-2xs">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Budget of this section:
                      </span>
                      <p className="text-xs sm:text-sm font-black text-emerald-700">
                        {formatINR(sec.budget)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Activities preview */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-blue-600" />
                      Section Experiences ({sec.activities.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sec.activities.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => setPreviewActivity(act)}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 px-3 hover:border-blue-400 hover:shadow-xs transition"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{act.name}</h4>
                          <span className="text-[10px] text-slate-400">{act.time}</span>
                        </div>
                        <span className="text-xs font-black text-emerald-700 flex-shrink-0">
                          {formatINR(act.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Bottom CTA: "+ Add another Section" */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-md hover:bg-slate-900 hover:text-white transition active:scale-95 cursor-pointer"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add another Section
            </button>
          </div>
        </div>
      )}

      {/* ADD SECTION MODAL */}
      {showAddModal && (
        <AddSectionModal
          sectionNumber={sections.length + 1}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSection}
        />
      )}

      {/* ACTIVITY DETAIL PREVIEW MODAL */}
      {previewActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
            <div className="relative h-44 w-full bg-slate-900">
              <img
                src={previewActivity.imageUrl}
                alt={previewActivity.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setPreviewActivity(null)}
                className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {previewActivity.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-tight drop-shadow-xs">
                  {previewActivity.name}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scheduled Timing
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <Clock size={12} className="text-blue-600" /> {previewActivity.time} ({previewActivity.duration})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Expense Cost
                  </span>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    {formatINR(previewActivity.cost)} / traveler
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {previewActivity.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Experience Highlights:
                </h4>
                <ul className="space-y-1.5">
                  {previewActivity.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-blue-50/70 p-2.5 text-[11px] text-blue-900 border border-blue-100">
                <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
                <span>Verified itinerary booking with flexible cancellation.</span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewActivity(null)}
                className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-98 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddSectionModal({
  sectionNumber,
  onClose,
  onAdd,
}: {
  sectionNumber: number;
  onClose: () => void;
  onAdd: (sec: SectionItem) => void;
}) {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Barcelona');
  const [country, setCountry] = useState('Spain');
  const [description, setDescription] = useState(
    'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including coastal exploration and local cultural immersion.'
  );
  const [startDate, setStartDate] = useState('Sep 24, 2026');
  const [endDate, setEndDate] = useState('Sep 28, 2026');
  const [budget, setBudget] = useState(28000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `sec-${Date.now()}`,
      sectionNumber,
      title: title || `Exploration & Stay in ${city}`,
      category: 'city',
      city,
      country,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      description,
      startDate,
      endDate,
      budget: Number(budget) || 20000,
      activities: MASTER_ACTIVITIES.slice(0, 2),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Section {sectionNumber}</h3>
            <p className="text-xs text-slate-500">Configure section title, dates, budget and details</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Section Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Barcelona Beachfront & Sagrada Familia Tour"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">City / Location:</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Barcelona, Tokyo, Bali"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Country:</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Spain, Japan, Indonesia"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Start Date:</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. Sep 24, 2026"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">End Date:</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="e.g. Sep 28, 2026"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Budget of this section:</span>
              <span className="text-emerald-700 font-extrabold">{formatINR(budget)}</span>
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

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Section Information & Details:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity..."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
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
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              + Add Section {sectionNumber}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
