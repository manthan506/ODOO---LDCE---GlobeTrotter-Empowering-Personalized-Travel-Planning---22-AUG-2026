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
  Eye,
  SlidersHorizontal,
  FolderPlus,
  ListTree,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

// ==========================================
// DATA TYPES
// ==========================================
interface ActivityItem {
  id: string;
  name: string;
  cost: number;
  time: string;
  category: string;
  imageUrl: string;
  duration: string;
  description: string;
  highlights: string[];
}

interface ItinerarySection {
  id: string;
  title: string;
  category: 'travel' | 'hotel' | 'activity' | 'city';
  city: string;
  country: string;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: ActivityItem[];
}

interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  activities: ActivityItem[];
}

interface PlaceTimeline {
  placeName: string;
  country: string;
  heroImage: string;
  totalBudget: number;
  days: DayPlan[];
}

// Initial Sections for Screen 5
const INITIAL_SECTIONS: ItinerarySection[] = [
  {
    id: 'sec-1',
    title: 'Flight & Arrival in Paris',
    category: 'travel',
    city: 'Paris',
    country: 'France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description:
      'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including international flights, airport shuttle, and private check-in.',
    startDate: 'Sep 10, 2026',
    endDate: 'Sep 13, 2026',
    budget: 35000,
    activities: [
      {
        id: 'a1',
        name: 'Seine River Sunset Cruise',
        cost: 3500,
        time: '06:30 PM',
        category: 'Cruise & Sightseeing',
        imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80',
        duration: '1.5 Hours',
        description: 'Glide down the River Seine with breathtaking twilight perspectives of Notre Dame & illuminated Eiffel Tower.',
        highlights: ['Eiffel Tower illuminations', 'Complimentary Champagne', 'Live commentary'],
      },
      {
        id: 'a2',
        name: 'Louvre Museum Guided Tour',
        cost: 4200,
        time: '10:00 AM',
        category: 'Art & History',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
        duration: '2.5 Hours',
        description: 'Skip-the-line pass with art historian specialist guiding you through the Venus de Milo and Mona Lisa.',
        highlights: ['Skip-the-line entrance', 'Mona Lisa priority viewing', 'Expert art historian guide'],
      },
    ],
  },
  {
    id: 'sec-2',
    title: 'Swiss Alps Hotel Stay & Alpine Glacier Tour',
    category: 'hotel',
    city: 'Interlaken',
    country: 'Switzerland',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    description:
      'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including 4-star mountain lodge booking, panoramic train transfers, and ski equipment rental.',
    startDate: 'Sep 14, 2026',
    endDate: 'Sep 18, 2026',
    budget: 52000,
    activities: [
      {
        id: 'a3',
        name: 'Jungfraujoch Top of Europe Express',
        cost: 12000,
        time: '09:00 AM',
        category: 'Alpine Adventure',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        duration: '5.0 Hours',
        description: 'Cogwheel scenic train climb to the highest railway station in Europe with stunning glacier panoramas.',
        highlights: ['Cogwheel scenic railway', 'Ice Palace exploration', 'Sphinx Observatory view'],
      },
      {
        id: 'a4',
        name: 'First Cliff Walk by Tissot',
        cost: 4500,
        time: '02:00 PM',
        category: 'Nature & Thrill',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
        duration: '2.0 Hours',
        description: 'Suspended metal walkway over dramatic cliffs overlooking the majestic Grindelwald valley.',
        highlights: ['Suspension bridge panorama', 'Grindelwald peak views', 'Alpine photo vantage'],
      },
    ],
  },
  {
    id: 'sec-3',
    title: 'Rome Historic City Center & Vatican Exploration',
    category: 'activity',
    city: 'Rome',
    country: 'Italy',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description:
      'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including Colosseum skip-the-line passes, Vatican City VIP tour, and local culinary tastings.',
    startDate: 'Sep 19, 2026',
    endDate: 'Sep 23, 2026',
    budget: 28000,
    activities: [
      {
        id: 'a5',
        name: 'Colosseum & Roman Forum VIP Tour',
        cost: 5800,
        time: '10:30 AM',
        category: 'Historical Landmark',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
        duration: '3.0 Hours',
        description: 'Direct arena floor pass walking through gladiator gates and ancient Roman temples.',
        highlights: ['Arena floor VIP access', 'Gladiator tunnels tour', 'Roman Forum ruins guide'],
      },
      {
        id: 'a6',
        name: 'Trastevere Evening Food & Wine Walking Tour',
        cost: 4800,
        time: '07:00 PM',
        category: 'Culinary Experience',
        imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
        duration: '3.5 Hours',
        description: 'Progressive culinary evening across 4 historic trattorias tasting authentic Roman pasta & wines.',
        highlights: ['Authentic Roman pasta tasting', 'Artisanal gelato', 'Selected Italian wine pairings'],
      },
    ],
  },
];

// Timeline for Screen 6 / 7
const TIMELINE_PLACES: Record<string, PlaceTimeline> = {
  paris: {
    placeName: 'Paris',
    country: 'France',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    totalBudget: 42000,
    days: [
      {
        dayNumber: 1,
        date: 'Sep 10, 2026',
        title: 'Arrival & River Romance',
        activities: [
          {
            id: 't1',
            name: 'Airport VIP Shuttle to Hotel Check-in',
            time: '10:00 AM',
            duration: '1.5 Hours',
            category: 'Transfer',
            cost: 4500,
            imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80',
            description: 'Private chauffeur transfer directly to luxury boutique hotel near Saint-Germain.',
            highlights: ['Mercedes sedan transfer', 'Luggage assistance', 'Instant hotel check-in'],
          },
          {
            id: 't2',
            name: 'Louvre Museum Guided Tour',
            time: '02:30 PM',
            duration: '2.5 Hours',
            category: 'Museum & Art',
            cost: 5200,
            imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
            description: 'Skip-the-line entrance to see the Mona Lisa, Winged Victory, and ancient Egyptian artifacts.',
            highlights: ['Fast-track pass', 'Art historian commentary', 'Mona Lisa viewing'],
          },
          {
            id: 't3',
            name: 'Seine River Sunset Gourmet Cruise',
            time: '07:00 PM',
            duration: '2.5 Hours',
            category: 'Cruise & Dining',
            cost: 6800,
            imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
            description: '3-course gourmet dinner cruising past illuminated bridges and the sparkling Eiffel Tower.',
            highlights: ['3-course dinner', 'Champagne welcome', 'Live French acoustic music'],
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Sep 11, 2026',
        title: 'Historic Montmartre & Summit View',
        activities: [
          {
            id: 't4',
            name: 'Montmartre & Sacré-Cœur Walking Tour',
            time: '09:30 AM',
            duration: '2.0 Hours',
            category: 'Cultural Walk',
            cost: 3200,
            imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80',
            description: 'Explore cobblestone alleys, artist squares, and scenic hill views across Paris.',
            highlights: ['Sacré-Cœur Basilica entry', 'Historic Moulin Rouge', 'Artisan bakery stops'],
          },
          {
            id: 't5',
            name: 'Palais Garnier Opera House Access',
            time: '02:00 PM',
            duration: '2.0 Hours',
            category: 'Architecture',
            cost: 4100,
            imageUrl: 'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?w=600&q=80',
            description: 'Gilded grand foyers, royal opera boxes, and historical architecture.',
            highlights: ['Grand staircase', 'Auditorium view', 'Chagall painted ceiling'],
          },
          {
            id: 't6',
            name: 'Eiffel Tower Top Floor Access & Champagne',
            time: '06:30 PM',
            duration: '2.5 Hours',
            category: 'Landmark',
            cost: 5800,
            imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80',
            description: 'Direct summit elevator with panoramic 360-degree night views over Paris.',
            highlights: ['Summit elevator pass', 'Observation deck', 'Evening sparkling lights show'],
          },
        ],
      },
    ],
  },
  swiss: {
    placeName: 'Swiss Alps',
    country: 'Switzerland',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    totalBudget: 58000,
    days: [
      {
        dayNumber: 1,
        date: 'Sep 14, 2026',
        title: 'Alpine Arrival & Lake Cruise',
        activities: [
          {
            id: 'st1',
            name: 'Scenic Glacier Express Train Transfer',
            time: '09:00 AM',
            duration: '3.0 Hours',
            category: 'Scenic Train',
            cost: 7500,
            imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',
            description: 'Panoramic glass dome train winding through alpine meadows into Interlaken.',
            highlights: ['Glacier Express 1st class', 'Alpine pass views', 'Luggage porter'],
          },
          {
            id: 'st2',
            name: 'Lake Brienz Steamer & Giessbach Falls',
            time: '02:00 PM',
            duration: '2.5 Hours',
            category: 'Lake & Nature',
            cost: 4200,
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
            description: 'Crystal turquoise waters surrounded by towering 4000m peaks.',
            highlights: ['Steamer boat cruise', 'Historic funicular', 'Waterfall trail'],
          },
          {
            id: 'st3',
            name: 'Traditional Swiss Fondue & Wine Dinner',
            time: '07:30 PM',
            duration: '2.0 Hours',
            category: 'Gastronomy',
            cost: 4800,
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
            description: 'Authentic wood-chalet cheese fondue experience with Valais white wine.',
            highlights: ['Gruyere fondue', 'Fresh baked rösti', 'Swiss chocolate dessert'],
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Sep 15, 2026',
        title: 'Jungfraujoch Summit & Cliff Walk',
        activities: [
          {
            id: 'st4',
            name: 'Jungfraujoch Top of Europe Express Train',
            time: '08:30 AM',
            duration: '5.0 Hours',
            category: 'Summit Adventure',
            cost: 14500,
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
            description: 'Climb inside the mountain to the highest railway station in Europe at 3,454m.',
            highlights: ['Eiger Glacier express', 'Ice Palace tunnels', 'Sphinx observation deck'],
          },
          {
            id: 'st5',
            name: 'Grindelwald First Cliff Walk by Tissot',
            time: '03:00 PM',
            duration: '2.0 Hours',
            category: 'Thrill & View',
            cost: 3800,
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
            description: 'Suspended walkway along steel bridge structure over Grindelwald valley.',
            highlights: ['Suspension bridge walk', 'First flyer zipline', 'Panoramic terrace'],
          },
          {
            id: 'st6',
            name: 'Alpine Spa Wellness & Heated Salt Pool',
            time: '06:30 PM',
            duration: '2.5 Hours',
            category: 'Relaxation',
            cost: 5200,
            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
            description: 'Relax in outdoor heated thermal saltwater pool facing the Jungfrau peak.',
            highlights: ['Heated infinity pool', 'Swiss pine sauna', 'Salt therapy'],
          },
        ],
      },
    ],
  },
  rome: {
    placeName: 'Rome',
    country: 'Italy',
    heroImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    totalBudget: 36000,
    days: [
      {
        dayNumber: 1,
        date: 'Sep 19, 2026',
        title: 'Ancient Colosseum & Forum',
        activities: [
          {
            id: 'rt1',
            name: 'Colosseum Arena Floor & Gladiator Pass',
            time: '09:30 AM',
            duration: '3.0 Hours',
            category: 'Historical',
            cost: 6500,
            imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
            description: 'Exclusive access onto the arena floor where gladiators fought.',
            highlights: ['Arena floor VIP pass', 'Palatine Hill palaces', 'Roman Forum guided tour'],
          },
          {
            id: 'rt2',
            name: 'Pantheon & Trevi Fountain Walk',
            time: '02:30 PM',
            duration: '2.0 Hours',
            category: 'Walking Tour',
            cost: 2800,
            imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
            description: 'Marvel at ancient domed architecture and throw a coin in Trevi.',
            highlights: ['Pantheon interior', 'Trevi photo spot', 'Espresso tasting'],
          },
          {
            id: 'rt3',
            name: 'Trastevere Foodie Walk: Pasta & Wine',
            time: '07:00 PM',
            duration: '3.5 Hours',
            category: 'Food & Wine',
            cost: 5400,
            imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
            description: 'Progressive 4-course dinner through Rome’s most vibrant district.',
            highlights: ['Handmade pasta', 'Chianti pairings', 'Artisanal gelato'],
          },
        ],
      },
      {
        dayNumber: 2,
        date: 'Sep 20, 2026',
        title: 'Vatican Treasures & Sunset Spritz',
        activities: [
          {
            id: 'rt4',
            name: 'Vatican Museums & Sistine Chapel Early Access',
            time: '08:00 AM',
            duration: '3.5 Hours',
            category: 'Museum & Faith',
            cost: 6800,
            imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
            description: 'Early bird entrance to admire Michelangelo’s ceiling in quiet splendor.',
            highlights: ['Early bird VIP entrance', 'Sistine Chapel', 'St. Peter’s Basilica'],
          },
          {
            id: 'rt5',
            name: 'Castel Sant’Angelo Fortress & Views',
            time: '02:30 PM',
            duration: '2.0 Hours',
            category: 'Castle & Views',
            cost: 3400,
            imageUrl: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&q=80',
            description: 'Papal fortress with secret passage corridors and rooftop terrace.',
            highlights: ['Rooftop terrace', 'Secret corridor', 'Angel bridge views'],
          },
          {
            id: 'rt6',
            name: 'Piazza Navona Sunset & Aperitivo',
            time: '06:30 PM',
            duration: '2.0 Hours',
            category: 'Aperitivo',
            cost: 3900,
            imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600&q=80',
            description: 'Bernini fountains, lively street artists, and refreshing Aperol Spritz.',
            highlights: ['Fountain of Four Rivers', 'Bruschetta platters', 'Spritz cocktail tasting'],
          },
        ],
      },
    ],
  },
};

export function TripListContent() {
  // Mode switcher: 'builder' (Screen 5) vs 'view' (Screen 6 / 7)
  const [activeScreen, setActiveScreen] = useState<'builder' | 'view'>('view');

  // Screen 5 Builder State
  const [sections, setSections] = useState<ItinerarySection[]>(INITIAL_SECTIONS);
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
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
    toast.success(`Section shifted ${dir === 'up' ? 'upwards' : 'downwards'}`);
  };

  const handleDeleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    toast.success('Section deleted');
  };

  const handleAddSection = (newSec: ItinerarySection) => {
    setSections((prev) => [...prev, newSec]);
    setShowAddModal(false);
    toast.success(`Section ${sections.length + 1} added successfully!`);
  };

  const totalSectionsBudget = sections.reduce((sum, s) => sum + s.budget, 0);

  // Screen 6/7 timeline filtering
  const currentPlace = TIMELINE_PLACES[selectedPlaceKey] || TIMELINE_PLACES.paris;

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

  const totalTimelineExpense = useMemo(() => {
    return processedDays.reduce(
      (sum, day) => sum + day.activities.reduce((s, a) => s + a.cost, 0),
      0
    );
  }, [processedDays]);

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
          Switch between Screen 5 Builder & Screen 6/7 View
        </span>
      </div>

      {/* ============================================================ */}
      {/* SCREEN 6 / 7: ITINERARY VIEW SCREEN WITH BUDGET SECTION       */}
      {/* ============================================================ */}
      {activeScreen === 'view' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Control Bar (Search bar ...... | Group by | Filter | Sort by...) */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search bar ...... */}
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

            {/* Group by */}
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

            {/* Filter */}
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

            {/* Sort by... */}
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
            {/* Header & City Selector */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Itinerary for a selected place
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visual timeline representation of scheduled physical activities and expense breakdown.
              </p>

              {/* Destination selector chips */}
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

            {/* TWO COLUMN HEADERS: [ Physical Activity ] and [ Expense ] */}
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
              {processedDays.map((day) => (
                <div key={day.dayNumber} className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-start">
                    {/* Day Box Pill */}
                    <div className="col-span-3 sm:col-span-2">
                      <div className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs sm:text-sm font-extrabold text-blue-800 shadow-2xs">
                        Day {day.dayNumber}
                      </div>
                      <span className="block text-[11px] font-semibold text-slate-400 mt-1.5 pl-1">
                        {day.date}
                      </span>
                    </div>

                    {/* Activities List */}
                    <div className="col-span-9 sm:col-span-10 space-y-3">
                      {day.activities.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-400 italic">
                          No activities match your filters for Day {day.dayNumber}.
                        </div>
                      ) : (
                        day.activities.map((act, actIdx) => (
                          <div key={act.id} className="space-y-3">
                            <div className="grid grid-cols-10 gap-3 items-center">
                              {/* Physical Activity Card */}
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

                              {/* Expense Box */}
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

                            {/* Downward Connector Arrow (↓) */}
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
                    Total Selected Itinerary Expense ({currentPlace.placeName})
                  </span>
                  <p className="text-lg sm:text-xl font-black text-emerald-700">
                    {formatINR(totalTimelineExpense)}
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
                  Europe Grand Discovery 2026
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
                  {/* Box 1: Date Range */}
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

                  {/* Box 2: Budget */}
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

      {/* ============================================================ */}
      {/* ADD SECTION MODAL POPUP                                      */}
      {/* ============================================================ */}
      {showAddModal && (
        <AddSectionModal
          sectionNumber={sections.length + 1}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSection}
        />
      )}

      {/* ============================================================ */}
      {/* ACTIVITY DETAIL PREVIEW MODAL                                */}
      {/* ============================================================ */}
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
  onAdd: (sec: ItinerarySection) => void;
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
      title: title || `Exploration & Stay in ${city}`,
      category: 'city',
      city,
      country,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      description,
      startDate,
      endDate,
      budget: Number(budget) || 20000,
      activities: [
        {
          id: `a-${Date.now()}-1`,
          name: `${city} City Center Walking Tour`,
          cost: 3200,
          time: '10:00 AM',
          category: 'Cultural Walk',
          imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
          duration: '2.5 Hours',
          description: 'Gothic quarter tour with local historian guide.',
          highlights: ['Historic Gothic Quarter', 'Architectural highlights', 'Local English guide'],
        },
        {
          id: `a-${Date.now()}-2`,
          name: `Local Gastronomy Tasting Experience`,
          cost: 4500,
          time: '07:30 PM',
          category: 'Food & Drinks',
          imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
          duration: '3.0 Hours',
          description: 'Traditional bodega tapas tasting paired with sangria.',
          highlights: ['Tapas pairings', 'Traditional sangria', 'Secret local bodega stops'],
        },
      ],
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
