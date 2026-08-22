'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Share2,
  Calendar,
  Pencil,
  MapPin,
  Check,
  X,
  Sparkles,
  Compass,
  Bookmark,
  Landmark,
  Utensils,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { TripWithDetails } from '@/types';
import { getDestinationInfo } from '@/lib/destinationData';
import { fetchRealNearbyPlaces, geocodeCity, RealPlace } from '@/lib/api/openApis';

interface CollaborationWorkspaceProps {
  trip?: TripWithDetails | null;
  tripId: string;
  destinationCity?: string;
}

export function CollaborationWorkspace({
  trip,
  tripId,
  destinationCity = 'Japan',
}: CollaborationWorkspaceProps) {
  const dest = getDestinationInfo(destinationCity || trip?.name);
  const [tripTitle, setTripTitle] = useState(trip?.name || `${dest.name} Trip with Friends`);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [loadingOverpass, setLoadingOverpass] = useState(false);

  // Real tripmates
  const members = trip?.trip_members && trip.trip_members.length > 0
    ? trip.trip_members
    : [
        { id: 'm1', name: 'Trip Owner', email: 'owner@globetrotter.io', color: '#3B82F6' },
      ];

  // Places in shared plan
  const [places, setPlaces] = useState([
    {
      id: 'p1',
      number: 1,
      title: dest.activities[0]?.name || `${dest.name} Historic Citadel`,
      description: dest.activities[0]?.description || `Iconic landmark in ${dest.name}.`,
      image: dest.activities[0]?.image || dest.coverImage,
    },
  ]);

  const [recommendedPlaces, setRecommendedPlaces] = useState<
    Array<{
      id: string;
      title: string;
      category: string;
      image: string;
      activeUser: string | null;
      color: string;
      isDragging?: boolean;
    }>
  >([]);

  useEffect(() => {
    let isMounted = true;
    async function loadPlaces() {
      setLoadingOverpass(true);
      const geo = await geocodeCity(destinationCity);
      const overpassPlaces = await fetchRealNearbyPlaces(geo.lat, geo.lng);

      if (isMounted) {
        setRecommendedPlaces(
          overpassPlaces.slice(0, 6).map((rp, idx) => ({
            id: rp.id,
            title: rp.name,
            category: rp.type,
            image: dest.activities[idx % dest.activities.length]?.image || dest.coverImage,
            activeUser: idx === 0 ? members[0]?.name : idx === 1 ? members[1]?.name || 'Collaborator' : null,
            color: idx === 0 ? '#3B82F6' : '#8B5CF6',
            isDragging: idx === 1,
          }))
        );
        setLoadingOverpass(false);
      }
    }

    loadPlaces();
    return () => {
      isMounted = false;
    };
  }, [destinationCity, members]);

  const handleAddPlace = (rec: any) => {
    setPlaces((prev) => [
      ...prev,
      {
        id: rec.id,
        number: prev.length + 1,
        title: rec.title,
        description: `Verified ${rec.category} attraction in ${dest.name} from OpenStreetMap.`,
        image: rec.image,
      },
    ]);
    toast.success(`Added "${rec.title}" to shared itinerary!`);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    toast.success(`Invite sent to ${newMemberName || newMemberEmail}!`);
    setNewMemberEmail('');
    setNewMemberName('');
    setShowInviteModal(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle with real destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Collaborate on your {dest.name} adventure in real time
        </h2>
      </div>

      {/* Main Collaboration Workspace Browser Card */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={dest.coverImage}
            alt={`${dest.name} Trip Cover`}
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <button
            onClick={() => toast.info('Change cover photo in trip settings')}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition"
            title="Edit cover"
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* Card Header Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            {/* Title */}
            <div className="space-y-2">
              <input
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition"
              />

              {/* Dates */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <Calendar size={13} />
                <span>
                  {trip?.start_date
                    ? `${new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : 'Flexible Trip Dates'}
                </span>
              </div>
            </div>

            {/* Avatars and Invite Button */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {members.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-black text-white shadow-sm"
                    style={{ backgroundColor: m.color || '#3B82F6' }}
                    title={m.name}
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
              >
                <Plus size={14} /> Invite
              </button>
            </div>
          </div>

          {/* Section: Places in Itinerary */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Places to Visit in {dest.name}
            </h3>

            <div className="space-y-3">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4 transition hover:border-slate-300 shadow-xs"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[11px] font-bold text-white flex-shrink-0">
                        {place.number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{place.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 pl-7">{place.description}</p>
                  </div>

                  <div className="h-16 w-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={place.image} alt={place.title} className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Live Overpass Recommended Places */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Overpass OpenStreetMap Places ({dest.name})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">1-Click Add to Plan</span>
            </div>

            {loadingOverpass ? (
              <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-400">
                <Loader2 size={16} className="animate-spin text-blue-600" />
                <span>Loading real attractions near {dest.name}...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {recommendedPlaces.map((rec) => (
                  <div
                    key={rec.id}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-between gap-3 group hover:bg-white hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          {rec.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{rec.title}</h4>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleAddPlace(rec)}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                      >
                        <Plus size={13} /> Add to plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Invite Collaborator</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Collaborator Name</label>
                <input
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none"
                  placeholder="e.g. Alex"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none"
                  placeholder="alex@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Send Invite
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
