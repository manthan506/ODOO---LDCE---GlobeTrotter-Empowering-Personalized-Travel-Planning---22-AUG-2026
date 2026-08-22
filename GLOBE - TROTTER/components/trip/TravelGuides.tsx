'use client';

import { useState } from 'react';
import {
  BookOpen,
  Compass,
  Sun,
  ShieldAlert,
  CreditCard,
  Bus,
  Sparkles,
  Heart,
  Bookmark,
  Users,
  Plus,
  Check,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { getDestinationInfo } from '@/lib/destinationData';

export function TravelGuides({ activeCity = 'Delhi' }: { activeCity?: string }) {
  const dest = getDestinationInfo(activeCity);
  const [following, setFollowing] = useState(false);
  const [addedPlaces, setAddedPlaces] = useState<string[]>([]);

  const handleFollow = () => {
    setFollowing(!following);
    toast.success(
      following
        ? `Unfollowed guide`
        : `Following ${dest.guide.curator}! New travel recommendations for ${dest.name} will appear in your feed.`
    );
  };

  const handleAddToPlan = (placeName: string) => {
    if (addedPlaces.includes(placeName)) {
      toast.info(`${placeName} is already in your itinerary`);
      return;
    }
    setAddedPlaces([...addedPlaces, placeName]);
    toast.success(`✓ Added ${placeName} directly into your ${dest.name} trip itinerary!`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle with dynamic destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Curated community travel guide for {dest.name}, {dest.country}
        </h2>
      </div>

      {/* Main Guide Frame Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Hero Guide Cover with Real Destination Photo */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8 shadow-md">
          <img
            src={dest.coverImage}
            alt={`${dest.name} Travel Guide`}
            className="absolute inset-0 h-full w-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Featured Guide
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">{dest.guide.title}</h1>
          </div>
        </div>

        {/* Guide Author Row */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-xs">
              {dest.guide.curator.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{dest.guide.curator}</h4>
              <p className="text-xs text-slate-500">{dest.guide.curatorRole}</p>
            </div>
          </div>

          <button
            onClick={handleFollow}
            className={`rounded-xl px-5 py-2 text-xs font-bold transition shadow-xs ${
              following
                ? 'bg-slate-200 text-slate-700'
                : 'bg-rose-500 hover:bg-rose-600 text-white'
            }`}
          >
            {following ? 'Following ✓' : 'Follow'}
          </button>
        </div>

        {/* Author Bio */}
        <p className="text-xs text-slate-600 italic px-1 leading-relaxed">
          &ldquo;{dest.guide.bio}&rdquo;
        </p>

        {/* Curated Recommendations for the Destination */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              ✓ Handpicked Spots in {dest.name} (1-Click Add)
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              {dest.guide.highlights.length} Curated Sights
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dest.guide.highlights.map((item, idx) => {
              const isAdded = addedPlaces.includes(item.name);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
                >
                  <div className="space-y-3">
                    <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      <span className="absolute top-2 left-2 rounded bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 backdrop-blur-xs">
                        {item.tag}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-md bg-blue-600 text-[10px] font-bold text-white flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                      </div>
                      <span className="text-[10px] text-blue-600 font-semibold block">{item.category}</span>
                      <p className="text-[10px] text-slate-400 font-medium">{item.note}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Add to Plan Button */}
                  <button
                    onClick={() => handleAddToPlan(item.name)}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isAdded ? <Check size={13} strokeWidth={3} /> : <Plus size={13} />}
                    <span>{isAdded ? 'Added to Plan' : 'Add to plan'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
