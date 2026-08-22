'use client';

import { useState, useMemo } from 'react';
import { useCities, useTrips } from '@/hooks/useTrips';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Plus,
  X,
  Sparkles,
  Clock,
  Heart,
  SlidersHorizontal,
  DollarSign,
  Compass,
  Star,
  CheckCircle2,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  Layers,
  ChevronRight,
  UserCheck,
  MousePointer2,
  Globe,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import type { City } from '@/types';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface SearchOptionItem {
  id: string;
  name: string;
  type: 'activity' | 'city';
  city: string;
  country: string;
  region: string;
  category: string;
  cost: number;
  costIndex: '$$' | '$$$' | '$$$$';
  popularity: number;
  reviewsCount: string;
  imageUrl: string;
  duration: string;
  bestTime: string;
  description: string;
  highlights: string[];
  activeCollaborator?: {
    name: string;
    color: string;
    bg: string;
  };
}

const SEARCH_DATA: SearchOptionItem[] = [
  {
    id: 'opt-1',
    name: 'Tandem Paragliding Over Interlaken & Lake Brienz',
    type: 'activity',
    city: 'Interlaken',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Paragliding & Adventure',
    cost: 8500,
    costIndex: '$$$',
    popularity: 4.9,
    reviewsCount: '2.8k',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    duration: '1.5 Hours',
    bestTime: 'May – October',
    description: 'Experience the ultimate rush soaring with certified Swiss tandem pilots above Jungfrau snow peaks and turquoise lakes.',
    highlights: ['GoPro HD video package included', 'All safety gear & pilot instruction', 'Hotel pickup & drop-off'],
    activeCollaborator: {
      name: 'Thunder1907',
      color: 'text-cyan-700',
      bg: 'bg-cyan-100 border-cyan-300',
    },
  },
  {
    id: 'opt-2',
    name: 'Paris Seine Romantic Sunset Yacht Cruise & Champagne',
    type: 'activity',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    category: 'Cruise & Dining',
    cost: 5800,
    costIndex: '$$$',
    popularity: 4.8,
    reviewsCount: '4.1k',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    duration: '2.0 Hours',
    bestTime: 'All Year Round',
    description: 'Glide past Notre Dame and the illuminated Eiffel Tower while sipping French champagne and savoring artisanal macarons.',
    highlights: ['Glass-canopy panoramic yacht', 'Champagne welcome flutes', 'Live acoustic music'],
  },
  {
    id: 'opt-3',
    name: 'Rome Colosseum Arena Floor & Underground Gladiator Pass',
    type: 'activity',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    category: 'Historical Landmark',
    cost: 6500,
    costIndex: '$$$',
    popularity: 4.9,
    reviewsCount: '5.6k',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    duration: '3.0 Hours',
    bestTime: 'March – November',
    description: 'Step directly through the Gladiator Gate onto the reconstructed arena floor and explore the underground hypogeum.',
    highlights: ['Restricted arena floor access', 'Roman Forum & Palatine Hill entry', 'Expert archaeologist guide'],
  },
  {
    id: 'opt-4',
    name: 'Swiss Alps Jungfraujoch Top of Europe Cogwheel Express',
    type: 'activity',
    city: 'Grindelwald',
    country: 'Switzerland',
    region: 'Europe',
    category: 'Summit Mountain Express',
    cost: 14500,
    costIndex: '$$$$',
    popularity: 4.9,
    reviewsCount: '3.4k',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    duration: '5.0 Hours',
    bestTime: 'All Year Round',
    description: 'Climb inside the mountain to Europe’s highest railway station at 3,454m featuring the Ice Palace and Sphinx Terrace.',
    highlights: ['Eiger Glacier 360 Express', 'Ice Palace tunnels pass', 'Sphinx Observatory ticket'],
    activeCollaborator: {
      name: 'Defiant Bear',
      color: 'text-blue-700',
      bg: 'bg-blue-100 border-blue-300',
    },
  },
  {
    id: 'opt-5',
    name: 'Tokyo Mount Fuji Panoramic Bullet Train & Lake Ashi Cruise',
    type: 'activity',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    category: 'Scenic Sightseeing',
    cost: 7200,
    costIndex: '$$$',
    popularity: 4.9,
    reviewsCount: '6.2k',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    duration: '8.0 Hours',
    bestTime: 'April – November',
    description: 'Scenic day trip from Tokyo on the Shinkansen bullet train to Mount Fuji 5th station with Hakone ropeway cable car.',
    highlights: ['Shinkansen bullet train pass', 'Pirate ship cruise on Lake Ashi', 'Mount Fuji 5th station views'],
    activeCollaborator: {
      name: 'Worthwhile Parrot',
      color: 'text-amber-800',
      bg: 'bg-amber-100 border-amber-300',
    },
  },
  {
    id: 'opt-6',
    name: 'Bali Ubud Sacred Monkey Forest & Jungle Waterfall Trek',
    type: 'activity',
    city: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    category: 'Nature & Wildlife',
    cost: 3200,
    costIndex: '$$',
    popularity: 4.8,
    reviewsCount: '4.8k',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    duration: '4.0 Hours',
    bestTime: 'May – September',
    description: 'Guided private trek through lush rice terraces, ancient mossy temples, and swimming under Tegenungan waterfall.',
    highlights: ['Private Balinese guide', 'Monkey forest sanctuary pass', 'Waterfall swim & fresh coconuts'],
    activeCollaborator: {
      name: 'Watchful Ape',
      color: 'text-rose-700',
      bg: 'bg-rose-100 border-rose-300',
    },
  },
  {
    id: 'opt-7',
    name: 'Barcelona Sagrada Familia Fast-Track & Tower View Tour',
    type: 'activity',
    city: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    category: 'Architecture & Culture',
    cost: 4600,
    costIndex: '$$$',
    popularity: 4.9,
    reviewsCount: '5.1k',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    duration: '2.5 Hours',
    bestTime: 'All Year Round',
    description: 'Skip the massive lines to explore Antoni Gaudí’s masterpiece basilica with Nativity facade tower access.',
    highlights: ['Skip-the-line entrance', 'Tower panoramic elevator', 'Gaudí museum access'],
  },
];

export function ExploreContent() {
  const { trips } = useTrips();

  // Search & Filter State matching Screen 8 Wireframe
  const [searchQuery, setSearchQuery] = useState('Paragliding');
  const [groupBy, setGroupBy] = useState<'none' | 'region' | 'cost'>('none');
  const [sortBy, setSortBy] = useState<'popularity' | 'costLow' | 'costHigh' | 'name'>('popularity');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCostIndex, setSelectedCostIndex] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  // Selected option for Canva/Figma detail modal preview
  const [selectedOption, setSelectedOption] = useState<SearchOptionItem | null>(null);
  const [showAddToTripModal, setShowAddToTripModal] = useState<SearchOptionItem | null>(null);

  // Filter and sort items
  const filteredResults = useMemo(() => {
    let items = SEARCH_DATA.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        const matchesCountry = item.country.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesCountry && !matchesCategory) {
          return false;
        }
      }

      if (selectedRegion !== 'All' && item.region !== selectedRegion) {
        return false;
      }

      if (selectedCostIndex !== 'All' && item.costIndex !== selectedCostIndex) {
        return false;
      }

      if (item.cost > maxPrice) {
        return false;
      }

      return true;
    });

    if (sortBy === 'popularity') {
      items = [...items].sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === 'costLow') {
      items = [...items].sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'costHigh') {
      items = [...items].sort((a, b) => b.cost - a.cost);
    } else if (sortBy === 'name') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [searchQuery, selectedRegion, selectedCostIndex, maxPrice, sortBy]);

  const handleConfirmAddToTrip = (tripName: string) => {
    if (showAddToTripModal) {
      toast.success(`"${showAddToTripModal.name}" added to ${tripName}!`);
      setShowAddToTripModal(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28">
      {/* ============================================================ */}
      {/* TOP CONTROL BAR MATCHING SCREEN 8 WIREFRAME                  */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        {/* Search bar (e.g. Paragliding) */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities or cities (e.g. Paragliding, Paris, Rome, Kyoto)..."
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

        {/* Group by Dropdown Button */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="none">Group by: None</option>
            <option value="region">Group by: Region</option>
            <option value="cost">Group by: Cost Index</option>
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
            <option value="popularity">Sort by: Popularity</option>
            <option value="costLow">Sort by: Price (Low to High)</option>
            <option value="costHigh">Sort by: Price (High to Low)</option>
            <option value="name">Sort by: Name (A-Z)</option>
          </select>
          <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* FILTER DRAWER EXPANDABLE                                     */}
      {/* ============================================================ */}
      {showFilterDrawer && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              Search Filters
            </span>
            <button
              onClick={() => {
                setSelectedRegion('All');
                setSelectedCostIndex('All');
                setMaxPrice(20000);
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Region:</label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Europe', 'Asia', 'Americas'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                      selectedRegion === reg
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Index Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Cost Index:</label>
              <div className="flex flex-wrap gap-1.5">
                {['All', '$$', '$$$', '$$$$'].map((ci) => (
                  <button
                    key={ci}
                    onClick={() => setSelectedCostIndex(ci)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                      selectedCostIndex === ci
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {ci}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
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

      {/* ============================================================ */}
      {/* SECTION TITLE: "Results" MATCHING SCREEN 8 WIREFRAME         */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Results
          </h2>
          <p className="text-xs text-slate-500">
            Found {filteredResults.length} options matching &quot;{searchQuery || 'All'}&quot;
          </p>
        </div>

        {/* Quick search shortcuts */}
        <div className="hidden sm:flex items-center gap-1.5">
          {['Paragliding', 'Paris', 'Swiss Alps', 'Rome', 'Tokyo'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 transition cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* STACK OF WIDE OPTION CARDS MATCHING SCREEN 8 WIREFRAME       */}
      {/* ============================================================ */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
            <Compass size={36} className="mx-auto text-blue-500 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No matching options found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try searching for different terms like &quot;Paragliding&quot;, &quot;Paris&quot;, &quot;Rome&quot;, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
                setSelectedCostIndex('All');
              }}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          filteredResults.map((opt) => (
            <div
              key={opt.id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
              onClick={() => setSelectedOption(opt)}
            >
              {/* Optional Multiplayer Collaborator Cursor Badge (from Wireframe) */}
              {opt.activeCollaborator && (
                <div
                  className={`absolute -top-3 right-6 z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black shadow-xs ${opt.activeCollaborator.bg} ${opt.activeCollaborator.color}`}
                >
                  <MousePointer2 size={11} className="fill-current" />
                  <span>{opt.activeCollaborator.name} is viewing</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Side: Thumbnail & Title Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl bg-slate-100 flex-shrink-0 border border-slate-100">
                    <img
                      src={opt.imageUrl}
                      alt={opt.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                        {opt.category}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {opt.city}, {opt.country}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                      {opt.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        {opt.popularity} ({opt.reviewsCount})
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-600">
                        {opt.duration}
                      </span>
                      <span>•</span>
                      <span className="font-mono font-bold text-slate-500">
                        Cost Index: <strong className="text-slate-900">{opt.costIndex}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Cost and Action Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Estimated Cost
                    </span>
                    <p className="text-base sm:text-lg font-black text-emerald-700">
                      {formatINR(opt.cost)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddToTripModal(opt);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================================ */}
      {/* OPTION DETAIL PREVIEW MODAL                                  */}
      {/* ============================================================ */}
      {selectedOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={selectedOption.imageUrl}
                alt={selectedOption.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedOption(null)}
                className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-5 right-5">
                <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {selectedOption.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-tight drop-shadow-xs">
                  {selectedOption.name}
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
                    {selectedOption.duration}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Popularity
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> {selectedOption.popularity}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Expense Cost
                  </span>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    {formatINR(selectedOption.cost)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedOption.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Key Experience Inclusions:
                </h4>
                <ul className="space-y-1.5">
                  {selectedOption.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-blue-50/70 p-2.5 text-[11px] text-blue-900 border border-blue-100">
                <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
                <span>Instant reservation confirmation with flexible free cancellation.</span>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const opt = selectedOption;
                    setSelectedOption(null);
                    setShowAddToTripModal(opt);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition active:scale-98 cursor-pointer"
                >
                  <Plus size={16} /> Add to Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD TO TRIP SELECTION MODAL                                  */}
      {/* ============================================================ */}
      {showAddToTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add to Which Trip?</h3>
                <p className="text-xs text-slate-500">Select an active trip to insert this option</p>
              </div>
              <button
                onClick={() => setShowAddToTripModal(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'trip-1', name: 'Europe Grand Discovery 2026', dates: 'Sep 10 – Sep 28, 2026', stops: '3 Stops' },
                { id: 'trip-2', name: 'Japan Cherry Blossom Tour', dates: 'Apr 02 – Apr 14, 2027', stops: '2 Stops' },
                { id: 'trip-3', name: 'Bali Coastal & Rainforest Retreat', dates: 'Nov 05 – Nov 16, 2026', stops: '3 Stops' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleConfirmAddToTrip(t.name)}
                  className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 px-4 text-left hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-xs transition group cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {t.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">{t.dates} • {t.stops}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddToTripModal(null)}
              className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
