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
  Search,
  Star,
  ShieldCheck,
  Clock,
  Heart,
  ChevronRight,
  Play,
  PhoneCall,
  Mail,
  Lock,
  User as UserIcon,
  X,
  Eye,
  EyeOff,
  Globe,
  ExternalLink,
  BookOpen,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LandingPage() {
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // Search in Section 3
  const [destSearch, setDestSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'all' | 'mountains' | 'beach' | 'culture'>('all');

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Video / Demo Tour Modal
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Hotel Preview Modal
  const [showHotelModal, setShowHotelModal] = useState(false);

  // Blog Story Modal
  const [showBlogModal, setShowBlogModal] = useState(false);

  // Newsletter email
  const [newsletterEmail, setNewsletterEmail] = useState('');

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

  const handleProtectedAction = (targetUrl: string) => {
    if (user) {
      router.push(targetUrl);
    } else {
      setShowAuthModal(true);
      toast.info('Please sign in or create an account to proceed!');
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success(`Subscribed ${newsletterEmail} to GlobeTrotter travel insights! 📬`);
    setNewsletterEmail('');
  };

  // Section 3 Cards Data
  const DESTINATION_CARDS = [
    {
      id: 'dc-1',
      name: 'Alpine High Peaks',
      country: 'Switzerland',
      category: 'mountains',
      tag: 'Glacier Express',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
      rotation: '-rotate-2',
    },
    {
      id: 'dc-2',
      name: 'Amazon Rainforest',
      country: 'Brazil / Peru',
      category: 'beach',
      tag: 'Amazon Wildlife',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
      rotation: 'rotate-1',
    },
    {
      id: 'dc-3',
      name: 'Santorini Sunset Villas',
      country: 'Greece',
      category: 'beach',
      tag: 'Aegean Heritage',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
      rotation: '-rotate-1',
    },
    {
      id: 'dc-4',
      name: 'Himalayan Ridge Trails',
      country: 'India / Nepal',
      category: 'mountains',
      tag: 'High Mountain Pass',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
      rotation: 'rotate-2',
    },
  ];

  const filteredDestCards = DESTINATION_CARDS.filter((c) => {
    if (selectedCategoryTab !== 'all' && c.category !== selectedCategoryTab) return false;
    if (destSearch.trim()) {
      const q = destSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    }
    return true;
  });

  // Section 4 Vacation Packages Data
  const VACATION_PLANS = [
    {
      id: 'vp-1',
      title: 'Rome, Italy',
      price: '₹74.5k',
      duration: '7 Day Trip',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    },
    {
      id: 'vp-2',
      title: 'India, Delhi & Jaipur',
      price: '₹38.5k',
      duration: '7 Day Trip',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    },
    {
      id: 'vp-3',
      title: 'USA, Chicago & NYC',
      price: '₹85.0k',
      duration: '7 Day Trip',
      rating: '4.8',
      image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80',
    },
    {
      id: 'vp-4',
      title: 'UK, London & Scotland',
      price: '₹78.0k',
      duration: '7 Day Trip',
      rating: '4.9',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ============================================================ */}
      {/* 1. TOP HEADER (Matching Wireframe Mockup)                     */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <Compass size={20} strokeWidth={2.2} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              GlobeTrotter
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <Link href="/" className="text-blue-600 transition">
              Home
            </Link>
            <a href="#destinations" className="hover:text-blue-600 transition">
              Destination
            </a>
            <a href="#plans" className="hover:text-blue-600 transition">
              Flight & Stays
            </a>
            <a href="#planner" className="hover:text-blue-600 transition">
              Booking
            </a>
            <a href="#blog" className="hover:text-blue-600 transition">
              Blog
            </a>
            <a href="#contact" className="hover:text-blue-600 transition">
              Contact Us
            </a>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
              >
                Dashboard <ArrowRight size={13} />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="rounded-full px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="rounded-full bg-slate-900 hover:bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. SECTION 1: HERO ("Travel Memories You'll Never Forget")    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Travel Memories <br />
              You'll Never Forget
            </h1>

            <p className="max-w-lg text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
              Empowering personalized travel planning with multi-city stop management, automated <strong>₹ INR</strong> budget estimates, and synchronized interactive schedules.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => handleProtectedAction('/trips/new')}
                className="rounded-xl bg-slate-900 hover:bg-blue-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition duration-300 active:scale-95 cursor-pointer"
              >
                Find Out More
              </button>

              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-blue-600">
                  <Play size={11} fill="currentColor" />
                </div>
                Play Demo
              </button>
            </div>
          </div>

          {/* Right Column: Hero Traveler Circle with World Landmarks */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative h-[340px] w-[340px] sm:h-[440px] sm:w-[440px]">
              {/* Circular Backdrop with Landmarks collage */}
              <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl shadow-blue-500/15">
                <img
                  src="/images/landing-hero-globe.jpg"
                  alt="Travel Memories Worldwide"
                  className="h-full w-full object-cover scale-110"
                />
              </div>

              {/* Floating Traveler Accent */}
              <div className="absolute -top-4 -right-4 rounded-2xl bg-white p-3.5 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3 animate-bounce-slow">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Budget</span>
                  <span className="text-xs font-black text-slate-900">100% Synced ₹</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SECTION 2: FEATURED DESTINATION & QUICK BOOK CARD         */}
      {/* ============================================================ */}
      <section id="planner" className="py-12 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Organic Brush Cut Image */}
          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-3xl shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
                alt="Tropical Island"
                className="h-full w-full object-cover hover:scale-105 transition duration-700"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
                Featured Escape
              </span>
            </div>
          </div>

          {/* Right Selector Meta */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <h4 className="text-base font-bold text-slate-900">Arizona, Phoenix / Amalfi Coast</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar size={13} className="text-slate-400" /> 25 Sept 2026
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Price</span>
                  <p className="text-xs sm:text-sm font-black text-emerald-600 mt-0.5">
                    ₹35,000 – ₹52,000
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowHotelModal(true)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
              >
                Preview Hotel
              </button>
              <button
                type="button"
                onClick={() => handleProtectedAction('/trips/new')}
                className="rounded-xl bg-slate-900 hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SECTION 3: "FIND YOUR BEST DESTINATION"                   */}
      {/* ============================================================ */}
      <section id="destinations" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your <span className="text-blue-600">Best</span> Destination
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            We have more than 2000 destinations and personalized experiences you can choose from.
          </p>

          {/* Search Box with icon */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400" size={16} />
              <input
                type="text"
                value={destSearch}
                onChange={(e) => setDestSearch(e.target.value)}
                placeholder="Search Destination e.g. Alps, Amazon, Greece..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-24 text-xs font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm"
              />
              <button
                type="button"
                onClick={() => handleProtectedAction('/explore')}
                className="absolute right-2 grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition cursor-pointer"
              >
                <Search size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Tilted Modern Photo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {filteredDestCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleProtectedAction('/explore')}
              className={`group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer ${card.rotation}`}
            >
              <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-sm font-bold text-white drop-shadow-md">
                  {card.tag}
                </span>
              </div>
              <div className="p-3 text-left">
                <h4 className="text-sm font-bold text-slate-900">{card.name}</h4>
                <span className="text-xs text-slate-400">{card.country}</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => handleProtectedAction('/explore')}
            className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            See more destinations <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SECTION 4: "BEST VACATION PLAN"                          */}
      {/* ============================================================ */}
      <section id="plans" className="py-16 px-6 sm:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              <span className="text-blue-600">Best</span> Vacation Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Plan your perfect vacation with our travel planner. Choose among hundreds of all-inclusive packages!
            </p>
          </div>

          {/* 4 Vacation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VACATION_PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleProtectedAction('/trips/new')}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-xl hover:border-blue-300 transition duration-300 cursor-pointer space-y-3"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {plan.price}
                  </span>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900">{plan.title}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">{plan.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={13} fill="currentColor" /> {plan.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={() => handleProtectedAction('/trips')}
              className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              See more vacation plans <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SECTION 5: "OUR BLOG"                                    */}
      {/* ============================================================ */}
      <section id="blog" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            <span className="text-blue-600">Our</span> Blog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            An insight into incredible travel experiences around the world.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl shadow-md">
              <img
                src="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80"
                alt="Kashmir Valley"
                className="h-full w-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              Traveler Story
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Beautiful Kashmir: Let's Travel
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We are ready to help you build and realize the dream journey that you envisioned, with recommendations from top travelers and real-time expense tracking.
            </p>
            <button
              type="button"
              onClick={() => setShowBlogModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 pt-2 cursor-pointer"
            >
              Read more →
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. SECTION 6: "WE MAKE WORLD TRAVEL EASY"                   */}
      {/* ============================================================ */}
      <section className="py-16 px-6 sm:px-12 bg-blue-50/50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              We Make World <br />
              Travel Easy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
              Navigating the globe effortlessly, we transform wanderlust dreams into seamless adventures. With us, the world becomes your accessible playground — travel simplified.
            </p>
            <button
              type="button"
              onClick={() => handleProtectedAction('/trips/new')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-2 cursor-pointer"
            >
              Explore Our Tour →
            </button>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="relative h-64 sm:h-72 w-full max-w-md overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1508672019048-805b876b67e2?w=800&q=80"
                alt="Smartphone Travel View"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <span className="text-xs font-bold text-white">
                  GlobeTrotter Mobile Itinerary Sync
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FOOTER (Matching Wireframe Mockup)                        */}
      {/* ============================================================ */}
      <footer id="contact" className="bg-[#11161F] py-14 px-6 sm:px-12 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Compass size={18} className="text-blue-500" />
              <span className="text-base font-bold">GlobeTrotter</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Empowering personalized travel planning with shared expenses and smart budgeting.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Call Center</h4>
            <p className="text-[11px] text-slate-400">International: +1 (800) 456-7890</p>
            <p className="text-[11px] text-slate-400">Support: support@globetrotter.io</p>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Subscribe to our newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5 pt-1">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Email address..."
                className="h-9 w-full rounded-xl bg-slate-800 border border-slate-700 px-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="h-9 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 transition flex-shrink-0 cursor-pointer"
              >
                Join Now
              </button>
            </form>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Download our mobile app</h4>
            <p className="text-[11px] text-slate-400">Available on iOS & Android Web App.</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
          <span>© 2026 GlobeTrotter Inc. All Rights Reserved.</span>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-white">Twitter/X</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Facebook</a>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 9. SIGN IN / SIGN UP MODAL (Seamless Auth Gate)              */}
      {/* ============================================================ */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-5 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1.5">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-2">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {authMode === 'login' ? 'Sign In to GlobeTrotter' : 'Create Traveler Account'}
              </h3>
              <p className="text-xs text-slate-500">
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-10 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-black text-white shadow-lg shadow-blue-500/30 transition active:scale-98 disabled:opacity-50 cursor-pointer"
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

      {/* ============================================================ */}
      {/* 10. DEMO TOUR MODAL                                          */}
      {/* ============================================================ */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl text-left space-y-4 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                Interactive Tour
              </span>
              <h3 className="text-lg font-bold text-slate-900">Explore GlobeTrotter Features</h3>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-900 relative h-48">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                alt="Demo Preview"
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <span className="font-black text-sm">Full Itinerary & Budget Workspace</span>
                <p className="text-xs text-slate-200 mt-1 max-w-xs">
                  Multi-city stop management, 7-column calendar, and itemized ₹ INR expense logs.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDemoModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDemoInstantLogin}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Start Live Demo Workspace →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 11. HOTEL PREVIEW MODAL                                      */}
      {/* ============================================================ */}
      {showHotelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl text-left space-y-4 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowHotelModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-slate-900">Featured Hotel & Resort Preview</h3>
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
              alt="Luxury Villa"
              className="h-44 w-full rounded-2xl object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Amalfi Cliffside Boutique Lodge</h4>
              <p className="text-xs text-slate-500 mt-1">
                Panoramic Mediterranean balcony, private terrace breakfasts, and fast-track boat transfers.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-black text-emerald-600">₹14,500 / night</span>
              <button
                type="button"
                onClick={() => {
                  setShowHotelModal(false);
                  handleProtectedAction('/trips/new');
                }}
                className="rounded-xl bg-slate-900 text-white text-xs font-bold px-4 py-2"
              >
                Add to Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 12. BLOG STORY MODAL                                         */}
      {/* ============================================================ */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-2xl text-left space-y-4 animate-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowBlogModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
              Curated Travel Guide
            </span>
            <h3 className="text-lg font-bold text-slate-900">Beautiful Kashmir & Alpine Journeys</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From the Shikara rides across Dal Lake to the snow-capped gondolas of Gulmarg, planning a multi-stop itinerary requires coordinating daily caps, driver bookings, and acclimatization days.
            </p>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CheckCircle2 size={14} className="text-blue-600" /> Key Takeaway for Planners:
              </div>
              <p className="text-[11px] text-slate-500">
                GlobeTrotter auto-allocates transport budgets and sends overbudget alerts before you depart.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowBlogModal(false)}
                className="rounded-xl bg-slate-900 text-white text-xs font-bold px-5 py-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
