'use client';

import { useState } from 'react';
import { BookOpen, Compass, Sun, ShieldAlert, CreditCard, Bus, Sparkles } from 'lucide-react';

interface CityGuide {
  cityName: string;
  country: string;
  bestSeason: string;
  currency: string;
  transitTip: string;
  tipping: string;
  safety: string;
  cultureTip: string;
}

const GUIDES: Record<string, CityGuide> = {
  Paris: {
    cityName: 'Paris',
    country: 'France',
    bestSeason: 'April – October (Mild & Sunny)',
    currency: 'Euro (€) · Cards widely accepted',
    transitTip: 'Use the Metro with Navigo Easy pass; avoid taxis during rush hour.',
    tipping: '5–10% for exceptional dining; service is included in the bill.',
    safety: 'Watch for pickpockets around Eiffel Tower & Gare du Nord.',
    cultureTip: 'Always greet shopkeepers with "Bonjour" before browsing.',
  },
  'Swiss Alps': {
    cityName: 'Swiss Alps',
    country: 'Switzerland',
    bestSeason: 'Dec–Mar (Skiing) & Jun–Sep (Alpine Hikes)',
    currency: 'Swiss Franc (CHF)',
    transitTip: 'The Swiss Travel Pass covers unlimited trains, buses, and scenic lake boats.',
    tipping: 'Not expected, service charge included by law.',
    safety: 'Very safe; always check alpine weather forecasts before mountain hikes.',
    cultureTip: 'Punctuality is valued strictly—trains depart on the exact second.',
  },
  Rome: {
    cityName: 'Rome',
    country: 'Italy',
    bestSeason: 'April–May & September–October',
    currency: 'Euro (€)',
    transitTip: 'Explore historical center on foot; use ATAC metro for Vatican / Colosseum.',
    tipping: 'Round up to nearest €1–€2 at casual trattorias.',
    safety: 'Keep valuables secure in crowded plazas.',
    cultureTip: 'Drink espresso standing at the bar like locals; no cappuccino after 11 AM.',
  },
  Tokyo: {
    cityName: 'Tokyo',
    country: 'Japan',
    bestSeason: 'March–May (Cherry Blossoms) & Oct–Nov (Autumn Leaves)',
    currency: 'Japanese Yen (¥) · Carry cash for small ramen bars',
    transitTip: 'Get a digital Suica / Pasmo IC card on your phone for all subways & convenience stores.',
    tipping: 'Never tip in Japan—it is considered impolite.',
    safety: 'One of the safest global cities in the world.',
    cultureTip: 'Keep your voice down on public trains; stand on left side of escalators.',
  },
  Bali: {
    cityName: 'Bali',
    country: 'Indonesia',
    bestSeason: 'April – October (Dry Season)',
    currency: 'Indonesian Rupiah (IDR)',
    transitTip: 'Use Grab or Gojek apps for rides and food deliveries.',
    tipping: '5–10% appreciated at restaurants and for private drivers.',
    safety: 'Drink bottled/filtered water; rent scooters only with international permit.',
    cultureTip: 'Dress respectfully with a sarong when entering temples.',
  },
};

export function TravelGuides({ activeCity = 'Paris' }: { activeCity?: string }) {
  const [selectedCity, setSelectedCity] = useState<string>(activeCity);

  const guide = GUIDES[selectedCity] || GUIDES['Paris'];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Local Travel Guide</h3>
            <span className="text-[10px] text-slate-400">Curated cultural insights & transit advice</span>
          </div>
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 outline-none"
        >
          {Object.keys(GUIDES).map((c) => (
            <option key={c} value={c}>
              {c} Guide
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-purple-50/50 border border-purple-100 p-3.5 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
            <Sun size={14} className="text-purple-600" /> Best Time to Visit
          </span>
          <p className="text-xs text-purple-950/80">{guide.bestSeason}</p>
        </div>

        <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-3.5 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <Bus size={14} className="text-blue-600" /> Getting Around
          </span>
          <p className="text-xs text-blue-950/80">{guide.transitTip}</p>
        </div>

        <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-3.5 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <CreditCard size={14} className="text-amber-600" /> Tipping & Currency
          </span>
          <p className="text-xs text-amber-950/80">{guide.tipping} • {guide.currency}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-3.5 space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <Sparkles size={14} className="text-emerald-600" /> Local Customs
          </span>
          <p className="text-xs text-emerald-950/80">{guide.cultureTip}</p>
        </div>
      </div>
    </div>
  );
}
