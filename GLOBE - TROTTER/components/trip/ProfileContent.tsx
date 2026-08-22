'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  MapPin,
  Compass,
  Bookmark,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  Mountain,
  Building,
  Flag,
  Shield,
  Edit3,
  Trash2,
  Check,
  X,
  Plus,
  Calendar,
  Wallet,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MASTER_TRIP } from '@/lib/tripDataSync';

const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

interface ProfileTripCard {
  id: string;
  name: string;
  dates: string;
  budget: number;
  stopsCount: number;
  cities: string;
  imageUrl: string;
  status: 'planning' | 'completed';
  link: string;
}

const PREPLANNED_TRIPS: ProfileTripCard[] = [
  {
    id: 'prep-1',
    name: MASTER_TRIP.name,
    dates: 'Sep 10 – Sep 28, 2026',
    budget: MASTER_TRIP.totalEstimatedCost,
    stopsCount: MASTER_TRIP.stopsCount,
    cities: 'Paris • Swiss Alps • Rome • Barcelona',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    status: 'planning',
    link: '/trips',
  },
  {
    id: 'prep-2',
    name: 'Tropical Bali & Coral Isles',
    dates: 'Oct 05 – Oct 14, 2026',
    budget: 58000,
    stopsCount: 3,
    cities: 'Ubud • Seminyak • Nusa Penida',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    status: 'planning',
    link: '/trips',
  },
  {
    id: 'prep-3',
    name: 'Japan Autumn Sakura & Alpine Shrines',
    dates: 'Nov 02 – Nov 14, 2026',
    budget: 112000,
    stopsCount: 4,
    cities: 'Tokyo • Kyoto • Hakone • Osaka',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    status: 'planning',
    link: '/trips',
  },
];

const PREVIOUS_TRIPS: ProfileTripCard[] = [
  {
    id: 'prev-1',
    name: 'Swiss Alpine Glacier Tour',
    dates: 'Completed Aug 2025',
    budget: 94000,
    stopsCount: 4,
    cities: 'Zurich • Interlaken • Zermatt • Geneva',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    status: 'completed',
    link: '/trips',
  },
  {
    id: 'prev-2',
    name: 'Rome & Amalfi Coastal Odyssey',
    dates: 'Completed Jun 2025',
    budget: 82000,
    stopsCount: 3,
    cities: 'Rome • Positano • Capri',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    status: 'completed',
    link: '/trips',
  },
  {
    id: 'prev-3',
    name: 'Himalayan High Passes Expedition',
    dates: 'Completed Mar 2025',
    budget: 46000,
    stopsCount: 3,
    cities: 'Manali • Leh • Nubra Valley',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    status: 'completed',
    link: '/trips',
  },
];

const SAVED_DESTINATIONS = [
  { id: 'sd-1', name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { id: 'sd-2', name: 'Interlaken', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80' },
  { id: 'sd-3', name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
  { id: 'sd-4', name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
  { id: 'sd-5', name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { id: 'sd-6', name: 'Barcelona', country: 'Spain', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80' },
];

import { useTripSync } from '@/context/TripSyncContext';

export function ProfileContent() {
  const { signOut } = useAuth();
  const { userProfile, updateUserProfile, savedDestinations, removeSavedDestination } = useTripSync();

  // Profile Form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [location, setLocation] = useState(userProfile.location);
  const [bio, setBio] = useState(userProfile.bio);
  const [language, setLanguage] = useState(userProfile.language);
  const [currency, setCurrency] = useState(userProfile.currency);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      location,
      bio,
      language,
      currency,
    });
    setIsEditing(false);
  };

  const handleRemoveSavedDest = (id: string, destName: string) => {
    removeSavedDestination(id);
    toast.success(`Removed ${destName} from wishlist`);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    toast.error('Account deletion request submitted');
    signOut();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 pb-28 space-y-8">
      {/* ============================================================ */}
      {/* 1. USER PROFILE HEADER (Screen 7 Wireframe)                  */}
      {/* Left: Image of the User | Right: User Details & Edit Option  */}
      {/* ============================================================ */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* LEFT: IMAGE OF THE USER (Circle matching Screen 7) */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="h-full w-full rounded-full border-4 border-slate-100 object-cover shadow-md ring-4 ring-blue-50"
              />
              <button
                type="button"
                onClick={() => {
                  const newImg = prompt('Enter new avatar image URL:', userProfile.avatar);
                  if (newImg) {
                    updateUserProfile({ avatar: newImg });
                    toast.success('Avatar updated!');
                  }
                }}
                className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white border-2 border-white shadow-md hover:bg-blue-600 transition cursor-pointer"
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                Pro Explorer
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                Verified
              </span>
            </div>
          </div>

          {/* RIGHT: USER DETAILS & EDIT OPTIONS (Screen 7) */}
          <div className="flex-1 w-full text-center md:text-left space-y-4">
            {!isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {userProfile.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      {userProfile.email} • 📍 {userProfile.location}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setName(userProfile.name);
                      setEmail(userProfile.email);
                      setLocation(userProfile.location);
                      setBio(userProfile.bio);
                      setLanguage(userProfile.language);
                      setCurrency(userProfile.currency);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                </div>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  "{userProfile.bio}"
                </p>

                {/* Preferences Strip: Language, Currency */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{language}</p>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Currency</span>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">{currency}</p>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Trips Created</span>
                    <p className="text-xs font-bold text-blue-600 mt-0.5">6 Itineraries</p>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Saved Spots</span>
                    <p className="text-xs font-bold text-purple-600 mt-0.5">{savedDests.length} Cities</p>
                  </div>
                </div>
              </div>
            ) : (
              /* INLINE EDIT PROFILE FORM */
              <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Update Profile Details</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name:</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address:</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location:</label>
                    <input
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Language Preference:</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                      <option value="French (Français)">French (Français)</option>
                      <option value="Spanish (Español)">Spanish (Español)</option>
                      <option value="German (Deutsch)">German (Deutsch)</option>
                      <option value="Japanese (日本語)">Japanese (日本語)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Currency:</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="₹ INR (Indian Rupee)">₹ INR (Indian Rupee)</option>
                      <option value="$ USD (US Dollar)">$ USD (US Dollar)</option>
                      <option value="€ EUR (Euro)">€ EUR (Euro)</option>
                      <option value="£ GBP (British Pound)">£ GBP (British Pound)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Travel Bio & Preferences:</label>
                  <textarea
                    rows={2}
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition"
                  >
                    <Save size={14} /> Save Profile Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. PREPLANNED TRIPS (3 Tall Cards matching Wireframe Screen 7) */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Preplanned Trips</h2>
            <p className="text-xs text-slate-500">Upcoming journeys currently being organized</p>
          </div>
          <Link href="/trips" className="text-xs font-bold text-blue-600 hover:underline">
            Manage all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PREPLANNED_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition duration-300"
            >
              <div>
                <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={trip.imageUrl}
                    alt={trip.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                    Preplanned
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-bold">
                    <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                      {formatINR(trip.budget)}
                    </span>
                    <span className="bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px]">
                      {trip.stopsCount} Stops
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {trip.dates}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                    {trip.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{trip.cities}</p>
                </div>
              </div>

              {/* View Button matching Wireframe */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={trip.link}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-2xs cursor-pointer"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PREVIOUS TRIPS (3 Tall Cards matching Wireframe Screen 7)   */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Previous Trips</h2>
            <p className="text-xs text-slate-500">Completed travel experiences & travel logs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PREVIOUS_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 hover:shadow-md transition duration-300"
            >
              <div>
                <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={trip.imageUrl}
                    alt={trip.name}
                    className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                    ✓ Completed
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs font-bold">
                    <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg">
                      {formatINR(trip.budget)}
                    </span>
                    <span className="bg-slate-800/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px]">
                      {trip.stopsCount} Stops
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {trip.dates}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                    {trip.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{trip.cities}</p>
                </div>
              </div>

              {/* View Button matching Wireframe */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={trip.link}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition shadow-2xs cursor-pointer"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. SAVED DESTINATIONS LIST (Feature 12)                       */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Saved Destinations & Wishlist</h3>
            <p className="text-xs text-slate-500">Quick shortcuts to your bookmarked cities</p>
          </div>
          <Link href="/explore" className="text-xs font-bold text-blue-600 hover:underline">
            Explore more cities →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {savedDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 hover:border-blue-300 hover:bg-white transition"
            >
              <div className="relative h-20 w-full overflow-hidden rounded-xl bg-slate-200">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSavedDest(dest.id, dest.name)}
                  className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                  title="Remove from wishlist"
                >
                  <X size={11} />
                </button>
              </div>
              <div className="mt-2 text-center">
                <h4 className="text-xs font-bold text-slate-900 truncate">{dest.name}</h4>
                <span className="text-[10px] text-slate-400 block truncate">{dest.country}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. PRIVACY & ACCOUNT SETTINGS / DANGER ZONE                  */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-red-200 bg-red-50/40 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
            <ShieldAlert size={18} /> Danger Zone & Account Privacy
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-md">
            Permanently delete your account and all associated itineraries, custom expense logs, and shared trips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition"
          >
            Sign Out
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-100">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Account?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete your account? All your itineraries, saved destinations, and custom preferences will be wiped permanently.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
