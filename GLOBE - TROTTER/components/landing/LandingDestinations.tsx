'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Heart, Sparkles, MapPin, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { toast } from 'sonner';
import { useTripSync } from '@/context/TripSyncContext';

const DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Santorini',
    country: 'Greece',
    rating: 4.9,
    reviews: '2.8k',
    budgetFrom: '₹58,000',
    tag: 'Island Romance',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  },
  {
    id: 'dest-2',
    name: 'Tokyo',
    country: 'Japan',
    rating: 4.9,
    reviews: '4.1k',
    budgetFrom: '₹89,000',
    tag: 'Culture & Modernity',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
  },
  {
    id: 'dest-3',
    name: 'Swiss Alps',
    country: 'Switzerland',
    rating: 4.9,
    reviews: '3.4k',
    budgetFrom: '₹1,20,000',
    tag: 'Scenic Mountains',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
  },
  {
    id: 'dest-4',
    name: 'Bali',
    country: 'Indonesia',
    rating: 4.8,
    reviews: '3.9k',
    budgetFrom: '₹35,000',
    tag: 'Tropical Beaches',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  },
  {
    id: 'dest-5',
    name: 'New York City',
    country: 'United States',
    rating: 4.8,
    reviews: '5.2k',
    budgetFrom: '₹72,000',
    tag: 'Urban Energy',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  },
];

export function LandingDestinations() {
  const { addSavedDestination } = useTripSync();
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (dest: typeof DESTINATIONS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = !likedMap[dest.id];
    setLikedMap((prev) => ({ ...prev, [dest.id]: isLiked }));
    if (isLiked) {
      addSavedDestination({ id: dest.id, name: dest.name, country: dest.country, img: dest.image });
      toast.success(`Saved ${dest.name} to your profile wishlist!`);
    } else {
      toast.info(`Removed ${dest.name} from wishlist.`);
    }
  };

  return (
    <section id="destinations" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
              Popular Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Find your next adventure
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Explore handpicked destinations loved by travelers worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition"
            >
              <span>View All Destinations</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 5 Horizontal Destination Cards matching Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3.5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-slate-100 mb-3.5">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-black text-slate-900 shadow-2xs">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span>{dest.rating}</span>
                </div>

                {/* Heart / Wishlist Toggle */}
                <button
                  type="button"
                  onClick={(e) => toggleLike(dest, e)}
                  className={`absolute top-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition ${
                    likedMap[dest.id]
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/40 text-white hover:bg-rose-500'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart size={14} fill={likedMap[dest.id] ? 'currentColor' : 'none'} />
                </button>

                {/* Destination & Country on image */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="text-base font-black tracking-tight drop-shadow-xs">
                    {dest.name}
                  </h3>
                  <span className="text-xs text-slate-200 font-semibold drop-shadow-xs">
                    {dest.country}
                  </span>
                </div>
              </div>

              {/* Card Footer: Starting Price in Indian Rupees ₹ INR */}
              <div className="flex items-center justify-between pt-1 px-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Starting from
                  </span>
                  <p className="text-sm font-black text-slate-900 font-mono">
                    {dest.budgetFrom}
                  </p>
                </div>

                <Link
                  href={`/explore?q=${encodeURIComponent(dest.name)}`}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition shadow-2xs"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
