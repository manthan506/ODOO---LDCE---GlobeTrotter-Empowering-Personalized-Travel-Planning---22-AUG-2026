'use client';

import { useState, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Wallet,
  CheckCircle2,
  Plus,
  Compass,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface PlaceSuggestion {
  id: string;
  name: string;
  category: string;
  duration: string;
  cost: number;
  image: string;
  desc: string;
}

const PLACES_DATA: Record<
  string,
  {
    country: string;
    cover: string;
    suggestions: PlaceSuggestion[];
  }
> = {
  Paris: {
    country: 'France',
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
    suggestions: [
      {
        id: 'paris-1',
        name: 'Eiffel Tower & Seine Cruise',
        category: 'Sightseeing',
        duration: '3h',
        cost: 4200,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        desc: 'Panoramic summit elevator ticket and sunset cruise along the Seine.',
      },
      {
        id: 'paris-2',
        name: 'Louvre Museum Guided Tour',
        category: 'Culture',
        duration: '2.5h',
        cost: 3500,
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=800&q=80',
        desc: 'Skip-the-line pass with art historian for Mona Lisa & Venus de Milo.',
      },
      {
        id: 'paris-3',
        name: 'Montmartre & Sacré-Cœur Walk',
        category: 'Sightseeing',
        duration: '2h',
        cost: 1200,
        image: 'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?w=800&q=80',
        desc: 'Cobblestone alleys, historic artist square, and basilica views.',
      },
      {
        id: 'paris-4',
        name: 'Palace of Versailles Day Trip',
        category: 'Culture',
        duration: '5h',
        cost: 6500,
        image: 'https://images.unsplash.com/photo-1599818816933-4f6c4ff94e50?w=800&q=80',
        desc: 'Hall of Mirrors, Royal Apartments, and the Grand Trianon Gardens.',
      },
      {
        id: 'paris-5',
        name: 'Le Marais Gourmet Pastry Tasting',
        category: 'Food',
        duration: '2h',
        cost: 3200,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
        desc: 'Artisanal macarons, eclairs, freshly baked baguettes & French cheese.',
      },
      {
        id: 'paris-6',
        name: 'Moulin Rouge Evening Cabaret',
        category: 'Entertainment',
        duration: '2.5h',
        cost: 9500,
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
        desc: 'World famous Féerie revue show with champagne service.',
      },
    ],
  },
  Bali: {
    country: 'Indonesia',
    cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
    suggestions: [
      {
        id: 'bali-1',
        name: 'Nusa Penida Coral Reef Diving',
        category: 'Adventure',
        duration: '4.5h',
        cost: 5500,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        desc: 'Swim alongside giant manta rays and crystal bay coral reefs.',
      },
      {
        id: 'bali-2',
        name: 'Ubud Sacred Monkey Forest & Waterfall',
        category: 'Nature',
        duration: '3h',
        cost: 1800,
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
        desc: 'Jungle sanctuary, ancient temple ruins, and Tegenungan waterfall.',
      },
      {
        id: 'bali-3',
        name: 'Mount Batur Sunrise Trekking',
        category: 'Adventure',
        duration: '5h',
        cost: 3200,
        image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80',
        desc: 'Early morning volcano hike with sunrise breakfast cooked in steam vents.',
      },
      {
        id: 'bali-4',
        name: 'Uluwatu Sunset Temple & Kecak Dance',
        category: 'Culture',
        duration: '3h',
        cost: 2400,
        image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
        desc: 'Cliffside sea temple views with traditional sunset fire performance.',
      },
      {
        id: 'bali-5',
        name: 'Tegallalang Rice Terrace Swing',
        category: 'Sightseeing',
        duration: '2h',
        cost: 1500,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        desc: 'Fly above emerald-green valley terraces on an iconic jungle swing.',
      },
      {
        id: 'bali-6',
        name: 'Seminyak Beachside Seafood Dinner',
        category: 'Food',
        duration: '2h',
        cost: 2800,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        desc: 'Grilled Jimbaran seafood platters with beachfront sunset seating.',
      },
    ],
  },
  'Swiss Alps': {
    country: 'Switzerland',
    cover: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80',
    suggestions: [
      {
        id: 'swiss-1',
        name: 'Jungfraujoch Top of Europe',
        category: 'Sightseeing',
        duration: '6h',
        cost: 14500,
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
        desc: 'Eiger Express cableway to 3,454m ice palace and Sphinx observatory.',
      },
      {
        id: 'swiss-2',
        name: 'Zermatt & Matterhorn Glacier Ride',
        category: 'Adventure',
        duration: '4h',
        cost: 9800,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        desc: 'Highest 3S cableway with 360-degree views of 38 alpine peaks.',
      },
      {
        id: 'swiss-3',
        name: 'Lake Geneva & Chillon Castle',
        category: 'Culture',
        duration: '3h',
        cost: 3800,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        desc: 'Medieval fortress on the shores of sparkling Lake Geneva.',
      },
      {
        id: 'swiss-4',
        name: 'Grindelwald First Cliff Walk',
        category: 'Adventure',
        duration: '3.5h',
        cost: 4500,
        image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
        desc: 'Suspension bridge walk along jagged rock faces with valley views.',
      },
      {
        id: 'swiss-5',
        name: 'Traditional Swiss Fondue Tasting',
        category: 'Food',
        duration: '2h',
        cost: 4200,
        image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80',
        desc: 'Authentic Gruyère & Emmental cheese fondue in an alpine chalet.',
      },
      {
        id: 'swiss-6',
        name: 'Lucerne Chapel Bridge & Lake Cruise',
        category: 'Relaxation',
        duration: '2.5h',
        cost: 3100,
        image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&q=80',
        desc: 'Scenic paddle steamer cruise across Lake Lucerne with historic bridge.',
      },
    ],
  },
  Tokyo: {
    country: 'Japan',
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
    suggestions: [
      {
        id: 'tokyo-1',
        name: 'Mount Fuji & Lake Kawaguchi Tour',
        category: 'Sightseeing',
        duration: '8h',
        cost: 7500,
        image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80',
        desc: 'Chureito Pagoda views, Oshino Hakkai spring ponds, and matcha tea.',
      },
      {
        id: 'tokyo-2',
        name: 'Tsukiji Sushi Making Masterclass',
        category: 'Food',
        duration: '2h',
        cost: 4800,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
        desc: 'Learn authentic Edomae nigiri and maki rolling from a master chef.',
      },
      {
        id: 'tokyo-3',
        name: 'teamLab Planets Digital Art Museum',
        category: 'Culture',
        duration: '2.5h',
        cost: 3200,
        image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
        desc: 'Immersive body-interactive digital art exhibits and infinite crystal rooms.',
      },
      {
        id: 'tokyo-4',
        name: 'Shibuya Crossing & Harajuku Culture',
        category: 'Sightseeing',
        duration: '3h',
        cost: 1500,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
        desc: 'The busiest crosswalk in the world, Takeshita street fashion, and crepes.',
      },
      {
        id: 'tokyo-5',
        name: 'Senso-ji Temple & Asakusa Rickshaw',
        category: 'Culture',
        duration: '2h',
        cost: 2600,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        desc: "Tokyo's oldest Buddhist temple and traditional street snacks.",
      },
      {
        id: 'tokyo-6',
        name: 'Akihabara Gaming & Maid Café Tour',
        category: 'Entertainment',
        duration: '2.5h',
        cost: 3400,
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
        desc: 'Explore retro arcade centers, anime collectibles, and themed cafes.',
      },
    ],
  },
  Rome: {
    country: 'Italy',
    cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
    suggestions: [
      {
        id: 'rome-1',
        name: 'Colosseum & Roman Forum VIP Floor',
        category: 'Culture',
        duration: '3h',
        cost: 3800,
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
        desc: 'Gladiator arena floor access with archaeologist guide.',
      },
      {
        id: 'rome-2',
        name: 'Vatican Museums & Sistine Chapel',
        category: 'Culture',
        duration: '3.5h',
        cost: 4800,
        image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&q=80',
        desc: 'Michelangelo’s Sistine Chapel ceiling and St. Peter’s Basilica.',
      },
      {
        id: 'rome-3',
        name: 'Trevi Fountain & Spanish Steps Walk',
        category: 'Sightseeing',
        duration: '2h',
        cost: 800,
        image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80',
        desc: 'Coin toss at Trevi, Pantheon architecture, and Piazza Navona.',
      },
      {
        id: 'rome-4',
        name: 'Handmade Pasta & Gelato Workshop',
        category: 'Food',
        duration: '2.5h',
        cost: 3600,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
        desc: 'Craft fresh fettuccine and tiramisu paired with Italian wine.',
      },
      {
        id: 'rome-5',
        name: 'Catacombs & Appian Way Tour',
        category: 'Culture',
        duration: '3h',
        cost: 2900,
        image: 'https://images.unsplash.com/photo-1529154036634-a62459461159?w=800&q=80',
        desc: 'Ancient underground burial tunnels and the earliest Roman cobblestones.',
      },
      {
        id: 'rome-6',
        name: 'Trastevere Sunset Food & Wine Walk',
        category: 'Food',
        duration: '3h',
        cost: 4100,
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
        desc: 'Crispy Roman pizza, suppli, pecorino cheese, and craft spritz.',
      },
    ],
  },
};

export function CreateTripForm() {
  const router = useRouter();

  // Screen 4 Form Inputs matching Wireframe
  const [selectedPlace, setSelectedPlace] = useState('Paris');
  const [name, setName] = useState('Parisian Dream & Culture Escape');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-24');
  const [description, setDescription] = useState(
    'Exploring iconic art galleries, historical landmarks, gourmet dining, and river cruises.'
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    PLACES_DATA['Paris']?.cover || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80'
  );
  const [budgetCap, setBudgetCap] = useState<number>(75000);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'paris-1',
    'paris-2',
  ]);
  const [loading, setLoading] = useState(false);

  // When place changes, update cover image, default title, and active suggestions
  const handlePlaceChange = (placeName: string) => {
    setSelectedPlace(placeName);
    const placeInfo = PLACES_DATA[placeName];
    if (placeInfo) {
      setCoverImageUrl(placeInfo.cover);
      setName(`${placeName} Getaway & Highlights`);
      // Auto-select first two recommended activities
      if (placeInfo.suggestions.length >= 2) {
        setSelectedActivities([
          placeInfo.suggestions[0].id,
          placeInfo.suggestions[1].id,
        ]);
      }
    }
  };

  const currentSuggestions = useMemo(() => {
    return PLACES_DATA[selectedPlace]?.suggestions || PLACES_DATA['Paris'].suggestions;
  }, [selectedPlace]);

  const toggleActivity = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

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
          name: name || `${selectedPlace} Tour`,
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

      toast.success(`Trip "${data.name}" created with ${selectedActivities.length} activities planned!`);
      router.push(`/trips/${data.id}/plan`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create trip';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Personalized Itinerary Creator
        </span>
      </div>

      {/* Main Container matching Wireframe Screen 4 */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Compass size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Plan a new trip</h1>
              <p className="text-xs text-slate-500">Define destinations, travel dates, and select initial activities</p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-400 block uppercase">Estimated Budget</span>
            <span className="text-sm font-extrabold text-emerald-600">
              ₹{budgetCap.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: FORM INPUTS (Matching Wireframe Screen 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Trip Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Trip Name:
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="e.g. Euro-Alpine Explorer, Bali Tropical Getaway..."
              />
            </div>

            {/* Select a Place : (Dropdown / Quick Picker) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Select a Place :
              </label>
              <div className="relative">
                <select
                  value={selectedPlace}
                  onChange={(e) => handlePlaceChange(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  {Object.keys(PLACES_DATA).map((place) => (
                    <option key={place} value={place}>
                      📍 {place}, {PLACES_DATA[place].country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Destination Pill Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Popular:</span>
                {Object.keys(PLACES_DATA).map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => handlePlaceChange(place)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      selectedPlace === place
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Date: */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Start Date:
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* End Date: */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                End Date:
              </label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Trip Description: */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Trip Description:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Write your trip vision, travel notes, group goals..."
              />
            </div>

            {/* Estimated Budget Slider */}
            <div className="md:col-span-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Trip Budget Limit:</span>
                <span className="text-blue-600 font-extrabold">₹{budgetCap.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={250000}
                step={5000}
                value={budgetCap}
                onChange={(e) => setBudgetCap(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* SECTION 2: SUGGESTION FOR PLACES TO VISIT / ACTIVITIES TO PERFORM (Screen 4 Wireframe 3x2 Grid) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Suggestion for Places to Visit / Activities to perform
                </h2>
                <p className="text-xs text-slate-500">
                  Top recommended experiences in {selectedPlace} • Click to add into itinerary
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {selectedActivities.length} selected
              </span>
            </div>

            {/* 3x2 Grid of 6 interactive suggestion cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentSuggestions.map((item) => {
                const isSelected = selectedActivities.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleActivity(item.id)}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3 cursor-pointer transition duration-200 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Activity Image Thumbnail */}
                      <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>

                        <div className="absolute top-2 right-2">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full transition shadow-xs ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/80 text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Metadata Footer: Duration & ₹ Cost */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock size={12} /> {item.duration}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        ₹{item.cost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: SUBMIT ACTION */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition hover:opacity-95 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Save Trip & Build Itinerary 🚀</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
