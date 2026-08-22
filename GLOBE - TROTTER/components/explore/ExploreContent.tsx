'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCities, useTrips } from '@/hooks/useTrips';
import { toast } from 'sonner';
import {
  Search,
  Loader2,
  MapPin,
  Plus,
  X,
  ChevronDown,
  Sparkles,
  Clock,
  Heart,
  SlidersHorizontal,
  DollarSign,
  Compass,
} from 'lucide-react';
import type { City, Activity } from '@/types';
import { ActivityDetailsSheet } from '@/components/itinerary/ActivityDetailsSheet';

const formatINR = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export function ExploreContent() {
  const { cities, loading: loadingCities } = useCities();
  const { trips, refetch: refetchTrips } = useTrips();

  const [activeTab, setActiveTab] = useState<'cities' | 'activities'>('cities');
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [likedActivities, setLikedActivities] = useState<Record<string, boolean>>({});

  // Fetch all activities on mount
  useEffect(() => {
    setLoadingActivities(true);
    fetch('/api/cities/all/activities')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setAllActivities(data);
        setLoadingActivities(false);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setLoadingActivities(false);
      });
  }, []);

  const regions = ['All', 'Europe', 'Asia', 'Americas', 'Africa'];

  // Filtered cities (Screen 8)
  const filteredCities = useMemo(() => {
    return cities.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase());
      const matchesRegion =
        selectedRegion === 'All' ||
        (c as any).region === selectedRegion ||
        (selectedRegion === 'Europe' && ['France', 'Switzerland', 'Italy', 'Spain', 'Turkey'].includes(c.country)) ||
        (selectedRegion === 'Asia' && ['Japan', 'Indonesia', 'Thailand', 'India'].includes(c.country)) ||
        (selectedRegion === 'Americas' && ['USA', 'Brazil', 'Canada'].includes(c.country)) ||
        (selectedRegion === 'Africa' && ['South Africa', 'Egypt', 'Morocco'].includes(c.country));
      return matchesSearch && matchesRegion;
    });
  }, [cities, search, selectedRegion]);

  // Filtered activities (Screen 9)
  const filteredActivities = useMemo(() => {
    return allActivities.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || a.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [allActivities, search, categoryFilter]);

  const handleOpenDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  const handleQuickAddCity = async (city: City) => {
    if (trips.length === 0) {
      toast.info('Create a trip first to add stops');
      return;
    }
    const targetTrip = trips[0];
    try {
      const res = await fetch(`/api/trips/${targetTrip.id}/stops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: city.id,
          arriveDate: targetTrip.start_date || '2025-05-20',
          leaveDate: targetTrip.end_date || '2025-05-24',
        }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success(`Added ${city.name} to ${targetTrip.name}`);
        refetchTrips();
      }
    } catch {
      toast.error('Failed to add stop');
    }
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success(likedActivities[id] ? 'Removed from favorites' : 'Saved to favorites');
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
      {/* Header with Title and Search/Activities Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Explore & Discover 🌍
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Browse world-class destinations, top experiences, and add them directly to your itinerary.
          </p>
        </div>

        {/* View Switcher Tabs (Cities vs Activities) */}
        <div className="flex rounded-2xl bg-slate-100 p-1 self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('cities')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'cities'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Search Cities
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'activities'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore Activities
          </button>
        </div>
      </div>

      {/* Search Input Bar with Filter */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder={
              activeTab === 'cities'
                ? 'Search for cities or countries...'
                : 'Search activities (e.g. Scuba diving, museum, food)...'
            }
          />
        </div>
      </div>

      {/* Screen 8: City Search View */}
      {activeTab === 'cities' && (
        <div className="space-y-6">
          {/* Region Chips (All, Europe, Asia, Americas, Africa) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition flex-shrink-0 ${
                  selectedRegion === reg
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {loadingCities ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                      <img
                        src={city.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                        alt={city.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{city.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{city.country}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {city.cost_index >= 3 ? '$$$$' : city.cost_index === 2 ? '$$$' : '$$'}
                    </span>
                    <button
                      onClick={() => handleQuickAddCity(city)}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm"
                      title="Add to Itinerary"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Screen 9: Activity Search / Browse Grid */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'adventure', label: 'Adventure' },
              { id: 'culture', label: 'Culture' },
              { id: 'sightseeing', label: 'Sightseeing' },
              { id: 'food', label: 'Food & Dining' },
              { id: 'relaxation', label: 'Relaxation' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition flex-shrink-0 ${
                  categoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loadingActivities ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((act) => {
                const liked = likedActivities[act.id];
                return (
                  <div
                    key={act.id}
                    onClick={() => handleOpenDetails(act)}
                    className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 hover:shadow-lg"
                  >
                    {/* Activity Card Hero (Screen 9) */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <img
                        src={act.image_url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'}
                        alt={act.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Top favorite heart */}
                      <button
                        type="button"
                        onClick={(e) => toggleLike(act.id, e)}
                        className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
                      >
                        <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-white'} />
                      </button>

                      {/* Category tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider backdrop-blur-sm">
                          {act.category}
                        </span>
                      </div>
                    </div>

                    {/* Card info */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
                        {act.name}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-400" />
                          <span>{Math.round((act.duration_min || 120) / 60)} - {Math.round((act.duration_min || 120) / 60) + 1} hrs</span>
                        </div>
                        <span className="font-bold text-slate-900">{formatINR(act.cost)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Screen 10: Activity Details Sheet Slide-Over */}
      <ActivityDetailsSheet
        activity={selectedActivity}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddedToTrip={() => {
          refetchTrips();
          setIsDetailsOpen(false);
        }}
      />
    </div>
  );
}
