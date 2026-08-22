'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  Sparkles,
  Heart,
  Plus,
  Check,
  ExternalLink,
  MapPin,
  Loader2,
  Globe,
  Utensils,
  Landmark,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchWikivoyageGuide,
  fetchRealNearbyPlaces,
  geocodeCity,
  WikivoyageGuide,
  RealPlace,
} from '@/lib/api/openApis';
import { getDestinationInfo } from '@/lib/destinationData';

export function TravelGuides({ activeCity = 'Delhi' }: { activeCity?: string }) {
  const dest = getDestinationInfo(activeCity);
  const [guide, setGuide] = useState<WikivoyageGuide | null>(null);
  const [realPlaces, setRealPlaces] = useState<RealPlace[]>([]);
  const [loadingGuide, setLoadingGuide] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [addedPlaces, setAddedPlaces] = useState<string[]>([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoadingGuide(true);
      setLoadingPlaces(true);

      // 1. Geocode
      const geo = await geocodeCity(activeCity);

      // 2. Fetch Wikivoyage Travel Guide
      const wikiGuide = await fetchWikivoyageGuide(activeCity);
      if (isMounted) {
        setGuide(wikiGuide);
        setLoadingGuide(false);
      }

      // 3. Fetch Real Nearby Places via Overpass OpenStreetMap
      const places = await fetchRealNearbyPlaces(geo.lat, geo.lng);
      if (isMounted) {
        setRealPlaces(places);
        setLoadingPlaces(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeCity]);

  const handleFollow = () => {
    setFollowing(!following);
    toast.success(
      following
        ? `Unsaved travel guide`
        : `Saved ${activeCity} travel guide to your offline repository!`
    );
  };

  const handleAddToPlan = (place: RealPlace) => {
    if (addedPlaces.includes(place.name)) {
      toast.info(`${place.name} is already in your plan`);
      return;
    }
    setAddedPlaces([...addedPlaces, place.name]);
    toast.success(`✓ Added ${place.name} (${place.type}) to your ${activeCity} itinerary!`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle with dynamic destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Official Wikivoyage Travel Guide & OpenStreetMap Attractions for {activeCity}
        </h2>
      </div>

      {/* Main Guide Frame Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Hero Guide Cover with Real Destination Photo */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8 shadow-md">
          <img
            src={dest.coverImage}
            alt={`${activeCity} Travel Guide`}
            className="absolute inset-0 h-full w-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Wikivoyage Guide
              </span>
              <span className="rounded-full bg-emerald-500/80 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md">
                Live API
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {guide?.title || activeCity} Travel Insights
            </h1>
          </div>
        </div>

        {/* Wikivoyage Real Description Extract */}
        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Globe size={16} className="text-blue-600" />
              <span>Overview & Travel Insights (Wikivoyage)</span>
            </div>
            {guide?.sourceUrl && (
              <a
                href={guide.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Wikivoyage Entry <ExternalLink size={11} />
              </a>
            )}
          </div>

          {loadingGuide ? (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-3">
              <Loader2 size={14} className="animate-spin text-blue-600" />
              <span>Loading destination intelligence from Wikivoyage...</span>
            </div>
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed">
              {guide?.extract}
            </p>
          )}
        </div>

        {/* Real Nearby Places via Overpass OpenStreetMap API */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark size={16} className="text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Real Attractions & Food Spots (Overpass API)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {realPlaces.length} OpenStreetMap Results
            </span>
          </div>

          {loadingPlaces ? (
            <div className="flex items-center justify-center py-8 text-xs text-slate-400 gap-2">
              <Loader2 size={14} className="animate-spin text-blue-600" />
              <span>Querying live attractions & eateries from Overpass API...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {realPlaces.map((place, idx) => {
                const isAdded = addedPlaces.includes(place.name);
                return (
                  <div
                    key={place.id || idx}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {place.name}
                          </h5>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase flex-shrink-0 ${
                          place.category === 'food'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : place.category === 'historic'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {place.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {place.type}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <MapPin size={11} className="text-slate-400" />
                        <span>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
                      </div>
                    </div>

                    {/* 1-Click Add to Plan Button */}
                    <button
                      onClick={() => handleAddToPlan(place)}
                      className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? <Check size={13} strokeWidth={3} /> : <Plus size={13} />}
                      <span>{isAdded ? 'Added to Itinerary' : 'Add to Plan'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
