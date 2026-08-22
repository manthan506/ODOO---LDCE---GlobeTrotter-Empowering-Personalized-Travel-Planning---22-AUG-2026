'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Plus,
  Check,
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  Layers,
  ChevronRight,
  MousePointer2,
  Compass,
  Wallet,
  Clock,
  Sparkles,
  Building,
  Plane,
  Heart,
  Eye,
  SlidersHorizontal,
  BookmarkCheck,
} from 'lucide-react';

import { useTripSync } from '@/context/TripSyncContext';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

type CostTier = 'budget' | 'moderate' | 'luxury';
type DurationTier = 'quick' | 'halfDay' | 'fullDay';

interface ActivityItem {
  id: string;
  name: string;
  cityId: string;
  city: string;
  country: string;
  region: string;
  category: string;
  categoryGroup: 'adventure' | 'sightseeing' | 'food' | 'culture' | 'relaxation' | 'cruise';
  cost: number;
  costTier: CostTier;
  costLabel: string;
  durationMinutes: number;
  durationLabel: string;
  durationTier: DurationTier;
  popularity: number;
  reviewsCount: string;
  imageUrl: string;
  description: string;
  highlights: string[];
  activeCollaborator?: {
    name: string;
    color: string;
    bg: string;
  };
}

interface CityItem {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: '$$' | '$$$' | '$$$$';
  costLabel: string;
  popularity: number;
  reviewsCount: string;
  imageUrl: string;
  description: string;
  topAttractions: string[];
}

const CITIES_DATA: CityItem[] = [
  {
    id: 'c-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: '$$$',
    costLabel: '₹₹ Moderate (₹6,000/day avg)',
    popularity: 4.9,
    reviewsCount: '18.4k',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'The City of Light, world-famous for the Eiffel Tower, Louvre art collection, and romantic Seine riverbanks.',
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre'],
  },
  {
    id: 'c-swiss',
    name: 'Interlaken & Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    costIndex: '$$$$',
    costLabel: '₹₹₹ Luxury (₹9,500/day avg)',
    popularity: 4.9,
    reviewsCount: '12.6k',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    description: 'Alpine adventure capital nestled between Lake Thun and Lake Brienz beneath snow-capped Jungfrau peak.',
    topAttractions: ['Jungfraujoch Summit', 'Paragliding', 'Lake Brienz Steamer', 'Grindelwald Cliff Walk'],
  },
  {
    id: 'c-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: '$$$',
    costLabel: '₹₹ Moderate (₹5,500/day avg)',
    popularity: 4.9,
    reviewsCount: '21.2k',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description: 'The Eternal City with thousands of years of imperial history, gladiator arenas, and authentic culinary trattorias.',
    topAttractions: ['Colosseum Arena', 'Vatican Museums', 'Trevi Fountain', 'Trastevere Food Walk'],
  },
  {
    id: 'c-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: '$$$',
    costLabel: '₹₹ Moderate (₹6,800/day avg)',
    popularity: 4.9,
    reviewsCount: '19.8k',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    description: 'Futuristic mega-metropolis blending neon skyscrapers with historic Shinto shrines and Mount Fuji views.',
    topAttractions: ['Shibuya Crossing', 'Mount Fuji Bullet Train', 'Senso-ji Temple', 'Tsukiji Outer Market'],
  },
  {
    id: 'c-bali',
    name: 'Bali (Ubud & Seminyak)',
    country: 'Indonesia',
    region: 'Asia',
    costIndex: '$$',
    costLabel: '₹ Budget (₹3,200/day avg)',
    popularity: 4.8,
    reviewsCount: '16.5k',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Tropical island paradise of lush emerald rice terraces, sacred monkey temples, and world-class surfing beaches.',
    topAttractions: ['Ubud Sacred Monkey Forest', 'Tegenungan Waterfall', 'Uluwatu Sunset Temple', 'Mount Batur Sunrise'],
  },
  {
    id: 'c-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: '$$$',
    costLabel: '₹₹ Moderate (₹5,200/day avg)',
    popularity: 4.9,
    reviewsCount: '15.3k',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    description: 'Vibrant Mediterranean coastal capital famed for Gaudí architecture, Gothic alleys, and lively tapas bars.',
    topAttractions: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter', 'Barceloneta Beachfront'],
  },
];

const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-1',
    name: 'Tandem Paragliding Over Interlaken & Lake Brienz',
    cityId: 'c-swiss',
    city: 'Interlaken',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Paragliding & Adventure',
    categoryGroup: 'adventure',
    cost: 8500,
    costTier: 'luxury',
    costLabel: '₹₹₹ Luxury',
    durationMinutes: 90,
    durationLabel: '1.5 Hours',
    durationTier: 'quick',
    popularity: 4.9,
    reviewsCount: '2.8k',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    description: 'Experience the ultimate rush soaring with certified Swiss tandem pilots above Jungfrau snow peaks and turquoise lakes.',
    highlights: ['GoPro HD video package included', 'All safety gear & pilot instruction', 'Hotel pickup & drop-off'],
    activeCollaborator: {
      name: 'Thunder1907',
      color: 'text-cyan-700',
      bg: 'bg-cyan-100 border-cyan-300',
    },
  },
  {
    id: 'act-2',
    name: 'Jungfraujoch Top of Europe Cogwheel Express Pass',
    cityId: 'c-swiss',
    city: 'Interlaken',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Summit Mountain Express',
    categoryGroup: 'sightseeing',
    cost: 14500,
    costTier: 'luxury',
    costLabel: '₹₹₹ Luxury',
    durationMinutes: 300,
    durationLabel: '5.0 Hours',
    durationTier: 'fullDay',
    popularity: 4.9,
    reviewsCount: '3.4k',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    description: 'Climb inside the mountain to Europe’s highest railway station at 3,454m featuring the Ice Palace and Sphinx Terrace.',
    highlights: ['Eiger Glacier 360 Express', 'Ice Palace tunnels pass', 'Sphinx Observatory ticket'],
    activeCollaborator: {
      name: 'Defiant Bear',
      color: 'text-blue-700',
      bg: 'bg-blue-100 border-blue-300',
    },
  },
  {
    id: 'act-3',
    name: 'Paris Seine Romantic Sunset Yacht Cruise & Champagne',
    cityId: 'c-paris',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Cruise & Dining',
    categoryGroup: 'cruise',
    cost: 5800,
    costTier: 'moderate',
    costLabel: '₹₹ Moderate',
    durationMinutes: 120,
    durationLabel: '2.0 Hours',
    durationTier: 'quick',
    popularity: 4.8,
    reviewsCount: '4.1k',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'Glide past Notre Dame and the illuminated Eiffel Tower while sipping French champagne and savoring artisanal macarons.',
    highlights: ['Glass-canopy panoramic yacht', 'Champagne welcome flutes', 'Live acoustic music'],
  },
  {
    id: 'act-4',
    name: 'Louvre Museum Masterpieces Guided Walking Tour',
    cityId: 'c-paris',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Art & History',
    categoryGroup: 'culture',
    cost: 4200,
    costTier: 'moderate',
    costLabel: '₹₹ Moderate',
    durationMinutes: 150,
    durationLabel: '2.5 Hours',
    durationTier: 'halfDay',
    popularity: 4.9,
    reviewsCount: '5.2k',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    description: 'Skip-the-line entrance with art historian guide to view the Mona Lisa, Venus de Milo, and French Crown Jewels.',
    highlights: ['Skip-the-line pass', 'Mona Lisa priority viewing', 'Curated historic commentary'],
  },
  {
    id: 'act-5',
    name: 'Rome Colosseum Arena Floor & Underground Gladiator Pass',
    cityId: 'c-rome',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    category: 'Historical Landmark',
    categoryGroup: 'sightseeing',
    cost: 6500,
    costTier: 'moderate',
    costLabel: '₹₹ Moderate',
    durationMinutes: 180,
    durationLabel: '3.0 Hours',
    durationTier: 'halfDay',
    popularity: 4.9,
    reviewsCount: '5.6k',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description: 'Step directly through the Gladiator Gate onto the reconstructed arena floor and explore the underground hypogeum.',
    highlights: ['Restricted arena floor access', 'Roman Forum & Palatine Hill entry', 'Expert archaeologist guide'],
  },
  {
    id: 'act-6',
    name: 'Trastevere Food & Wine Tour: Handmade Pasta Tasting',
    cityId: 'c-rome',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    category: 'Food & Wine Tasting',
    categoryGroup: 'food',
    cost: 5400,
    costTier: 'moderate',
    costLabel: '₹₹ Moderate',
    durationMinutes: 210,
    durationLabel: '3.5 Hours',
    durationTier: 'halfDay',
    popularity: 4.9,
    reviewsCount: '3.9k',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    description: 'Authentic 4-course progressive dinner through Rome’s most vibrant cobblestone district tasting carbonara and Chianti.',
    highlights: ['Carbonara & Cacio e Pepe', 'Chianti & Barolo pairings', 'Award-winning artisanal gelato'],
  },
  {
    id: 'act-7',
    name: 'Tokyo Mount Fuji Panoramic Bullet Train & Hakone Cruise',
    cityId: 'c-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    category: 'Scenic Sightseeing',
    categoryGroup: 'sightseeing',
    cost: 7200,
    costTier: 'moderate',
    costLabel: '₹₹ Moderate',
    durationMinutes: 480,
    durationLabel: '8.0 Hours',
    durationTier: 'fullDay',
    popularity: 4.9,
    reviewsCount: '6.2k',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    description: 'Scenic day trip from Tokyo on the Shinkansen bullet train to Mount Fuji 5th station with Hakone ropeway cable car.',
    highlights: ['Shinkansen bullet train pass', 'Pirate ship cruise on Lake Ashi', 'Mount Fuji 5th station views'],
    activeCollaborator: {
      name: 'Worthwhile Parrot',
      color: 'text-amber-800',
      bg: 'bg-amber-100 border-amber-300',
    },
  },
  {
    id: 'act-8',
    name: 'Bali Ubud Sacred Monkey Forest & Jungle Waterfall Trek',
    cityId: 'c-bali',
    city: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    category: 'Nature & Wildlife',
    categoryGroup: 'adventure',
    cost: 3200,
    costTier: 'budget',
    costLabel: '₹ Budget',
    durationMinutes: 240,
    durationLabel: '4.0 Hours',
    durationTier: 'halfDay',
    popularity: 4.8,
    reviewsCount: '4.8k',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Guided private trek through lush rice terraces, ancient mossy temples, and swimming under Tegenungan waterfall.',
    highlights: ['Private Balinese guide', 'Monkey forest sanctuary pass', 'Waterfall swim & fresh coconuts'],
    activeCollaborator: {
      name: 'Watchful Ape',
      color: 'text-rose-700',
      bg: 'bg-rose-100 border-rose-300',
    },
  },
  {
    id: 'act-9',
    name: 'Barcelona Sagrada Familia Fast-Track & Tower View Tour',
    cityId: 'c-barcelona',
    city: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    category: 'Architecture & Culture',
    categoryGroup: 'culture',
    cost: 4600,
    costTier: 'moderate',
    costLabel: '₹₹ Moderate',
    durationMinutes: 150,
    durationLabel: '2.5 Hours',
    durationTier: 'halfDay',
    popularity: 4.9,
    reviewsCount: '5.1k',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    description: 'Skip the massive lines to explore Antoni Gaudí’s masterpiece basilica with Nativity facade tower access.',
    highlights: ['Skip-the-line entrance', 'Tower panoramic elevator', 'Gaudí museum access'],
  },
];

export function ExploreContent() {
  // Main view switcher: 'activities' (Feature 8) vs 'cities' (Feature 7)
  const [activeTab, setActiveTab] = useState<'activities' | 'cities'>('activities');

  // Selected stop filter for activities (e.g. 'all', 'c-paris', 'c-swiss', 'c-rome')
  const [selectedStopId, setSelectedStopId] = useState<string>('all');

  // Interest category filter
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string>('all');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCostTier, setSelectedCostTier] = useState<string>('all');
  const [selectedDurationTier, setSelectedDurationTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'costLow' | 'costHigh' | 'duration'>('popularity');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  const { addedActivityIds, toggleAddActivity, addSavedDestination } = useTripSync();

  // Selected for quick preview modal
  const [previewActivity, setPreviewActivity] = useState<ActivityItem | null>(null);
  const [previewCity, setPreviewCity] = useState<CityItem | null>(null);

  // Toggle add/remove
  const handleToggleActivity = (act: ActivityItem, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleAddActivity(act);
  };

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter((act) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = act.name.toLowerCase().includes(q);
        const matchesCity = act.city.toLowerCase().includes(q);
        const matchesCountry = act.country.toLowerCase().includes(q);
        const matchesCat = act.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesCountry && !matchesCat) return false;
      }

      if (selectedStopId !== 'all' && act.cityId !== selectedStopId) {
        return false;
      }

      if (selectedCategoryGroup !== 'all' && act.categoryGroup !== selectedCategoryGroup) {
        return false;
      }

      if (selectedCostTier !== 'all' && act.costTier !== selectedCostTier) {
        return false;
      }

      if (selectedDurationTier !== 'all' && act.durationTier !== selectedDurationTier) {
        return false;
      }

      if (act.cost > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'costLow') return a.cost - b.cost;
      if (sortBy === 'costHigh') return b.cost - a.cost;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      return 0;
    });
  }, [searchQuery, selectedStopId, selectedCategoryGroup, selectedCostTier, selectedDurationTier, maxPrice, sortBy]);

  // Filtered Cities
  const filteredCities = useMemo(() => {
    return CITIES_DATA.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.region.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery]);

  const totalSelectedActivities = addedActivityIds.length;
  const totalSelectedCost = ACTIVITIES_DATA.reduce((sum, act) => {
    return addedActivityIds.includes(act.id) ? sum + act.cost : sum;
  }, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28">
      {/* ============================================================ */}
      {/* TOP HEADER & MODE TOGGLE (Activity Search vs City Search)    */}
      {/* ============================================================ */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
              {activeTab === 'activities' ? 'Feature 8' : 'Feature 7'}
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900">
              {activeTab === 'activities' ? 'Activity Search & Experiences' : 'City Search & Discovery'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'activities'
              ? 'Browse things to do in each stop, categorized by interest, cost, and duration.'
              : 'Discover and include relevant destination cities in your trip itinerary.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={13} /> Activity Search
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cities')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'cities'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building size={13} /> City Search
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CONTROL BAR (Search Bar | Stop Selector | Filter | Sort by)  */}
      {/* ============================================================ */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'activities'
                  ? 'Search activities (e.g. Paragliding, Cruise, Colosseum, Pasta, Fuji)...'
                  : 'Search cities (e.g. Paris, Interlaken, Rome, Tokyo, Bali)...'
              }
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-9 text-xs sm:text-sm text-slate-900 font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stop / City Selector Dropdown (when in Activity Search) */}
          {activeTab === 'activities' && (
            <div className="relative">
              <select
                value={selectedStopId}
                onChange={(e) => setSelectedStopId(e.target.value)}
                className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
              >
                <option value="all">📍 All Stops & Cities</option>
                <option value="c-paris">🇫🇷 Stop 1: Paris, France</option>
                <option value="c-swiss">🇨🇭 Stop 2: Interlaken, Switzerland</option>
                <option value="c-rome">🇮🇹 Stop 3: Rome, Italy</option>
                <option value="c-tokyo">🇯🇵 Stop 4: Tokyo, Japan</option>
                <option value="c-bali">🇮🇩 Stop 5: Bali, Indonesia</option>
                <option value="c-barcelona">🇪🇸 Stop 6: Barcelona, Spain</option>
              </select>
              <MapPin size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          )}

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

          {/* Sort by... Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
            >
              <option value="popularity">Sort by: Popularity ⭐</option>
              <option value="costLow">Sort by: Cost (Low to High ₹)</option>
              <option value="costHigh">Sort by: Cost (High to Low ₹)</option>
              <option value="duration">Sort by: Duration ⏱️</option>
            </select>
            <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* CATEGORY / INTEREST CHIPS (Feature 8) */}
        {activeTab === 'activities' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: '🌟 All Interests' },
              { id: 'adventure', label: '🧗 Adventure' },
              { id: 'sightseeing', label: '🏛️ Sightseeing & Landmarks' },
              { id: 'food', label: '🍷 Food & Dining' },
              { id: 'culture', label: '🎨 Culture & Art' },
              { id: 'cruise', label: '⛵ Cruises & Sailing' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryGroup(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                  selectedCategoryGroup === cat.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* FILTER DRAWER EXPANDABLE (Cost, Duration, Price)              */}
      {/* ============================================================ */}
      {showFilterDrawer && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              Filter Options
            </span>
            <button
              onClick={() => {
                setSelectedStopId('all');
                setSelectedCategoryGroup('all');
                setSelectedCostTier('all');
                setSelectedDurationTier('all');
                setMaxPrice(20000);
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cost Index Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                <Wallet size={13} className="text-emerald-600" /> Cost Index (₹ INR):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'budget', label: '₹ Budget (< ₹4k)' },
                  { id: 'moderate', label: '₹₹ Mid (₹4k–₹7.5k)' },
                  { id: 'luxury', label: '₹₹₹ Luxury (> ₹7.5k)' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedCostTier(tier.id)}
                    className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                      selectedCostTier === tier.id
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                <Clock size={13} className="text-blue-600" /> Duration Filter:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'quick', label: '⏱️ Quick (< 2 hrs)' },
                  { id: 'halfDay', label: '⏱️ Half-Day (2–5 hrs)' },
                  { id: 'fullDay', label: '⏱️ Full-Day (5+ hrs)' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDurationTier(d.id)}
                    className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                      selectedDurationTier === d.id
                        ? 'border-blue-600 bg-blue-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Cost Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Max Cost:</span>
                <span className="text-emerald-700 font-extrabold">{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={2000}
                max={20000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected Items Summary Strip */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-blue-50/60 p-3 px-4 border border-blue-100 text-xs font-semibold text-blue-900">
        <div className="flex items-center gap-2">
          <BookmarkCheck size={16} className="text-blue-600" />
          <span>
            <strong>{totalSelectedActivities}</strong> experiences currently selected for your trip stops.
          </span>
        </div>
        <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
          Selected Cost: {formatINR(totalSelectedCost)}
        </span>
      </div>

      {/* ============================================================ */}
      {/* ACTIVITIES TAB: STACK OF WIDE CARDS (Feature 8)              */}
      {/* ============================================================ */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
              <Compass size={36} className="mx-auto text-blue-500 mb-3" />
              <h3 className="text-base font-bold text-slate-900">No activities match your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try selecting &quot;All Stops&quot; or clearing your category & cost filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStopId('all');
                  setSelectedCategoryGroup('all');
                  setSelectedCostTier('all');
                  setSelectedDurationTier('all');
                }}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredActivities.map((act) => {
              const isAdded = addedActivityIds.includes(act.id);

              return (
                <div
                  key={act.id}
                  onClick={() => setPreviewActivity(act)}
                  className={`group relative rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition-all cursor-pointer ${
                    isAdded
                      ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Multiplayer Collaborator badge */}
                  {act.activeCollaborator && (
                    <div
                      className={`absolute -top-3 right-6 z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black shadow-xs ${act.activeCollaborator.bg} ${act.activeCollaborator.color}`}
                    >
                      <MousePointer2 size={11} className="fill-current" />
                      <span>{act.activeCollaborator.name} is viewing</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0 border border-slate-100">
                        <img
                          src={act.imageUrl}
                          alt={act.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMG;
                          }}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                            {act.category}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {act.city}, {act.country}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                          {act.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-amber-600 font-bold">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            {act.popularity} ({act.reviewsCount})
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-600 flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" /> {act.durationLabel}
                          </span>
                          <span>•</span>
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-200">
                            {act.costLabel} ({formatINR(act.cost)})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Cost & ADD / REMOVE BUTTON (Feature 8) */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Cost
                        </span>
                        <p className="text-base sm:text-lg font-black text-emerald-700">
                          {formatINR(act.cost)}
                        </p>
                      </div>

                      {/* Add/Remove Button Toggle */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleActivity(act, e)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} strokeWidth={2.5} />
                            Added to Stop
                          </>
                        ) : (
                          <>
                            <Plus size={15} strokeWidth={2.5} />
                            Add to Stop
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* CITIES TAB: DESTINATIONS STACK (Feature 7)                   */}
      {/* ============================================================ */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              onClick={() => setPreviewCity(city)}
              className="group relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0 border border-slate-100">
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                        {city.region}
                      </span>
                      <span className="text-xs font-bold text-slate-500">📍 {city.country}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                      {city.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {city.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span className="font-semibold text-emerald-700">Cost Index: {city.costLabel}</span>
                      <span>•</span>
                      <span>⭐ {city.popularity} ({city.reviewsCount} travelers)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Added ${city.name}, ${city.country} to trip stops!`);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add City to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* ACTIVITY QUICK DETAIL MODAL PREVIEW                          */}
      {/* ============================================================ */}
      {previewActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={previewActivity.imageUrl}
                alt={previewActivity.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent" />
              <button
                type="button"
                onClick={() => setPreviewActivity(null)}
                className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-5 right-5">
                <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {previewActivity.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-tight drop-shadow-xs">
                  {previewActivity.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2.5 rounded-2xl bg-slate-50 p-3 border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Duration
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {previewActivity.durationLabel}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cost Tier
                  </span>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    {previewActivity.costLabel}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cost
                  </span>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    {formatINR(previewActivity.cost)}
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
                <span>Verified experience booking with flexible free cancellation.</span>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewActivity(null)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    handleToggleActivity(previewActivity, e);
                    setPreviewActivity(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white shadow-sm transition active:scale-98 cursor-pointer ${
                    addedActivityIds.includes(previewActivity.id)
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {addedActivityIds.includes(previewActivity.id) ? (
                    <>
                      <X size={16} /> Remove from Stop
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add to Stop
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
