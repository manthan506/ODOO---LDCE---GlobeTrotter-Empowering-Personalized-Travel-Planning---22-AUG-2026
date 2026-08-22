'use client';

import { useState, useMemo } from 'react';
import { useTrip, useExpenses } from '@/hooks/useTrips';
import { toast } from 'sonner';
import {
  Loader2,
  MapPin,
  CalendarDays,
  ChevronRight,
  ArrowLeft,
  ArrowDown,
  Sparkles,
  Plus,
  X,
  Share2,
  Copy,
  Clock,
  Wallet,
  Calendar,
  List,
  SlidersHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface DayActivity {
  id: string;
  name: string;
  time: string;
  duration: string;
  category: string;
  cost: number;
  imageUrl: string;
  description: string;
  highlights: string[];
}

interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  activities: DayActivity[];
}

interface PlaceItinerary {
  placeName: string;
  country: string;
  heroImage: string;
  totalBudget: number;
  days: DayPlan[];
}

const SAMPLE_PLACES_ITINERARY: Record<string, PlaceItinerary> = {
  paris: {
    placeName: 'Paris',
    country: 'France',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    totalBudget: 42000,
    days: [
      {
        dayNumber: 1,
        date: 'Sep 10, 2026',
        title: 'Arrival & Iconic Landmarks',
        activities: [
          {
            id: 'p1',
            name: 'Airport VIP Shuttle to Central Hotel Check-in',
            time: '10:00 AM',
            duration: '1.5 Hours',
            category: 'Transfer',
            cost: 4500,
            imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80',
            description: 'Private airport transfer directly to boutique hotel near the Seine.',
            highlights: ['Mercedes executive transfer', 'Luggage assistance', 'Instant hotel check-in'],
          },
          {
            id: 'p2',
            name: 'Louvre Museum Guided Masterpieces Tour',
            time: '02:30 PM',
            duration: '2.5 Hours',
            category: 'Museum & Art',
            cost: 5200,
            imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
            description: 'Skip-the-line entrance with art historian guide to view the Mona Lisa & Venus de Milo.',
            highlights: ['Skip-the-line pass', 'Mona Lisa priority viewing', 'Curated historic commentary'],
          },
          {
            id: 'p3',
            name: 'Seine River Romantic Sunset Dinner Cruise',
            time: '07:00 PM',
            duration: '2.5 Hours',
            category: 'Cruise & Dining',
            cost: 6800,
            imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
            description: '3-course French gourmet meal onboard a panoramic glass boat facing illuminated Eiffel Tower.',
            highlights: ['3-course gourmet dinner', 'Champagne toast', 'Live acoustic French music'],
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Sep 11, 2026',
        title: 'Bohemian Montmartre & Historic Palace',
        activities: [
          {
            id: 'p4',
            name: 'Montmartre Artists Quarter & Sacré-Cœur Walking Tour',
            time: '09:30 AM',
            duration: '2.0 Hours',
            category: 'Cultural Walk',
            cost: 3200,
            imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80',
            description: 'Explore cobblestone alleys, artist squares, and breathtaking panoramic hill views of Paris.',
            highlights: ['Sacré-Cœur Basilica entry', 'Historic Moulin Rouge exterior', 'Local bakery macaron tasting'],
          },
          {
            id: 'p5',
            name: 'Palais Garnier Opera House Private Access Tour',
            time: '02:00 PM',
            duration: '2.0 Hours',
            category: 'Architecture',
            cost: 4100,
            imageUrl: 'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?w=600&q=80',
            description: 'Gilded grand foyers, phantom of the opera history, and royal theater boxes.',
            highlights: ['Grand staircase photography', 'Auditorium access', 'Chagall painted ceiling'],
          },
          {
            id: 'p6',
            name: 'Eiffel Tower Top Floor Access & Champagne Bar',
            time: '06:30 PM',
            duration: '2.5 Hours',
            category: 'Landmark',
            cost: 5800,
            imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80',
            description: 'Direct elevator to the very top summit with panoramic 360-degree night views over Paris.',
            highlights: ['Summit elevator pass', 'Glass floor observatory', 'Evening sparkling lights show'],
          },
        ],
      },
    ],
  },
  swiss: {
    placeName: 'Swiss Alps',
    country: 'Switzerland',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80',
    totalBudget: 58000,
    days: [
      {
        dayNumber: 1,
        date: 'Sep 14, 2026',
        title: 'Alpine Arrival & Lake Brienz Cruise',
        activities: [
          {
            id: 's1',
            name: 'Scenic Glacier Express Train & Hotel Transfer',
            time: '09:00 AM',
            duration: '3.0 Hours',
            category: 'Scenic Train',
            cost: 7500,
            imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',
            description: 'Panoramic glass dome train winding through alpine meadows into Interlaken.',
            highlights: ['Glacier Express 1st class', 'Luggage porter service', 'Alpine mountain pass views'],
          },
          {
            id: 's2',
            name: 'Turquoise Lake Brienz Steamer & Giessbach Falls',
            time: '02:00 PM',
            duration: '2.5 Hours',
            category: 'Lake & Nature',
            cost: 4200,
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
            description: 'Cruise crystal turquoise waters surrounded by towering 4000m peaks to Giessbach waterfalls.',
            highlights: ['Steamer boat cruise', 'Historic funicular railway', 'Waterfall trail walk'],
          },
          {
            id: 's3',
            name: 'Traditional Swiss Fondue & Raclette Dinner',
            time: '07:30 PM',
            duration: '2.0 Hours',
            category: 'Gastronomy',
            cost: 4800,
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
            description: 'Authentic wood-chalet cheese fondue experience paired with Valais white wine.',
            highlights: ['Artisanal Gruyere fondue', 'Fresh baked rösti', 'Swiss chocolate dessert'],
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Sep 15, 2026',
        title: 'Jungfraujoch Summit & Cliff Thrills',
        activities: [
          {
            id: 's4',
            name: 'Jungfraujoch Top of Europe Express Cogwheel Train',
            time: '08:30 AM',
            duration: '5.0 Hours',
            category: 'Summit Adventure',
            cost: 14500,
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
            description: 'Climb inside the mountain to the highest railway station in Europe at 3,454 meters.',
            highlights: ['Eiger Glacier express', 'Ice Palace tunnels', 'Sphinx 360-degree observation deck'],
          },
          {
            id: 's5',
            name: 'Grindelwald First Cliff Walk by Tissot',
            time: '03:00 PM',
            duration: '2.0 Hours',
            category: 'Thrill & View',
            cost: 3800,
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
            description: 'Walk suspended over 2,000m cliffs along steel bridge structure overlooking Grindelwald valley.',
            highlights: ['Suspension bridge walk', 'First flyer zipline option', 'Panoramic terrace photos'],
          },
          {
            id: 's6',
            name: 'Alpine Spa Wellness & Thermal Salt Pool',
            time: '06:30 PM',
            duration: '2.5 Hours',
            category: 'Relaxation',
            cost: 5200,
            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
            description: 'Relax aching muscles in outdoor heated thermal saltwater pool facing the Jungfrau peak.',
            highlights: ['Heated infinity pool', 'Swiss pine sauna', 'Mineral salt therapy'],
          },
        ],
      },
    ],
  },
  rome: {
    placeName: 'Rome',
    country: 'Italy',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    totalBudget: 36000,
    days: [
      {
        dayNumber: 1,
        date: 'Sep 19, 2026',
        title: 'Ancient Colosseum & Imperial Rome',
        activities: [
          {
            id: 'r1',
            name: 'Colosseum Arena Floor & Underground Gladiator Pass',
            time: '09:30 AM',
            duration: '3.0 Hours',
            category: 'Historical',
            cost: 6500,
            imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
            description: 'Exclusive access directly onto the arena floor where gladiators fought.',
            highlights: ['Gladiator arena floor VIP pass', 'Palatine Hill imperial palaces', 'Roman Forum guided tour'],
          },
          {
            id: 'r2',
            name: 'Pantheon Temple & Trevi Fountain Historic Walk',
            time: '02:30 PM',
            duration: '2.0 Hours',
            category: 'Walking Tour',
            cost: 2800,
            imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
            description: 'Marvel at ancient domed architecture, throw a coin in Trevi, and savor espresso.',
            highlights: ['Pantheon interior entry', 'Trevi Fountain photo spot', 'Sant Eustachio espresso tasting'],
          },
          {
            id: 'r3',
            name: 'Trastevere Foodie Walk: Handmade Pasta & Wine',
            time: '07:00 PM',
            duration: '3.5 Hours',
            category: 'Food & Wine',
            cost: 5400,
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
            description: 'Authentic 4-course progressive dinner through Rome’s most vibrant cobblestone district.',
            highlights: ['Carbonara & Cacio e Pepe', 'Chianti & Barolo pairings', 'Award-winning artisanal gelato'],
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Sep 20, 2026',
        title: 'Vatican Treasures & St. Peter’s Dome',
        activities: [
          {
            id: 'r4',
            name: 'Vatican Museums & Sistine Chapel Early Access',
            time: '08:00 AM',
            duration: '3.5 Hours',
            category: 'Museum & Faith',
            cost: 6800,
            imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
            description: 'Enter before general crowds to admire Michelangelo’s ceiling in quiet splendor.',
            highlights: ['Early bird VIP entrance', 'Sistine Chapel private viewing', 'St. Peter’s Basilica access'],
          },
          {
            id: 'r5',
            name: 'Castel Sant’Angelo Fortress & Angel Bridge',
            time: '02:30 PM',
            duration: '2.0 Hours',
            category: 'Castle & Views',
            cost: 3400,
            imageUrl: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&q=80',
            description: 'Papal fortress with secret passage corridors and rooftop views across Rome.',
            highlights: ['Castle rooftop terrace', 'Passetto di Borgo corridor', 'Ponte Sant’Angelo bridge views'],
          },
          {
            id: 'r6',
            name: 'Piazza Navona Evening Sunset & Aperitivo',
            time: '06:30 PM',
            duration: '2.0 Hours',
            category: 'Aperitivo',
            cost: 3900,
            imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80',
            description: 'Bernini fountains, lively street artists, and refreshing Aperol Spritz cocktails.',
            highlights: ['Fountain of Four Rivers view', 'Gourmet bruschetta platters', 'Spritz cocktail tasting'],
          },
        ],
      },
    ],
  },
};

export function ItineraryView({ tripId }: { tripId: string }) {
  const [selectedPlaceKey, setSelectedPlaceKey] = useState<string>('paris');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'day' | 'category'>('day');
  const [sortBy, setSortBy] = useState<'chrono' | 'costHigh' | 'costLow'>('chrono');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxCostFilter, setMaxCostFilter] = useState<number>(20000);
  const [selectedActivity, setSelectedActivity] = useState<DayActivity | null>(null);

  const currentPlace = SAMPLE_PLACES_ITINERARY[selectedPlaceKey] || SAMPLE_PLACES_ITINERARY.paris;

  // Filter and sort activities
  const processedDays = useMemo(() => {
    return currentPlace.days.map((day) => {
      let acts = day.activities.filter((act) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (
            !act.name.toLowerCase().includes(q) &&
            !act.category.toLowerCase().includes(q) &&
            !act.description.toLowerCase().includes(q)
          ) {
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

      if (sortBy === 'costHigh') {
        acts = [...acts].sort((a, b) => b.cost - a.cost);
      } else if (sortBy === 'costLow') {
        acts = [...acts].sort((a, b) => a.cost - b.cost);
      }

      return {
        ...day,
        activities: acts,
      };
    });
  }, [currentPlace, searchQuery, selectedCategory, maxCostFilter, sortBy]);

  const totalFilteredExpense = useMemo(() => {
    return processedDays.reduce(
      (sum, day) => sum + day.activities.reduce((s, a) => s + a.cost, 0),
      0
    );
  }, [processedDays]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-24">
      {/* Top Header Control Bar matching Screen 6/7 Wireframe */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        {/* Search bar ...... (Wide Input) */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bar ...... (activities, landmarks, tours)"
            className="h-11 w-full rounded-2xl border-2 border-slate-900 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs"
          />
        </div>

        {/* Group by Dropdown Button */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border-2 border-slate-900 bg-white px-4 pr-9 text-xs font-bold text-slate-900 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
          >
            <option value="day">Group by: Day</option>
            <option value="category">Group by: Category</option>
          </select>
          <Layers size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 px-5 text-xs font-bold transition shadow-2xs cursor-pointer ${
            showFilterDrawer ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Filter size={14} /> Filter
        </button>

        {/* Sort by... Dropdown Button */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border-2 border-slate-900 bg-white px-4 pr-9 text-xs font-bold text-slate-900 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
          >
            <option value="chrono">Sort by: Chronological</option>
            <option value="costHigh">Sort by: Highest Expense</option>
            <option value="costLow">Sort by: Lowest Expense</option>
          </select>
          <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>
      </div>

      {/* FILTER DRAWER EXPANDABLE */}
      {showFilterDrawer && (
        <div className="mb-6 rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-md space-y-4 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
              Filter Options
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
                        ? 'border-slate-900 bg-slate-900 text-white'
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
                <span>Max Expense Per Activity:</span>
                <span className="text-emerald-700 font-extrabold">{formatINR(maxCostFilter)}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={20000}
                step={1000}
                value={maxCostFilter}
                onChange={(e) => setMaxCostFilter(Number(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER: "Itinerary for a selected place" matching Screen 6/7 Wireframe */}
      <div className="rounded-3xl border-2 border-slate-900 bg-white p-6 sm:p-8 shadow-sm">
        {/* Title & Place Selection Selector */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Itinerary for a selected place
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore the scheduled physical activities and corresponding expense breakdown.
          </p>

          {/* Place Switcher Chips (Paris, Swiss Alps, Rome) */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
            {[
              { key: 'paris', label: '📍 Paris, France' },
              { key: 'swiss', label: '🏔️ Swiss Alps, Switzerland' },
              { key: 'rome', label: '🏛️ Rome, Italy' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPlaceKey(p.key)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedPlaceKey === p.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* TWO COLUMN HEADERS MATCHING WIREFRAME: [ Physical Activity ] and [ Expense ] */}
        <div className="grid grid-cols-12 gap-4 border-b-2 border-slate-900 pb-3 mb-6 text-slate-900">
          <div className="col-span-3 sm:col-span-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Timeline</span>
          </div>
          <div className="col-span-6 sm:col-span-7">
            <h2 className="text-base sm:text-lg font-black text-slate-900">Physical Activity</h2>
          </div>
          <div className="col-span-3 sm:col-span-3 text-right sm:text-center">
            <h2 className="text-base sm:text-lg font-black text-slate-900">Expense</h2>
          </div>
        </div>

        {/* DAY-WISE TIMELINE FLOW WITH ARROWS (↓) */}
        <div className="space-y-10">
          {processedDays.map((day) => (
            <div key={day.dayNumber} className="space-y-4">
              {/* Day Row Header */}
              <div className="grid grid-cols-12 gap-4 items-start">
                {/* Left "Day {N}" Pill Box matching Wireframe */}
                <div className="col-span-3 sm:col-span-2">
                  <div className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-2 text-xs sm:text-sm font-black text-white shadow-2xs">
                    Day {day.dayNumber}
                  </div>
                  <span className="block text-[11px] font-bold text-slate-400 mt-1.5 pl-1">
                    {day.date}
                  </span>
                </div>

                {/* Day Activities & Expenses Flow */}
                <div className="col-span-9 sm:col-span-10 space-y-3">
                  {day.activities.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-400 italic">
                      No activities match your filters for Day {day.dayNumber}.
                    </div>
                  ) : (
                    day.activities.map((act, actIdx) => (
                      <div key={act.id} className="space-y-3">
                        {/* Activity Row: Left Physical Activity Card & Right Expense Box */}
                        <div className="grid grid-cols-10 gap-3 items-center">
                          {/* Physical Activity Card (7/10 Columns) */}
                          <div
                            onClick={() => setSelectedActivity(act)}
                            className="col-span-7 flex cursor-pointer items-center justify-between rounded-2xl border-2 border-slate-900 bg-white p-3.5 px-4 shadow-2xs hover:bg-blue-50/40 hover:border-blue-600 transition-all group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                              {/* Activity Image Thumbnail */}
                              <img
                                src={act.imageUrl}
                                alt={act.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                                }}
                                className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-cover flex-shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                              />

                              <div className="min-w-0">
                                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">
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

                          {/* Corresponding Expense Box (3/10 Columns matching Wireframe) */}
                          <div className="col-span-3 flex items-center justify-center rounded-2xl border-2 border-slate-900 bg-emerald-50/80 p-3.5 px-3 text-center shadow-2xs">
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

                        {/* FLOW DOWNWARD CONNECTOR ARROW (↓) matching Wireframe */}
                        {actIdx < day.activities.length - 1 && (
                          <div className="flex justify-center my-1">
                            <div className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-900 border border-slate-300 shadow-2xs">
                              <ArrowDown size={14} strokeWidth={2.5} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Day Divider */}
              <div className="border-b border-slate-200 pt-3" />
            </div>
          ))}
        </div>

        {/* Total Expense Summary Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 px-6 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Wallet size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Itinerary Expense ({currentPlace.placeName})
              </span>
              <p className="text-lg sm:text-xl font-black text-emerald-400">
                {formatINR(totalFilteredExpense)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/trips/${tripId}/plan`}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Edit Sections
            </Link>
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? window.location.href : '';
                navigator.clipboard.writeText(url);
                toast.success('Itinerary link copied to clipboard!');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition cursor-pointer"
            >
              <Share2 size={13} /> Share Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVITY DETAIL INSPECTOR MODAL */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
            {/* Modal Image Hero */}
            <div className="relative h-44 w-full bg-slate-900">
              <img
                src={selectedActivity.imageUrl}
                alt={selectedActivity.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {selectedActivity.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-tight drop-shadow-xs">
                  {selectedActivity.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scheduled Timing
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <Clock size={12} className="text-blue-600" /> {selectedActivity.time} ({selectedActivity.duration})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Expense Cost
                  </span>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    {formatINR(selectedActivity.cost)} / traveler
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedActivity.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Experience Highlights:
                </h4>
                <ul className="space-y-1.5">
                  {selectedActivity.highlights.map((h, i) => (
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
                onClick={() => setSelectedActivity(null)}
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
