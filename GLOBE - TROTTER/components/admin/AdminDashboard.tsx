'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  Luggage,
  MapPin,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  Calendar,
  IndianRupee,
  Activity as ActivityIcon,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  ShieldAlert,
  UserCheck,
  UserX,
  Plus,
  Eye,
  Trash2,
  Check,
  X,
  Compass,
  Wallet,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { MASTER_ACTIVITIES, MASTER_TRIP } from '@/lib/tripDataSync';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Pro Explorer' | 'Traveler';
  tripsCount: number;
  joinedDate: string;
  status: 'Active' | 'Suspended';
  lastActive: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Manthan Saraiya',
    email: 'manthan@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    role: 'Admin',
    tripsCount: 6,
    joinedDate: 'Aug 2026',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'u-2',
    name: 'Elena Rostova',
    email: 'elena.travels@world.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    role: 'Pro Explorer',
    tripsCount: 4,
    joinedDate: 'Jul 2026',
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 'u-3',
    name: 'Kenji Sato',
    email: 'kenji.sato@tokyo.jp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    role: 'Pro Explorer',
    tripsCount: 5,
    joinedDate: 'Jun 2026',
    status: 'Active',
    lastActive: 'Yesterday',
  },
  {
    id: 'u-4',
    name: 'Aarav Patel',
    email: 'aarav.patel@mumbai.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    role: 'Traveler',
    tripsCount: 2,
    joinedDate: 'Aug 2026',
    status: 'Active',
    lastActive: '3 days ago',
  },
  {
    id: 'u-5',
    name: 'Sophia Laurent',
    email: 'sophia@parisien.fr',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    role: 'Traveler',
    tripsCount: 3,
    joinedDate: 'May 2026',
    status: 'Active',
    lastActive: '5 days ago',
  },
  {
    id: 'u-6',
    name: 'Carlos Mendez',
    email: 'carlos.m@bcn.es',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
    role: 'Traveler',
    tripsCount: 1,
    joinedDate: 'Apr 2026',
    status: 'Suspended',
    lastActive: '2 weeks ago',
  },
];

const POPULAR_CITIES = [
  {
    id: 'c-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    visitors: '4,820 travelers',
    sharePercentage: 38,
    avgBudget: 42000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    topAttraction: 'Louvre Museum & Seine Sunset Cruise',
  },
  {
    id: 'c-swiss',
    name: 'Interlaken & Alps',
    country: 'Switzerland',
    region: 'Europe',
    visitors: '3,910 travelers',
    sharePercentage: 32,
    avgBudget: 58000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    topAttraction: 'Jungfraujoch Summit Cogwheel & Paragliding',
  },
  {
    id: 'c-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    visitors: '3,450 travelers',
    sharePercentage: 28,
    avgBudget: 35000,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    topAttraction: 'Colosseum Gladiator Arena & Vatican Early Access',
  },
  {
    id: 'c-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    visitors: '2,980 travelers',
    sharePercentage: 24,
    avgBudget: 48000,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    topAttraction: 'Shibuya Sky & Mount Fuji Bullet Train Pass',
  },
  {
    id: 'c-bali',
    name: 'Bali (Ubud & Isles)',
    country: 'Indonesia',
    region: 'Asia',
    visitors: '2,420 travelers',
    sharePercentage: 20,
    avgBudget: 28000,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    topAttraction: 'Mount Batur Sunrise Trek & Rice Terraces',
  },
  {
    id: 'c-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    visitors: '2,150 travelers',
    sharePercentage: 18,
    avgBudget: 32000,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
    topAttraction: 'Sagrada Familia & Gothic Tapas Walk',
  },
];

export function AdminDashboard() {
  // Wireframe Tabs: 'users' | 'cities' | 'activities' | 'analytics'
  const [activeTab, setActiveTab] = useState<'users' | 'cities' | 'activities' | 'analytics'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'all' | 'role' | 'region'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'trips' | 'date'>('trips');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // User management state
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [selectedUserForTrips, setSelectedUserForTrips] = useState<UserRecord | null>(null);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          toast.info(`User ${u.name} status updated to ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const promoteUserRole = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextRole = u.role === 'Traveler' ? 'Pro Explorer' : 'Admin';
          toast.success(`User ${u.name} promoted to ${nextRole}!`);
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.role.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [users, searchQuery]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28 space-y-6">
      {/* ============================================================ */}
      {/* TOP CONTROL BAR MATCHING SCREEN 12 WIREFRAME                 */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search bar ...... */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bar ...... (e.g. Manthan, Paris, Activities, Pro Explorer)"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-xs sm:text-sm text-slate-900 font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs transition"
          />
        </div>

        {/* Group by Dropdown */}
        <div className="relative">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="all">Group by: All Data</option>
            <option value="role">Group by: User Roles</option>
            <option value="region">Group by: Regions</option>
          </select>
          <Layers size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={`flex h-11 items-center justify-center gap-2 rounded-2xl border px-5 text-xs font-bold transition shadow-2xs cursor-pointer ${
            showFilterDrawer
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter size={14} /> Filter
        </button>

        {/* Sort by... Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-9 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none transition"
          >
            <option value="trips">Sort by: Highest Trips</option>
            <option value="name">Sort by: Name Alphabetical</option>
            <option value="date">Sort by: Join Date</option>
          </select>
          <ArrowUpDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* FILTER DRAWER */}
      {showFilterDrawer && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase text-slate-900 tracking-wider">
              Analytics Filter Parameters
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                toast.info('Filters reset');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Real-time filter applies across active users, destination adoption, and activity popularity.
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* FOUR WIREFRAME TABS: Manage Users | Popular cities | ...     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users size={15} /> Manage Users
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cities')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
            activeTab === 'cities'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building size={15} /> Popular cities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activities')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
            activeTab === 'activities'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles size={15} /> Popular Activities
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp size={15} /> User Trends & Analytics
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: USER TRENDS & ANALYTICS CHARTS (Screen 12 Wireframe)   */}
      {/* ============================================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Visual Charts Container (Matching Screen 12 Wireframe) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-8">
            <div className="text-center sm:text-left">
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700 uppercase tracking-wider border border-blue-200">
                Screen 12 • Analytics Dashboard
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Platform Adoption & Travel Metrics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-point analysis across user adoption, budget volumes, and activity distributions.
              </p>
            </div>

            {/* TOP ROW: USER PREFERENCE BREAKDOWN PIE / DONUT + METRIC CHIPS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Metric Chips (4 grey bullets matching wireframe) */}
              <div className="md:col-span-6 space-y-3.5">
                {[
                  { label: 'Total Active Travel Itineraries', value: '1,420 Trips', color: 'bg-blue-600', sub: '+28% growth month-over-month' },
                  { label: 'Total Budget Tracked Across Trips', value: '₹2.84 Crores', color: 'bg-emerald-600', sub: 'In real Indian Rupees (₹ INR)' },
                  { label: 'Top Destination Category', value: 'Alpine & Cultural (68%)', color: 'bg-purple-600', sub: 'Europe & Japan dominating bookings' },
                  { label: 'Platform Community Clones', value: '840 Copies', color: 'bg-amber-600', sub: 'Public shared itineraries duplicated' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 px-4">
                    <div className={`h-4 w-4 rounded-full ${stat.color} flex-shrink-0 shadow-2xs`} />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-700">{stat.label}</span>
                        <strong className="text-xs font-black text-slate-900">{stat.value}</strong>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{stat.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Donut / Pie Chart (Matching Wireframe Top Right) */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50/60 border border-slate-100">
                <div className="relative h-44 w-44">
                  {/* SVG Donut */}
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
                    {/* Segment 1: Blue 45% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#2563EB" strokeWidth="18" strokeDasharray="107 238" strokeDashoffset="0" />
                    {/* Segment 2: Purple 30% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#7C3AED" strokeWidth="18" strokeDasharray="71 238" strokeDashoffset="-107" />
                    {/* Segment 3: Emerald 15% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#059669" strokeWidth="18" strokeDasharray="36 238" strokeDashoffset="-178" />
                    {/* Segment 4: Amber 10% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#D97706" strokeWidth="18" strokeDasharray="24 238" strokeDashoffset="-214" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-black text-slate-900">100%</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Tracked</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Europe (45%)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-purple-600" /> Asia (30%)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Med (15%)</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Other (10%)</span>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: LINE CHART WITH NODE DOTS (Matching Wireframe Center) */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <LineIcon size={16} className="text-blue-600" /> Monthly User Growth & Trip Creations
                  </h3>
                  <p className="text-[11px] text-slate-500">Continuous user trajectory across Q1 – Q3 2026</p>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5">
                  +142% Active Surge
                </span>
              </div>

              {/* Responsive SVG Line Chart */}
              <div className="relative h-44 w-full pt-4">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#E2E8F0" strokeDasharray="3 3" />

                  {/* Gradient Area Fill */}
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 95 L 100 80 L 180 65 L 260 70 L 340 40 L 420 30 L 480 15 L 480 115 L 20 115 Z"
                    fill="url(#lineGrad)"
                  />

                  {/* Smooth Line */}
                  <path
                    d="M 20 95 L 100 80 L 180 65 L 260 70 L 340 40 L 420 30 L 480 15"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Circular Node Dots (Matching Wireframe Red / Blue Nodes) */}
                  {[
                    { x: 20, y: 95, val: '240' },
                    { x: 100, y: 80, val: '410' },
                    { x: 180, y: 65, val: '580' },
                    { x: 260, y: 70, val: '520' },
                    { x: 340, y: 40, val: '890' },
                    { x: 420, y: 30, val: '1,120' },
                    { x: 480, y: 15, val: '1,420' },
                  ].map((node, idx) => (
                    <g key={idx}>
                      <circle cx={node.x} cy={node.y} r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" className="hover:scale-125 transition-transform" />
                      <text x={node.x} y={node.y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E293B">
                        {node.val}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Month labels */}
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-2">
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: BAR CHART (Orange bars) + SUMMARY TABLE (Matching Wireframe) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Bar Chart */}
              <div className="md:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Weekly Booking Velocity
                </h4>
                <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2">
                  {[
                    { week: 'W1', height: '45%', val: '₹42k' },
                    { week: 'W2', height: '70%', val: '₹68k' },
                    { week: 'W3', height: '100%', val: '₹95k' },
                    { week: 'W4', height: '85%', val: '₹82k' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[9px] font-bold text-slate-500">{bar.val}</span>
                      <div
                        className="w-full rounded-xl bg-gradient-to-t from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 transition-all shadow-2xs"
                        style={{ height: bar.height }}
                      />
                      <span className="text-[10px] font-extrabold text-slate-700">{bar.week}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Summary Table */}
              <div className="md:col-span-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Real-Time Platform KPI Performance
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Average Trip Duration:</span>
                    <strong className="text-slate-900 font-bold">11.4 Travel Days</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Average Budget per Traveler:</span>
                    <strong className="text-emerald-700 font-black">₹1,18,000 INR</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Itinerary Clone-to-Book Rate:</span>
                    <strong className="text-blue-700 font-black">64.2% Conversion</strong>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-600 font-semibold">Active Multiplayer Collaborators:</span>
                    <strong className="text-purple-700 font-black">214 Live Sessions</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: MANAGE USERS (Screen 12 Wireframe)                     */}
      {/* ============================================================ */}
      {activeTab === 'users' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Users & Platform Access</h2>
              <p className="text-xs text-slate-500">
                View user itineraries, grant permissions, suspend or reactivate accounts.
              </p>
            </div>

            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
              {filteredUsers.length} Registered Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Trips Created</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <strong className="font-bold text-slate-900 block">{u.name}</strong>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          u.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'Pro Explorer'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold text-slate-800">
                      {u.tripsCount} Itineraries
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          u.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {u.lastActive}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForTrips(u)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition"
                          title="View Trips"
                        >
                          View Trips
                        </button>
                        <button
                          type="button"
                          onClick={() => promoteUserRole(u.id)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                          title="Promote Role"
                        >
                          Promote
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                            u.status === 'Active'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: POPULAR CITIES (Screen 12 Wireframe)                  */}
      {/* ============================================================ */}
      {activeTab === 'cities' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Popular Destinations & Traveler Trends</h2>
                <p className="text-xs text-slate-500">Ranking of most included cities in user itineraries</p>
              </div>
              <span className="text-xs font-bold text-slate-700">Top 6 Tracked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_CITIES.map((city, idx) => (
                <div
                  key={city.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-slate-300 transition"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-white">
                      #{idx + 1} Trending
                    </span>
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {city.sharePercentage}% user share
                    </span>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <h3 className="text-base font-bold drop-shadow-xs">{city.name}</h3>
                      <span className="text-xs text-slate-200 font-medium">📍 {city.country} • {city.visitors}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Avg. Traveler Budget:</span>
                      <strong className="text-emerald-700 font-bold">{formatINR(city.avgBudget)}</strong>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Top Booked Experience:
                      </span>
                      <p className="text-slate-800 font-semibold">{city.topAttraction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: POPULAR ACTIVITIES (Screen 12 Wireframe)               */}
      {/* ============================================================ */}
      {activeTab === 'activities' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Popular Activities & Experiences</h2>
              <p className="text-xs text-slate-500">Most scheduled and highly rated experiences across the platform</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl">
              Verified Bookings
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {MASTER_ACTIVITIES.slice(0, 8).map((act, idx) => (
              <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-700 font-black text-xs flex-shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                        {act.category} • {act.city}, {act.country}
                      </span>
                      <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-black text-emerald-700 border border-emerald-200">
                        ⭐ {act.popularity} ({act.reviewsCount})
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {act.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                  <span className="text-xs sm:text-sm font-black text-emerald-700">
                    {formatINR(act.cost)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {act.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER TRIPS INSPECTOR MODAL */}
      {selectedUserForTrips && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Itineraries by {selectedUserForTrips.name}</h3>
                <p className="text-xs text-slate-500">{selectedUserForTrips.email}</p>
              </div>
              <button
                onClick={() => setSelectedUserForTrips(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Active Route:</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{MASTER_TRIP.name}</h4>
                <p className="text-[11px] text-slate-500">Sep 10 – Sep 28, 2026 • 4 Stops • Total: {formatINR(MASTER_TRIP.totalEstimatedCost)}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForTrips(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
