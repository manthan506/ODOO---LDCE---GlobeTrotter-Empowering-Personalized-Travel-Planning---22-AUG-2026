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
  ArrowLeftRight,
  Anchor,
  HelpCircle,
  PhoneCall,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const { masterTrip, totalCalculatedCost, userProfile, addSavedDestination } = useTripSync();
  const router = useRouter();

  // Search Widget State matching template
  const [searchTab, setSearchTab] = useState<'flights' | 'hotels' | 'cars' | 'cruises' | 'itineraries'>('flights');
  const [origin, setOrigin] = useState('New York, USA');
  const [destination, setDestination] = useState('Anywhere (Paris, Swiss Alps, Rome)');
  const [departDate, setDepartDate] = useState('May 24, 2026');
  const [returnDate, setReturnDate] = useState('May 31, 2026');
  const [travelersCount, setTravelersCount] = useState('2 Adults, 1 Child');

  // Liked / Saved suggestion cards
  const [likedSuggestions, setLikedSuggestions] = useState<Record<string, boolean>>({});

  // Auth Modal State (Sign-in / Sign-up)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination.includes('(') ? 'Paris, France' : destination);
    setDestination(temp);
    toast.info('Swapped origin and destination');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching ${searchTab} to ${destination}!`);
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

  const toggleLike = (id: string, name: string, country: string, img: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedSuggestions((prev) => ({ ...prev, [id]: !prev[id] }));
    addSavedDestination({ id, name, country, img });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH EXACT AI ARTWORK BACKGROUND & TEMPLATE  */}
      {/* ============================================================ */}
      <div className="relative min-h-screen w-full overflow-hidden bg-sky-500 pb-16">
        {/* Exact AI-Generated 3D Earth & Landmark Panorama Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/globe-landmarks-hero.jpg"
            alt="Globe Landmark Panorama"
            className="h-full w-full object-cover object-center"
          />
          {/* Subtle gradient vignette to ensure crisp UI contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/20 to-sky-950/70" />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* TOP HEADER & NAVBAR (Matching GlobalVista Template)          */}
        {/* ------------------------------------------------------------ */}
        <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo matching template */}
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white shadow-md group-hover:scale-105 transition duration-300">
              <Globe2 size={24} className="animate-spin-slow text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none drop-shadow-md">
                GlobalVista
              </span>
              <span className="text-[10px] text-sky-100 font-medium tracking-wide drop-shadow-xs mt-0.5">
                Your Journey, Our Expertise
              </span>
            </div>
          </Link>

          {/* Nav Links matching template */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
            <Link href="/" className="relative text-white font-bold drop-shadow-sm pb-1">
              Home
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-white" />
            </Link>
            <Link href="/explore" className="hover:text-white transition drop-shadow-sm">
              Destinations
            </Link>
            <Link href="/trips" className="hover:text-white transition drop-shadow-sm">
              Packages & Itineraries
            </Link>
            <Link href="/community" className="hover:text-white transition drop-shadow-sm">
              Community
            </Link>
            <Link href="#features" className="hover:text-white transition drop-shadow-sm">
              Features
            </Link>
          </nav>

          {/* Right Action & Auth Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md drop-shadow-sm">
              <span>🇮🇳 ₹ INR</span>
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/30 transition hover:scale-105 active:scale-95"
              >
                Dashboard ➔
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-900/40 transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ------------------------------------------------------------ */}
        {/* HERO CENTER TEXT & CALL TO ACTION                            */}
        {/* ------------------------------------------------------------ */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-6 sm:pt-10 text-center">
          {/* AI Badge Pill matching template */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-900/40 px-4 py-1 text-xs font-bold text-white backdrop-blur-md shadow-md mb-4 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles size={13} className="text-yellow-400" />
            <span className="tracking-wide">AI-POWERED TRAVEL PLANNER</span>
          </div>

          {/* Main Title matching template */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
            Explore the World <br />
            With Confidence
          </h1>

          {/* Subtitle matching template */}
          <p className="mt-3 text-xs sm:text-base text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md leading-relaxed">
            Seamless global travel planning, personalized experiences, and trusted booking — all in one place.
          </p>

          {/* Two Hero CTAs matching template */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-7 py-3 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-blue-900/40 transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Your Journey ➔
            </button>

            <Link
              href="/trips"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 hover:bg-white/25 px-6 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition hover:scale-105 active:scale-95 drop-shadow-md"
            >
              <MapPin size={15} /> View Destinations ➔
            </Link>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* FLOATING GLASSMORPHIC SEARCH CARD (Exact GlobalVista Layout) */}
          {/* ------------------------------------------------------------ */}
          <div className="mt-10 mx-auto max-w-4xl rounded-3xl border border-white/40 bg-white/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl text-left animate-in fade-in slide-in-from-bottom-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                { key: 'flights', label: 'Flights', icon: Plane },
                { key: 'hotels', label: 'Hotels', icon: Hotel },
                { key: 'cars', label: 'Cars', icon: Car },
                { key: 'cruises', label: 'Cruises', icon: Anchor },
                { key: 'itineraries', label: 'Modular Itineraries', icon: Compass },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = searchTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSearchTab(tab.key as any)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-white/90 hover:bg-white/15'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Fields Row */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center rounded-2xl bg-white/25 border border-white/40 p-2.5 backdrop-blur-md">
              {/* From */}
              <div className="lg:col-span-3 px-2 py-1">
                <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  From
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={14} className="text-white/70 flex-shrink-0" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent text-xs font-black text-white placeholder:text-white/60 outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                    title="Swap locations"
                  >
                    <ArrowLeftRight size={13} />
                  </button>
                </div>
              </div>

              {/* To */}
              <div className="lg:col-span-3 px-2 py-1 border-t sm:border-t-0 sm:border-l border-white/20">
                <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  To
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Compass size={14} className="text-white/70 flex-shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-xs font-black text-white placeholder:text-white/60 outline-none truncate"
                  />
                </div>
              </div>

              {/* Depart */}
              <div className="lg:col-span-2 px-2 py-1 border-t lg:border-t-0 lg:border-l border-white/20">
                <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  Depart
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar size={14} className="text-white/70 flex-shrink-0" />
                  <input
                    type="text"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-black text-white outline-none truncate"
                  />
                </div>
              </div>

              {/* Return */}
              <div className="lg:col-span-2 px-2 py-1 border-t lg:border-t-0 lg:border-l border-white/20">
                <span className="block text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  Return
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Calendar size={14} className="text-white/70 flex-shrink-0" />
                  <input
                    type="text"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-black text-white outline-none truncate"
                  />
                </div>
              </div>

              {/* Search CTA */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-black text-white shadow-lg shadow-blue-900/40 transition hover:scale-102 active:scale-95 cursor-pointer"
                >
                  <Search size={15} /> Search 🔍
                </button>
              </div>
            </form>

            {/* ------------------------------------------------------------ */}
            {/* AI SUGGESTIONS FOR YOU ROW (Exact 4 Cards with Heart & Price) */}
            {/* ------------------------------------------------------------ */}
            <div className="mt-4 pt-3.5 border-t border-white/20">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                  <Sparkles size={14} className="text-yellow-300" />
                  <span>AI SUGGESTIONS FOR YOU</span>
                </div>
                <Link
                  href="/explore"
                  className="text-[11px] font-bold text-white/90 hover:text-white flex items-center gap-1"
                >
                  See more ideas →
                </Link>
              </div>

              {/* 4 Cards matching the template */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 's-bali', name: 'Bali, Indonesia', country: 'Indonesia', priceUSD: '$899', priceINR: '₹48,000', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
                  { id: 's-santorini', name: 'Santorini, Greece', country: 'Greece', priceUSD: '$1,299', priceINR: '₹82,000', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
                  { id: 's-dubai', name: 'Dubai, UAE', country: 'UAE', priceUSD: '$1,099', priceINR: '₹65,000', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
                  { id: 's-maldives', name: 'Maldives', country: 'Maldives', priceUSD: '$1,499', priceINR: '₹95,000', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
                ].map((item) => {
                  const isLiked = !!likedSuggestions[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setDestination(item.name);
                        toast.info(`Selected ${item.name}`);
                      }}
                      className="group flex items-center justify-between rounded-2xl border border-white/30 bg-white/20 p-1.5 pr-2.5 backdrop-blur-md hover:bg-white/30 transition cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-10 w-10 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition duration-300"
                        />
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-extrabold text-white truncate drop-shadow-xs">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-300 block">
                            from {item.priceINR} ({item.priceUSD})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleLike(item.id, item.name, item.country, item.img, e)}
                        className={`p-1 rounded-full transition ${isLiked ? 'text-red-400 bg-white/20' : 'text-white/70 hover:text-red-300'}`}
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. BOTTOM WHITE TRUST BAR (Matching GlobalVista Bottom Row)  */}
      {/* ============================================================ */}
      <section className="bg-white py-6 border-b border-slate-200 text-slate-800 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          {/* 1. Best Price Guarantee */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Best Price Guarantee</h4>
              <p className="text-[11px] text-slate-500 font-medium">We match the best prices & ₹ INR budgets</p>
            </div>
          </div>

          {/* 2. 24/7 Travel Support */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">24/7 Travel Support</h4>
              <p className="text-[11px] text-slate-500 font-medium">Always here when you need us</p>
            </div>
          </div>

          {/* 3. Secure Booking */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
              <Lock size={22} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Secure Booking</h4>
              <p className="text-[11px] text-slate-500 font-medium">Your data is 100% protected</p>
            </div>
          </div>

          {/* 4. Trusted by Millions */}
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
              <Star size={22} fill="#3B82F6" className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Trusted by Millions</h4>
              <p className="text-[11px] text-slate-500 font-medium">10M+ happy travelers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. COMPREHENSIVE FEATURES SPOTLIGHT & MARKETING (All 13)     */}
      {/* ============================================================ */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 bg-slate-950 text-white">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="rounded-full bg-blue-500/15 border border-blue-400/30 px-3.5 py-1 text-xs font-black text-blue-400 uppercase tracking-wider">
            All-In-One Travel Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Every Tool to Build, Budget & Share Your Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Engineered with real-time ₹ INR calculations, drag-to-reorder day plans, and 1-click community cloning.
          </p>
        </div>

        {/* 6 Feature Marketing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Multi-City Itinerary Builder */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-xl hover:border-blue-500/50 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Compass size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">Features #5 & #6</span>
              <h3 className="text-lg font-bold text-white mt-1">Modular Itinerary Builder</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Add cities, travel dates, and modular sections. Drag-to-reorder stops effortlessly and preview two-column physical activity & expense timelines.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/trips" className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
                Open Builder Screen <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 2: Smart ₹ INR Budget Breakdown */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-xl hover:border-emerald-500/50 hover:bg-slate-900 transition-all space-y-4">
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

          {/* Feature 3: Trip Calendar & Timeline */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-xl hover:border-indigo-500/50 hover:bg-slate-900 transition-all space-y-4">
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
                View Calendar Grid <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 4: City & Activity Search */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-xl hover:border-amber-500/50 hover:bg-slate-900 transition-all space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Search size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Features #7 & #8</span>
              <h3 className="text-lg font-bold text-white mt-1">City & Experience Discovery</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Filter activities by interest (Adventure, Culture, Food, Cruises), duration, and rupee cost index with instant "+ Add to Stop" toggling.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <Link href="/explore" className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                Explore Experiences <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Feature 5: Community Hub & 1-Click Clone */}
          <div className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-xl hover:border-purple-500/50 hover:bg-slate-900 transition-all space-y-4">
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
          <div className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-7 shadow-xl hover:border-sky-500/50 hover:bg-slate-900 transition-all space-y-4">
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
      {/* 4. BOTTOM BANNER & CALL TO ACTION                            */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto bg-slate-950">
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
                className="rounded-full bg-white text-slate-900 hover:bg-slate-100 px-7 py-3 text-xs font-black shadow-lg transition active:scale-95 cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-bold text-white backdrop-blur-md transition active:scale-95 cursor-pointer"
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. COMPREHENSIVE FOOTER                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 bg-slate-950 pt-14 pb-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 text-xs">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
                <Globe2 size={20} />
              </div>
              <span className="text-lg font-black text-white">GlobalVista / GlobeTrotter</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Seamless global travel planning, personalized experiences, and trusted booking — empowering smart journey planning with ₹ INR budget synchronicity.
            </p>
            <span className="inline-block text-[11px] font-semibold text-slate-500">
              Built for ODOO X L.D College Hackathon 2026
            </span>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/trips" className="hover:text-white transition">Itinerary Builder</Link></li>
              <li><Link href="/budget" className="hover:text-white transition">₹ INR Budget Tracker</Link></li>
              <li><Link href="/calendar" className="hover:text-white transition">Calendar Timeline</Link></li>
              <li><Link href="/explore" className="hover:text-white transition">Activities & Experiences</Link></li>
              <li><Link href="/community" className="hover:text-white transition">Community Hub</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/profile" className="hover:text-white transition">Profile & Wishlist</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Admin Panel</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition">Register</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Travel Alerts</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Get weekly curated deals and budget travel tips directly in ₹ INR.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  toast.success('Subscribed for deal alerts in ₹ INR!');
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
          <span>© 2026 GlobeTrotter & GlobalVista. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 6. INTERACTIVE SIGN-IN / SIGN-UP MODAL POPUP                 */}
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
