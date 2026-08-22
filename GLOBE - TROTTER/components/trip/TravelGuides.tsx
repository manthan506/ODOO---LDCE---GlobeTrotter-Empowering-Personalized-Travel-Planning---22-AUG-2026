'use client';

import { useState } from 'react';
import { BookOpen, Compass, Sun, ShieldAlert, CreditCard, Bus, Sparkles, Heart, Bookmark, Users } from 'lucide-react';
import { toast } from 'sonner';

export function TravelGuides({ activeCity = 'Paris' }: { activeCity?: string }) {
  const [following, setFollowing] = useState(false);

  const handleFollow = () => {
    setFollowing(!following);
    toast.success(following ? 'Unfollowed guide' : 'Following Jenny Wilson! New travel recommendations will appear in your feed.');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Top Section Header matching Screen 11 */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Community Travel Guides</h3>
            <p className="text-xs text-slate-500">Get inspired by global guides with expert tips and recommendations</p>
          </div>
        </div>
      </div>

      {/* Hero Guide Card matching Screen 11 */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 shadow-md">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80"
          alt="Paris Travel Guide"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 space-y-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
            Featured Guide
          </span>
          <h2 className="text-2xl font-black">{activeCity} Explorer: Jenny’s Top Picks</h2>
        </div>
      </div>

      {/* Guide Author Row (Screen 11) */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-sm font-bold text-white shadow-xs">
            JW
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Jenny Wilson</h4>
            <p className="text-[11px] text-slate-500">Local Food & Culture Curator • 24 Trips</p>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
            following
              ? 'bg-slate-200 text-slate-700'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
          }`}
        >
          {following ? 'Following ✓' : 'Follow'}
        </button>
      </div>

      <p className="text-xs text-slate-600 italic px-1">
        &ldquo;Bonjour! Here are my personal favorite spots to visit in {activeCity}. From hidden cozy bistros to historic sunset viewpoints, enjoy your adventure!&rdquo;
      </p>

      {/* Curated Recommendations Section (Screen 11: Restaurant & Sights) */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          ✓ Handpicked Dining & Hidden Gems
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: 'Café de Flore & Saint-Germain',
              category: 'Hidden gem • Café • +2 more',
              note: 'Mentioned on 5 other member lists',
              desc: 'A charming spot known for its cozy atmosphere, artisan pastries, and Parisian history.',
              image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
            },
            {
              name: 'Le Marais Boulangerie & Wine Bar',
              category: 'Authentic dining • Bakery',
              note: 'Top rated in 2025 by locals',
              desc: 'Crispy warm baguettes, organic cheeses, and an exquisite selection of Bordeaux wines.',
              image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 hover:border-blue-300 transition"
            >
              <div className="flex gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-blue-600 text-[10px] font-bold text-white mb-1">
                    {idx + 1}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                  <span className="text-[10px] text-blue-600 font-semibold block">{item.category}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{item.note}</p>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
