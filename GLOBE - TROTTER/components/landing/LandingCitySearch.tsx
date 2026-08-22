'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Plus, Check, Filter, Sparkles, Star, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useTripSync } from '@/context/TripSyncContext';

const SEARCH_CITIES = [
  {
    id: 'sc-1',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: '₹₹ Moderate (₹5,200/day)',
    costNum: 5200,
    popularity: 4.9,
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
  },
  {
    id: 'sc-2',
    name: 'Interlaken',
    country: 'Switzerland',
    region: 'Europe',
    costIndex: '₹₹₹ Luxury (₹9,500/day)',
    costNum: 9500,
    popularity: 4.9,
    highlights: ['Jungfraujoch Peak', 'Lake Brienz', 'Glacier Pass'],
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&q=80',
  },
  {
    id: 'sc-3',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: '₹₹ Moderate (₹4,800/day)',
    costNum: 4800,
    popularity: 4.8,
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
  },
  {
    id: 'sc-4',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: '₹₹ Moderate (₹6,100/day)',
    costNum: 6100,
    popularity: 4.9,
    highlights: ['Shibuya Crossing', 'Mount Fuji Day Tour', 'Senso-ji'],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  },
  {
    id: 'sc-5',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    costIndex: '₹ Budget (₹2,900/day)',
    costNum: 2900,
    popularity: 4.8,
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Nusa Penida'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  },
  {
    id: 'sc-6',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: '₹₹ Moderate (₹4,500/day)',
    costNum: 4500,
    popularity: 4.8,
    highlights: ['Sagrada Familia', 'Park Güell', 'Gothic Quarter'],
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80',
  },
];

export function LandingCitySearch() {
  const { addSavedDestination } = useTripSync();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [addedCities, setAddedCities] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return SEARCH_CITIES.filter((city) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = city.name.toLowerCase().includes(q) || city.country.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedRegion !== 'all' && city.region.toLowerCase() !== selectedRegion.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedRegion]);

  const handleAddCity = (city: typeof SEARCH_CITIES[0]) => {
    const isAdded = !addedCities[city.id];
    setAddedCities((prev) => ({ ...prev, [city.id]: isAdded }));
    if (isAdded) {
      addSavedDestination({ id: city.id, name: city.name, country: city.country, img: city.image });
      toast.success(`Added ${city.name} (${city.country}) to your personalized trip itinerary!`);
    } else {
      toast.info(`Removed ${city.name} from trip.`);
    }
  };

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
            City Search & Discovery
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            From inspiration to your next destination
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Search cities, filter by cost index in Indian Rupees (₹), and add stops seamlessly.
          </p>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="max-w-3xl mx-auto mb-10 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Where do you want to go? (e.g. Paris, Tokyo, Rome)"
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-3">
            {['all', 'Europe', 'Asia'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition capitalize cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {reg === 'all' ? 'All Regions' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((city) => {
            const isAdded = !!addedCities[city.id];
            return (
              <div
                key={city.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:border-blue-300 transition"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {city.country}
                    </span>
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-slate-900">
                      <Star size={11} className="text-amber-500 fill-amber-500" />
                      <span>{city.popularity}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-900">{city.name}</h3>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                        {city.costIndex}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {city.highlights.map((h, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddCity(city)}
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-black transition active:scale-98 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-blue-600 text-white shadow-2xs'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={15} strokeWidth={3} />
                      <span>Added to Trip Plan</span>
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      <span>Add to Trip</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
