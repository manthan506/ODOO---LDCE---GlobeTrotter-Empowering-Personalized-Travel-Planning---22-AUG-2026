'use client';

import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/hooks/useTrips';
import {
  User,
  MapPin,
  Compass,
  Bookmark,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  Mountain,
  Building,
  Flag,
  Shield,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';

export function ProfileContent() {
  const { user, signOut } = useAuth();
  const { trips } = useTrips();

  const userName = user?.name || user?.email?.split('@')[0] || 'Traveler';
  const userEmail = user?.email || 'traveler@globetrotter.io';
  const totalTrips = trips?.length || 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 space-y-6">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        {/* Background gradient banner */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 opacity-90" />

        {/* User Avatar Initial */}
        <div className="relative mx-auto mt-6 mb-3 h-20 w-20 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-md">
          {userName.charAt(0).toUpperCase()}
        </div>

        <h2 className="text-xl font-bold text-slate-900">{userName}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{userEmail}</p>

        {/* Persona tags */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-700">
            Explorer
          </span>
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-[11px] font-bold text-indigo-700">
            Verified Member
          </span>
        </div>

        {/* Real Live Stats */}
        <div className="mt-6 grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 pt-4 text-center">
          <div>
            <span className="text-2xl font-black text-slate-900 block font-mono">{totalTrips}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Trips</span>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block font-mono">₹ INR</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Currency</span>
          </div>
        </div>
      </div>

      {/* Your Travel Account Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Your Travel Account
        </h3>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          <Link
            href="/trips"
            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Briefcase size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">My Trips & Itineraries</h4>
                <p className="text-[10px] text-slate-400">{totalTrips} planned destinations</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          <Link
            href="/explore"
            className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Compass size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Explore Global Destinations</h4>
                <p className="text-[10px] text-slate-400">Search world cities & attractions</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Preferences
        </h3>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Currency & Region</h4>
                <p className="text-[10px] text-slate-400">Indian Rupee (₹) • India</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              INR (₹)
            </span>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div>
        <button
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 py-3.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
        >
          <LogOut size={16} /> Sign Out of GlobeTrotter
        </button>
      </div>
    </div>
  );
}
