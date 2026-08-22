'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Shield,
  Users,
  CheckCircle2,
  Plane,
  Hotel,
  Car,
  Ship,
  Search,
  Calendar,
  Wallet,
  Star,
  Globe2,
  Clock,
  ArrowLeftRight,
  TrendingUp,
  Award,
  Layers,
  Heart,
  ChevronRight,
  Check,
  ShieldCheck,
  Headphones,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Search Widget Tabs
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'activities' | 'itineraries'>('flights');
  const [fromCity, setFromCity] = useState('New Delhi, India (DEL)');
  const [toCity, setToCity] = useState('Paris, Interlaken, Rome (Multi-City)');
  const [departDate, setDepartDate] = useState('Sep 10, 2026');
  const [returnDate, setReturnDate] = useState('Sep 28, 2026');
  const [travelers, setTravelers] = useState('2 Adults (₹ INR)');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching customized multi-city routes from ${fromCity} to ${toCity}...`);
    router.push('/explore');
  };

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const AI_SUGGESTIONS = [
    {
      id: 'sug-1',
      name: 'Paris & Swiss Alps',
      country: 'France & Switzerland',
      price: '₹42,000',
      tag: '🔥 Most Popular',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
      link: '/explore?q=Paris',
    },
    {
      id: 'sug-2',
      name: 'Interlaken & Jungfraujoch',
      country: 'Switzerland',
      price: '₹58,000',
      tag: '🏔️ Alpine Peak',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',
      link: '/explore?q=Interlaken',
    },
    {
      id: 'sug-3',
      name: 'Rome & Vatican Treasures',
      country: 'Italy',
      price: '₹35,000',
      tag: '🏛️ Historic',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
      link: '/explore?q=Rome',
    },
    {
      id: 'sug-4',
      name: 'Tropical Bali & Coral Isles',
      country: 'Indonesia',
      price: '₹28,000',
      tag: '🌴 Island Escape',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
      link: '/explore?q=Bali',
    },
    {
      id: 'sug-5',
      name: 'Tokyo & Mount Fuji Bullet Train',
      country: 'Japan',
      price: '₹48,000',
      tag: '⛩️ Modern & Zen',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
      link: '/explore?q=Tokyo',
    },
    {
      id: 'sug-6',
      name: 'Barcelona & Sagrada Familia',
      country: 'Spain',
      price: '₹32,000',
      tag: '🎨 Mediterranean',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
      link: '/explore?q=Barcelona',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. TOP GLOBAL NAVIGATION HEADER                              */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition duration-300">
              <Compass size={24} strokeWidth={2.3} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                GlobeTrotter
              </span>
              <span className="text-[11px] text-blue-400 font-semibold mt-0.5">
                Empowering Travel Planning
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <Link
              href="/"
              className="rounded-xl px-4 py-2 text-xs font-bold text-white bg-white/15 shadow-xs"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              Destinations
            </Link>
            <Link
              href="/trips"
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              Itinerary Builder
            </Link>
            <Link
              href="/budget"
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              Budget (₹)
            </Link>
            <Link
              href="/calendar"
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              Calendar
            </Link>
            <Link
              href="/community"
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              Community
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-95"
              >
                Go to Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition active:scale-95"
                >
                  Get Started Free <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION WITH GLOBAL MONUMENTS & GLASS WIDGET         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
        {/* Background Visual Montage with Global Monuments Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&q=85"
            alt="World Travel Panorama"
            className="h-full w-full object-cover object-center opacity-30 scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
          {/* Subtle glowing orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Pill / Hackathon Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-xl shadow-lg">
              <Sparkles size={14} className="text-amber-400" />
              <span>AI-POWERED PERSONALIZED TRAVEL PLANNER • ODOO 2026 EDITION</span>
            </div>
          </div>

          {/* Hero Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              Explore the World <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                With Total Confidence
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Seamless multi-city travel planning, day-by-day interactive itineraries, real-time <strong className="text-white">₹ INR budget tracking</strong>, and verified community cloning — all in one unified workspace.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/35 transition duration-200 active:scale-95"
              >
                Start Your Journey <ArrowRight size={16} />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition duration-200 active:scale-95"
              >
                <MapPin size={16} className="text-blue-400" /> View Destinations
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* GLASSMORPHIC TRAVEL PLANNER WIDGET (Matching Reference Image)*/}
          {/* ============================================================ */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl border border-white/20 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
            {/* Widget Tabs (Flights, Hotels, Activities, Itineraries) */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('flights')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'flights'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Plane size={15} /> Flights & Routes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'hotels'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Hotel size={15} /> Hotels & Stays
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'activities'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={15} /> Activities & Tours
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('itineraries')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  activeTab === 'itineraries'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass size={15} /> Multi-City Planner
              </button>
            </div>

            {/* Search Input Controls Bar */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* From Input */}
              <div className="sm:col-span-3 rounded-2xl bg-white/5 border border-white/10 p-3 hover:border-white/20 transition">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Origin City
                </span>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-blue-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-white outline-none placeholder:text-slate-500"
                    placeholder="Origin (e.g. Delhi, Mumbai)"
                  />
                </div>
              </div>

              {/* Swap Button (Hidden on Mobile) */}
              <div className="hidden sm:flex sm:col-span-1 justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer"
                  title="Swap Origin & Destination"
                >
                  <ArrowLeftRight size={15} />
                </button>
              </div>

              {/* To Input */}
              <div className="sm:col-span-3 rounded-2xl bg-white/5 border border-white/10 p-3 hover:border-white/20 transition">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Destination / Multi-Stop
                </span>
                <div className="flex items-center gap-2">
                  <Compass size={15} className="text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-white outline-none placeholder:text-slate-500"
                    placeholder="Anywhere / Paris, Alps, Rome"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className="sm:col-span-3 rounded-2xl bg-white/5 border border-white/10 p-3 hover:border-white/20 transition">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Travel Dates
                </span>
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white truncate">
                    {departDate} – {returnDate}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex h-full min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-xs font-black text-white shadow-lg shadow-blue-500/30 transition duration-200 active:scale-95 cursor-pointer"
                >
                  <Search size={16} /> Plan Trip
                </button>
              </div>
            </form>

            {/* AI Suggestions For You Carousel Strip */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>AI SUGGESTIONS FOR YOU</span>
                </div>
                <Link
                  href="/explore"
                  className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  See all destinations <ChevronRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {AI_SUGGESTIONS.map((sug) => (
                  <Link
                    key={sug.id}
                    href={sug.link}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 transition hover:border-blue-400 hover:bg-white/10"
                  >
                    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-slate-800">
                      <img
                        src={sug.image}
                        alt={sug.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white drop-shadow-xs">
                        {sug.price}
                      </span>
                    </div>

                    <div className="mt-2 px-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition">
                        {sug.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate">{sug.country}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TRUST & VALUE BADGES BAR (Matching Reference Image Bottom)   */}
          {/* ============================================================ */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/20 flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Smart ₹ Budget Control</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time daily cap alerts & zero hidden fees</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Interactive Timeline</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Day-by-day drag & reorder schedules</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/20 flex-shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Multiplayer Sharing</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Collaborate live with fellow travelers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/20 flex-shrink-0">
                <Star size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Community Clone</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">1-Click duplicate top verified trips</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. GLOBAL PRESS & EDITORS SOCIAL PROOF (Top 5 Giants)       */}
      {/* ============================================================ */}
      <section className="border-y border-white/10 bg-slate-900/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Award size={16} className="text-amber-400" />
            <span>Recognized by Top Global Tech & Travel Authorities</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition duration-500">
            <div className="text-lg sm:text-xl font-black text-white tracking-tighter">
              TechCrunch
            </div>
            <div className="text-lg sm:text-xl font-serif font-black text-white tracking-tight">
              Forbes
            </div>
            <div className="text-lg sm:text-xl font-serif uppercase tracking-widest text-white">
              Condé Nast
            </div>
            <div className="text-lg sm:text-xl font-sans font-bold tracking-tight text-white">
              NATIONAL GEOGRAPHIC
            </div>
            <div className="text-lg sm:text-xl font-serif italic text-white">
              The New York Times
            </div>
            <div className="text-lg sm:text-xl font-black text-white tracking-tight">
              Bloomberg
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-300">
            🏆 Winner: #1 Travel Tech Platform — Odoo x LDCE Global Hackathon 2026
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FOUR CORE PLATFORM PILLARS (All Clickable to App Screens) */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="rounded-md bg-blue-500/20 text-blue-300 text-xs font-black px-3 py-1 uppercase tracking-wider border border-blue-400/20">
              Powerful Core Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need for Flawless Travel Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore the four integrated modules designed to take you from initial dream to departure day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Builder */}
            <Link
              href="/trips/new"
              className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl hover:border-blue-500 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-400/30 group-hover:scale-110 transition">
                  <Layers size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                  Modular Itinerary Builder
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Construct day-wise trip sections with drag-and-drop city reordering, flight passes, and hotel stays.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400">
                <span>Open Screen 5 / 6</span>
                <ChevronRight size={16} />
              </div>
            </Link>

            {/* Pillar 2: Budget */}
            <Link
              href="/budget"
              className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl hover:border-emerald-500 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-400/30 group-hover:scale-110 transition">
                  <Wallet size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  Live ₹ INR Budget Tracker
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time cost breakdown across flights, stays, activities, and dining with dynamic overbudget alerts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Open Screen 11 (Budget)</span>
                <ChevronRight size={16} />
              </div>
            </Link>

            {/* Pillar 3: Calendar */}
            <Link
              href="/calendar"
              className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl hover:border-purple-500 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-400/30 group-hover:scale-110 transition">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                  Interactive Calendar & Spans
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  7-Column visual calendar grid mapping multi-day trip spans with expandable hourly activity schedules.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Open Screen 11 (Calendar)</span>
                <ChevronRight size={16} />
              </div>
            </Link>

            {/* Pillar 4: Community */}
            <Link
              href="/community"
              className="group rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl hover:border-amber-500 hover:shadow-2xl transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-400/30 group-hover:scale-110 transition">
                  <Globe2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                  Community Public Itineraries
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse verified public itineraries shared by top explorers and duplicate complete plans in 1-click.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Open Screen 10 (Community)</span>
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. VERIFIED REVIEWS & USER TESTIMONIALS                     */}
      {/* ============================================================ */}
      <section className="border-t border-white/10 bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
              Community Voices
            </span>
            <h2 className="text-3xl font-extrabold text-white">Loved by Travelers Worldwide</h2>
            <p className="text-xs text-slate-400">Read what adventurers and digital nomads say about GlobeTrotter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The multi-city split budgeting in ₹ INR saved our group trip to Switzerland and Paris! We caught the overbudget alert on Day 4 and adjusted ahead of time."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
                  alt="Elena"
                  className="h-10 w-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Elena Rostova</h4>
                  <span className="text-[10px] text-slate-400">Adventure Photographer</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Cloning itineraries from the community tab makes planning 10x faster. I duplicated Manthan’s European Grand Discovery and customized it in 5 minutes."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                  alt="Kenji"
                  className="h-10 w-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Kenji Sato</h4>
                  <span className="text-[10px] text-slate-400">Cultural Travel Specialist</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The visual calendar with activity times is better than Google Sheets and Notion combined. Zero confusion on transfer days between cities."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
                  alt="Aarav"
                  className="h-10 w-10 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Aarav Patel</h4>
                  <span className="text-[10px] text-slate-400">Solo Explorer & Nomad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. CALL TO ACTION BANNER                                     */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Plan Your Next Epic Journey?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of travelers designing smarter, unforgettable multi-city itineraries with GlobeTrotter.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/35 transition duration-200 active:scale-95"
            >
              Create Your Free Itinerary <ArrowRight size={16} />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/15 px-8 py-4 text-sm font-bold text-white transition active:scale-95"
            >
              Explore Public Trips
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. COMPREHENSIVE FOOTER                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
                  <Compass size={20} />
                </div>
                <span className="text-base font-bold text-white">GlobeTrotter</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Empowering personalized multi-city travel planning, collaborative group budgets, and curated global experiences.
              </p>
              <span className="inline-block text-[11px] text-slate-500">
                ODDO X L.D College Hackathon • August 22, 2026
              </span>
            </div>

            {/* Product Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Product</h4>
              <ul className="space-y-1.5">
                <li><Link href="/trips" className="hover:text-white transition">Itinerary Builder</Link></li>
                <li><Link href="/budget" className="hover:text-white transition">Budget Tracker (₹)</Link></li>
                <li><Link href="/calendar" className="hover:text-white transition">Visual Calendar</Link></li>
                <li><Link href="/explore" className="hover:text-white transition">Activity Search</Link></li>
                <li><Link href="/community" className="hover:text-white transition">Community Sharing</Link></li>
              </ul>
            </div>

            {/* Top Destinations */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Destinations</h4>
              <ul className="space-y-1.5">
                <li><Link href="/explore?q=Paris" className="hover:text-white transition">Paris, France</Link></li>
                <li><Link href="/explore?q=Interlaken" className="hover:text-white transition">Swiss Alps</Link></li>
                <li><Link href="/explore?q=Rome" className="hover:text-white transition">Rome, Italy</Link></li>
                <li><Link href="/explore?q=Tokyo" className="hover:text-white transition">Tokyo, Japan</Link></li>
                <li><Link href="/explore?q=Bali" className="hover:text-white transition">Bali, Indonesia</Link></li>
              </ul>
            </div>

            {/* Platform & Admin */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="space-y-1.5">
                <li><Link href="/profile" className="hover:text-white transition">User Profile</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">Admin & Analytics</Link></li>
                <li><Link href="/login" className="hover:text-white transition">Member Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition">Sign Up Free</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 GlobeTrotter Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Made with ❤️ by Manthan Saraiya</span>
              <span>•</span>
              <Link href="/dashboard" className="text-blue-400 hover:underline">
                Open App Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
