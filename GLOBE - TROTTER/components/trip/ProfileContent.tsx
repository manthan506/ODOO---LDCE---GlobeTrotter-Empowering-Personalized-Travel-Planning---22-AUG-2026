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
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export function ProfileContent() {
  const { user, signOut, refetchUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const userName = user?.name || user?.email?.split('@')[0] || 'Alex Traveler';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Profile updated successfully!');
        setEditing(false);
        if (refetchUser) await refetchUser();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 space-y-6">
      {/* Profile Header Card matching Screen 12 */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        {/* Background gradient banner */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 opacity-90" />

        {/* User Avatar with Camera Badge */}
        <div className="relative mx-auto mt-4 mb-3 h-24 w-24">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
            alt={userName}
            className="h-full w-full rounded-full border-4 border-white object-cover shadow-md"
          />
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white border-2 border-white shadow-sm hover:bg-slate-800"
            title="Edit Profile"
          >
            <Camera size={13} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{userName}</h2>
          <button
            onClick={() => {
              setName(user?.name || '');
              setEditing(true);
            }}
            className="text-slate-400 hover:text-blue-600 transition"
            title="Edit Name"
          >
            <Edit3 size={14} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'alex@globetrotter.io'}</p>
        <span className="text-[11px] font-semibold text-blue-600 mt-1 inline-block">
          📍 Explorer • Verified Traveler
        </span>

        {/* Persona tags (Nomad, Explorer) */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-700">
            Nomad
          </span>
          <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-700">
            Explorer
          </span>
        </div>

        {/* 3 Travel Stats (Countries, Mountains, Cities) */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-4 text-center">
          <div>
            <span className="text-xl font-black text-slate-900 block">30</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase">Countries</span>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">93</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase">Mountains</span>
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block">69</span>
            <span className="text-[11px] font-medium text-slate-400 uppercase">Cities</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm space-y-3 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase">Edit Profile Details</h4>
            <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Your Travel Profile Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Your Travel Profile
        </h3>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          <button
            onClick={() => toast.info('Persona Manager: Foodie, Nomad, Explorer active')}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Compass size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Travel Persona Manager</h4>
                <p className="text-[10px] text-slate-400">Foodie, Nomad, Explorer</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => toast.info('Saved Places: 45 destinations on wishlist')}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Bookmark size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Saved Places</h4>
                <p className="text-[10px] text-slate-400">45 Destinations</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => toast.info('Saved Trips: 8 upcoming itineraries saved')}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Flag size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Saved Trips</h4>
                <p className="text-[10px] text-slate-400">8 Upcoming Trips</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Your Preferences Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Your Preferences
        </h3>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <Bell size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                <p className="text-[10px] text-slate-400">Trip reminders and budget alerts</p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-600">On</span>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Currency & Language</h4>
                <p className="text-[10px] text-slate-400">Indian Rupee (₹) • English</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-600">INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 py-3.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
        >
          <LogOut size={16} /> Sign Out of Account
        </button>
      </div>
    </div>
  );
}
