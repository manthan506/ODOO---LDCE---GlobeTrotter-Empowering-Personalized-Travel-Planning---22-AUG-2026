'use client';

import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  Plus,
  Clock,
  MapPin,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  X,
  Wallet,
  Compass,
  Building,
  Plane,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  MASTER_ACTIVITIES,
  MASTER_CALENDAR_SPANS,
  ActivityItem,
  TripSpanItem,
} from '@/lib/tripDataSync';
import { useTripSync } from '@/context/TripSyncContext';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

// Month: September 2026 (starts on Tuesday = col index 2)
const SEPTEMBER_2026_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export function CalendarViewContent() {
  const { masterTrip, daySchedule, addActivityToDay, removeActivityFromDay, reorderActivitiesInDay } = useTripSync();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 = September 2026
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'month' | 'trip' | 'city'>('month');
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | 'cost'>('asc');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedTripFilter, setSelectedTripFilter] = useState<string>('all');
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // New activity form
  const [newActName, setNewActName] = useState('');
  const [newActTime, setNewActTime] = useState('11:00 AM');
  const [newActCost, setNewActCost] = useState('3500');
  const [newActCategory, setNewActCategory] = useState('Sightseeing');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = `${months[currentMonthIndex]} 2026`;

  // Selected Day activities
  const currentDayActivities = useMemo(() => {
    let list = daySchedule[selectedDay]?.activities || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.city.toLowerCase().includes(q));
    }
    return list;
  }, [daySchedule, selectedDay, searchQuery]);

  const selectedDayMeta = daySchedule[selectedDay];

  const handleReorder = (idx: number, dir: 'up' | 'down') => {
    if (!daySchedule[selectedDay]) return;
    const acts = daySchedule[selectedDay].activities;
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === acts.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    reorderActivitiesInDay(selectedDay, idx, target);
    toast.success('Activity reordered');
  };

  const handleDeleteActivity = (actId: string) => {
    removeActivityFromDay(selectedDay, actId);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName.trim()) return;

    const newAct: ActivityItem = {
      id: `ca-${Date.now()}`,
      name: newActName,
      cityId: selectedDayMeta?.city.toLowerCase() || 'custom',
      city: selectedDayMeta?.city || 'Selected City',
      country: selectedDayMeta?.country || 'Europe',
      region: 'Europe',
      time: newActTime,
      duration: '2.0 Hours',
      durationMinutes: 120,
      cost: Number(newActCost) || 3000,
      costTier: Number(newActCost) > 7500 ? 'luxury' : Number(newActCost) > 3500 ? 'moderate' : 'budget',
      costLabel: Number(newActCost) > 7500 ? '₹₹₹ Luxury' : Number(newActCost) > 3500 ? '₹₹ Moderate' : '₹ Budget',
      category: newActCategory,
      categoryGroup: 'sightseeing',
      popularity: 4.9,
      reviewsCount: '1.2k',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      description: 'Scheduled trip activity.',
      highlights: ['Confirmed Reservation', 'English speaking host'],
    };

    addActivityToDay(selectedDay, newAct);
    setNewActName('');
    setShowAddActivityModal(false);
  };

  const totalSelectedDayCost = currentDayActivities.reduce((sum, a) => sum + a.cost, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28">
      {/* ============================================================ */}
      {/* TOP CONTROL BAR MATCHING SCREEN 11 WIREFRAME                 */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        {/* Search bar ...... */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bar ...... (e.g. Paris, Louvre, Glacier Express, Colosseum)"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition"
          />
        </div>

        {/* Group by Dropdown Button */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="month">Group by: Month</option>
            <option value="trip">Group by: Trip</option>
            <option value="city">Group by: City</option>
          </select>
          <Layers size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Filter Button */}
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

        {/* Sort by... Dropdown Button */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="asc">Sort by: Date (Ascending)</option>
            <option value="desc">Sort by: Date (Descending)</option>
            <option value="cost">Sort by: Expense (High to Low)</option>
          </select>
          <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* FILTER DRAWER EXPANDABLE */}
      {showFilterDrawer && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              Calendar Filters
            </span>
            <button
              onClick={() => setSelectedTripFilter('all')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-2">Filter by Stop:</span>
            {['all', 'PARIS TRIP', 'SWISS ALPS TOUR', 'ROME GETAWAY'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTripFilter(t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                  selectedTripFilter === t
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t === 'all' ? 'All Stops' : t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTAINER: "Calendar View" MATCHING SCREEN 11 WIREFRAME */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Calendar View
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual month timeline with synchronized trip spans and expandable daily schedules.
          </p>
        </div>

        {/* MONTH & YEAR NAVIGATOR: ← September 2026 → */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1))}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {monthName}
            </h2>
            <span className="text-[11px] font-bold text-blue-600">
              {MASTER_TRIP.name} (Sep 10 – Sep 28)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1))}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE CALENDAR GRID MATCHING WIREFRAME                 */}
        {/* ============================================================ */}
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-black text-slate-600 uppercase tracking-wider py-3">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-white text-xs">
            {/* Empty Offset Days (Sep 2026 starts on Tuesday -> 2 blank cells) */}
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">30</span>
            </div>
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">31</span>
            </div>

            {/* 30 Days of September 2026 */}
            {SEPTEMBER_2026_DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const hasActivities = !!daySchedule[day]?.activities?.length;
              const matchingSpan = MASTER_CALENDAR_SPANS.find((s) => day >= s.startDay && day <= s.endDay);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative h-24 sm:h-28 p-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 ring-2 ring-blue-500 z-10'
                      : matchingSpan
                      ? 'bg-slate-50/60 hover:bg-blue-50/30'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full font-black text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : hasActivities
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>

                    {hasActivities && (
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded-md hidden sm:inline-block">
                        {daySchedule[day].activities.length} acts
                      </span>
                    )}
                  </div>

                  {/* Trip Span Badges (Paris, Swiss Alps, Rome) */}
                  {matchingSpan && (
                    <div
                      className={`mt-1 rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase truncate shadow-2xs border ${
                        day === matchingSpan.startDay
                          ? matchingSpan.badgeBg
                          : 'bg-white text-slate-800 border-slate-200'
                      }`}
                    >
                      {matchingSpan.title}
                    </div>
                  )}

                  {/* Synchronized First Activity Title */}
                  {hasActivities && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-slate-500 truncate hidden sm:flex">
                      <Clock size={10} className="text-slate-400" />
                      <span className="truncate">{daySchedule[day].activities[0]?.name}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Trailing blank cells */}
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">1</span>
            </div>
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">2</span>
            </div>
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">3</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* EXPANDABLE DAY DETAIL DRAWER / SCHEDULE                      */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">
                  Sep {selectedDay}, 2026
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDayMeta ? `${selectedDayMeta.title} (${selectedDayMeta.city}, ${selectedDayMeta.country})` : `Day Plan`}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage timeline flow, reorder activities (⬆ ⬇), and log expenses.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl">
                Day Cost: {formatINR(totalSelectedDayCost)}
              </span>
              <button
                type="button"
                onClick={() => setShowAddActivityModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Plus size={15} /> + Add Activity
              </button>
            </div>
          </div>

          {/* Synchronized Activity Schedule */}
          {currentDayActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              No scheduled activities on Sep {selectedDay}. Click &quot;+ Add Activity&quot; to schedule this date.
            </div>
          ) : (
            <div className="space-y-3">
              {currentDayActivities.map((act, idx) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 px-4 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                          {act.time} • {act.duration}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
                          {act.category}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {act.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-black text-emerald-700">
                      {formatINR(act.cost)}
                    </span>

                    {/* Reorder and Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleReorder(idx, 'up')}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Earlier"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === currentDayActivities.length - 1}
                        onClick={() => handleReorder(idx, 'down')}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Move Later"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADD ACTIVITY MODAL POPUP                                     */}
      {/* ============================================================ */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Activity to Sep {selectedDay}</h3>
                <p className="text-xs text-slate-500">Insert event into day calendar schedule</p>
              </div>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Activity Name:</label>
                <input
                  type="text"
                  required
                  value={newActName}
                  onChange={(e) => setNewActName(e.target.value)}
                  placeholder="e.g. Guided Museum Tour or Sunset Cruise"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Time:</label>
                  <input
                    type="text"
                    value={newActTime}
                    onChange={(e) => setNewActTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Cost (₹):</label>
                  <input
                    type="number"
                    value={newActCost}
                    onChange={(e) => setNewActCost(e.target.value)}
                    placeholder="e.g. 4500"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 font-bold outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category:</label>
                <select
                  value={newActCategory}
                  onChange={(e) => setNewActCategory(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="Sightseeing">Sightseeing & Landmarks</option>
                  <option value="Adventure">Adventure & Outdoor</option>
                  <option value="Cruise & Dining">Cruise & Dining</option>
                  <option value="Museum & Art">Museum & Art</option>
                  <option value="Transfer">Transfer & Travel</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  + Add to Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
