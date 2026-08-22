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
  Play,
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
  ArrowUpRight,
  Wallet,
  Globe,
  SlidersHorizontal,
  Phone,
  Bookmark,
  Share2,
  CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const isFav = !prev[id];
      if (isFav) toast.success(`Saved ${name} to wishlist! ❤️`);
      else toast.info(`Removed ${name} from wishlist.`);
      return { ...prev, [id]: isFav };
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setShowAuthModal(true);
      toast.info('Sign in to explore customized itineraries for this destination!');
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
    toast.success('Instant Demo Access granted! Redirecting to Dashboard...');
    setShowAuthModal(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. TOP NAVBAR (Matching Inspiration Design)                   */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm group-hover:scale-105 transition">
              <Compass size={20} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none font-serif">
                GlobeTrotter
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Personalized Travel Planning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <Link href="/" className="text-blue-600">Home</Link>
            <button
              type="button"
              onClick={() => {
                if (user) router.push('/explore');
                else setShowAuthModal(true);
              }}
              className="hover:text-slate-900 transition cursor-pointer"
            >
              Destinations
            </button>
            <Link href="/trips" className="hover:text-slate-900 transition">Flight & Routes</Link>
            <Link href="/budget" className="hover:text-slate-900 transition">Budget (₹)</Link>
            <Link href="/community" className="hover:text-slate-900 transition">Community</Link>
            <a href="#contact" className="hover:text-slate-900 transition">Contact Us</a>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition active:scale-95"
              >
                Open Dashboard →
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="rounded-full px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION ("Travel Memories You’ll Never Forget")      */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-700">
              <Sparkles size={13} className="text-blue-600" />
              EMPOWERING PERSONALIZED TRAVEL PLANNING
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Travel Memories <br />
              <span className="text-slate-900">You’ll Never Forget</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Transform the way you plan and experience multi-city journeys with intelligent budgeting in <strong>₹ INR</strong>, modular stops, and shared group collaboration.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (user) router.push('/trips/new');
                  else {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-blue-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
              >
                Find Out More <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={handleDemoInstantLogin}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-white">
                  <Play size={11} fill="white" />
                </div>
                Play Demo
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual with Circular Portal */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-84 h-72 sm:h-84">
              {/* Circular Backdrop Image */}
              <div className="h-full w-full rounded-full overflow-hidden border-8 border-white shadow-2xl bg-gradient-to-tr from-sky-400 to-blue-600 relative">
                <img
                  src="/images/landing-hero-globe.jpg"
                  alt="World Travel Portal"
                  className="h-full w-full object-cover object-center scale-110"
                />
              </div>

              {/* Floating Mini Badge */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 animate-in zoom-in-75">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Cap</span>
                  <p className="text-xs font-black text-slate-900">₹1,60,000 Budget</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SPOTLIGHT DESTINATION CARD (Matching Inspiration Banner)   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 mb-20">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Organic Cutout Image */}
            <div className="lg:col-span-6 relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=80"
                alt="Paris & Swiss Alps Experience"
                className="h-full w-full object-cover hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white">
                Featured Grand Discovery 2026
              </span>
            </div>

            {/* Right Meta Info */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  📍 Location: Europe Route
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Paris, Swiss Alps & Rome Discovery
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  A 14-day multi-city journey with synchronized train passes, alpine chalets, and historic excursions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date</span>
                  <p className="font-bold text-slate-800">25 Sept 2026</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Budget</span>
                  <p className="font-bold text-emerald-600">₹1,52,000 INR</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (user) router.push('/trips');
                    else setShowAuthModal(true);
                  }}
                  className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
                >
                  Preview Itinerary
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (user) router.push('/trips/new');
                    else setShowAuthModal(true);
                  }}
                  className="rounded-xl bg-slate-900 hover:bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Book / Plan Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. "FIND YOUR BEST DESTINATION" SECTION (Matching Design)     */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 mb-24 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Your Best <span className="text-blue-600">Destination</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We have more than 2,000 curated cities and verified experiences you can choose.
          </p>
        </div>

        {/* Centered Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mx-auto max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Destination, City, or Landmark..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-12 text-xs font-bold text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="absolute right-1.5 grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition cursor-pointer"
            >
              <Search size={15} />
            </button>
          </div>
        </form>

        {/* 4 Angled / Tilted Fan Visual Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {[
            { name: 'Amazon Rainforest', sub: 'Brazil', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&q=80', rot: '-rotate-2' },
            { name: 'Swiss Alps Trails', sub: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&q=80', rot: 'rotate-1' },
            { name: 'Santorini Caldera', sub: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&q=80', rot: '-rotate-1' },
            { name: 'Bali Temples', sub: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80', rot: 'rotate-2' },
          ].map((card, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (user) router.push('/explore');
                else setShowAuthModal(true);
              }}
              className={`group relative overflow-hidden rounded-3xl bg-slate-100 p-2 shadow-md hover:scale-105 hover:rotate-0 transition duration-300 cursor-pointer ${card.rot}`}
            >
              <div className="relative h-60 sm:h-72 w-full overflow-hidden rounded-2xl">
                <img
                  src={card.img}
                  alt={card.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-left text-white">
                  <h4 className="text-xs sm:text-sm font-bold truncate drop-shadow-xs">{card.name}</h4>
                  <span className="text-[10px] text-slate-300 font-semibold">{card.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. "BEST VACATION PLAN" SECTION (4 Multi-Stop Cards)          */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 mb-24 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Best <span className="text-blue-600">Vacation Plans</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Plan your perfect vacation with our personalized trip planner. Choose among hundreds of all-inclusive offers!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              id: 'vp-1',
              title: 'Rome, Italy',
              budget: '₹35,000',
              duration: '7 Day Trip',
              rating: '4.9',
              img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&q=80',
            },
            {
              id: 'vp-2',
              title: 'India, Delhi & Agra',
              budget: '₹28,000',
              duration: '7 Day Trip',
              rating: '4.8',
              img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80',
            },
            {
              id: 'vp-3',
              title: 'Swiss Alps & Lakes',
              budget: '₹52,000',
              duration: '7 Day Trip',
              rating: '4.9',
              img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=500&q=80',
            },
            {
              id: 'vp-4',
              title: 'UK, London & Oxford',
              budget: '₹68,000',
              duration: '7 Day Trip',
              rating: '4.8',
              img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80',
            },
          ].map((item) => {
            const isFav = !!favorites[item.id];
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (user) router.push('/trips/new');
                  else setShowAuthModal(true);
                }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-400 hover:shadow-lg transition duration-300 cursor-pointer space-y-3"
              >
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(item.id, item.title, e)}
                    className={`absolute top-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/80 backdrop-blur-md transition ${
                      isFav ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                    }`}
                  >
                    <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="px-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <span className="text-xs font-black text-emerald-600">{item.budget}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Plane size={12} className="text-blue-500" /> {item.duration}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Star size={11} fill="gold" className="text-yellow-400" /> {item.rating}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. "OUR BLOG & STORIES" SECTION (Matching Inspiration Design) */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 mb-24 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our <span className="text-blue-600">Blog</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            An insight into incredible experiences around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="lg:col-span-6 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80"
              alt="Beautiful Kashmir & Glacier Discovery"
              className="h-full w-full object-cover hover:scale-105 transition duration-700"
            />
          </div>

          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-200">
              Expedition Spotlight
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Beautiful Kashmir: Let's Travel The Valleys
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We are ready to help you build and realize the dream trip you always wanted, with our verified expert category recommendations, budget alerts, and interactive day-by-day maps.
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (user) router.push('/community');
                  else setShowAuthModal(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Read more stories →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. "WE MAKE WORLD TRAVEL EASY" FEATURE SHOWCASE              */}
      {/* ============================================================ */}
      <section className="bg-slate-900 text-white py-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="rounded-md bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-400 uppercase tracking-wider">
              Platform Vision & Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              We Make World <br /> Travel Easy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Navigating the globe effortlessly, we transform wanderlust dreams into seamless adventures. With us, the world becomes your accessible playground.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Add & manage multi-city stops and durations modularly',
                'Explore 2,000+ cities & activities with smart filters',
                'Estimate trip budgets in ₹ INR automatically with alerts',
                'Visualize full 7-column calendar timelines & daily flows',
                'Share public itineraries with 1-click community cloning',
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleDemoInstantLogin}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition active:scale-95 cursor-pointer"
              >
                Explore Our Tour Workspace →
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 p-2 max-w-md">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                alt="GlobeTrotter Travel Interface"
                className="h-80 w-full object-cover rounded-2xl opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold">
                  Interactive Timeline & Budget
                </span>
                <h4 className="text-base font-black">Europe Grand Discovery 2026</h4>
                <p className="text-xs text-slate-300">Sep 10 – Sep 28 • ₹1,52,000 Total Estimated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FOOTER (Matching Inspiration Design)                      */}
      {/* ============================================================ */}
      <footer id="contact" className="bg-[#111315] text-slate-400 py-14 px-6 sm:px-8 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm">Powered By</h4>
              <p className="text-xs text-slate-400">GlobeTrotter Inc.</p>
              <p className="text-[11px] text-slate-500">LDCE Hackathon Edition 2026</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-sm">Call Center</h4>
              <p className="text-xs text-slate-400">+91 98765 43210</p>
              <p className="text-[11px] text-slate-500">support@globetrotter.io</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <h4 className="text-white font-bold text-sm">Subscribe to our newsletter</h4>
              <form onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed to travel newsletter!'); }} className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email address..."
                  className="h-10 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 text-xs text-white outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 text-xs font-bold text-white transition flex-shrink-0"
                >
                  Join Now
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 GlobeTrotter. All Rights Reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 9. AUTH POPUP MODAL (Sign In / Sign Up Entry)                */}
      {/* ============================================================ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-5 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-md mb-2">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {authMode === 'login' ? 'Welcome to GlobeTrotter' : 'Create Traveler Account'}
              </h3>
              <p className="text-xs text-slate-500">
                {authMode === 'login'
                  ? 'Sign in to access your itineraries and synchronized budget.'
                  : 'Start planning multi-city journeys with real-time tracking.'}
              </p>
            </div>

            {/* 1-Click Instant Demo Login Banner */}
            <button
              type="button"
              onClick={handleDemoInstantLogin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-xs font-black text-white shadow-md hover:opacity-95 transition active:scale-98 cursor-pointer"
            >
              ⚡ 1-Click Instant Demo Login (Manthan)
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400">Or with email</span>
              <div className="w-full border-t border-slate-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name:</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Manthan Saraiya"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. manthan@globetrotter.io"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password:</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-blue-600 text-xs font-black text-white shadow-md transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? 'Authenticating...' : authMode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>

            {/* Toggle Login / Signup */}
            <div className="pt-2 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
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
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
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
