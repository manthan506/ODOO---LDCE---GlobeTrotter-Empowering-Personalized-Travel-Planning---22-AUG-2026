'use client';

import { useState, useMemo } from 'react';
import { Sparkles, Clock, Star, Plus, Check, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useTripSync } from '@/context/TripSyncContext';
import { ActivityItem } from '@/lib/tripDataSync';

const ACTIVITIES = [
  {
    id: 'act-c-1',
    name: 'Colosseum & Roman Forum Guided VIP Tour',
    city: 'Rome',
    country: 'Italy',
    category: 'culture',
    categoryLabel: 'Culture & History',
    duration: '2.5 Hours',
    cost: 3800,
    costLabel: '₹3,800',
    rating: 4.9,
    reviews: '3.4k',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
  },
  {
    id: 'act-c-2',
    name: 'Jungfraujoch Top of Europe Alpine Train',
    city: 'Interlaken',
    country: 'Switzerland',
    category: 'adventure',
    categoryLabel: 'Alpine Adventure',
    duration: '6.0 Hours',
    cost: 14500,
    costLabel: '₹14,500',
    rating: 4.9,
    reviews: '2.1k',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',
  },
  {
    id: 'act-c-3',
    name: 'Louvre Museum Mona Lisa Priority Entry',
    city: 'Paris',
    country: 'France',
    category: 'sightseeing',
    categoryLabel: 'Sightseeing',
    duration: '3.0 Hours',
    cost: 4200,
    costLabel: '₹4,200',
    rating: 4.9,
    reviews: '5.6k',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  },
  {
    id: 'act-c-4',
    name: 'Seine River Sunset Gourmet Dinner Cruise',
    city: 'Paris',
    country: 'France',
    category: 'food',
    categoryLabel: 'Food & Dining',
    duration: '2.5 Hours',
    cost: 6500,
    costLabel: '₹6,500',
    rating: 4.8,
    reviews: '1.9k',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80',
  },
  {
    id: 'act-c-5',
    name: 'Mount Fuji 5th Station & Lake Ashi Cruise',
    city: 'Tokyo',
    country: 'Japan',
    category: 'nature',
    categoryLabel: 'Nature & Scenic',
    duration: '8.0 Hours',
    cost: 8200,
    costLabel: '₹8,200',
    rating: 4.9,
    reviews: '4.2k',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  },
  {
    id: 'act-c-6',
    name: 'Traditional Balinese Organic Cooking Workshop',
    city: 'Bali',
    country: 'Indonesia',
    category: 'food',
    categoryLabel: 'Food & Dining',
    duration: '4.0 Hours',
    cost: 2400,
    costLabel: '₹2,400',
    rating: 4.9,
    reviews: '1.1k',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Activities' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'food', label: 'Food & Dining' },
  { id: 'culture', label: 'Culture' },
  { id: 'sightseeing', label: 'Sightseeing' },
  { id: 'nature', label: 'Nature' },
];

export function LandingActivityDiscovery() {
  const { toggleAddActivity, addedActivityIds } = useTripSync();
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = useMemo(() => {
    if (selectedCat === 'all') return ACTIVITIES;
    return ACTIVITIES.filter((a) => a.category === selectedCat);
  }, [selectedCat]);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
            Activity Discovery & Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Build a trip around what you love
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Filter activities by interest, duration, and transparent Indian Rupee (₹) pricing.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((act) => {
            const isAdded = addedActivityIds.includes(act.id);
            return (
              <div
                key={act.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:border-blue-300 transition"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 mb-3.5">
                    <img
                      src={act.image}
                      alt={act.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                      📍 {act.city}, {act.country}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 rounded-full bg-blue-600/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {act.categoryLabel}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h3 className="text-sm font-black text-slate-900 line-clamp-2 leading-snug">
                      {act.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        {act.duration}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star size={13} fill="currentColor" />
                        <strong className="text-slate-800">{act.rating}</strong> ({act.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Price per person
                    </span>
                    <p className="text-base font-black text-slate-900 font-mono">
                      {act.costLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      toggleAddActivity({
                        id: act.id,
                        name: act.name,
                        cityId: act.city.toLowerCase(),
                        city: act.city,
                        country: act.country,
                        region: 'Europe',
                        time: '10:00 AM',
                        duration: act.duration,
                        durationMinutes: 120,
                        cost: act.cost,
                        costTier: act.cost > 7000 ? 'luxury' : 'moderate',
                        costLabel: act.costLabel,
                        category: act.categoryLabel,
                        categoryGroup: 'sightseeing',
                        popularity: act.rating,
                        reviewsCount: act.reviews,
                        imageUrl: act.image,
                        description: act.name,
                        highlights: ['Instant confirmation'],
                      });
                    }}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-95 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} strokeWidth={3} />
                        <span>Added ✓</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Add to Trip +</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
