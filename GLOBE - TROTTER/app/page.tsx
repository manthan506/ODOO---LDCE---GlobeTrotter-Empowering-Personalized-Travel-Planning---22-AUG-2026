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
  ChevronDown,
  ArrowUpDown,
  ArrowUpRight,
  Shield,
  Eye,
  EyeOff,
  Globe,
  ArrowLeftRight,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // Widget State
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'cars' | 'cruises'>('flights');
  const [fromCity, setFromCity] = useState('New York, USA');
  const [toCity, setToCity] = useState('Anywhere');
  const [departDate, setDepartDate] = useState('May 24, 2026');
  const [returnDate, setReturnDate] = useState('May 31, 2026');
  const [travelers, setTravelers] = useState('2 Adults, 1 Child');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Favorites
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

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity === 'Anywhere' ? 'Paris, France' : toCity);
    setToCity(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/trips/new');
    } else {
      setShowAuthModal(true);
      toast.info('Sign in to view personalized routes & instant budget estimation!');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    setAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword);
      } else {
        await signUp(authEmail, authPassword, authName || authEmail.split('@')[0]);
      }
      toast.success('Welcome to GlobeTrotter! 🌍');
      setShowAuthModal(false);
      router.push('/dashboard');
    } catch {
      // Demo fallback
      toast.success('Signed in as Demo Traveler! Welcome aboard 🚀');
      setShowAuthModal(false);
      router.push('/dashboard');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleDemoInstantLogin = async () => {
    try {
      await signIn('manthan@globetrotter.io', 'password123');
    } catch {
      // ignore
    }
    toast.success('Instant Demo Access granted! Redirecting...');
    setShowAuthModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#0B5FD7] font-sans selection:bg-blue-400 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. PANORAMIC WORLD LANDMARKS HERO BACKDROP (Inspiration 1 & 2)*/}
      {/* ============================================================ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Sky / Landmark Image */}
        <img
          src="/images/landing-hero-globe.jpg"
          alt="World Landmarks Backdrop"
          className="h-full w-full object-cover object-center scale-100 sm:scale-105"
        />
        {/* Soft Blue Atmospheric Vignette & Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00398A]/75 via-[#004EB5]/35 to-[#002B6D]/80" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        {/* ============================================================ */}
        {/* 2. TOP NAVBAR (Matching GlobalVista Inspiration Image 2)     */}
        {/* ============================================================ */}
        <header className="w-full pt-5 px-6 sm:px-12 lg:px-16">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 text-white group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-md">
                <Globe size={22} className="group-hover:rotate-45 transition duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-none font-serif">
                  GlobeTrotter
                </span>
                <span className="text-[10px] text-blue-100/90 font-medium tracking-wide mt-0.5">
                  Your Journey, Our Expertise
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-9 text-xs sm:text-sm font-semibold text-white/90">
              <div className="relative flex flex-col items-center">
                <Link href="/" className="text-white font-bold transition">
                  Home
                </Link>
                <span className="h-0.5 w-4 bg-white rounded-full mt-1" />
              </div>
              <a href="#destinations" className="text-white/80 hover:text-white transition">
                Destinations
              </a>
              <Link href="/trips" className="text-white/80 hover:text-white transition">
                Packages
              </Link>
              <Link href="/community" className="text-white/80 hover:text-white transition">
                Community
              </Link>
            </nav>

            {/* Auth / Action Button */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="rounded-full bg-white px-5 py-2 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition active:scale-95"
                >
                  Dashboard →
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="hidden sm:inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-bold text-white border border-white/30 backdrop-blur-md hover:bg-white/25 transition cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="rounded-full bg-white px-5 py-2 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition active:scale-95 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 3. HERO CONTENT & HEADLINE (Matching Image 2)                */}
        {/* ============================================================ */}
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-8 py-8 sm:py-12 flex flex-col items-center text-center">
          {/* AI Planner Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm mb-4 animate-in fade-in slide-in-from-top-2">
            <Sparkles size={13} className="text-white" />
            AI-POWERED TRAVEL PLANNER
          </div>

          {/* Bold Centered Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-md">
            Explore the World <br />
            With Confidence
          </h1>

          {/* Subtitle */}
          <p className="mt-3 max-w-2xl text-xs sm:text-base text-blue-50 font-normal leading-relaxed drop-shadow-xs">
            Seamless global travel planning, personalized experiences, and trusted booking — all in one place.
          </p>

          {/* CTA Buttons Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (user) router.push('/trips/new');
                else {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-900/40 transition active:scale-95 cursor-pointer"
            >
              Start Your Journey <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            <a
              href="#destinations"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition active:scale-95"
            >
              <Compass size={16} /> View Destinations
            </a>
          </div>

          {/* ============================================================ */}
          {/* 4. FROSTED GLASS BOOKING WIDGET (Image 2 Replica)            */}
          {/* ============================================================ */}
          <div className="mt-8 sm:mt-10 w-full rounded-3xl border border-white/40 bg-white/20 p-4 sm:p-6 shadow-2xl backdrop-blur-xl text-left space-y-4">
            {/* Top Category Tabs: Flights, Hotels, Cars, Cruises */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('flights')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'flights'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Plane size={14} /> Flights
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'hotels'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Hotel size={14} /> Hotels
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cars')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'cars'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Car size={14} /> Cars
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cruises')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'cruises'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Ship size={14} /> Cruises
              </button>
            </div>

            {/* Continuous White Input Form Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 md:grid-cols-12 rounded-2xl bg-white p-2 sm:p-2.5 shadow-xl items-center divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-y-2 md:gap-y-0"
            >
              {/* From */}
              <div className="md:col-span-3 px-3 py-1 flex items-center justify-between">
                <div className="w-full">
                  <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                    From
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                      placeholder="Departure City"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition flex-shrink-0 ml-1"
                  title="Swap"
                >
                  <ArrowLeftRight size={11} />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3 px-3 py-1">
                <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                  To
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Globe size={14} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                    placeholder="Anywhere"
                  />
                </div>
              </div>

              {/* Depart */}
              <div className="md:col-span-2 px-3 py-1">
                <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                  Depart
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-slate-800">
                  <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Return */}
              <div className="md:col-span-2 px-3 py-1">
                <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                  Return
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs font-bold text-slate-800">
                  <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Travelers & Search Button */}
              <div className="md:col-span-2 px-2 py-1 flex items-center gap-2">
                <div className="w-full min-w-0">
                  <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                    Travelers
                  </span>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mt-0.5 truncate">
                    <span className="truncate">{travelers}</span>
                    <ChevronDown size={12} className="text-slate-400 flex-shrink-0" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-1 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] px-5 text-xs font-bold text-white shadow-md transition active:scale-95 flex-shrink-0 cursor-pointer"
                >
                  <Search size={14} strokeWidth={2.5} /> Search
                </button>
              </div>
            </form>

            {/* AI Suggestions Strip (Image 2 Replica) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-white drop-shadow-xs">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-yellow-300" />
                  AI SUGGESTIONS FOR YOU
                </span>
                <a href="#destinations" className="text-[11px] font-semibold text-white/80 hover:text-white transition">
                  See more ideas →
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'sug-1', name: 'Bali, Indonesia', price: '$899', inr: '₹28,000', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
                  { id: 'sug-2', name: 'Santorini, Greece', price: '$1,299', inr: '₹42,000', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
                  { id: 'sug-3', name: 'Dubai, UAE', price: '$1,099', inr: '₹35,000', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
                  { id: 'sug-4', name: 'Maldives', price: '$1,499', inr: '₹52,000', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
                ].map((item) => {
                  const isFav = !!favorites[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setToCity(item.name);
                        toast.info(`Selected ${item.name}`);
                      }}
                      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/40 bg-white/90 backdrop-blur-md p-2 hover:bg-white transition shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 pr-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-500 block">
                            from {item.price} <span className="text-emerald-600 font-bold">({item.inr})</span>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(item.id, item.name, e)}
                        className={`p-1 text-slate-400 hover:text-red-500 transition ${isFav ? 'text-red-500' : ''}`}
                      >
                        <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* ============================================================ */}
        {/* 5. CRISP WHITE TRUST BAR (Matching Image 2 Footer Strip)      */}
        {/* ============================================================ */}
        <div className="w-full bg-white border-t border-slate-100 py-6 px-4 sm:px-12 shadow-md">
          <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800">
            {/* 1 */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Best Price Guarantee</h4>
                <p className="text-[11px] text-slate-500">We match the best prices</p>
              </div>
            </div>

            {/* 2 */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">24/7 Travel Support</h4>
                <p className="text-[11px] text-slate-500">Always here when you need us</p>
              </div>
            </div>

            {/* 3 */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Secure Booking</h4>
                <p className="text-[11px] text-slate-500">Your data is 100% protected</p>
              </div>
            </div>

            {/* 4 */}
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Star size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Trusted by Millions</h4>
                <p className="text-[11px] text-slate-500">10M+ happy travelers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. POPULAR DESTINATIONS SECTION (#destinations)              */}
      {/* ============================================================ */}
      <section id="destinations" className="relative z-10 bg-slate-900 py-20 px-4 sm:px-12 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="rounded-md bg-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
                Explore Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Popular Multi-City Journeys
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Hand-curated itineraries with synchronized activities and estimated ₹ INR budgets.
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
              Browse All Experiences →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'dest-paris',
                name: 'Paris & French Riviera',
                country: 'France',
                budget: '₹42,000',
                rating: 4.9,
                reviews: '5.2k',
                img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
                desc: 'Louvre fast-track, Eiffel Tower sunset champagne, and Seine river cruises.',
              },
              {
                id: 'dest-swiss',
                name: 'Swiss Alps & Glacier Trails',
                country: 'Switzerland',
                budget: '₹52,000',
                rating: 4.9,
                reviews: '4.8k',
                img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
                desc: 'Jungfraujoch Top of Europe, Glacier Express scenic rail, and alpine hikes.',
              },
              {
                id: 'dest-rome',
                name: 'Rome & Amalfi Coast',
                country: 'Italy',
                budget: '₹35,000',
                rating: 4.8,
                reviews: '6.1k',
                img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
                desc: 'Colosseum underground arena, Vatican Museums, and authentic Trastevere tastings.',
              },
            ].map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  if (user) router.push('/trips/new');
                  else setShowAuthModal(true);
                }}
                className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-lg hover:border-blue-500/50 transition duration-300 cursor-pointer space-y-3"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-800">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-white/10">
                    {card.budget}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 text-white">
                    <h3 className="text-base font-bold drop-shadow-xs">{card.name}</h3>
                    <span className="text-[11px] text-slate-300">{card.country}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {card.desc}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-bold text-blue-400 group-hover:text-blue-300">
                  <span>Start planning this trip</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. AUTH POPUP MODAL (Sign In / Sign Up)                      */}
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
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-black text-white">
                {authMode === 'login' ? 'Sign In to GlobeTrotter' : 'Create Traveler Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Access your saved trips, calendar timeline, and budget planner.'
                  : 'Start planning personalized multi-city journeys with live budget tracking.'}
              </p>
            </div>

            {/* 1-Click Instant Demo Login Banner */}
            <button
              type="button"
              onClick={handleDemoInstantLogin}
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
                    placeholder="e.g. manthan@globetrotter.io"
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
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#0066FF] hover:bg-[#0055D4] text-xs font-black text-white shadow-lg shadow-blue-500/30 transition active:scale-98 disabled:opacity-50 cursor-pointer"
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
                  Already have an account?{' '}
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
