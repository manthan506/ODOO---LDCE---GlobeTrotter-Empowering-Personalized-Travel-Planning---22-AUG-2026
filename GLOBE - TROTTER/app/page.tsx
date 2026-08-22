'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTripSync } from '@/context/TripSyncContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Shield,
  Users,
  CheckCircle2,
  Calendar,
  Wallet,
  Clock,
  Search,
  Star,
  Plane,
  Hotel,
  Car,
  Heart,
  Globe2,
  Lock,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Layers,
  Copy,
  Share2,
  ArrowUpRight,
  ShieldCheck,
  Headphones,
  Check,
  X,
  Mail,
  User,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const { masterTrip, totalCalculatedCost, userProfile, addSavedDestination } = useTripSync();
  const router = useRouter();

  // Search Widget State
  const [searchTab, setSearchTab] = useState<'flights' | 'hotels' | 'activities' | 'itineraries'>('itineraries');
  const [origin, setOrigin] = useState('Mumbai, India (BOM)');
  const [destination, setDestination] = useState('Paris & Swiss Alps (Multi-City)');
  const [departDate, setDepartDate] = useState('Sep 10, 2026');
  const [returnDate, setReturnDate] = useState('Sep 28, 2026');
  const [travelersCount, setTravelersCount] = useState('2 Adults, 1 Trip');

  // Auth Modal State (Sign-in / Sign-up)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching ${destination} itineraries for ${departDate}!`);
    router.push('/explore');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await signIn(authEmail || 'manthan@globetrotter.io', authPassword || 'password123');
      } else {
        await signUp({
          email: authEmail || 'traveler@globetrotter.io',
          password: authPassword || 'password123',
          name: authName || 'Global Explorer',
        });
      }
      setShowAuthModal(false);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Authentication error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setAuthLoading(true);
    try {
      await signIn('manthan@globetrotter.io', 'password123');
      setShowAuthModal(false);
      toast.success('Signed in as Pro Explorer!');
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveWishlist = (dest: { id: string; name: string; country: string; img: string }) => {
    addSavedDestination(dest);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. HEADER & NAVIGATION                                       */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition duration-300">
              <Compass size={22} strokeWidth={2.3} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                GlobeTrotter
              </span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">
                AI Travel Planner
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Link href="#features" className="rounded-xl px-3.5 py-2 hover:bg-white/10 hover:text-white transition">
              Features
            </Link>
            <Link href="/explore" className="rounded-xl px-3.5 py-2 hover:bg-white/10 hover:text-white transition">
              Destinations
            </Link>
            <Link href="/trips" className="rounded-xl px-3.5 py-2 hover:bg-white/10 hover:text-white transition">
              Itinerary Builder
            </Link>
            <Link href="/budget" className="rounded-xl px-3.5 py-2 hover:bg-white/10 hover:text-white transition">
              Budget (₹ INR)
            </Link>
            <Link href="/calendar" className="rounded-xl px-3.5 py-2 hover:bg-white/10 hover:text-white transition">
              Calendar
            </Link>
            <Link href="/community" className="rounded-xl px-3.5 py-2 hover:bg-white/10 hover:text-white transition">
              Community Hub
            </Link>
          </nav>

          {/* Right Action & Auth */}
          <div className="flex items-center gap-3">
            {/* Currency Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
              <span>🇮🇳 ₹ INR</span>
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-95"
              >
                Go to Dashboard ➔
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="rounded-2xl border border-white/20 bg-white/5 hover:bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition active:scale-95"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION (GlobalVista Panorama Inspired)             */}
      {/* ============================================================ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-12 pb-20">
        {/* Panoramic Background with Iconic World Monuments */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&q=90"
            alt="World Destinations Panorama"
            className="h-full w-full object-cover opacity-35 scale-105 transition-transform duration-1000"
          />
          {/* Blue Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Top AI Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles size={14} className="text-yellow-400" />
            <span>AI-POWERED PERSONALIZED TRAVEL PLANNER</span>
          </div>

          {/* Catchy Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Explore the World <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Seamless multi-city travel planning, day-wise interactive itineraries, real-time ₹ INR budget breakdown, and 1-click community trip cloning — all in one place.
          </p>

          {/* Top CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-500/35 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Your Journey ➔
            </button>

            <Link
              href="/trips"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:scale-105 active:scale-95"
            >
              <Eye size={16} /> View Sample Itinerary
            </Link>
          </div>

          {/* ============================================================ */}
          {/* GLASSMORPHISM FLOATING SEARCH WIDGET (GlobalVista Layout)    */}
          {/* ============================================================ */}
          <div className="mt-14 mx-auto max-w-5xl rounded-3xl border border-white/20 bg-slate-900/75 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl text-left animate-in fade-in slide-in-from-bottom-6">
            {/* Search Type Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-5">
              {[
                { key: 'itineraries', label: '📅 Modular Itineraries', icon: Compass },
                { key: 'flights', label: '✈️ Flights & Transit', icon: Plane },
                { key: 'hotels', label: '🏨 Stays & Chalets', icon: Hotel },
                { key: 'activities', label: '🏄 Activities & Tours', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSearchTab(tab.key as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                    searchTab === tab.key
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input Fields Grid */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
              {/* Origin */}
              <div className="lg:col-span-3 space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  From:
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white">
                  <MapPin size={15} className="text-blue-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent font-bold outline-none text-white placeholder:text-slate-500"
                    placeholder="Origin City..."
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="lg:col-span-4 space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  To (Multi-City):
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white">
                  <Compass size={15} className="text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent font-bold outline-none text-white placeholder:text-slate-500"
                    placeholder="e.g. Paris, Swiss Alps, Rome"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className="lg:col-span-3 space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Dates:
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white">
                  <Calendar size={15} className="text-indigo-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={`${departDate} – ${returnDate}`}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-transparent font-bold outline-none text-white"
                  />
                </div>
              </div>

              {/* Search CTA */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-lg shadow-blue-500/30 transition active:scale-95 cursor-pointer"
                >
                  <Search size={15} /> Search Itinerary
                </button>
              </div>
            </form>

            {/* AI SUGGESTIONS CHIPS (GlobalVista inspiration) */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Sparkles size={13} className="text-yellow-400" />
                <span>AI Suggestions for you:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { id: 'c-bali', name: 'Bali, Indonesia', price: '₹48,000', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
                  { id: 'c-swiss', name: 'Swiss Alps, Switzerland', price: '₹75,000', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80' },
                  { id: 'c-paris', name: 'Paris, France', price: '₹54,000', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
                  { id: 'c-rome', name: 'Rome, Italy', price: '₹52,000', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
                ].map((sugg) => (
                  <div
                    key={sugg.id}
                    onClick={() => {
                      setDestination(sugg.name);
                      toast.info(`Selected ${sugg.name}`);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-1.5 pr-3 text-xs text-white transition cursor-pointer"
                  >
                    <img src={sugg.img} alt={sugg.name} className="h-6 w-6 rounded-lg object-cover" />
                    <span className="font-semibold">{sugg.name}</span>
                    <span className="text-[10px] font-black text-emerald-400">from {sugg.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TRUST & SOCIAL PROOF STRIP                                */}
      {/* ============================================================ */}
      <section className="border-y border-white/10 bg-slate-900/50 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Best Price Guarantee</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time ₹ INR smart budget matches</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">24/7 Travel Planner</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Offline synchronized itinerary flow</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex-shrink-0">
              <Lock size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Secure Data</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Instant reactive cloud persistence</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
              <Star size={22} fill="currentColor" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Trusted by 10k+ Travelers</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">⭐ 4.9/5 star community rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ALL BUILT FEATURES MARKETING SPOTLIGHT                    */}
      {/* Showcases all screens built above with live interactive cards */}
      {/* ============================================================ */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="rounded-full bg-blue-500/10 border border-blue-400/20 px-3.5 py-1 text-xs font-extrabold text-blue-400 uppercase tracking-wider">
            All-in-One Travel Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything You Need to Plan Your Next Grand Adventure
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From multi-stop day planning to live expense splitting and community route cloning.
          </p>
        </div>

        {/* 6 Feature Marketing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Multi-City Builder */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl hover:border-blue-500/40 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Compass size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">Feature #5 & 6</span>
              <h3 className="text-lg font-bold text-white mt-1">Modular Itinerary Builder</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Add cities, travel dates, and modular sections. Drag-to-reorder stops effortlessly and preview two-column physical activity & expense timelines.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/trips" className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                Explore Builder Screen <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 2: Smart Budget Breakdown */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl hover:border-emerald-500/40 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Wallet size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Feature #9</span>
              <h3 className="text-lg font-bold text-white mt-1">Real-Time ₹ INR Budget Tracker</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Visual category progress breakdown across flights, stays, activities, and dining. Includes average daily spend limits and overbudget alerts.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/budget" className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                Open Budget Screen <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 3: Trip Calendar */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl hover:border-indigo-500/40 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Calendar size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">Feature #10</span>
              <h3 className="text-lg font-bold text-white mt-1">Calendar & Timeline Grid</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Month-based calendar layout with visual multi-day trip spans (Paris, Swiss Alps, Rome) and expandable day-wise activity schedulers.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/calendar" className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                View Calendar Screen <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 4: City & Activity Search */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl hover:border-amber-500/40 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Search size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Feature #7 & 8</span>
              <h3 className="text-lg font-bold text-white mt-1">City & Experience Discovery</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Filter activities by interest (Adventure, Culture, Food, Cruises), duration, and rupee cost index with instant "+ Add to Stop" toggling.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/explore" className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                Search Activities <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 5: Community Hub */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl hover:border-purple-500/40 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Globe2 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">Feature #11</span>
              <h3 className="text-lg font-bold text-white mt-1">Community Hub & 1-Click Clone</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Browse verified public travel itineraries shared by fellow explorers. Copy the full trip into your personal account in one single click.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/community" className="text-xs font-bold text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                Visit Community <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 6: Admin Analytics Dashboard */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-7 shadow-xl hover:border-sky-500/40 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <BarChart3 size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">Feature #13</span>
              <h3 className="text-lg font-bold text-white mt-1">Admin Analytics Intelligence</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                4-tab executive dashboard with user management permissions, popular cities ranking, trending activities, and interactive SVG charts.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/admin" className="text-xs font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-1">
                View Admin Dashboard <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BOTTOM CALL TO ACTION BANNER                              */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-14 text-center text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Design Your Personalized Journey?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Join thousands of travelers crafting smart, budget-conscious, multi-city European and global itineraries with GlobeTrotter.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 text-xs font-black shadow-lg transition active:scale-95 cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="rounded-2xl border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-bold text-white backdrop-blur-md transition active:scale-95 cursor-pointer"
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. COMPREHENSIVE FOOTER                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 bg-slate-950 pt-14 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 text-xs">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
                <Compass size={20} />
              </div>
              <span className="text-lg font-black text-white">GlobeTrotter</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering personalized travel planning with modular day itineraries, synchronized ₹ INR budget analytics, and collaborative community trips.
            </p>
            <span className="inline-block text-[11px] font-semibold text-slate-500">
              Built for ODOO X L.D College of Engineering Hackathon 2026
            </span>
          </div>

          {/* Col 2: Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/trips" className="hover:text-white transition">Itinerary Builder</Link></li>
              <li><Link href="/budget" className="hover:text-white transition">₹ INR Budget Breakdown</Link></li>
              <li><Link href="/calendar" className="hover:text-white transition">Calendar & Timeline</Link></li>
              <li><Link href="/explore" className="hover:text-white transition">Activity Discovery</Link></li>
              <li><Link href="/community" className="hover:text-white transition">Community Public Routes</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/profile" className="hover:text-white transition">User Profile & Wishlist</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Dashboard</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition">Register</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Travel Deal Alerts</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Get weekly curated deals and budget travel tips directly in ₹ INR.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  toast.success('Subscribed for travel deal alerts in ₹ INR!');
                  setNewsletterEmail('');
                }
              }}
              className="space-y-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email..."
                className="h-9 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="h-8 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>© 2026 GlobeTrotter Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 7. INTERACTIVE SIGN-IN / SIGN-UP MODAL POPUP                 */}
      {/* ============================================================ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {authMode === 'login' ? 'Welcome Back 👋' : 'Create Free Account 🌍'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {authMode === 'login' ? 'Access your personalized itineraries' : 'Start planning your multi-city journey in minutes'}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick 1-Click Demo Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/25 transition active:scale-98 cursor-pointer"
            >
              ⚡ Instant 1-Click Demo Sign In
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500">
                Or Continue With Email
              </span>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Manthan Saraiya"
                    className="h-10 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white outline-none focus:border-blue-500 focus:bg-white/10"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. traveler@globetrotter.io"
                  className="h-10 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white outline-none focus:border-blue-500 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-xs text-white outline-none focus:border-blue-500 focus:bg-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 py-3 text-xs font-black transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? 'Signing In...' : authMode === 'login' ? 'Log In to Account' : 'Sign Up Free'}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-blue-400 hover:underline"
                  >
                    Sign up free
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-blue-400 hover:underline"
                  >
                    Log in here
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
