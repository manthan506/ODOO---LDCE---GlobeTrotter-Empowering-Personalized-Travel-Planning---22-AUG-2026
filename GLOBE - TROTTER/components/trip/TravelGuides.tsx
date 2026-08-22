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

export function TravelGuides({ activeCity = 'Oahu' }: { activeCity?: string }) {
  const [following, setFollowing] = useState(false);
  const [addedPlaces, setAddedPlaces] = useState<string[]>([]);

  const handleFollow = () => {
    setFollowing(!following);
    toast.success(
      following
        ? 'Unfollowed guide'
        : 'Following Jenny Wilson! New travel recommendations will appear in your feed.'
    );
  };

  const handleAddToPlan = (placeName: string) => {
    if (addedPlaces.includes(placeName)) {
      toast.info(`${placeName} is already in your itinerary`);
      return;
    }
    setAddedPlaces([...addedPlaces, placeName]);
    toast.success(`✓ Added ${placeName} directly into your trip itinerary!`);
  };

  const curatedPlaces = [
    {
      id: 'cp1',
      name: 'Café Kaila & Breakfast Bar',
      category: 'Hidden gem • Café • +2 more',
      note: 'Mentioned on 5 other member lists',
      desc: 'A charming spot known for its cozy atmosphere, artisan Belgian waffles, and fresh local fruits.',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
      tag: 'Best Breakfast',
    },
    {
      id: 'cp2',
      name: 'Lanikai Pillbox Ridge Trail',
      category: 'Scenic hike • Viewpoint',
      note: 'Top rated in 2025 by locals',
      desc: 'Short scenic ridge hike overlooking turquoise Mokulua Islands with breathtaking sunrise views.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
      tag: 'Must Visit',
    },
    {
      id: 'cp3',
      name: 'Haleiwa North Shore Seafood',
      category: 'Authentic dining • Seafood',
      note: 'Featured on Travel Channel',
      desc: 'Fresh garlic butter shrimp plates, grilled mahi mahi, and Hawaiian shaved ice.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      tag: 'Local Favorite',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 11 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Get inspired by global guides with expert tips and recommendations
        </h2>
      </div>

      {/* Main Guide Frame Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Hero Guide Cover matching Screenshot 11 */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
            alt="Travel Guide Cover"
            className="absolute inset-0 h-full w-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Featured Guide
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">{activeCity} Explorer: Jenny’s Top Picks</h1>
          </div>
        </div>

        {/* Guide Author Row (Screenshot 11) */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-sm font-bold text-white shadow-xs">
              JW
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Jenny Wilson</h4>
              <p className="text-xs text-slate-500">Local Food & Culture Curator • 24 Trips</p>
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
          &ldquo;Aloha! Here are my personal favorite spots to visit around {activeCity}. From hidden cozy bistros to historic sunrise hikes, easily add these spots directly to your plan!&rdquo;
        </p>

        {/* Curated Recommendations with 1-Click "Add to plan" (Screenshot 11 & Mobile Feature 1) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              ✓ Handpicked Dining & Sights (1-Click Add)
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">3 Curated Places</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {curatedPlaces.map((item, idx) => {
              const isAdded = addedPlaces.includes(item.name);
              return (
                <div
                  key={item.id}
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

                  {/* 1-Click Add to Plan Button (Mobile Feature 1) */}
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
