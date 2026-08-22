'use client';

import { useState } from 'react';
import {
  Plus,
  Calendar,
  Wallet,
  ArrowUp,
  ArrowDown,
  Trash2,
  Sparkles,
  MapPin,
  X,
  Hotel,
  Plane,
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

interface ActivityItem {
  id: string;
  name: string;
  cost: number;
  time: string;
  category: string;
  imageUrl: string;
  duration: string;
  highlights: string[];
}

interface ItinerarySection {
  id: string;
  title: string;
  category: 'travel' | 'hotel' | 'activity' | 'city';
  city: string;
  country: string;
  imageUrl: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: ActivityItem[];
}

const INITIAL_SECTIONS: ItinerarySection[] = [
  {
    id: 'sec-1',
    title: 'Flight & Arrival in Paris',
    category: 'travel',
    city: 'Paris',
    country: 'France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description:
      'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including international flights, airport shuttle, and private check-in.',
    startDate: 'Sep 10, 2026',
    endDate: 'Sep 13, 2026',
    budget: 35000,
    activities: [
      {
        id: 'a1',
        name: 'Seine River Sunset Cruise',
        cost: 3500,
        time: '06:30 PM',
        category: 'Cruise & Sightseeing',
        imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=600&q=80',
        duration: '1.5 Hours',
        highlights: ['Eiffel Tower illuminations', 'Complimentary Champagne', 'Live commentary'],
      },
      {
        id: 'a2',
        name: 'Louvre Museum Guided Tour',
        cost: 4200,
        time: '10:00 AM',
        category: 'Art & History',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
        duration: '2.5 Hours',
        highlights: ['Skip-the-line entrance', 'Mona Lisa priority viewing', 'Expert art historian guide'],
      },
    ],
  },
  {
    id: 'sec-2',
    title: 'Swiss Alps Hotel Stay & Alpine Glacier Tour',
    category: 'hotel',
    city: 'Interlaken',
    country: 'Switzerland',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    description:
      'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including 4-star mountain lodge booking, panoramic train transfers, and ski equipment rental.',
    startDate: 'Sep 14, 2026',
    endDate: 'Sep 18, 2026',
    budget: 52000,
    activities: [
      {
        id: 'a3',
        name: 'Jungfraujoch Top of Europe Express',
        cost: 12000,
        time: '09:00 AM',
        category: 'Alpine Adventure',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
        duration: '5.0 Hours',
        highlights: ['Cogwheel scenic railway', 'Ice Palace exploration', 'Sphinx Observatory view'],
      },
      {
        id: 'a4',
        name: 'First Cliff Walk by Tissot',
        cost: 4500,
        time: '02:00 PM',
        category: 'Nature & Thrill',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
        duration: '2.0 Hours',
        highlights: ['Suspension bridge panorama', 'Grindelwald peak views', 'Alpine photo vantage'],
      },
    ],
  },
  {
    id: 'sec-3',
    title: 'Rome Historic City Center & Vatican Exploration',
    category: 'activity',
    city: 'Rome',
    country: 'Italy',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    description:
      'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including Colosseum skip-the-line passes, Vatican City VIP tour, and local culinary tastings.',
    startDate: 'Sep 19, 2026',
    endDate: 'Sep 23, 2026',
    budget: 28000,
    activities: [
      {
        id: 'a5',
        name: 'Colosseum & Roman Forum VIP Tour',
        cost: 5800,
        time: '10:30 AM',
        category: 'Historical Landmark',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
        duration: '3.0 Hours',
        highlights: ['Arena floor VIP access', 'Gladiator tunnels tour', 'Roman Forum ruins guide'],
      },
      {
        id: 'a6',
        name: 'Trastevere Evening Food & Wine Walking Tour',
        cost: 4800,
        time: '07:00 PM',
        category: 'Culinary Experience',
        imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
        duration: '3.5 Hours',
        highlights: ['Authentic Roman pasta tasting', 'Artisanal gelato', 'Selected Italian wine pairings'],
      },
    ],
  },
];

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export function TripListContent() {
  const [sections, setSections] = useState<ItinerarySection[]>(INITIAL_SECTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewActivity, setPreviewActivity] = useState<ActivityItem & { city: string; country: string } | null>(null);

  // Reorder up / down
  const handleReorder = (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === sections.length - 1) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
    toast.success(`Section moved ${dir === 'up' ? 'upward' : 'downward'}`);
  };

  const handleDelete = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    toast.success('Section deleted from itinerary');
  };

  const handleAddSection = (newSec: ItinerarySection) => {
    setSections((prev) => [...prev, newSec]);
    setShowAddModal(false);
    toast.success(`Section ${sections.length + 1} added!`);
  };

  const totalBudget = sections.reduce((sum, s) => sum + s.budget, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 pb-28">
      {/* Top Banner Overview (Figma/Canva Level Glassmorphism + Background Motif) */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-400/25 backdrop-blur-md">
              <Compass size={14} className="text-blue-400" /> Multi-City Day Wise Planner
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Europe Grand Discovery 2026
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Construct your day-wise trip plan in an interactive section format.
            </p>
          </div>

          <div className="flex items-center gap-5 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 px-5 border border-slate-800 shadow-inner flex-shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Sections
              </span>
              <p className="text-xl font-black text-blue-400">{sections.length} Planned</p>
            </div>
            <div className="h-9 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                Total Budget
              </span>
              <p className="text-xl font-black text-emerald-400">{formatINR(totalBudget)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* STACK OF SECTIONS (Exact Screen 5 Wireframe with Figma-Level Aesthetic Polish) */}
      <div className="space-y-7">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="group relative overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6 sm:p-7 space-y-5">
              {/* SECTION HEADER: [SECTION {N}:] + Section Title + Reorder Controls + Destination Thumbnail */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Destination High-Res Visual Badge */}
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-slate-200">
                    <img
                      src={sec.imageUrl}
                      alt={sec.city}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="rounded-lg bg-slate-950 px-2.5 py-0.5 text-xs font-black text-white uppercase tracking-wider shadow-xs">
                        Section {idx + 1}:
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <MapPin size={12} className="text-blue-600" /> {sec.city}, {sec.country}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {sec.title}
                    </h2>
                  </div>
                </div>

                {/* Reorder Up/Down & Delete Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleReorder(idx, 'up')}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-200 disabled:opacity-30 transition active:scale-90 cursor-pointer"
                    title="Move Section Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => handleReorder(idx, 'down')}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-200 disabled:opacity-30 transition active:scale-90 cursor-pointer"
                    title="Move Section Down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(sec.id)}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-slate-300 text-slate-400 bg-slate-50 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition active:scale-90 cursor-pointer"
                    title="Delete Section"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Section Description Text (Exact wireframe content) */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {sec.description}
              </p>

              {/* TWO PROMINENT WIREFRAME BOXES: [ Date Range: xxx to yyy ] and [ Budget of this section ] */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Box 1: Date Range */}
                <div className="flex items-center gap-3.5 rounded-2xl border-2 border-slate-900 bg-slate-50/70 p-3.5 px-4 shadow-2xs hover:bg-white transition">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-800 flex-shrink-0 shadow-2xs">
                    <Calendar size={19} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Date Range:
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {sec.startDate} to {sec.endDate}
                    </p>
                  </div>
                </div>

                {/* Box 2: Budget of this section */}
                <div className="flex items-center gap-3.5 rounded-2xl border-2 border-slate-900 bg-slate-50/70 p-3.5 px-4 shadow-2xs hover:bg-white transition">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800 flex-shrink-0 shadow-2xs">
                    <Wallet size={19} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Budget of this section:
                    </span>
                    <p className="text-xs sm:text-sm font-black text-emerald-700">
                      {formatINR(sec.budget)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned Section Experiences (With High-Resolution Canva/Figma Thumbnails) */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-blue-600" />
                    Assigned Section Experiences ({sec.activities.length})
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    📍 {sec.city}, {sec.country}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sec.activities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() =>
                        setPreviewActivity({ ...act, city: sec.city, country: sec.country })
                      }
                      className="group/act flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-2.5 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <img
                          src={act.imageUrl}
                          alt={act.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMG;
                          }}
                          className="h-11 w-11 rounded-xl object-cover flex-shrink-0 border border-slate-100 group-hover/act:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover/act:text-blue-600 transition-colors">
                            {act.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={11} className="text-slate-400" /> {act.time} • {act.duration}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-1">
                        <span className="text-xs font-black text-emerald-700 block">
                          {formatINR(act.cost)}
                        </span>
                        <span className="text-[9px] text-blue-600 font-bold group-hover/act:underline inline-flex items-center">
                          Details →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRIMARY CTA: "+ Add another Section" (Direct Wireframe Screen 5 Match) */}
      <div className="mt-9 text-center">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-8 py-3.5 text-sm font-extrabold text-slate-900 shadow-lg hover:bg-slate-900 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add another Section
        </button>
      </div>

      {/* ADD ANOTHER SECTION MODAL */}
      {showAddModal && (
        <AddSectionModal
          sectionNumber={sections.length + 1}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSection}
        />
      )}

      {/* ACTIVITY PREVIEW MODAL (Canva/Figma Detail Inspector) */}
      {previewActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
            {/* Modal Image Hero Banner */}
            <div className="relative h-44 w-full bg-slate-900">
              <img
                src={previewActivity.imageUrl}
                alt={previewActivity.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMG;
                }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/30 to-transparent" />
              <button
                type="button"
                onClick={() => setPreviewActivity(null)}
                className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  {previewActivity.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-tight drop-shadow-xs">
                  {previewActivity.name}
                </h3>
              </div>
            </div>

            {/* Modal Details Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scheduled Timing
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <Clock size={12} className="text-blue-600" /> {previewActivity.time} ({previewActivity.duration})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estimated Cost
                  </span>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    {formatINR(previewActivity.cost)} / traveler
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Experience Highlights:
                </h4>
                <ul className="space-y-1.5">
                  {previewActivity.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-blue-50/70 p-2.5 text-[11px] text-blue-900 border border-blue-100">
                <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
                <span>Includes skip-the-line reservation, certified guide, and free cancellation.</span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewActivity(null)}
                className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-98"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddSectionModal({
  sectionNumber,
  onClose,
  onAdd,
}: {
  sectionNumber: number;
  onClose: () => void;
  onAdd: (sec: ItinerarySection) => void;
}) {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Barcelona');
  const [country, setCountry] = useState('Spain');
  const [description, setDescription] = useState(
    'All the necessary information about this section. This can be anything like travel section, hotel or any other activity including coastal exploration and local cultural immersion.'
  );
  const [startDate, setStartDate] = useState('Sep 24, 2026');
  const [endDate, setEndDate] = useState('Sep 28, 2026');
  const [budget, setBudget] = useState(28000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `sec-${Date.now()}`,
      title: title || `Exploration & Stay in ${city}`,
      category: 'city',
      city,
      country,
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      description,
      startDate,
      endDate,
      budget: Number(budget) || 20000,
      activities: [
        {
          id: `a-${Date.now()}-1`,
          name: `${city} City Center Walking Tour`,
          cost: 3200,
          time: '10:00 AM',
          category: 'Cultural Walk',
          imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
          duration: '2.5 Hours',
          highlights: ['Historic Gothic Quarter', 'Architectural highlights', 'Local English guide'],
        },
        {
          id: `a-${Date.now()}-2`,
          name: `Local Gastronomy Tasting Experience`,
          cost: 4500,
          time: '07:30 PM',
          category: 'Food & Drinks',
          imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80',
          duration: '3.0 Hours',
          highlights: ['Tapas pairings', 'Traditional sangria', 'Secret local bodega stops'],
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">Add Section {sectionNumber}</h3>
            <p className="text-xs text-slate-500">Configure section title, dates, budget and details</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Section Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Barcelona Beachfront & Sagrada Familia Tour"
              className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">City / Location:</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Barcelona, Tokyo, Bali"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Country:</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Spain, Japan, Indonesia"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Start Date:</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. Sep 24, 2026"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">End Date:</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="e.g. Sep 28, 2026"
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Budget of this section:</span>
              <span className="text-emerald-700 font-extrabold">{formatINR(budget)}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={100000}
              step={2000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Section Information & Details:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity..."
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition"
            >
              + Add Section {sectionNumber}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
