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
  ChevronLeft,
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
  Plus,
  Send,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const { masterTrip, totalCalculatedCost, userProfile, addSavedDestination } = useTripSync();
  const router = useRouter();

  // Search Bar State
  const [destinationQuery, setDestinationQuery] = useState('');
  const [travelDates, setTravelDates] = useState('Sep 10 – Sep 28, 2026');
  const [travelersCount, setTravelersCount] = useState('2 Travelers');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationQuery) {
      toast.success(`Exploring destinations matching "${destinationQuery}"!`);
    }
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

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & NAVBAR (Exact Mockup Match)                  */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Compass size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              GlobeTrotter
            </span>
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="text-blue-600 font-bold">
              Home
            </Link>
            <Link href="#features" className="hover:text-slate-900 transition">
              Features
            </Link>
            <Link href="/explore" className="hover:text-slate-900 transition">
              Destinations
            </Link>
            <Link href="/trips" className="hover:text-slate-900 transition">
              Itinerary Planner
            </Link>
            <Link href="/budget" className="hover:text-slate-900 transition">
              Pricing & Budget (₹)
            </Link>
            <Link href="/community" className="hover:text-slate-900 transition">
              Community
            </Link>
          </nav>

          {/* Right Language & Auth Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl px-2.5 py-1.5 hover:bg-slate-50 cursor-pointer">
              <Globe2 size={14} className="text-slate-500" />
              <span>EN (₹ INR)</span>
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95"
              >
                Dashboard ➔
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="rounded-xl border border-slate-300 hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="rounded-xl bg-[#0f172a] hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH EXACT SPLIT ARTWORK & FLOATING SEARCH   */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-8 pb-16 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* LEFT HERO TEXT COLUMN */}
            <div className="lg:col-span-6 space-y-5 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold text-blue-600 shadow-2xs">
                <Plane size={13} className="text-blue-600" />
                <span>Plan Smarter, Travel Better</span>
              </div>

              {/* Main Headline matching mockup */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Your Journey, <br />
                <span className="text-blue-600">Perfectly</span> Planned
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
                GlobeTrotter helps you plan multi-city trips, discover amazing places, build personalized itineraries, manage budgets in ₹ INR, and share your adventures with the world.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 px-5 py-3 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
                >
                  Plan Your Trip <ArrowUpRight size={15} />
                </button>

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-700 shadow-2xs transition"
                >
                  Explore Destinations <ArrowUpRight size={15} />
                </Link>
              </div>

              {/* Social Proof with traveler avatars */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                    alt="Traveler"
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="Traveler"
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                    alt="Traveler"
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Join <strong className="text-slate-900 font-bold">25,000+</strong> happy travelers who plan smarter with GlobeTrotter.
                </p>
              </div>
            </div>

            {/* RIGHT ARTWORK COLUMN: Exact Globe with Iconic Monuments Artwork */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-lg aspect-square">
                {/* Globe + Monuments Artwork (Hero Image) */}
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&q=85"
                  alt="World Monuments Panorama"
                  className="h-full w-full object-cover rounded-3xl shadow-2xl border-4 border-white"
                />

                {/* Floating Destination Badge: Rome, Italy (as in mockup) */}
                <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
                  <img
                    src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=150&q=80"
                    alt="Rome"
                    className="h-11 w-11 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-slate-900">Rome, Italy</h4>
                      <span className="text-[10px] text-blue-600 font-bold">📍</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex text-amber-400 text-[10px]">
                        ★★★★★
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">4.8 (1.2k reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* FLOATING SEARCH WIDGET PILL BAR (Exact Mockup Match)         */}
          {/* ============================================================ */}
          <div className="mt-10 mx-auto max-w-5xl rounded-2xl bg-white p-3 sm:p-4 shadow-xl border border-slate-200/80">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Field 1: Where to? */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <Search size={18} className="text-blue-600 flex-shrink-0" />
                <div className="w-full">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Where to?
                  </span>
                  <input
                    type="text"
                    value={destinationQuery}
                    onChange={(e) => setDestinationQuery(e.target.value)}
                    placeholder="Search destinations, cities..."
                    className="w-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Field 2: Travel Dates */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <Calendar size={18} className="text-indigo-600 flex-shrink-0" />
                <div className="w-full">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Travel Dates
                  </span>
                  <input
                    type="text"
                    value={travelDates}
                    onChange={(e) => setTravelDates(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Field 3: Travelers */}
              <div className="sm:col-span-2 flex items-center gap-3 px-3 py-2">
                <User size={18} className="text-emerald-600 flex-shrink-0" />
                <div className="w-full">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Travelers
                  </span>
                  <input
                    type="text"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0b2144] hover:bg-blue-900 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Search size={14} /> Search
                </button>
              </div>
            </form>
          </div>

          {/* ============================================================ */}
          {/* 5 VALUE PROPOSITION ICONS STRIP (Exact Mockup Match)         */}
          {/* ============================================================ */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 text-left">
            <div className="flex items-start gap-3 p-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Compass size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Multi-city Itineraries</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Plan complex trips with ease across multiple cities.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Wallet size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Smart Budgeting</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Get real-time cost estimates and budget breakdowns in ₹ INR.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Search size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Discover & Explore</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Find activities, attractions, and hidden gems.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Visual Itineraries</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">See your trip come to life with beautiful timelines.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                <Share2 size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Share & Collaborate</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Share plans and collaborate with friends & family.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. "EVERYTHING YOU NEED, ALL IN ONE PLACE" FEATURE SHOWCASE   */}
      {/* (Exact Mockup Match: Left Checklist + Right 3 Floating Cards) */}
      {/* ============================================================ */}
      <section id="features" className="py-20 bg-slate-50/60 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Description & Checklist */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  Plan Your Perfect Trip
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Everything you need, <br />
                  all in one place
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  From inspiration to itinerary, GlobeTrotter makes travel planning simple, smart, and exciting.
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-3 pt-2">
                {[
                  'Create & manage unlimited trips',
                  'Add cities, dates & activities effortlessly',
                  'Get budget estimates & cost breakdowns (in ₹ INR)',
                  'Beautiful day-wise itinerary views',
                  'Share plans with friends or make it public',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/trips"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition"
                >
                  Explore All Features <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right UI Showcase Cards (Budget Donut + Itinerary Flow + Activities) */}
            <div className="lg:col-span-7 relative flex flex-col md:flex-row items-center justify-center gap-4">
              {/* Mini Card 1: Budget Overview Donut */}
              <div className="w-full md:w-48 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg space-y-3 flex-shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Budget Overview
                </span>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Total Budget</span>
                  <p className="text-base font-black text-slate-900">₹1,52,000</p>
                </div>
                {/* SVG Mini Donut */}
                <div className="relative h-20 w-20 mx-auto">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="35 100" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="32 100" strokeDashoffset="-35" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="19 100" strokeDashoffset="-67" />
                  </svg>
                </div>
                <div className="space-y-1 text-[9px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Flights</span>
                    <span className="font-bold">₹54,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Stays</span>
                    <span className="font-bold">₹49,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Activities</span>
                    <span className="font-bold">₹29,000</span>
                  </div>
                </div>
              </div>

              {/* Main Card 2: My Europe Trip Itinerary */}
              <div className="w-full md:w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">My Europe Trip</h4>
                    <span className="text-[9px] text-slate-400 font-semibold">Sep 10 – Sep 28, 2026 • 18 Days</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                    Published
                  </span>
                </div>

                {/* Day stops matching mockup */}
                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 1 – 3</span>
                      <span className="text-slate-700">Paris, France</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=80" alt="Paris" className="h-7 w-9 rounded object-cover" />
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 4 – 6</span>
                      <span className="text-slate-700">Rome, Italy</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=100&q=80" alt="Rome" className="h-7 w-9 rounded object-cover" />
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 7 – 9</span>
                      <span className="text-slate-700">Barcelona, Spain</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1583422409516-2895a77efded?w=100&q=80" alt="Barcelona" className="h-7 w-9 rounded object-cover" />
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-bold text-blue-600 block">Day 10 – 12</span>
                      <span className="text-slate-700">Swiss Alps, Switzerland</span>
                    </div>
                    <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=100&q=80" alt="Swiss Alps" className="h-7 w-9 rounded object-cover" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/trips')}
                  className="w-full py-1.5 rounded-lg border border-dashed border-blue-400 text-blue-600 text-[10px] font-bold hover:bg-blue-50 transition"
                >
                  + Add New Stop
                </button>
              </div>

              {/* Mini Card 3: Top Activities in Rome */}
              <div className="w-full md:w-48 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-lg space-y-2.5 flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-900 block">
                  Top Activities in Rome
                </span>
                <div className="space-y-1.5 text-[9px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <div className="flex items-center gap-1.5">
                      <img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=50&q=80" className="h-5 w-5 rounded object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">Colosseum Tour</p>
                        <span className="text-[8px] text-slate-400">3 hrs</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹3,500</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <div className="flex items-center gap-1.5">
                      <img src="https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=50&q=80" className="h-5 w-5 rounded object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">Vatican Museums</p>
                        <span className="text-[8px] text-slate-400">4 hrs</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹4,200</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src="https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=50&q=80" className="h-5 w-5 rounded object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">Trevi Fountain</p>
                        <span className="text-[8px] text-slate-400">1 hr</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">Free</span>
                  </div>
                </div>

                <Link
                  href="/explore"
                  className="block text-center w-full py-1.5 rounded-lg bg-[#0b2144] text-white text-[9px] font-bold hover:bg-blue-900 transition"
                >
                  Add Activity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. "POPULAR DESTINATIONS: FIND YOUR NEXT ADVENTURE"          */}
      {/* (Exact Mockup Match: 5 Destination Cards with starting price)*/}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
                Popular Destinations
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
                Find your next adventure
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore handpicked destinations loved by travelers worldwide.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                View All Destinations <ChevronRight size={14} />
              </Link>
              <div className="flex items-center gap-1">
                <button className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                  <ChevronLeft size={16} />
                </button>
                <button className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 5 Destination Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { id: 'd-1', name: 'Santorini, Greece', rating: '4.9', price: '₹62,000', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
              { id: 'd-2', name: 'Tokyo, Japan', rating: '4.9', price: '₹74,000', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
              { id: 'd-3', name: 'Swiss Alps, Switzerland', rating: '4.9', price: '₹75,000', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80' },
              { id: 'd-4', name: 'Bali, Indonesia', rating: '4.7', price: '₹48,000', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
              { id: 'd-5', name: 'New York, USA', rating: '4.8', price: '₹89,000', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
            ].map((dest) => (
              <div
                key={dest.id}
                onClick={() => router.push('/explore')}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm hover:shadow-md hover:border-blue-300 transition duration-300 cursor-pointer"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={dest.img}
                    alt={dest.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-slate-900 shadow-2xs">
                    <Star size={10} className="text-amber-500 fill-amber-500" /> {dest.rating}
                  </span>
                </div>
                <div className="mt-2.5 px-1 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{dest.name}</h4>
                    <span className="text-[10px] text-slate-400">Starting from</span>
                  </div>
                  <span className="text-xs font-black text-blue-600">{dest.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. "PLAN YOUR TRIP IN 4 SIMPLE STEPS" HOW IT WORKS           */}
      {/* (Exact Mockup Match: Horizontal sequence with 4 step pills)  */}
      {/* ============================================================ */}
      <section className="py-18 bg-blue-50/40 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
              How It Works
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Plan your trip in 4 simple steps
            </h2>
          </div>

          {/* 4 Step Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-2xs">
                <Compass size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Choose Destinations</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Search and pick the cities you want to visit on your adventure.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-2xs">
                <Calendar size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Build Itinerary</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Add dates, activities and organize your trip with drag-to-reorder.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 shadow-2xs">
                <Wallet size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Set Budget</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Get real-time ₹ INR cost estimates and manage your daily limits.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-600 mb-3 shadow-2xs">
                <Send size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">4. Share & Go!</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Share your plan with friends and start your personalized journey!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. "TRAVELERS LOVE GLOBETROTTER: WHAT OUR TRAVELERS SAY"     */}
      {/* (Exact Mockup Match: 3 Testimonial Cards + Rating)           */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 block">
              Travelers Love GlobeTrotter
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              What our travelers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Review 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-slate-300 transition">
              <span className="text-2xl text-blue-600 font-serif leading-none">“</span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                GlobeTrotter made planning our Europe trip so easy! The itinerary builder and budget planner are complete game changers.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"
                    alt="Sarah"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sarah Johnson</h4>
                    <span className="text-[10px] text-slate-400">New York, USA</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-500">5.0 ★</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-slate-300 transition">
              <span className="text-2xl text-blue-600 font-serif leading-none">“</span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                I love how I can discover activities and see the total cost upfront in rupees. Super helpful, fast, and beautifully designed!
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"
                    alt="Michael"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Michael Chen</h4>
                    <span className="text-[10px] text-slate-400">Toronto, Canada</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-500">5.0 ★</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-slate-300 transition">
              <span className="text-2xl text-blue-600 font-serif leading-none">“</span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Finally, a travel planner that understands multi-city travelers! Sharing trips with friends in one click is so convenient.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
                    alt="Priya"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Priya Sharma</h4>
                    <span className="text-[10px] text-slate-400">Mumbai, India</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-500">5.0 ★</span>
              </div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="h-2 w-5 rounded-full bg-blue-600" />
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="h-2 w-2 rounded-full bg-slate-200" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TRUSTED PARTNERS STRIP (Exact Mockup Match)               */}
      {/* ============================================================ */}
      <section className="py-8 bg-slate-50 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Trusted By Travelers & Partners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition duration-300">
            <span className="text-base sm:text-lg font-black tracking-tight text-blue-900">Booking.com</span>
            <span className="text-base sm:text-lg font-black tracking-tight text-amber-600">Expedia</span>
            <span className="text-base sm:text-lg font-black tracking-tight text-rose-500">airbnb</span>
            <span className="text-base sm:text-lg font-black tracking-tight text-emerald-600">Tripadvisor</span>
            <span className="text-base sm:text-lg font-black tracking-tight text-sky-600">Skyscanner</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. "READY TO PLAN YOUR DREAM TRIP?" CALL TO ACTION BANNER     */}
      {/* (Exact Mockup Match: Mountain traveler background banner)    */}
      {/* ============================================================ */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
          {/* Background image of mountain traveler */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=85"
              alt="Hiker overlooking mountains"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/70 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 max-w-xl text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Ready to plan your dream trip?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Join thousands of travelers who plan smarter, travel better, and turn travel dreams into effortless realities.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openAuth('signup')}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 text-xs font-black shadow-lg transition active:scale-95 cursor-pointer"
              >
                Start Planning Now <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. DARK FOOTER (Exact Mockup Match)                          */}
      {/* ============================================================ */}
      <footer className="bg-[#0b172a] text-white pt-14 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 text-xs">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
                <Compass size={18} />
              </div>
              <span className="text-base font-extrabold text-white">GlobeTrotter</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your all-in-one travel planning companion. Plan smarter, travel better, create unforgettable memories.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-1">
              <span className="hover:text-white cursor-pointer">f</span>
              <span className="hover:text-white cursor-pointer">📸</span>
              <span className="hover:text-white cursor-pointer">🐦</span>
              <span className="hover:text-white cursor-pointer">▶</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/trips" className="hover:text-white transition">Itinerary Planner</Link></li>
              <li><Link href="/budget" className="hover:text-white transition">Budget Calculator</Link></li>
              <li><Link href="/explore" className="hover:text-white transition">City Discovery</Link></li>
              <li><Link href="/budget" className="hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/profile" className="hover:text-white transition">About Us</Link></li>
              <li><span className="hover:text-white cursor-pointer">Careers</span></li>
              <li><span className="hover:text-white cursor-pointer">Blog</span></li>
              <li><span className="hover:text-white cursor-pointer">Press Kit</span></li>
              <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/community" className="hover:text-white transition">Travel Guides</Link></li>
              <li><span className="hover:text-white cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer">FAQs</span></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Get travel tips & exclusive deals straight to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) {
                  toast.success('Subscribed for deal alerts in ₹ INR!');
                  setNewsletterEmail('');
                }
              }}
              className="relative flex items-center"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-10 w-full rounded-xl bg-slate-800/90 border border-slate-700 px-3 pr-10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 grid h-7 w-7 place-items-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>© 2026 GlobeTrotter. All rights reserved.</span>
          <span>Made with ❤️ for travelers around the world.</span>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 10. INTERACTIVE SIGN-IN / SIGN-UP MODAL POPUP                */}
      {/* ============================================================ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {authMode === 'login' ? 'Welcome Back 👋' : 'Create Free Account 🌍'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'login' ? 'Access your personalized itineraries' : 'Start planning your multi-city journey in minutes'}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick 1-Click Demo Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-black text-white shadow-md shadow-blue-500/25 transition active:scale-98 cursor-pointer"
            >
              ⚡ Instant 1-Click Demo Sign In
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400">
                Or Continue With Email
              </span>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Manthan Saraiya"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. traveler@globetrotter.io"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0f172a] hover:bg-slate-800 text-white py-3 text-xs font-black transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? 'Signing In...' : authMode === 'login' ? 'Log In to Account' : 'Sign Up Free'}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-blue-600 hover:underline"
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
                    className="font-bold text-blue-600 hover:underline"
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
