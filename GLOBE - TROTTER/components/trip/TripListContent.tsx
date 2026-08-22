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
  Eye,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
  activities: { id: string; name: string; cost: number; time: string }[];
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
      { id: 'a1', name: 'Seine River Sunset Cruise', cost: 3500, time: '06:30 PM' },
      { id: 'a2', name: 'Louvre Museum Guided Tour', cost: 4200, time: '10:00 AM' },
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
      { id: 'a3', name: 'Jungfraujoch Top of Europe Express', cost: 12000, time: '09:00 AM' },
      { id: 'a4', name: 'First Cliff Walk by Tissot', cost: 4500, time: '02:00 PM' },
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
      { id: 'a5', name: 'Colosseum & Roman Forum VIP Tour', cost: 5800, time: '10:30 AM' },
      { id: 'a6', name: 'Trastevere Evening Food & Wine Walking Tour', cost: 4800, time: '07:00 PM' },
    ],
  },
];

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

export function TripListContent() {
  const [sections, setSections] = useState<ItinerarySection[]>(INITIAL_SECTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewActivity, setPreviewActivity] = useState<any | null>(null);

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
    toast.success(`Section moved ${dir}`);
  };

  const handleDelete = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    toast.success('Section removed');
  };

  const handleAddSection = (newSec: ItinerarySection) => {
    setSections((prev) => [...prev, newSec]);
    setShowAddModal(false);
    toast.success(`Section ${sections.length + 1} added!`);
  };

  const totalBudget = sections.reduce((sum, s) => sum + s.budget, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 pb-24">
      {/* Top Banner Overview */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-400/20 mb-2">
            <Compass size={13} /> Multi-City Day Wise Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Europe Grand Discovery 2026</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Construct your day-wise trip plan in an interactive section format.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/90 rounded-2xl p-3 px-4 border border-slate-700/60">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Sections</span>
            <p className="text-lg font-black text-blue-400">{sections.length} Planned</p>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Budget</span>
            <p className="text-lg font-black text-emerald-400">{formatINR(totalBudget)}</p>
          </div>
        </div>
      </div>

      {/* STACK OF SECTIONS (Direct Wireframe Screen 5 Implementation) */}
      <div className="space-y-6">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md"
          >
            {/* Section Header with Section {N}: and Reorder Controls */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-slate-900 px-3.5 py-1 text-sm font-black text-white uppercase tracking-wider">
                  Section {idx + 1}:
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {sec.title}
                </h2>
              </div>

              {/* Reorder Up/Down & Delete */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleReorder(idx, 'up')}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
                  title="Move Section Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={() => handleReorder(idx, 'down')}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
                  title="Move Section Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sec.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Delete Section"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Section Description Text (Exact wireframe content) */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-5 font-medium">
              {sec.description}
            </p>

            {/* TWO EXACT WIREFRAME BOXES: [ Date Range: xxx to yyy ] and [ Budget of this section ] */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Box 1: Date Range */}
              <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white p-3.5 px-4 shadow-2xs">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-700 flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Date Range:
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {sec.startDate} to {sec.endDate}
                  </p>
                </div>
              </div>

              {/* Box 2: Budget of this section */}
              <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white p-3.5 px-4 shadow-2xs">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 flex-shrink-0">
                  <Wallet size={18} />
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

            {/* Section Experiences / Activities Preview */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" />
                  Assigned Section Experiences ({sec.activities.length})
                </span>
                <span className="text-[11px] text-slate-500">📍 {sec.city}, {sec.country}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sec.activities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => setPreviewActivity({ ...act, city: sec.city, country: sec.country })}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 px-3 hover:border-blue-400 hover:bg-blue-50/40 transition"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{act.name}</h4>
                      <span className="text-[10px] text-slate-500">{act.time}</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 flex-shrink-0">
                      {formatINR(act.cost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRIMARY CTA: "+ Add another Section" (Direct wireframe match at the bottom) */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-8 py-3.5 text-sm font-extrabold text-slate-900 shadow-md hover:bg-slate-900 hover:text-white transition active:scale-95 cursor-pointer"
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

      {/* ACTIVITY PREVIEW MODAL */}
      {previewActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  📍 {previewActivity.city}, {previewActivity.country}
                </span>
                <h3 className="text-base font-bold text-slate-900">{previewActivity.name}</h3>
              </div>
              <button
                onClick={() => setPreviewActivity(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <strong>Scheduled Timing:</strong> {previewActivity.time}
              </p>
              <p>
                <strong>Estimated Cost:</strong> <span className="font-bold text-emerald-700">{formatINR(previewActivity.cost)}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Includes verified entrance ticketing, audio guide reservation, and flexible cancellation.
              </p>
            </div>
            <button
              onClick={() => setPreviewActivity(null)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Close
            </button>
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
    'All the necessary information about this section. This can be anything like travel section, hotel or any other activity.'
  );
  const [startDate, setStartDate] = useState('Sep 24, 2026');
  const [endDate, setEndDate] = useState('Sep 28, 2026');
  const [budget, setBudget] = useState(25000);

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
        { id: `a-${Date.now()}-1`, name: `${city} City Center Walking Tour`, cost: 3200, time: '10:00 AM' },
        { id: `a-${Date.now()}-2`, name: `Local Gastronomy Tasting Experience`, cost: 4500, time: '07:30 PM' },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
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
