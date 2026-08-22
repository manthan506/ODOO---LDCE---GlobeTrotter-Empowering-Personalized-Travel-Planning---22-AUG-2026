'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  Mountain,
  User,
  Car,
  Users,
  Check,
  MapPin,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

type TravelStyle = 'adventure' | 'solo' | 'roadtrip' | 'family';

export function CreateTripForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-10');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState(
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80'
  );
  const [budgetCap, setBudgetCap] = useState<number>(150000);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('adventure');
  const [loading, setLoading] = useState(false);

  const sampleCovers = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80',
  ];

  const travelStyles = [
    {
      id: 'adventure',
      title: 'Adventure',
      icon: Mountain,
      desc: 'Outdoors, thrills & hikes',
    },
    {
      id: 'solo',
      title: 'Solo Travel',
      icon: User,
      desc: 'Freedom, reflection & sights',
    },
    {
      id: 'roadtrip',
      title: 'Road Trip',
      icon: Car,
      desc: 'Scenic routes & flexibility',
    },
    {
      id: 'family',
      title: 'Family Tour',
      icon: Users,
      desc: 'Kid-friendly & relaxed pace',
    },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a destination or trip name');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date must be on or after the start date');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          startDate,
          endDate,
          description: description.trim() || null,
          coverImageUrl: coverImageUrl || null,
          budgetCap: budgetCap ? Number(budgetCap) : null,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create trip');
      }

      toast.success(`Trip to ${name} created successfully!`);
      router.push(`/trips/${data.id}`);
    } catch (err: any) {
      console.error('Submit error:', err);
      toast.error(err?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[640px] px-4 py-6 sm:px-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/trips"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Back to Trips
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Plan a New Trip ✨
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Enter your destination, dates, and budget to generate your customized travel workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Photo Selector */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center transition hover:border-blue-300">
          <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-900">
            <img
              src={coverImageUrl}
              alt="Trip Cover"
              className="h-full w-full object-cover opacity-90"
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
            {sampleCovers.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCoverImageUrl(url)}
                className={`h-9 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  coverImageUrl === url
                    ? 'border-blue-600 scale-105 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Primary Details Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Destination / Trip Name
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. Delhi, Japan, Paris, Australia, Barcelona..."
              />
            </div>
          </div>

          {/* Unified Clean Single Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Start Date
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
                End Date
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Budget Range Slider in INR */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Estimated Trip Budget (₹)
              </label>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 font-mono">
                ₹{budgetCap.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="5000"
              value={budgetCap}
              onChange={(e) => setBudgetCap(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>₹20,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          {/* Travel Style Selector */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {travelStyles.map((item) => {
                const isSelected = travelStyle === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTravelStyle(item.id as TravelStyle)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition text-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`mb-1.5 grid h-8 w-8 place-items-center rounded-xl transition ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="pt-2 border-t border-slate-100">
            <label className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Notes & Trip Description (Optional)
            </label>
            <textarea
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Exploring landmarks, local street food, cultural attractions..."
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>Create Trip & Open Workspace 🚀</>
          )}
        </button>
      </form>
    </div>
  );
}
