'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Compass, Loader2, MapPin, Search, Users, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { toast } from 'sonner';

type SharedTrip = {
  share_slug: string;
  trips: {
    id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    cover_image_url: string | null;
    stops: {
      cities: {
        name: string;
        country: string;
        image_url: string | null;
      } | null;
    }[];
  } | null;
};

export function CommunityContent() {
  const [items, setItems] = useState<SharedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const featuredCommunityTrips = [
    {
      id: 'ft-1',
      title: 'Delhi Heritage Trail & Old Delhi Food Odyssey',
      curator: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
      duration: '4 Days • 12 Places',
      cover: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
      likes: 342,
      stops: ['Red Fort', 'Chandni Chowk', 'Qutub Minar', 'Humayun’s Tomb'],
      category: 'Culture & Food',
    },
    {
      id: 'ft-2',
      title: 'Golden Triangle: Delhi, Agra & Jaipur',
      curator: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
      duration: '7 Days • 18 Places',
      cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
      likes: 512,
      stops: ['India Gate', 'Taj Mahal', 'Amber Palace', 'Hawa Mahal'],
      category: 'Royal Heritage',
    },
    {
      id: 'ft-3',
      title: 'Parisian Romance & Seine Art Walk',
      curator: 'Jenny Wilson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
      duration: '5 Days • 14 Places',
      cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      likes: 420,
      stops: ['Louvre Museum', 'Eiffel Tower', 'Montmartre', 'Latin Quarter'],
      category: 'Art & Romance',
    },
    {
      id: 'ft-4',
      title: 'Barcelona: Gaudí Wonders & Tapas Crawl',
      curator: 'Carlos Mendez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
      duration: '6 Days • 16 Places',
      cover: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
      likes: 289,
      stops: ['Sagrada Família', 'Park Güell', 'Gothic Quarter', 'Barceloneta'],
      category: 'Architecture',
    },
  ];

  useEffect(() => {
    fetch('/api/public/trips')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching public trips:', err);
        setLoading(false);
      });
  }, []);

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success(liked[id] ? 'Removed from favorites' : 'Added to favorites ❤️');
  };

  const filteredFeatured = featuredCommunityTrips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.stops.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-12 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-blue-100">
            <Compass size={16} /> Community Trips
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Inspiring Travel Itineraries ✨
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-blue-100">
            Browse public itineraries curated by travelers worldwide, explore verified routes, and copy into your own planner.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-xs"
            placeholder="Search Delhi, Paris, Heritage, Food..."
          />
        </div>

        {/* Featured Itineraries Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {filteredFeatured.map((t) => (
            <div
              key={t.id}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img src={t.cover} alt={t.title} className="h-full w-full object-cover" />
                  <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 backdrop-blur-xs">
                    {t.category}
                  </span>
                  <button
                    onClick={(e) => handleToggleLike(t.id, e)}
                    className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition"
                  >
                    <Heart
                      size={15}
                      className={liked[t.id] ? 'fill-red-500 text-red-500' : 'text-white'}
                    />
                  </button>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                    <img src={t.avatar} alt={t.curator} className="h-5 w-5 rounded-full object-cover" />
                    <span>{t.curator}</span>
                    <span>•</span>
                    <span>{t.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{t.title}</h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.stops.map((stop, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  ❤️ {liked[t.id] ? t.likes + 1 : t.likes} saves
                </span>

                <Link
                  href="/trips/new"
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Use this template <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
