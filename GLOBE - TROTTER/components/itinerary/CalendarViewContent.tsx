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

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface CalendarActivity {
  id: string;
  name: string;
  time: string;
  duration: string;
  cost: number;
  category: string;
  location: string;
  tripName: string;
  tripColor: string;
  description: string;
}

interface TripSpan {
  id: string;
  title: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  startDay: number;
  endDay: number;
  city: string;
}

// Month: September 2026 (starts on Tuesday = col index 2)
const SEPTEMBER_2026_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

const SAMPLE_TRIP_SPANS: TripSpan[] = [
  {
    id: 'ts-1',
    title: 'PARIS TRIP',
    color: '#2563EB',
    badgeBg: 'bg-blue-600 text-white',
    badgeText: 'text-blue-700 bg-blue-50 border-blue-200',
    startDay: 10,
    endDay: 13,
    city: 'Paris, France',
  },
  {
    id: 'ts-2',
    title: 'SWISS ALPS TOUR',
    color: '#7C3AED',
    badgeBg: 'bg-purple-600 text-white',
    badgeText: 'text-purple-700 bg-purple-50 border-purple-200',
    startDay: 14,
    endDay: 18,
    city: 'Interlaken, Switzerland',
  },
  {
    id: 'ts-3',
    title: 'ROME GETAWAY',
    color: '#059669',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    startDay: 19,
    endDay: 23,
    city: 'Rome, Italy',
  },
  {
    id: 'ts-4',
    title: 'NYC GETAWAY',
    color: '#D97706',
    badgeBg: 'bg-amber-600 text-white',
    badgeText: 'text-amber-700 bg-amber-50 border-amber-200',
    startDay: 26,
    endDay: 28,
    city: 'New York, USA',
  },
];

const INITIAL_DAY_ACTIVITIES: Record<number, CalendarActivity[]> = {
  10: [
    {
      id: 'ca-1',
      name: 'Airport VIP Chauffeur Transfer to Hotel',
      time: '10:00 AM',
      duration: '1.5 Hours',
      cost: 4500,
      category: 'Transfer',
      location: 'Paris, France',
      tripName: 'Paris Trip',
      tripColor: '#2563EB',
      description: 'Private Mercedes executive shuttle directly to hotel.',
    },
    {
      id: 'ca-2',
      name: 'Louvre Museum Masterpieces Guided Tour',
      time: '02:30 PM',
      duration: '2.5 Hours',
      cost: 5200,
      category: 'Museum & Art',
      location: 'Paris, France',
      tripName: 'Paris Trip',
      tripColor: '#2563EB',
      description: 'Skip-the-line entrance to see the Mona Lisa.',
    },
    {
      id: 'ca-3',
      name: 'Seine River Romantic Sunset Dinner Cruise',
      time: '07:00 PM',
      duration: '2.5 Hours',
      cost: 6800,
      category: 'Cruise & Dining',
      location: 'Paris, France',
      tripName: 'Paris Trip',
      tripColor: '#2563EB',
      description: '3-course gourmet dinner cruising past illuminated Eiffel Tower.',
    },
  ],
  11: [
    {
      id: 'ca-4',
      name: 'Montmartre & Sacré-Cœur Walking Tour',
      time: '09:30 AM',
      duration: '2.0 Hours',
      cost: 3200,
      category: 'Cultural Walk',
      location: 'Paris, France',
      tripName: 'Paris Trip',
      tripColor: '#2563EB',
      description: 'Cobblestone streets and panoramic hill views.',
    },
    {
      id: 'ca-5',
      name: 'Eiffel Tower Top Floor Access & Champagne',
      time: '06:30 PM',
      duration: '2.5 Hours',
      cost: 5800,
      category: 'Landmark',
      location: 'Paris, France',
      tripName: 'Paris Trip',
      tripColor: '#2563EB',
      description: 'Summit elevator pass with panoramic views over Paris.',
    },
  ],
  14: [
    {
      id: 'ca-6',
      name: 'Glacier Express Scenic Train to Interlaken',
      time: '09:00 AM',
      duration: '3.5 Hours',
      cost: 7500,
      category: 'Scenic Train',
      location: 'Interlaken, Switzerland',
      tripName: 'Swiss Alps Tour',
      tripColor: '#7C3AED',
      description: 'Panoramic glass dome train winding through alpine meadows.',
    },
    {
      id: 'ca-7',
      name: 'Lake Brienz Steamer & Giessbach Falls',
      time: '02:00 PM',
      duration: '2.5 Hours',
      cost: 4200,
      category: 'Lake & Nature',
      location: 'Interlaken, Switzerland',
      tripName: 'Swiss Alps Tour',
      tripColor: '#7C3AED',
      description: 'Cruise crystal turquoise waters beneath alpine peaks.',
    },
  ],
  15: [
    {
      id: 'ca-8',
      name: 'Jungfraujoch Top of Europe Cogwheel Train',
      time: '08:30 AM',
      duration: '5.0 Hours',
      cost: 14500,
      category: 'Summit Adventure',
      location: 'Interlaken, Switzerland',
      tripName: 'Swiss Alps Tour',
      tripColor: '#7C3AED',
      description: 'Highest railway station in Europe at 3,454 meters.',
    },
    {
      id: 'ca-9',
      name: 'Grindelwald First Cliff Walk by Tissot',
      time: '03:00 PM',
      duration: '2.0 Hours',
      cost: 3800,
      category: 'Thrill & View',
      location: 'Interlaken, Switzerland',
      tripName: 'Swiss Alps Tour',
      tripColor: '#7C3AED',
      description: 'Suspended metal walkway over Grindelwald valley.',
    },
  ],
  19: [
    {
      id: 'ca-10',
      name: 'Colosseum Arena Floor & Underground Gladiator Pass',
      time: '09:30 AM',
      duration: '3.0 Hours',
      cost: 6500,
      category: 'Historical Landmark',
      location: 'Rome, Italy',
      tripName: 'Rome Getaway',
      tripColor: '#059669',
      description: 'Exclusive access onto the arena floor where gladiators fought.',
    },
    {
      id: 'ca-11',
      name: 'Trastevere Foodie Walk: Handmade Pasta & Wine',
      time: '07:00 PM',
      duration: '3.5 Hours',
      cost: 5400,
      category: 'Food & Dining',
      location: 'Rome, Italy',
      tripName: 'Rome Getaway',
      tripColor: '#059669',
      description: 'Authentic 4-course dinner tasting carbonara and Chianti.',
    },
  ],
};

export function CalendarViewContent() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 = September
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'month' | 'trip' | 'city'>('month');
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | 'cost'>('asc');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedTripFilter, setSelectedTripFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  // Activities state
  const [dayActivities, setDayActivities] = useState<Record<number, CalendarActivity[]>>(INITIAL_DAY_ACTIVITIES);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // New activity form
  const [newActName, setNewActName] = useState('');
  const [newActTime, setNewActTime] = useState('11:00 AM');
  const [newActCost, setNewActCost] = useState('3500');
  const [newActCategory, setNewActCategory] = useState('Sightseeing');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = `${months[currentMonthIndex]} 2026`;

  // Selected Day activities
  const currentDayActivities = dayActivities[selectedDay] || [];

  const handleReorder = (idx: number, dir: 'up' | 'down') => {
    if (!dayActivities[selectedDay]) return;
    const list = [...dayActivities[selectedDay]];
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === list.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    setDayActivities((prev) => ({
      ...prev,
      [selectedDay]: list,
    }));
    toast.success('Activity reordered');
  };

  const handleDeleteActivity = (actId: string) => {
    setDayActivities((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).filter((a) => a.id !== actId),
    }));
    toast.success('Activity removed from day');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName.trim()) return;

    const newAct: CalendarActivity = {
      id: `ca-${Date.now()}`,
      name: newActName,
      time: newActTime,
      duration: '2.0 Hours',
      cost: Number(newActCost) || 3000,
      category: newActCategory,
      location: 'Selected City',
      tripName: 'Active Trip',
      tripColor: '#2563EB',
      description: 'Scheduled trip activity.',
    };

    setDayActivities((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newAct],
    }));

    setNewActName('');
    setShowAddActivityModal(false);
    toast.success(`Activity added to Sep ${selectedDay}!`);
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
            placeholder="Search bar ...... (e.g. Paris, Cruise, Colosseum, Glacier Express)"
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
              Reset
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-2">Filter by Trip:</span>
            {['all', 'PARIS TRIP', 'SWISS ALPS TOUR', 'ROME GETAWAY', 'NYC GETAWAY'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTripFilter(t)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                  selectedTripFilter === t
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t === 'all' ? 'All Trips' : t}
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
            Visual month timeline with trip spans and expandable daily schedules.
          </p>
        </div>

        {/* MONTH & YEAR NAVIGATOR: ← January 2024 → (or September 2026) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1))}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {monthName}
          </h2>

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
          {/* Days of Week Header: SUN, MON, TUE, WED, THU, FRI, SAT */}
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
            {/* Empty Offset Days (Sep 2026 starts on Tuesday -> 2 blank cells for Sun, Mon) */}
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">30</span>
            </div>
            <div className="h-24 sm:h-28 bg-slate-50/50 p-2 text-slate-300">
              <span className="font-semibold">31</span>
            </div>

            {/* 30 Days of September 2026 */}
            {SEPTEMBER_2026_DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const hasActivities = !!dayActivities[day]?.length;
              const matchingSpan = SAMPLE_TRIP_SPANS.find((s) => day >= s.startDay && day <= s.endDay);

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
                        {dayActivities[day].length} acts
                      </span>
                    )}
                  </div>

                  {/* Trip Spans Badges matching Wireframe: PARIS TRIP, SWISS ALPS, ROME, NYC */}
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

                  {/* Day activity indicator */}
                  {hasActivities && (
                    <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-slate-500 truncate hidden sm:flex">
                      <Clock size={10} className="text-slate-400" />
                      <span className="truncate">{dayActivities[day][0]?.name}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 3 Trailing blank cells to complete 7-col grid */}
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
        {/* EXPANDABLE DAY DETAIL DRAWER / SCHEDULE (Feature 10)         */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">
                  Sep {selectedDay}, 2026
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Day Schedule & Activities
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

          {/* Activities List for Selected Day */}
          {currentDayActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              No scheduled activities on Sep {selectedDay}. Click &quot;+ Add Activity&quot; to plan this day.
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
