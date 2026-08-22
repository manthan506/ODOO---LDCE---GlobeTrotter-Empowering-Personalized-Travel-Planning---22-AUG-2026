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
  destinationCity = 'Delhi',
}: CollaborationWorkspaceProps) {
  const dest = getDestinationInfo(destinationCity || trip?.name);
  const [tripTitle, setTripTitle] = useState(trip?.name || `${dest.name} Trip with Friends`);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [loadingOverpass, setLoadingOverpass] = useState(false);

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
            activeUser: idx === 0 ? 'Rose Chen' : idx === 1 ? 'Lianne Jones' : null,
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
  }, [destinationCity]);

  const handleAddPlace = (rec: any) => {
    setPlaces((prev) => [
      ...prev,
      {
        id: rec.id,
        number: prev.length + 1,
        title: rec.title,
        description: `Verified ${rec.category || 'spot'} in ${dest.name} added to shared itinerary.`,
        image: rec.image,
      },
    ]);
    setRecommendedPlaces((prev) => prev.filter((item) => item.id !== rec.id));
    toast.success(`Added ${rec.title} to ${dest.name} trip plan`);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    toast.success(`Invitation sent to ${newMemberName} (${newMemberEmail || 'collaborator'}) for ${tripTitle}!`);
    setNewMemberName('');
    setNewMemberEmail('');
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
            onClick={() => toast.info('Change cover photo')}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition"
            title="Edit cover"
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* Card Header Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            {/* Title with Live Active Typing Cursor Badge */}
            <div className="space-y-2">
              <div className="relative inline-flex items-center gap-1.5">
                <input
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition"
                />
                <div className="relative -top-3 -right-1 flex flex-col items-start animate-in fade-in">
                  <div className="h-4 w-0.5 bg-blue-600 animate-pulse" />
                  <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md shadow-blue-500/30 whitespace-nowrap">
                    Rose Chen
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <Calendar size={13} />
                <span>
                  {trip?.start_date
                    ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Sep 1'}{' '}
                  -{' '}
                  {trip?.end_date
                    ? new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : 'Sep 10'}
                </span>
              </div>
            </div>

            {/* Tripmate Avatars */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"
                  alt="Rose Chen"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  title="Rose Chen (Editor)"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"
                  alt="James Levi"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  title="James Levi"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
                  alt="Lianne Jones"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  title="Lianne Jones"
                />
                <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 ring-2 ring-white">
                  +3
                </span>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition shadow-xs"
                title="Add Tripmate"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          {/* Section: Places to visit in the Destination */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin size={16} className="text-blue-600" />
                  Places to visit in {dest.name}
                </span>
              </div>

              <button
                onClick={() => toast.info(`Viewing all attractions in ${dest.name}`)}
                className="rounded-full bg-[#ff5a36] hover:bg-[#e04826] px-4 py-1.5 text-xs font-bold text-white shadow-sm transition active:scale-98"
              >
                Browse all
              </button>
            </div>

            {/* Places List */}
            <div className="space-y-3">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-300"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white flex-shrink-0">
                        {place.number}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{place.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 pl-8 leading-relaxed">
                      {place.description}
                    </p>
                  </div>

                  <div className="h-20 w-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 self-end sm:self-center">
                    <img src={place.image} alt={place.title} className="h-full w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>

            {/* Real Recommended Places via Overpass API with Live Presence Badges */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Real Nearby Attractions in {dest.name} (Overpass API)
                </span>
                {loadingOverpass && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Loader2 size={12} className="animate-spin" /> Querying OpenStreetMap...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedPlaces.map((rec) => (
                  <div
                    key={rec.id}
                    className={`relative rounded-2xl border bg-white p-3 flex items-center justify-between gap-2.5 transition shadow-xs ${
                      rec.isDragging
                        ? 'border-red-400 ring-2 ring-red-100 translate-y-[-2px] shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={rec.image} alt={rec.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate block">{rec.title}</span>
                        <span className="text-[9px] text-slate-400 font-medium truncate block">{rec.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddPlace(rec)}
                      className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition flex-shrink-0"
                      title="Add to trip"
                    >
                      <Plus size={14} />
                    </button>

                    {/* Active User Cursor Tag */}
                    {rec.activeUser && (
                      <div
                        className="absolute -bottom-2.5 right-4 z-20 flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold text-white shadow-md animate-in fade-in"
                        style={{ backgroundColor: rec.color || '#8B5CF6' }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        {rec.activeUser}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Tripmate Modal */}
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
                  placeholder="e.g. Rahul"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none"
                  placeholder="rahul@example.com"
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
