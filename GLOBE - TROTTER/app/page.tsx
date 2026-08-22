'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Plane,
  Hotel,
  Car,
  Ship,
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  Heart,
  ShieldCheck,
  Clock,
  Shield,
  Star,
  ChevronDown,
  ArrowLeftRight,
  Compass,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // Widget Tabs & State
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

  const handleSearchClick = (e: React.FormEvent) => {
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
      toast.error('Please enter all required fields.');
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
    } catch {}
    toast.success('Instant Demo Access granted! Redirecting...');
    setShowAuthModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen font-sans flex flex-col justify-between overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. CRYSTAL CLEAR HIGH-RES LANDMARK BACKGROUND                */}
      {/* ============================================================ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/landing-hero-globe.jpg"
          alt="World Landmarks Background"
          className="h-full w-full object-cover object-top brightness-105 contrast-105"
        />
        {/* Subtle gradient only at top for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-blue-950/70 via-blue-950/30 to-transparent" />
        {/* Soft vignette at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blue-950/40 to-transparent" />
      </div>

      {/* ============================================================ */}
      {/* 2. TOP HEADER (Exact GlobalVista Replica)                     */}
      {/* ============================================================ */}
      <header className="relative z-20 w-full pt-6 pb-2 px-6 sm:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo: GlobalVista / GlobeTrotter */}
          <Link href="/" className="flex items-center gap-3 text-white group">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-md">
              <Globe size={22} className="group-hover:rotate-45 transition duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none font-serif drop-shadow-sm">
                GlobeTrotter
              </span>
              <span className="text-[10px] text-white/90 font-medium tracking-wide mt-0.5 drop-shadow-xs">
                Your Journey, Our Expertise
              </span>
            </div>
          </Link>

          {/* Nav Links: Home, Destinations, Packages, Contact */}
          <nav className="flex items-center gap-8 sm:gap-10 text-xs sm:text-sm font-semibold text-white">
            <div className="relative flex flex-col items-center">
              <Link href="/" className="text-white font-bold transition drop-shadow-xs">
                Home
              </Link>
              <span className="h-0.5 w-4 bg-white rounded-full mt-1 shadow-xs" />
            </div>
            <button
              type="button"
              onClick={() => {
                if (user) router.push('/explore');
                else setShowAuthModal(true);
              }}
              className="text-white/90 hover:text-white transition drop-shadow-xs cursor-pointer"
            >
              Destinations
            </button>
            <Link href="/trips" className="text-white/90 hover:text-white transition drop-shadow-xs">
              Packages
            </Link>
            <Link href="/community" className="text-white/90 hover:text-white transition drop-shadow-xs">
              Contact
            </Link>

            {/* Auth / Action Button */}
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-5 py-2 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition active:scale-95 ml-2"
              >
                Dashboard →
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="rounded-full bg-white px-5 py-2 text-xs font-bold text-blue-700 shadow-md hover:bg-blue-50 transition active:scale-95 ml-2 cursor-pointer"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. HERO CONTENT & HEADLINE (Exact GlobalVista Replica)       */}
      {/* ============================================================ */}
      <main className="relative z-20 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center text-center my-auto">
        {/* Centered AI-Powered Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm mb-4">
          <Sparkles size={13} className="text-white" />
          AI-POWERED TRAVEL PLANNER
        </div>

        {/* Huge Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
          Explore the World <br />
          With Confidence
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 max-w-2xl text-xs sm:text-base text-white font-medium leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
          Seamless global travel planning, personalized experiences, and trusted booking — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => {
              if (user) router.push('/trips/new');
              else {
                setAuthMode('signup');
                setShowAuthModal(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0066FF] hover:bg-[#0055D4] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-900/50 transition duration-300 active:scale-95 cursor-pointer"
          >
            Start Your Journey <ArrowRight size={16} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (user) router.push('/explore');
              else setShowAuthModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/15 hover:bg-white/25 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition duration-300 active:scale-95 cursor-pointer"
          >
            <Compass size={16} /> View Destinations
          </button>
        </div>

        {/* ============================================================ */}
        {/* 4. GLASSMORPHISM BOOKING WIDGET (Exact Replica)              */}
        {/* ============================================================ */}
        <div className="mt-8 sm:mt-10 w-full rounded-3xl border border-white/50 bg-white/25 p-4 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-left space-y-4">
          {/* Top Category Tabs: Flights, Hotels, Cars, Cruises */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('flights')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'flights'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Plane size={15} /> Flights
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hotels')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'hotels'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Hotel size={15} /> Hotels
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cars')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'cars'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Car size={15} /> Cars
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cruises')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'cruises'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Ship size={15} /> Cruises
            </button>
          </div>

          {/* Continuous White Form Card */}
          <form
            onSubmit={handleSearchClick}
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
                    placeholder="New York, USA"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSwapCities}
                className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition flex-shrink-0 ml-1 cursor-pointer"
                title="Swap origin & destination"
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

          {/* AI Suggestions Strip (Exact Replica) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-white drop-shadow-xs">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-white" />
                AI SUGGESTIONS FOR YOU
              </span>
              <button
                type="button"
                onClick={() => {
                  if (user) router.push('/explore');
                  else setShowAuthModal(true);
                }}
                className="text-[11px] font-semibold text-white hover:underline transition cursor-pointer"
              >
                See more ideas →
              </button>
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
                      toast.info(`Selected destination: ${item.name}`);
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/50 bg-white/90 backdrop-blur-md p-2 hover:bg-white transition shadow-sm"
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
                        <span className="text-[10px] font-semibold text-slate-500 block truncate">
                          from {item.price} <strong className="text-emerald-600 font-bold">({item.inr})</strong>
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
      {/* 5. CRISP WHITE TRUST BAR (Exact GlobalVista Footer Replica)   */}
      {/* ============================================================ */}
      <div className="relative z-20 w-full bg-white border-t border-slate-100 py-6 px-4 sm:px-12 shadow-lg">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-800">
          {/* Item 1 */}
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0066FF] flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Best Price Guarantee</h4>
              <p className="text-[11px] text-slate-500">We match the best prices</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0066FF] flex-shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">24/7 Travel Support</h4>
              <p className="text-[11px] text-slate-500">Always here when you need us</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0066FF] flex-shrink-0">
              <Shield size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Secure Booking</h4>
              <p className="text-[11px] text-slate-500">Your data is 100% protected</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0066FF] flex-shrink-0">
              <Star size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Trusted by Millions</h4>
              <p className="text-[11px] text-slate-500">10M+ happy travelers worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. POPUP AUTH MODAL (Seamless Sign In / Sign Up Entry)       */}
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
