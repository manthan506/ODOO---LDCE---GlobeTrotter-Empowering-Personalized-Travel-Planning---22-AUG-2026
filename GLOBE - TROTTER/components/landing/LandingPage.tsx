'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Wallet,
  Users,
  Search,
  Check,
  Star,
  Globe2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plane,
  Hotel,
  Clock,
  Heart,
  ExternalLink,
  X,
  Lock,
  Mail,
  User,
  ArrowUpRight,
  Send,
  Layers,
  Sparkle,
  Share2,
  CalendarDays,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export function LandingPage() {
  const router = useRouter();
  const { user, signIn, signUp } = useAuth();

  // Search Widget State
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDates, setSearchDates] = useState('');
  const [searchTravelers, setSearchTravelers] = useState('2 Travelers');

  // Auth Modal State ('login' | 'signup' | null)
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDestination.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchDestination)}`);
    } else {
      router.push('/explore');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authModal === 'login') {
        await signIn(authEmail, authPassword);
        toast.success('Welcome back to GlobeTrotter!');
      } else {
        await signUp(authEmail, authPassword, { name: authName || 'Traveler' });
        toast.success('Welcome to GlobeTrotter! Account initialized.');
      }
      setAuthModal(null);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Signed in via demo mode.');
      setAuthModal(null);
      router.push('/dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* ============================================================ */}
      {/* 1. HEADER & NAVIGATION BAR (Matching Reference Image)        */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0047FF] text-white shadow-md shadow-blue-500/20">
              <Compass size={22} strokeWidth={2.4} />
            </div>
            <span className="text-xl font-black tracking-tight text-[#0F172A]">
              GlobeTrotter
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold text-slate-600">
            <Link href="/" className="text-[#0047FF] font-bold">Home</Link>
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#destinations" className="hover:text-slate-900 transition">Destinations</a>
            <Link href="/trips" className="hover:text-slate-900 transition">Itinerary Planner</Link>
            <Link href="/budget" className="hover:text-slate-900 transition">Pricing</Link>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-slate-900 transition">
              <span>Resources</span>
              <ChevronDown size={14} />
            </div>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <Globe2 size={15} className="text-slate-500" />
              <span>EN</span>
              <ChevronDown size={13} className="text-slate-400" />
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-[#0047FF] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAuthModal('login')}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModal('signup')}
                  className="rounded-full bg-[#002699] hover:bg-[#001f80] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/20 transition active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH EXACT GLOBE ARTWORK & SEARCH WIDGET     */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24">
        {/* Soft Background Radial Glow */}
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold text-[#0047FF]">
                <Plane size={13} className="text-[#0047FF]" />
                Plan Smarter, Travel Better
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.12]">
                Your Journey, <br />
                <span className="text-[#002699]">
                  Perfectaly Planned
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal">
                GlobeTrotter helps you plan multi-city trips, discover amazing places, build personalized itineraries, manage budgets, and share your adventures with the world.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => (user ? router.push('/trips/new') : setAuthModal('signup'))}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002699] hover:bg-[#001f80] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition active:scale-95 cursor-pointer"
                >
                  Plan Your Trip <ArrowUpRight size={16} />
                </button>

                <a
                  href="#destinations"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs cursor-pointer"
                >
                  Explore Destinations <ArrowUpRight size={15} />
                </a>
              </div>

              {/* Social Proof Avatars */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                    alt="Traveler 1"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="Traveler 2"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                    alt="Traveler 3"
                  />
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  <strong className="text-slate-900 font-bold">Join 25,000+</strong> happy travelers who plan smarter with GlobeTrotter.
                </p>
              </div>
            </div>

            {/* Right Column: Exact Globe Hero Artwork & Floating Badge */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-[540px]">
                {/* Globe Artwork matching Image 1 */}
                <img
                  src="/globe-hero.png"
                  alt="World Monuments Illustration"
                  className="w-full h-auto object-contain drop-shadow-xl hover:scale-[1.02] transition duration-700"
                />

                {/* Floating Destination Card (Rome, Italy ⭐ 4.9) */}
                <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-8 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 p-3 px-4 shadow-xl backdrop-blur-md">
                  <img
                    src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80"
                    alt="Colosseum Rome"
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-slate-900">Rome, Italy</h4>
                      <ArrowUpRight size={12} className="text-slate-400" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <Star size={11} fill="currentColor" />
                      <span className="text-slate-600 font-semibold ml-1">4.9</span>
                      <span className="text-slate-400 font-normal text-[10px]">(1.8k reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SEARCH WIDGET BAR (Matching Reference)                       */}
          {/* ============================================================ */}
          <div className="mt-14 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xl shadow-slate-100">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Where to */}
              <div className="sm:col-span-4 flex items-center gap-3 rounded-2xl p-2.5 px-3.5 hover:bg-slate-50 transition border border-slate-100 sm:border-0">
                <Search size={18} className="text-slate-400 flex-shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] font-bold text-slate-800 block">Where to?</span>
                  <input
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="Search destinations, cities..."
                    className="w-full bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="hidden sm:block sm:col-span-0.5 h-8 w-px bg-slate-200 mx-auto" />

              {/* Travel Dates */}
              <div className="sm:col-span-3 flex items-center gap-3 rounded-2xl p-2.5 px-3.5 hover:bg-slate-50 transition border border-slate-100 sm:border-0">
                <CalendarDays size={18} className="text-slate-400 flex-shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] font-bold text-slate-800 block">Travel Dates</span>
                  <input
                    type="text"
                    value={searchDates}
                    onChange={(e) => setSearchDates(e.target.value)}
                    placeholder="Add dates"
                    className="w-full bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="hidden sm:block sm:col-span-0.5 h-8 w-px bg-slate-200 mx-auto" />

              {/* Travelers */}
              <div className="sm:col-span-3 flex items-center gap-3 rounded-2xl p-2.5 px-3.5 hover:bg-slate-50 transition border border-slate-100 sm:border-0">
                <User size={18} className="text-slate-400 flex-shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] font-bold text-slate-800 block">Travelers</span>
                  <input
                    type="text"
                    value={searchTravelers}
                    onChange={(e) => setSearchTravelers(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-600 outline-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#002699] hover:bg-[#001f80] text-xs font-bold text-white shadow-md shadow-blue-900/20 transition active:scale-95 cursor-pointer"
                >
                  <span>Search</span>
                  <Search size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. 5-FEATURE ICON PILLS (Matching Reference Image)           */}
      {/* ============================================================ */}
      <section className="border-t border-slate-100 bg-[#FAFBFD] py-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: Compass, title: 'Multi-city Itineraries', desc: 'Plan complex trips with ease across multiple cities.' },
              { icon: Wallet, title: 'Smart Budgeting', desc: 'Get real-time cost estimates and budget breakdowns.' },
              { icon: Search, title: 'Discover & Explore', desc: 'Find activities, attractions and hidden gems.' },
              { icon: Calendar, title: 'Visual Itineraries', desc: 'See your trip come to life with beautiful timelines.' },
              { icon: Users, title: 'Share & Collaborate', desc: 'Share plans and collaborate with friends & family.' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-start gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-[#0047FF] border border-blue-100">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. "EVERYTHING YOU NEED, ALL IN ONE PLACE" SECTION           */}
      {/* ============================================================ */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side text and checklist */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0047FF]">
                PLAN YOUR PERFECT TRIP
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Everything you need, <br />
                all in one place
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                From inspiration to itinerary, GlobeTrotter makes travel planning simple, smart, and exciting.
              </p>

              {/* 5 Green Checkmark Bullets */}
              <div className="space-y-3.5 pt-2">
                {[
                  'Create & manage unlimited trips',
                  'Add cities, dates & activities effortlessly',
                  'Get budget estimates & cost breakdowns',
                  'Beautiful day-wise itinerary views',
                  'Share plans with friends or make it public',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/trips"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-2xs"
                >
                  Explore All Features <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right side UI MOCKUPS matching reference layout */}
            <div className="lg:col-span-7 relative flex flex-col md:flex-row items-center justify-center gap-4">
              {/* Left Card: Budget Overview */}
              <div className="w-full md:w-48 rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-100 space-y-3 flex-shrink-0">
                <span className="text-[11px] font-bold text-slate-800 block">Budget Overview</span>
                <div>
                  <span className="text-[9px] text-slate-400 font-semibold block">Total Budget</span>
                  <p className="text-base font-black text-slate-900">$3,450</p>
                </div>
                {/* Donut graphic */}
                <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                  <div className="h-full w-full rounded-full border-4 border-blue-500 border-t-amber-400 border-r-emerald-500 border-b-purple-500" />
                </div>
                <div className="space-y-1 text-[9px] text-slate-500">
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Flights</span> <strong>$1,200</strong></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Stay</span> <strong>$1,050</strong></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Food</span> <strong>$600</strong></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Activities</span> <strong>$600</strong></div>
                </div>
              </div>

              {/* Center Card: My Europe Trip */}
              <div className="w-full md:w-64 rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl space-y-3 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">My Europe Trip</h4>
                    <span className="text-[9px] text-slate-400 font-medium">May 15 – May 25, 2026 • 10 Days</span>
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[8px] font-bold border border-emerald-200">
                    ✓ Published
                  </span>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 1 - 3</span>
                      <span className="text-slate-800 font-semibold">Paris, France</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80" alt="Paris" className="h-8 w-8 rounded-lg object-cover" />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 4 - 6</span>
                      <span className="text-slate-800 font-semibold">Rome, Italy</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&q=80" alt="Rome" className="h-8 w-8 rounded-lg object-cover" />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 7 - 9</span>
                      <span className="text-slate-800 font-semibold">Barcelona, Spain</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1583422409516-2895a77efded?w=100&q=80" alt="Barcelona" className="h-8 w-8 rounded-lg object-cover" />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 10 - 12</span>
                      <span className="text-slate-800 font-semibold">Swiss Alps, Switzerland</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=100&q=80" alt="Swiss" className="h-8 w-8 rounded-lg object-cover" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/trips')}
                  className="w-full py-2 rounded-xl bg-blue-50 text-[#0047FF] font-bold text-[10px] hover:bg-blue-100 transition cursor-pointer"
                >
                  + Add New Stop
                </button>
              </div>

              {/* Right Card: Top Activities in Rome */}
              <div className="w-full md:w-48 rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-100 space-y-3 flex-shrink-0">
                <span className="text-[11px] font-bold text-slate-800 block">Top Activities in Rome</span>
                <div className="space-y-2 text-[9px]">
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=80&q=80" alt="Colosseum" className="h-6 w-6 rounded-md object-cover" />
                    <div><span className="font-bold text-slate-800 block">Colosseum Tour</span><span className="text-slate-400">From $45</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=80&q=80" alt="Vatican" className="h-6 w-6 rounded-md object-cover" />
                    <div><span className="font-bold text-slate-800 block">Vatican Museums</span><span className="text-slate-400">From $35</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80" alt="Trevi" className="h-6 w-6 rounded-md object-cover" />
                    <div><span className="font-bold text-slate-800 block">Trevi Fountain</span><span className="text-emerald-600 font-bold">Free</span></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/explore')}
                  className="w-full py-2 rounded-xl bg-[#002699] text-white font-bold text-[10px] hover:bg-[#001f80] transition cursor-pointer"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. POPULAR DESTINATIONS GRID (Find your next adventure)      */}
      {/* ============================================================ */}
      <section id="destinations" className="py-20 bg-[#FAFBFD] border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0047FF]">
                POPULAR DESTINATIONS
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                Find your next adventure
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore handpicked destinations loved by travelers worldwide.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                View All Destinations <ChevronRight size={14} />
              </Link>
              <div className="flex items-center gap-1">
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"><ChevronLeft size={16} /></button>
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { name: 'Santorini, Greece', rating: '4.9', price: '$899', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
              { name: 'Tokyo, Japan', rating: '4.9', price: '$1,199', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
              { name: 'Swiss Alps, Switzerland', rating: '4.9', price: '$1,400', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80' },
              { name: 'Bali, Indonesia', rating: '4.7', price: '$1,495', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
              { name: 'New York, USA', rating: '4.8', price: '$899', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
            ].map((dest, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-800 flex items-center gap-1">
                    <Star size={10} className="text-amber-500 fill-amber-500" /> {dest.rating}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xs font-bold">{dest.name}</h3>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="text-slate-400 text-[11px]">From <strong className="text-slate-900">{dest.price}</strong></span>
                  <Link href="/explore" className="font-bold text-[#0047FF] hover:underline text-[11px]">
                    Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. HOW IT WORKS (4 Connected Simple Steps)                   */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 text-center space-y-12">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0047FF]">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Plan your trip in 4 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { icon: Search, title: '1. Choose Destinations', desc: 'Search and pick the cities you want to visit.' },
              { icon: Calendar, title: '2. Build Itinerary', desc: 'Add dates, activities and organize your trip.' },
              { icon: Wallet, title: '3. Set Budget', desc: 'Get cost estimates and manage your budget.' },
              { icon: Send, title: '4. Share & Go!', desc: 'Share your plan and start your adventure!' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[#0047FF] border border-blue-100 shadow-xs">
                  <step.icon size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TESTIMONIALS (What our travelers say)                     */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#FAFBFD] border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 space-y-12">
          <div className="text-center">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0047FF]">
              TRAVELERS LOVE GLOBETROTTER
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              What our travelers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                loc: 'New York, USA',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
                quote: 'GlobeTrotter made planning our Europe trip so easy! The itinerary builder and budget planner are game changers.',
              },
              {
                name: 'Michael Chen',
                loc: 'Toronto, Canada',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                quote: 'I love how I can discover activities and see the total cost upfront. Super helpful and beautifully designed!',
              },
              {
                name: 'Priya Sharma',
                loc: 'Mumbai, India',
                img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
                quote: 'Finally, a travel planner that understands travelers! Sharing trips with friends is so convenient.',
              },
            ].map((test, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-2xl text-blue-400 font-serif leading-none block">“</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {test.quote}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={test.img} alt={test.name} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{test.name}</h4>
                      <span className="text-[10px] text-slate-400">{test.loc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                    <span>5.0</span>
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-2 w-2 rounded-full bg-[#0047FF]" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. TRUSTED BY TRAVELERS & PARTNERS STRIP                     */}
      {/* ============================================================ */}
      <section className="py-10 bg-white text-center border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-6">
            TRUSTED BY TRAVELERS & PARTNERS
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70">
            <span className="text-lg font-black text-[#003580]">Booking.com</span>
            <span className="text-lg font-black text-[#FFB700]">Expedia</span>
            <span className="text-lg font-black text-[#FF5A5F]">airbnb</span>
            <span className="text-lg font-black text-[#00AF87]">Tripadvisor</span>
            <span className="text-lg font-black text-[#00A4D6]">Skyscanner</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. READY TO PLAN YOUR DREAM TRIP? BANNER                     */}
      {/* ============================================================ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#0F2942] p-8 sm:p-14 text-white shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85"
              alt="Hiker overlooking mountains"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F2942] via-[#0F2942]/80 to-transparent" />

            <div className="relative z-10 max-w-xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Ready to plan your dream trip?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join thousands of travelers who plan smarter, travel better.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => (user ? router.push('/trips/new') : setAuthModal('signup'))}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[#002699] shadow-lg hover:bg-slate-100 transition active:scale-95 cursor-pointer"
                >
                  Start Planning Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. DARK NAVY FOOTER                                         */}
      {/* ============================================================ */}
      <footer className="bg-[#0A1128] text-slate-400 pt-16 pb-10 text-xs">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#0047FF] text-white">
                  <Compass size={18} />
                </div>
                <span className="text-lg font-black tracking-tight">GlobeTrotter</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Your all-in-one travel planning companion. Plan smarter, travel better, create unforgettable memories.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 text-slate-400 pt-1">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white hover:bg-blue-600 transition cursor-pointer">f</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white hover:bg-blue-600 transition cursor-pointer">ig</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white hover:bg-blue-600 transition cursor-pointer">tw</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-white hover:bg-blue-600 transition cursor-pointer">yt</span>
              </div>
            </div>

            {/* Col 2: PRODUCT */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">PRODUCT</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><Link href="/trips" className="hover:text-white transition">Itinerary Planner</Link></li>
                <li><Link href="/budget" className="hover:text-white transition">Budget Calculator</Link></li>
                <li><Link href="/calendar" className="hover:text-white transition">Mobile App</Link></li>
                <li><Link href="/budget" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>

            {/* Col 3: COMPANY */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">COMPANY</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>

            {/* Col 4: RESOURCES */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">RESOURCES</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/explore" className="hover:text-white transition">Travel Guides</Link></li>
                <li><Link href="/community" className="hover:text-white transition">Help Center</Link></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              </ul>
            </div>

            {/* Col 5: NEWSLETTER */}
            <div className="lg:col-span-1 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">NEWSLETTER</h4>
              <p className="text-[11px] text-slate-400">Get travel tips & exclusive deals straight to your inbox.</p>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => toast.success('Subscribed!')}
                  className="rounded-xl bg-[#0047FF] px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <span>© 2026 GlobeTrotter. All rights reserved.</span>
            <span>Made with ❤️ for travelers around the world.</span>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* AUTH MODAL POPUP (Login / Sign Up)                           */}
      {/* ============================================================ */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {authModal === 'login' ? 'Welcome back!' : 'Create your GlobeTrotter Account'}
                </h3>
                <p className="text-xs text-slate-500">
                  {authModal === 'login' ? 'Sign in to access your travel itineraries' : 'Start planning personalized multi-city journeys'}
                </p>
              </div>
              <button
                onClick={() => setAuthModal(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authModal === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name:</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Manthan Saraiya"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address:</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. traveler@globetrotter.io"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password:</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#002699] text-xs font-bold text-white shadow-md shadow-blue-950/25 hover:bg-[#001f80] transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authLoading
                  ? 'Connecting...'
                  : authModal === 'login'
                  ? 'Sign In to Dashboard'
                  : 'Create Free Account'}
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              {authModal === 'login' ? (
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModal('signup')}
                    className="font-bold text-[#0047FF] hover:underline cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModal('login')}
                    className="font-bold text-[#0047FF] hover:underline cursor-pointer"
                  >
                    Log in
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
