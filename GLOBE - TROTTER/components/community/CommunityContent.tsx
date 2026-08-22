'use client';

import { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  Copy,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  CheckCircle2,
  Calendar,
  Wallet,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X,
  User,
  Star,
  Bookmark,
  Check,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MASTER_TRIP, MASTER_ACTIVITIES, MASTER_SECTIONS } from '@/lib/tripDataSync';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface CommunityPost {
  id: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
    verified: boolean;
    role: string;
  };
  postedAt: string;
  trip: {
    id: string;
    name: string;
    coverImageUrl: string;
    durationDays: number;
    cities: string[];
    stopsCount: number;
    totalCost: number;
    budgetCap: number;
    description: string;
    rating: number;
    clonesCount: number;
    likesCount: number;
    commentsCount: number;
    highlights: string[];
  };
}

const SAMPLE_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    slug: 'europe-grand-discovery-2026',
    author: {
      name: 'Manthan Saraiya',
      handle: '@manthan_explorer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
      verified: true,
      role: 'GlobeTrotter Pro Explorer',
    },
    postedAt: '2 hours ago',
    trip: {
      id: 'trip-master-1',
      name: MASTER_TRIP.name,
      coverImageUrl: MASTER_TRIP.coverImageUrl,
      durationDays: MASTER_TRIP.daysCount,
      cities: ['Paris, France', 'Interlaken, Switzerland', 'Rome, Italy', 'Barcelona, Spain'],
      stopsCount: MASTER_TRIP.stopsCount,
      totalCost: MASTER_TRIP.totalEstimatedCost,
      budgetCap: MASTER_TRIP.budgetCap,
      description:
        'A balanced 14-day European discovery route covering Paris museums, high-altitude Swiss peaks via the Glacier Express, and Rome gladiator arenas. Includes budget alerts and optimized transfer times.',
      rating: 4.9,
      clonesCount: 342,
      likesCount: 512,
      commentsCount: 38,
      highlights: ['Louvre VIP Guided Access', 'Glacier Express 1st Class', 'Jungfraujoch Top of Europe', 'Colosseum Gladiator Floor'],
    },
  },
  {
    id: 'post-2',
    slug: 'tropical-bali-coral-isles',
    author: {
      name: 'Elena Rostova',
      handle: '@elena_wanderlust',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      verified: true,
      role: 'Adventure Photographer',
    },
    postedAt: 'Yesterday at 4:30 PM',
    trip: {
      id: 'trip-bali-2',
      name: 'Tropical Bali & Coral Isles',
      coverImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      durationDays: 10,
      cities: ['Ubud, Indonesia', 'Seminyak, Indonesia', 'Nusa Penida, Indonesia'],
      stopsCount: 3,
      totalCost: 58000,
      budgetCap: 65000,
      description:
        'Immerse in emerald rice terraces, sacred monkey sanctuaries, sunrise volcano hikes at Mount Batur, and secret manta ray snorkeling lagoons.',
      rating: 4.8,
      clonesCount: 189,
      likesCount: 295,
      commentsCount: 24,
      highlights: ['Tegenungan Waterfall Trek', 'Uluwatu Sunset Fire Dance', 'Manta Ray Coral Snorkeling'],
    },
  },
  {
    id: 'post-3',
    slug: 'japan-sakura-alpine-shrines',
    author: {
      name: 'Kenji Sato',
      handle: '@kenji_travels',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      verified: true,
      role: 'Cultural Travel Specialist',
    },
    postedAt: '3 days ago',
    trip: {
      id: 'trip-japan-3',
      name: 'Japan Autumn Sakura & Alpine Shrines',
      coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
      durationDays: 12,
      cities: ['Tokyo, Japan', 'Kyoto, Japan', 'Hakone, Japan', 'Osaka, Japan'],
      stopsCount: 4,
      totalCost: 112000,
      budgetCap: 125000,
      description:
        'Bullet train adventure through neon Tokyo metropolis, traditional ryokan hot springs facing Mount Fuji, and ancient Kyoto bamboo groves.',
      rating: 4.9,
      clonesCount: 420,
      likesCount: 680,
      commentsCount: 52,
      highlights: ['Mount Fuji Onsen Ryokan', 'Fushimi Inari 10,000 Torii Gates', 'Tsukiji Market Wagyu Tasting'],
    },
  },
  {
    id: 'post-4',
    slug: 'mediterranean-costa-brava-amalfi',
    author: {
      name: 'Aarav Patel',
      handle: '@aarav_travel',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      verified: false,
      role: 'Solo Explorer',
    },
    postedAt: '5 days ago',
    trip: {
      id: 'trip-amalfi-4',
      name: 'Classic Italian Renaissance & Amalfi Coast',
      coverImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
      durationDays: 8,
      cities: ['Florence, Italy', 'Positano, Italy', 'Capri, Italy'],
      stopsCount: 3,
      totalCost: 89000,
      budgetCap: 95000,
      description:
        'Clifftop pastel villages, private speedboat cruise through Capri sea caves, and Tuscan Chianti vineyard tastings.',
      rating: 4.8,
      clonesCount: 145,
      likesCount: 230,
      commentsCount: 19,
      highlights: ['Capri Blue Grotto Speedboat', 'Positano Cliffside Sunset Dinner', 'Florence Uffizi Gallery VIP'],
    },
  },
];

export function CommunityContent() {
  const [posts, setPosts] = useState<CommunityPost[]>(SAMPLE_COMMUNITY_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'all' | 'region' | 'duration'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'costLow' | 'costHigh'>('popular');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Read-only modal
  const [activePreviewTrip, setActivePreviewTrip] = useState<CommunityPost | null>(null);

  // Share modal
  const [activeSharePost, setActiveSharePost] = useState<CommunityPost | null>(null);

  const filteredPosts = useMemo(() => {
    let list = posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = post.trip.name.toLowerCase().includes(q);
        const matchesAuthor = post.author.name.toLowerCase().includes(q);
        const matchesCity = post.trip.cities.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesAuthor && !matchesCity) return false;
      }
      return true;
    });

    if (sortBy === 'popular') list.sort((a, b) => b.trip.clonesCount - a.trip.clonesCount);
    if (sortBy === 'rating') list.sort((a, b) => b.trip.rating - a.trip.rating);
    if (sortBy === 'costLow') list.sort((a, b) => a.trip.totalCost - b.trip.totalCost);
    if (sortBy === 'costHigh') list.sort((a, b) => b.trip.totalCost - a.trip.totalCost);

    return list;
  }, [posts, searchQuery, sortBy]);

  const handleCopyTrip = (post: CommunityPost) => {
    toast.success(`🎉 Copied "${post.trip.name}" into your personal itineraries!`);
    // Increment clone count locally
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, trip: { ...p.trip, clonesCount: p.trip.clonesCount + 1 } } : p))
    );
  };

  const handleCopyUrl = (slug: string) => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/community#${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    toast.success('Public sharable link copied to clipboard!');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setPosts((pList) =>
        pList.map((p) =>
          p.id === postId
            ? { ...p, trip: { ...p.trip, likesCount: isLiked ? p.trip.likesCount + 1 : p.trip.likesCount - 1 } }
            : p
        )
      );
      if (isLiked) toast.success('Added to your favorite community trips ❤️');
      return { ...prev, [postId]: isLiked };
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28">
      {/* ============================================================ */}
      {/* TOP CONTROL BAR MATCHING SCREEN 10 WIREFRAME                 */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        {/* Search bar ...... */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bar ...... (e.g. Paris, Swiss Alps, Bali, Japan, Manthan)"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition"
          />
        </div>

        {/* Group by Dropdown */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="all">Group by: All</option>
            <option value="region">Group by: Region</option>
            <option value="duration">Group by: Duration</option>
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

        {/* Sort by... Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="popular">Sort by: Most Cloned & Popular</option>
            <option value="rating">Sort by: Highest Rated</option>
            <option value="costLow">Sort by: Budget (Low to High)</option>
            <option value="costHigh">Sort by: Budget (High to Low)</option>
          </select>
          <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* FILTER DRAWER */}
      {showFilterDrawer && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              Community Filters
            </span>
            <button
              onClick={() => {
                setSelectedRegionFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-2">Quick Destinations:</span>
            {['all', 'Europe', 'Asia', 'Mediterranean', 'Switzerland', 'France', 'Italy'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRegionFilter(r);
                  if (r === 'all') setSearchQuery('');
                  else setSearchQuery(r);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                  selectedRegionFilter === r
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {r === 'all' ? 'All World' : r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* WIREFRAME HEADER: "Community tab" (Screen 10)                 */}
      {/* ============================================================ */}
      <div className="mb-8 text-center sm:text-left rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
          <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 uppercase tracking-wider border border-blue-200">
            Public Travel Network
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Community tab
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Community section where all users can share their experience about a certain trip or activity. Discover, copy, and customize verified itineraries from fellow travelers.
        </p>
      </div>

      {/* ============================================================ */}
      {/* COMMUNITY POSTS LIST (Avatars on left + Cards on right)       */}
      {/* ============================================================ */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isLiked = !!likedPosts[post.id];
          const isCurrentCopied = copiedSlug === post.slug;

          return (
            <div
              key={post.id}
              id={post.slug}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
            >
              {/* LEFT COLUMN: USER AVATAR (O) MATCHING WIREFRAME SCREEN 10 */}
              <div className="flex items-center sm:flex-col items-center gap-2 sm:gap-1.5 flex-shrink-0 pt-1">
                <div className="relative">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-200"
                  />
                  {post.author.verified && (
                    <span
                      className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white shadow-xs"
                      title="Verified Traveler"
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div className="sm:text-center">
                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                    {post.author.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {post.postedAt}
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: SHARED ITINERARY CARD */}
              <div className="flex-1 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4">
                {/* Top Trip Header & Cover Image Banner */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-900">
                  <img
                    src={post.trip.coverImageUrl}
                    alt={post.trip.name}
                    className="h-full w-full object-cover hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-transparent" />

                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-blue-700 shadow-xs">
                      🌍 {post.trip.durationDays} Days • {post.trip.stopsCount} Stops
                    </span>
                    <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs flex items-center gap-1">
                      <Star size={12} fill="white" /> {post.trip.rating}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Title & Cost */}
                  <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-xs">
                        {post.trip.name}
                      </h3>
                      <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">
                        📍 {post.trip.cities.join(' • ')}
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/50 backdrop-blur-md px-3 py-1.5 text-right border border-white/20">
                      <span className="text-[9px] uppercase font-bold text-slate-300 block">Total Estimated</span>
                      <p className="text-sm sm:text-base font-black text-emerald-400">
                        {formatINR(post.trip.totalCost)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trip Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {post.trip.description}
                </p>

                {/* Key Highlights Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.trip.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      <Sparkles size={11} className="text-blue-600" />
                      {h}
                    </span>
                  ))}
                </div>

                {/* Social & Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  {/* Left: Like and Comments */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                        isLiked ? 'text-red-600' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                      <span>{post.trip.likesCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePreviewTrip(post)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                    >
                      <MessageCircle size={16} />
                      <span>{post.trip.commentsCount} comments</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSharePost(post)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Right: Copy Trip & View Itinerary */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(post.slug)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition cursor-pointer"
                      title="Copy Public Sharable URL"
                    >
                      {isCurrentCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      {isCurrentCopied ? 'Link Copied!' : 'Public URL'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePreviewTrip(post)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition cursor-pointer"
                    >
                      <Eye size={13} /> View Plan
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyTrip(post)}
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Bookmark size={13} /> Copy Trip ({post.trip.clonesCount})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: READ-ONLY PUBLIC ITINERARY VIEW (Feature 11)        */}
      {/* ============================================================ */}
      {activePreviewTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700 uppercase tracking-wider border border-blue-200">
                    Read-Only Public View
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Shared by {activePreviewTrip.author.name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{activePreviewTrip.trip.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activePreviewTrip.trip.durationDays} Days • Total Estimated Cost: {formatINR(activePreviewTrip.trip.totalCost)}
                </p>
              </div>

              <button
                onClick={() => setActivePreviewTrip(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Public Itinerary Summary Banner */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{activePreviewTrip.trip.durationDays} Travel Days</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Stops</span>
                <p className="text-sm font-extrabold text-blue-600 mt-0.5">{activePreviewTrip.trip.stopsCount} Main Destinations</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget</span>
                <p className="text-sm font-extrabold text-emerald-700 mt-0.5">{formatINR(activePreviewTrip.trip.totalCost)}</p>
              </div>
            </div>

            {/* Read-Only Schedule Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Itinerary Sections & Schedule:
              </h4>

              <div className="space-y-3">
                {MASTER_SECTIONS.map((sec, idx) => (
                  <div key={sec.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-black text-white">
                          Section {idx + 1}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{sec.title}</h5>
                      </div>
                      <span className="text-xs font-black text-emerald-700">{formatINR(sec.budget)}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{sec.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {sec.city}, {sec.country}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {sec.startDate} – {sec.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy CTA in Modal */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActivePreviewTrip(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCopyTrip(activePreviewTrip);
                  setActivePreviewTrip(null);
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition"
              >
                📋 Copy this Trip to My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: SOCIAL SHARE POPUP                                  */}
      {/* ============================================================ */}
      {activeSharePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Share Itinerary</h3>
                <p className="text-xs text-slate-500">Distribute to social media or copy public link</p>
              </div>
              <button
                onClick={() => setActiveSharePost(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">Public Sharable URL:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/community#${activeSharePost.slug}`}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 font-mono select-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyUrl(activeSharePost.slug)}
                  className="rounded-xl bg-slate-900 hover:bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white transition flex-shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-800 mb-2">Share on Social Channels:</span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://wa.me/?text=Check%20out%20this%20travel%20itinerary:%20${encodeURIComponent(activeSharePost.trip.name)}%20${typeof window !== 'undefined' ? window.location.origin : ''}/community#${activeSharePost.slug}`;
                    window.open(url, '_blank');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition text-xs font-bold"
                >
                  <Send size={18} className="mb-1 text-emerald-600" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?text=Exploring%20${encodeURIComponent(activeSharePost.trip.name)}%20on%20GlobeTrotter!&url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/community#${activeSharePost.slug}`)}`;
                    window.open(url, '_blank');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition text-xs font-bold"
                >
                  <Share2 size={18} className="mb-1 text-sky-600" /> Twitter / X
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/community#${activeSharePost.slug}`)}`;
                    window.open(url, '_blank');
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition text-xs font-bold"
                >
                  <ExternalLink size={18} className="mb-1 text-blue-600" /> LinkedIn
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveSharePost(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
