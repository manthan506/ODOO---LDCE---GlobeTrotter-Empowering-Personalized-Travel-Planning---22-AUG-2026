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
  CheckCircle2,
  Star,
  Globe2,
  ChevronRight,
  ShieldCheck,
  Plane,
  Hotel,
  Clock,
  Heart,
  ExternalLink,
  ChevronDown,
  X,
  Lock,
  Mail,
  User,
  ArrowUpRight,
  Sparkle,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

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
        setAuthModal(null);
        router.push('/dashboard');
      } else {
        await signUp(authEmail, authPassword, { name: authName || 'Traveler' });
        toast.success('Account created! Welcome to GlobeTrotter!');
        setAuthModal(null);
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Authentication error. Demo accounts enabled.');
      // Auto-fallback for demo video
      setAuthModal(null);
      router.push('/dashboard');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* ============================================================ */}
      {/* 1. HEADER & NAVIGATION BAR                                   */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition">
              <Compass size={22} strokeWidth={2.4} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                GlobeTrotter
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Travel Planner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600">
            <Link href="/" className="text-blue-600 font-black">Home</Link>
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#destinations" className="hover:text-slate-900 transition">Destinations</a>
            <Link href="/trips" className="hover:text-slate-900 transition">Itinerary Planner</Link>
            <Link href="/budget" className="hover:text-slate-900 transition">Budget Tracker</Link>
            <Link href="/community" className="hover:text-slate-900 transition">Community</Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Currency / Language Selector */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
              <Globe2 size={14} className="text-slate-400" />
              <span>EN (₹ INR)</span>
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition active:scale-95"
              >
                Go to Dashboard ➔
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAuthModal('login')}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModal('signup')}
                  className="rounded-2xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH ARTWORK & SEARCH WIDGET                 */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white pt-8 pb-16 sm:pt-14 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 border border-blue-200/60 px-3.5 py-1 text-xs font-bold text-blue-700">
                <Plane size={13} className="text-blue-600" />
                Plan Smarter, Travel Better
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Your Journey, <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  Perfectally Planned
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                GlobeTrotter helps you plan multi-city trips, discover amazing places, build personalized itineraries, manage budgets in ₹ INR, and share your adventures with the world.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => (user ? router.push('/trips/new') : setAuthModal('signup'))}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition active:scale-95 cursor-pointer"
                >
                  Plan Your Trip <ArrowRight size={16} />
                </button>
                <a
                  href="#destinations"
                  className="flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Explore Destinations <ArrowUpRight size={15} />
                </a>
              </div>

              {/* Social Proof Avatar Pile */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-3">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                    alt="Traveler"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="Traveler"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                    alt="Traveler"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    alt="Traveler"
                  />
                </div>
                <div className="text-left text-xs font-semibold text-slate-600">
                  <strong className="text-slate-900 font-bold">Join 25,000+</strong> happy travelers who plan with GlobeTrotter
                </div>
              </div>
            </div>

            {/* Right Column: Panoramic Globe Artwork & Floating Cards */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square">
                {/* Globe Artwork with world landmarks (Matching uploaded artwork) */}
                <div className="relative h-full w-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85"
                    alt="Globe Landmarks Montage"
                    className="h-full w-full object-cover scale-105 hover:scale-110 transition duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-transparent" />
                </div>

                {/* Floating Destination Badge: Rome, Italy */}
                <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 p-3 px-4 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3">
                  <img
                    src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=80"
                    alt="Rome"
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Rome, Italy 🇮🇹</h4>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <Star size={11} fill="currentColor" /> 4.9 <span className="text-slate-400 font-normal">(1.8k reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Destination Badge: Swiss Alps */}
                <div className="absolute -top-2 -right-2 sm:top-4 sm:right-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 p-3 px-4 shadow-xl backdrop-blur-md animate-in slide-in-from-top-3">
                  <img
                    src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=200&q=80"
                    alt="Swiss Alps"
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Swiss Alps 🇨🇭</h4>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Glacier Express
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* INTERACTIVE HERO SEARCH WIDGET (Matching image layout)        */}
          {/* ============================================================ */}
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xl">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Where to */}
              <div className="sm:col-span-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 px-4 border border-slate-100">
                <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Where to?</span>
                  <input
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="Search destinations, cities..."
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className="sm:col-span-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 px-4 border border-slate-100">
                <Calendar size={18} className="text-blue-600 flex-shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Travel Dates</span>
                  <input
                    type="text"
                    value={searchDates}
                    onChange={(e) => setSearchDates(e.target.value)}
                    placeholder="e.g. Sep 10 – 28, 2026"
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Travelers Count */}
              <div className="sm:col-span-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3 px-4 border border-slate-100">
                <Users size={18} className="text-blue-600 flex-shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Travelers</span>
                  <input
                    type="text"
                    value={searchTravelers}
                    onChange={(e) => setSearchTravelers(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Search Action */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-95 cursor-pointer"
                >
                  <Search size={15} /> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HORIZONTAL FEATURE HIGHLIGHTS BAR                         */}
      {/* ============================================================ */}
      <section className="border-y border-slate-100 bg-slate-50/70 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Compass, title: 'Multi-City Itineraries', desc: 'Plan complex trips across cities with ease.' },
              { icon: Wallet, title: 'Smart Budgeting', desc: 'Live ₹ INR estimates and cost breakdowns.' },
              { icon: Search, title: 'Discover & Explore', desc: 'Activities, landmarks, and local gems.' },
              { icon: Calendar, title: 'Visual Timelines', desc: 'Beautiful day-wise calendar schedules.' },
              { icon: Users, title: 'Share & Collaborate', desc: 'Real-time multiplayer & public links.' },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-2xs">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                  <feat.icon size={17} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. "EVERYTHING YOU NEED, ALL IN ONE PLACE" SHOWCASE         */}
      {/* ============================================================ */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Feature Highlights */}
            <div className="lg:col-span-5 space-y-6">
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 uppercase tracking-wider border border-blue-200">
                Plan Your Perfect Trip
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Everything you need, <br />
                <span className="text-blue-600">all in one place</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From inspiration to itinerary, GlobeTrotter makes travel planning simple, smart, and exciting with cutting-edge features.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Create & manage unlimited multi-city trips',
                  'Add cities, dates & activities effortlessly',
                  'Get real-time budget estimates & cost breakdowns in ₹ INR',
                  'Beautiful day-wise itinerary views & calendar timelines',
                  'Share plans with friends or clone verified community routes',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link
                  href="/trips"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
                >
                  Explore All 13 Features <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Mockup Showcase (Budget Card + Timeline + Activities) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Budget Overview Mockup */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">Budget Overview</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live ₹ INR</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Budget</span>
                    <p className="text-xl font-black text-slate-900">₹1,52,000</p>
                  </div>
                  <div className="h-14 w-14 rounded-full border-4 border-blue-500 border-t-emerald-400 border-r-indigo-500 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    95%
                  </div>
                </div>
                <div className="space-y-1.5 text-[11px] pt-1">
                  <div className="flex justify-between text-slate-600"><span>✈️ Transport:</span><strong>₹54,000</strong></div>
                  <div className="flex justify-between text-slate-600"><span>🏨 Stays:</span><strong>₹49,000</strong></div>
                  <div className="flex justify-between text-slate-600"><span>🧗 Activities:</span><strong>₹29,000</strong></div>
                  <div className="flex justify-between text-slate-600"><span>🍽️ Meals:</span><strong>₹12,000</strong></div>
                </div>
              </div>

              {/* Card 2: My Europe Trip Itinerary Mockup */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">My Europe Trip</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">14 Days</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">D1-3</span>
                    <span className="font-bold text-slate-800">Paris, France</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white">D4-8</span>
                    <span className="font-bold text-slate-800">Swiss Alps & Glacier</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">D9-12</span>
                    <span className="font-bold text-slate-800">Rome & Vatican City</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. POPULAR DESTINATIONS ("Find your next adventure")         */}
      {/* ============================================================ */}
      <section id="destinations" className="py-16 bg-slate-50/70 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 uppercase tracking-wider border border-blue-200">
                Popular Destinations
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Find your next adventure
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore handpicked destinations loved by travelers worldwide.
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              View All Destinations <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Santorini', country: 'Greece', rating: 4.9, price: 65000, img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
              { name: 'Tokyo', country: 'Japan', rating: 4.9, price: 85000, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
              { name: 'Swiss Alps', country: 'Switzerland', rating: 4.9, price: 95000, img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80' },
              { name: 'Bali', country: 'Indonesia', rating: 4.8, price: 38000, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
              { name: 'New York', country: 'USA', rating: 4.8, price: 72000, img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
            ].map((dest, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-slate-300 transition duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-800 flex items-center gap-1">
                    <Star size={10} className="text-amber-500 fill-amber-500" /> {dest.rating}
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="text-sm font-bold drop-shadow-xs">{dest.name}</h3>
                    <span className="text-[11px] text-slate-200">{dest.country}</span>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">From {formatINR(dest.price)}</span>
                  <Link
                    href={`/explore?q=${dest.name}`}
                    className="font-bold text-blue-600 hover:underline flex items-center gap-0.5 text-[11px]"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. HOW IT WORKS (4 Simple Steps)                             */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-12">
          <div>
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 uppercase tracking-wider border border-blue-200">
              How It Works
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Plan your trip in 4 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Choose Destinations', desc: 'Search and pick the cities and regions you want to visit.' },
              { num: '2', title: 'Build Itinerary', desc: 'Add travel dates, modular sections, and schedule activities.' },
              { num: '3', title: 'Set Budget', desc: 'Get live cost estimates in ₹ INR and manage expenses.' },
              { num: '4', title: 'Share & Go!', desc: 'Share your plan with friends or clone community routes.' },
            ].map((step, i) => (
              <div key={i} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 text-center space-y-3">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white font-black text-base shadow-md shadow-blue-500/20">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TRAVELER TESTIMONIALS & REVIEWS                           */}
      {/* ============================================================ */}
      <section className="py-16 bg-slate-50/70 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
          <div className="text-center">
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 uppercase tracking-wider border border-blue-200">
              Travelers Love GlobeTrotter
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              What our travelers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                loc: 'New York, USA',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
                quote: 'GlobeTrotter made planning our Europe trip so easy! The itinerary builder and budget planner are absolute game changers.',
              },
              {
                name: 'Michael Chen',
                loc: 'Toronto, Canada',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                quote: 'I love how I can discover activities and see the total cost upfront in rupees. Super helpful and beautifully designed!',
              },
              {
                name: 'Priya Sharma',
                loc: 'Mumbai, India',
                img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
                quote: 'Finally, a travel planner that understands multi-city logistics! Sharing trips and copying community itineraries is effortless.',
              },
            ].map((test, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <img src={test.img} alt={test.name} className="h-9 w-9 rounded-full object-cover border border-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{test.name}</h4>
                    <span className="text-[10px] text-slate-400">{test.loc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. TRUSTED PARTNER LOGOS STRIP                               */}
      {/* ============================================================ */}
      <section className="py-10 border-b border-slate-100 bg-white text-center">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-6">
            Trusted by Travelers & Partners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition duration-300">
            <span className="text-lg font-black text-blue-900">Booking.com</span>
            <span className="text-lg font-black text-amber-600">Expedia</span>
            <span className="text-lg font-black text-rose-500">airbnb</span>
            <span className="text-lg font-black text-emerald-600">Tripadvisor</span>
            <span className="text-lg font-black text-sky-500">Skyscanner</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FINAL CALL-TO-ACTION (CTA) BANNER                         */}
      {/* ============================================================ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85"
              alt="Mountain Vista"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />

            <div className="relative z-10 max-w-xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to plan your dream trip?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join thousands of travelers who plan smarter, travel better, and create unforgettable multi-city memories with GlobeTrotter.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => (user ? router.push('/trips/new') : setAuthModal('signup'))}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-blue-500/35 transition active:scale-95 cursor-pointer"
                >
                  Start Planning Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FOOTER                                                   */}
      {/* ============================================================ */}
      <footer className="bg-slate-950 text-slate-400 pt-14 pb-8 border-t border-slate-900 text-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white">
                  <Compass size={18} />
                </div>
                <span className="text-lg font-bold">GlobeTrotter</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Your all-in-one travel planning companion. Plan smarter, travel better, and create unforgettable multi-city memories.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><Link href="/trips" className="hover:text-white">Features</Link></li>
                <li><Link href="/trips" className="hover:text-white">Itinerary Planner</Link></li>
                <li><Link href="/budget" className="hover:text-white">Budget Calculator</Link></li>
                <li><Link href="/calendar" className="hover:text-white">Calendar Timeline</Link></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><Link href="/admin" className="hover:text-white">Admin Dashboard</Link></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
              <p className="text-[11px] text-slate-400">Get travel tips & exclusive deals straight to your inbox.</p>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-white outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => toast.success('Subscribed to GlobeTrotter newsletter!')}
                  className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <span>© 2026 GlobeTrotter. All rights reserved. Hackathon Edition.</span>
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
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition active:scale-98 disabled:opacity-50 cursor-pointer"
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
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
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
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
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
