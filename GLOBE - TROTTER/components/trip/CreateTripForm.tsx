'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, Calendar, Tag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PlanTripStep, TravelStyle } from './PlanTripStep';

export function CreateTripForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('2025-05-20');
  const [endDate, setEndDate] = useState('2025-06-05');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState(
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80'
  );
  const [budgetCap, setBudgetCap] = useState<number>(110000);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('adventure');
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [loading, setLoading] = useState(false);

  const sampleCovers = [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date must be after the start date');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          description: description || null,
          coverImageUrl: coverImageUrl || null,
          budgetCap: budgetCap ? Number(budgetCap) : null,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create trip');
      }

      toast.success('Trip created — let\'s build your itinerary!');
      router.push(`/trips/${data.id}/plan`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create trip';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[640px] px-4 py-6 sm:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/trips"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={16} /> Back to Trips
        </Link>
        <button
          type="button"
          onClick={() => setShowEnhancer(!showEnhancer)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
            showEnhancer
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <Sparkles size={14} /> {showEnhancer ? 'Simple Form' : 'AI Trip Planner'}
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Create New Trip ✨
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Define your trip destination, travel dates, budget and itinerary style.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Photo Upload / Selection Box (Screen 4 visual) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-blue-300">
          {coverImageUrl ? (
            <div className="relative h-40 w-full overflow-hidden rounded-xl">
              <img
                src={coverImageUrl}
                alt="Trip Cover"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full">
                  Change Cover Photo
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-2">
                <ImageIcon size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-800">Add a cover photo (optional)</span>
              <span className="text-xs text-slate-400 mt-0.5">Choose from popular destination presets below</span>
            </div>
          )}

          {/* Quick preset selector */}
          <div className="mt-3 flex items-center justify-center gap-2 overflow-x-auto py-1">
            {sampleCovers.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCoverImageUrl(url)}
                className={`h-9 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  coverImageUrl === url ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Core details card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Trip Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Summer in Europe, Japan Adventure"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Start Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">End Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Trip Description</label>
              <span className="text-[11px] text-slate-400">{description.length}/300</span>
            </div>
            <textarea
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="Tell us about your trip plans, wishlist, companions..."
            />
          </div>
        </div>

        {/* PlanTripStep Enhancement: Travel Style, Budget Slider, Voice Suggestion */}
        <PlanTripStep
          budgetCap={budgetCap}
          onBudgetChange={setBudgetCap}
          travelStyle={travelStyle}
          onTravelStyleChange={setTravelStyle}
          destinationHint={name ? name : 'European Escape'}
          onDestinationSelect={(dest) => {
            if (!name) setName(dest);
          }}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>Save Trip & Build Itinerary 🚀</>
          )}
        </button>
      </form>
    </div>
  );
}
