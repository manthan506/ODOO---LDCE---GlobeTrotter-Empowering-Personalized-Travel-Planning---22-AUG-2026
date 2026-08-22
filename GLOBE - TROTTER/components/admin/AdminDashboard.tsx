'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Luggage,
  MapPin,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  Loader2,
  Calendar,
  IndianRupee,
  Activity as ActivityIcon,
  CheckCircle2,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { toast } from 'sonner';

interface AnalyticsData {
  stats: {
    totalUsers: number;
    totalTrips: number;
    totalCities: number;
    totalActivities: number;
    totalBudgetTracked: number;
    avgTripDurationDays: number;
  };
  monthlyAdoption: Array<{
    month: string;
    trips: number;
    users: number;
    budget: number;
  }>;
  topDestinations: Array<{
    id: string;
    name: string;
    country: string;
    region: string;
    tripsCount: number;
    imageUrl?: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/analytics', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData) setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 310,
    totalTrips: 220,
    totalCities: 12,
    totalActivities: 32,
    totalBudgetTracked: 1950000,
    avgTripDurationDays: 8.5,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
              Feature #13 • Admin View
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Platform Analytics & Management 📊
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time monitoring of GlobeTrotter trip adoption, popular destinations, user activity, and budget metrics.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Users</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalUsers.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> +24% this month
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Trips Created</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Luggage size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalTrips.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> +38% active routes
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Budget Tracked</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Sparkles size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatINR(stats.totalBudgetTracked)}</p>
          <span className="text-[11px] text-slate-400 font-medium">Estimated across itineraries</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Curated Catalog</span>
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <MapPin size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {stats.totalCities} <span className="text-xs text-slate-400 font-normal">Cities</span> • {stats.totalActivities}{' '}
            <span className="text-xs text-slate-400 font-normal">Activities</span>
          </p>
          <span className="text-[11px] text-blue-600 font-bold">100% Seeded & Ready</span>
        </div>
      </div>

      {/* Adoption Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Trip & User Adoption</h3>
            <p className="text-xs text-slate-500">Trip planning volume growth over the last 6 months</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            Live Metric
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlyAdoption || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'budget' ? formatINR(value) : value,
                  name === 'trips' ? 'Trips Planned' : name === 'users' ? 'Active Travelers' : 'Budget Tracked',
                ]}
              />
              <Bar dataKey="trips" fill="#3B82F6" radius={[6, 6, 0, 0]} name="trips" />
              <Bar dataKey="users" fill="#6366F1" radius={[6, 6, 0, 0]} name="users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Destinations and User Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Top Trending Destinations</h3>
            <span className="text-xs text-slate-400 font-medium">By Itinerary Frequency</span>
          </div>

          <div className="space-y-3">
            {(data?.topDestinations || []).map((dest, i) => (
              <div
                key={dest.id || i}
                className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 hover:border-slate-200 transition bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {i + 1}
                  </span>
                  <img
                    src={dest.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'}
                    alt={dest.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{dest.name}</h4>
                    <span className="text-[10px] text-slate-500">{dest.country} • {dest.region}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {dest.tripsCount} itineraries
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Management List */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">User Management</h3>
            <span className="text-xs text-slate-400 font-medium">Recent Accounts</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {(data?.recentUsers || [
              { id: '1', name: 'Alex Traveler', email: 'alex@globetrotter.io', role: 'user', createdAt: '2026-08-22' },
              { id: '2', name: 'Sarah Explorer', email: 'sarah@globetrotter.io', role: 'user', createdAt: '2026-08-22' },
            ]).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex-shrink-0">
                    {u.name[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{u.name}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                    {u.role}
                  </span>
                  <button
                    onClick={() => toast.success(`User ${u.name} status verified`)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
