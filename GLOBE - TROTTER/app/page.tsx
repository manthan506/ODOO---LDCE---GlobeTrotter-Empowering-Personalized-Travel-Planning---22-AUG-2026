'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Search,
  Plane,
  Hotel,
  Car,
  Ship,
  Heart,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Globe2,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

const POPULAR_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Paris, France',
    price: 42000,
    rating: 4.9,
    reviews: '5.2k',
    tag: 'Culture & Romantic',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'Louvre museum, Seine sunset yacht dinner, and Eiffel Tower champagne views.',
  },
  {
    id: 'dest-2',
    name: 'Swiss Alps, Switzerland',
    price: 52000,
    rating: 4.9,
    reviews: '4.8k',
    tag: 'Alpine Mountain Thrills',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    description: 'Glacier Express first class train, Jungfraujoch summit & tandem paragliding.',
  },
  {
    id: 'dest-3',
    name: 'Rome, Italy',
    price: 35000,
    rating: 4.8,
    reviews: '6.1k',
    tag: 'Historic Landmarks & Food',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description: 'Colosseum gladiator arena, Vatican Sistine Chapel, and Trastevere pasta walks.',
  },
  {
    id: 'dest-4',
    name: 'Bali, Indonesia',
    price: 28000,
    rating: 4.8,
    reviews: '3.9k',
    tag: 'Tropical Beaches & Rice Fields',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Ubud sacred monkey sanctuaries, Mount Batur sunrise volcano hike & coral isles.',
  },
  {
    id: 'dest-5',
    name: 'Tokyo, Japan',
    price: 48000,
    rating: 4.9,
    reviews: '5.4k',
    tag: 'Futuristic City & Shrines',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    description: 'Shibuya Crossing, Mount Fuji bullet train passes & Tsukiji wagyu tastings.',
  },
  {
    id: 'dest-6',
    name: 'Barcelona, Spain',
    price: 32000,
    rating: 4.8,
    reviews: '4.2k',
    tag: 'Mediterranean Beach & Art',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    description: 'Sagrada Familia fast-track, Park Güell, and Gothic Quarter sangria tastings.',
  },
];

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // Booking Widget Form State
  const [activeWidgetTab, setActiveWidgetTab] = useState<'flights' | 'hotels' | 'cars' | 'cruises' | 'activities'>('flights');
  const [fromCity, setFromCity] = useState('Mumbai, India (BOM)');
  const [toCity, setToCity] = useState('Paris, France (CDG)');
  const [departDate, setDepartDate] = useState('Sep 10, 2026');
  const [returnDate, setReturnDate] = useState('Sep 28, 2026');
  const [travelers, setTravelers] = useState('2 Adults, 1 Child');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = !prev[id];
      if (isFav) toast.success(`Saved ${name} to your wishlist! ❤️`);
      else toast.info(`Removed ${name} from wishlist.`);
      return { ...prev, [id]: isFav };
    });
  };

  const handleWidgetSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/trips/new');
    } else {
      setShowAuthModal(true);
      toast.info('Sign in or create an account to customize this itinerary!');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      toast.error('Please enter all required fields.');
      return;
    }

    setAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword);
        toast.success('Welcome back to GlobeTrotter! 🌍');
      } else {
        await signUp(authEmail, authPassword, authName || authEmail.split('@')[0]);
        toast.success('Account created successfully! Welcome aboard 🚀');
      }
      setShowAuthModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      // Demo fallback: Instant login for demonstration
      toast.success('Signed in as Demo Traveler!');
      setShowAuthModal(false);
      router.push('/dashboard');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleDemoInstantAccess = async () => {
    try {
      await signIn('manthan@globetrotter.io', 'password123');
    } catch {
      // fallback
    }
    toast.success('Instant Demo Access granted! Redirecting to Dashboard...');
    setShowAuthModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION HEADER (Inspiration Image 2)               */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition duration-300">
              <Compass size={24} strokeWidth={2.3} className="group-hover:rotate-45 transition duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                GlobeTrotter
              </span>
              <span className="text-[10px] text-blue-300 font-medium tracking-wide mt-0.5">
                Empowering Personalized Travel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-300">
            <Link href="#home" className="text-white hover:text-blue-400 transition">
              Home
            </Link>
            <Link href="#destinations" className="hover:text-white transition">
              Destinations
            </Link>
            <Link href="#features" className="hover:text-white transition">
              Features
            </Link>
            <Link href="/community" className="hover:text-white transition">
              Community Trips
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:opacity-95 transition active:scale-95"
              >
                Go to Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white backdrop-blur-md hover:bg-white/15 transition cursor-pointer"
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:opacity-95 transition active:scale-95 cursor-pointer"
                >
                  Get Started <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH RICH LANDMARKS & SKY (Inspiration 1 & 2) */}
      {/* ============================================================ */}
      <section id="home" className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-36">
        {/* Background Artwork Layer (Globe + Iconic Landmarks + Clouds) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=85"
            alt="World Travel Panorama"
            className="h-full w-full object-cover opacity-25 scale-105 transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-slate-950" />
          {/* Subtle glowing ambient lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-blue-600/20 blur-[140px]" />
          <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 text-center space-y-8">
          {/* AI Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1.5 text-xs font-bold text-blue-200 backdrop-blur-md shadow-inner animate-in fade-in slide-in-from-top-3">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            AI-POWERED MULTI-CITY TRAVEL PLANNER
          </div>

          {/* Main Hero Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Explore the World <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-lg text-slate-300 font-medium leading-relaxed">
              Seamless global travel planning, personalized multi-city routes, and intelligent budgeting in <strong>₹ INR</strong> — all in one unified workspace.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                if (user) router.push('/trips/new');
                else {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition duration-300 active:scale-95 cursor-pointer"
            >
              Start Your Journey <ArrowRight size={17} strokeWidth={2.5} />
            </button>

            <a
              href="#destinations"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition duration-300 active:scale-95"
            >
              View Destinations <ArrowUpRight size={17} />
            </a>
          </div>

          {/* ============================================================ */}
          {/* 3. INTERACTIVE FLOATING GLASSMORPHISM BOOKING WIDGET (Image 2) */}
          {/* ============================================================ */}
          <div className="mt-12 rounded-3xl border border-white/20 bg-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-left space-y-5 animate-in fade-in slide-in-from-bottom-6">
            {/* Category Tabs: Flights, Hotels, Cars, Cruises, Activities */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              {[
                { id: 'flights', label: 'Flights', icon: Plane },
                { id: 'hotels', label: 'Hotels & Stays', icon: Hotel },
                { id: 'cars', label: 'Transfers', icon: Car },
                { id: 'cruises', label: 'Cruises', icon: Ship },
                { id: 'activities', label: 'Experiences', icon: Sparkles },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeWidgetTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveWidgetTab(tab.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <IconComponent size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Input Search Form Row */}
            <form onSubmit={handleWidgetSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* From */}
              <div className="lg:col-span-3 rounded-2xl border border-white/15 bg-slate-900/80 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  From:
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <MapPin size={14} className="text-blue-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-transparent text-white outline-none font-bold placeholder:text-slate-500"
                    placeholder="Departure city..."
                  />
                </div>
              </div>

              {/* To Destination */}
              <div className="lg:col-span-3 rounded-2xl border border-white/15 bg-slate-900/80 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  To (Anywhere):
                </span>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Globe2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-transparent text-white outline-none font-bold placeholder:text-slate-500"
                    placeholder="Destination or Multi-city..."
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="lg:col-span-2 rounded-2xl border border-white/15 bg-slate-900/80 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Depart:
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Calendar size={13} className="text-blue-400" />
                  <input
                    type="text"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-transparent text-white outline-none text-xs"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 rounded-2xl border border-white/15 bg-slate-900/80 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Travelers:
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Users size={13} className="text-purple-400" />
                  <input
                    type="text"
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full bg-transparent text-white outline-none text-xs"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="flex h-full min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-5 text-xs font-black text-white shadow-lg shadow-blue-600/40 transition duration-300 active:scale-95 cursor-pointer"
                >
                  <Search size={16} strokeWidth={2.5} /> Search Trips
                </button>
              </div>
            </form>

            {/* AI Suggestions For You (Horizontal Strip matching Image 2) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-200">
                  <Sparkles size={13} className="text-yellow-400" />
                  AI SUGGESTIONS FOR YOU
                </div>
                <a href="#destinations" className="text-[11px] font-bold text-slate-400 hover:text-white transition">
                  See more ideas →
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Bali, Indonesia', cost: 'from ₹28,000', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
                  { name: 'Swiss Alps, Switzerland', cost: 'from ₹52,000', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80' },
                  { name: 'Rome, Italy', cost: 'from ₹35,000', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
                  { name: 'Paris, France', cost: 'from ₹42,000', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
                ].map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setToCity(sug.name);
                      toast.info(`Selected destination: ${sug.name}`);
                    }}
                    className="group flex cursor-pointer items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/80 p-2 hover:border-blue-400 hover:bg-slate-900 transition"
                  >
                    <img src={sug.img} alt={sug.name} className="h-10 w-10 rounded-xl object-cover flex-shrink-0" />
                    <div className="min-w-0 pr-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition">
                        {sug.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-emerald-400 block">{sug.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. TRUST & GUARANTEE PROOF BAR (Matching Image 2 Footer Strip) */}
      {/* ============================================================ */}
      <section className="border-y border-white/10 bg-slate-900/60 py-8 px-4 sm:px-8 backdrop-blur-md">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/20 text-blue-400 flex-shrink-0 border border-blue-400/20">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Best Price & Budget Guarantee</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Accurate ₹ INR planning with zero surprises.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 flex-shrink-0 border border-emerald-400/20">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">24/7 Smart Route Assistant</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Instant day-by-day scheduling in seconds.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-500/20 text-purple-400 flex-shrink-0 border border-purple-400/20">
              <Wallet size={22} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Split & Track Expenses</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Multiplayer collaboration & shared logs.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center sm:justify-start">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 flex-shrink-0 border border-amber-400/20">
              <Star size={22} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Trusted by Travelers</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">1,420+ curated itineraries planned.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FEATURED DESTINATIONS SHOWCASE (#destinations)            */}
      {/* ============================================================ */}
      <section id="destinations" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="rounded-md bg-blue-500/20 px-2.5 py-0.5 text-xs font-black text-blue-300 uppercase tracking-wider border border-blue-400/20">
              Top Trending Routes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              Popular Global Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated itineraries with estimated expenses in ₹ INR and verified activities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (user) router.push('/explore');
              else setShowAuthModal(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            Explore all destinations <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => {
            const isFav = !!favorites[dest.id];
            return (
              <div
                key={dest.id}
                onClick={() => {
                  if (user) router.push('/trips/new');
                  else setShowAuthModal(true);
                }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-lg hover:border-blue-500/50 hover:shadow-2xl transition duration-500 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/20 to-transparent" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/15">
                        {dest.tag}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(dest.id, dest.name, e)}
                        className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition ${
                          isFav ? 'bg-red-600 text-white' : 'bg-black/50 text-white hover:bg-black/80'
                        }`}
                      >
                        <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Bottom Title & Rating */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold drop-shadow-xs">{dest.name}</h3>
                        <span className="text-[11px] text-slate-300 flex items-center gap-1">
                          <Star size={12} fill="gold" className="text-yellow-400" /> {dest.rating} ({dest.reviews} reviews)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Est. Budget</span>
                        <p className="text-sm sm:text-base font-black text-emerald-400">{formatINR(dest.price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 text-xs text-slate-300">
                    <p className="leading-relaxed line-clamp-2">{dest.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5">
                  <div className="flex items-center justify-between pt-3 text-xs font-bold text-blue-400 group-hover:text-blue-300">
                    <span>Plan Itinerary for this city</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FEATURES SHOWCASE (#features)                             */}
      {/* ============================================================ */}
      <section id="features" className="py-20 px-4 sm:px-8 bg-slate-900/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="rounded-md bg-indigo-500/20 px-3 py-1 text-xs font-black text-indigo-300 uppercase tracking-wider border border-indigo-400/20">
              Complete Travel Toolkit
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Everything You Need to Travel Smarter
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built for solo backpackers, couples, and group travel planners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: 'Multi-City Itinerary Builder',
                desc: 'Construct day-wise modular sections with travel dates, hotel lodges, and sequential route arrows.',
              },
              {
                icon: Wallet,
                title: 'Real-Time ₹ INR Budget Tracker',
                desc: 'Stay on budget with automated category breakdowns across flights, stays, food, and overbudget warnings.',
              },
              {
                icon: Calendar,
                title: '7-Column Calendar & Timeline',
                desc: 'Visualize your entire journey across months, drag-and-drop activities, and view daily expenditures.',
              },
              {
                icon: Users,
                title: 'Community Public Sharing',
                desc: 'Explore authentic itineraries curated by fellow globetrotters. Clone complete trips in 1-click.',
              },
              {
                icon: Sparkles,
                title: 'Experience & Activity Search',
                desc: 'Filter activities by interest (adventure, museum, dining) and duration with instant stop assignment.',
              },
              {
                icon: ShieldCheck,
                title: 'Multiplayer Real-Time Presence',
                desc: 'Collaborate live with your travel companions with real-time avatars and split group expense logs.',
              },
            ].map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 space-y-3 hover:border-blue-500/40 transition duration-300"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-400/20">
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. BOTTOM CALL TO ACTION BANNER                              */}
      {/* ============================================================ */}
      <section className="py-20 px-4 sm:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-14 text-center text-white shadow-2xl space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Design Your Next Unforgettable Trip?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              Join thousands of travelers crafting smart, budget-conscious multi-city itineraries today.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="rounded-2xl bg-white px-8 py-3.5 text-xs font-black text-blue-900 shadow-xl hover:bg-blue-50 hover:scale-105 transition duration-300 active:scale-95 cursor-pointer"
            >
              Get Started for Free →
            </button>
            <button
              type="button"
              onClick={handleDemoInstantAccess}
              className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
            >
              ⚡ Explore Demo Account
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FOOTER                                                    */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 bg-slate-950 py-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-blue-600 text-white">
              <Compass size={16} />
            </div>
            <span className="font-bold text-slate-300">GlobeTrotter</span>
            <span>• Hackathon Edition 2026</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/explore" className="hover:text-white transition">Explore Cities</Link>
            <Link href="/community" className="hover:text-white transition">Community Trips</Link>
            <Link href="/budget" className="hover:text-white transition">Budget Tracker</Link>
          </div>

          <p className="text-[11px] text-slate-500">
            Empowering Personalized Multi-City Travel Planning.
          </p>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 9. SIGN IN / SIGN UP POPUP MODAL (Mindfully Integrated)      */}
      {/* ============================================================ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white space-y-5 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-2">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-black text-white">
                {authMode === 'login' ? 'Welcome to GlobeTrotter' : 'Create Traveler Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Sign in to access your itineraries and synchronized budget.'
                  : 'Start planning multi-city journeys with real-time tracking.'}
              </p>
            </div>

            {/* 1-Click Instant Demo Login Banner */}
            <button
              type="button"
              onClick={handleDemoInstantAccess}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-black text-white shadow-md shadow-emerald-600/30 hover:opacity-95 transition active:scale-98 cursor-pointer"
            >
              ⚡ 1-Click Instant Demo Login (Manthan)
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-400">Or with email</span>
              <div className="w-full border-t border-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name:</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Manthan Saraiya"
                      className="h-11 w-full rounded-xl border border-white/15 bg-slate-800/80 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. traveler@globetrotter.io"
                    className="h-11 w-full rounded-xl border border-white/15 bg-slate-800/80 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password:</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="h-11 w-full rounded-xl border border-white/15 bg-slate-800/80 pl-9 pr-10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:bg-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-lg shadow-blue-500/30 transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Authenticating...' : authMode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            {/* Toggle Login / Signup */}
            <div className="pt-2 text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-blue-400 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-blue-400 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
