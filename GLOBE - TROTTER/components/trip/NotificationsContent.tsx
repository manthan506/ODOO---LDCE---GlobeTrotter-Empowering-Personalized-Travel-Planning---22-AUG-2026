'use client';

import { useState } from 'react';
import { Bell, MapPin, Hotel, Sparkles, Plane, AlertTriangle, Check, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTrips } from '@/hooks/useTrips';
import { toast } from 'sonner';

export function NotificationsContent() {
  const { trips } = useTrips();
  const [cleared, setCleared] = useState(false);

  const activeTripName = trips.length > 0 ? trips[0].name : 'European Escape';

  const notificationsToday = [
    {
      id: '1',
      title: `Your trip to ${activeTripName} is starting soon!`,
      time: '10:30 AM',
      type: 'trip',
      icon: MapPin,
      iconBg: 'bg-emerald-100 text-emerald-600',
      unread: true,
    },
    {
      id: '2',
      title: 'Hotel booking confirmed in Rome & Swiss Alps',
      time: '9:15 AM',
      type: 'hotel',
      icon: Hotel,
      iconBg: 'bg-amber-100 text-amber-600',
      unread: true,
    },
    {
      id: '3',
      title: 'New activity added to your Itinerary: Hot Air Balloon Ride',
      time: '8:45 AM',
      type: 'activity',
      icon: Sparkles,
      iconBg: 'bg-purple-100 text-purple-600',
      unread: false,
    },
  ];

  const notificationsYesterday = [
    {
      id: '4',
      title: 'Flight tickets to Paris & Zurich confirmed and synced',
      time: 'Yesterday',
      type: 'flight',
      icon: Plane,
      iconBg: 'bg-blue-100 text-blue-600',
      unread: false,
    },
    {
      id: '5',
      title: `Budget notice: 65% of your trip budget for ${activeTripName} utilized`,
      time: 'Yesterday',
      type: 'budget',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 text-rose-600',
      unread: false,
    },
  ];

  const handleClearAll = () => {
    setCleared(true);
    toast.success('All notifications marked as read');
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      {/* Header matching Screen 14 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Notifications</h1>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Mark all read
        </button>
      </div>

      {cleared ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-3">
            <Check size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">All caught up!</h3>
          <p className="text-xs text-slate-500 mt-1">You have no unread travel notifications.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today Group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</span>
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            </div>

            <div className="space-y-2.5">
              {notificationsToday.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl flex-shrink-0 ${n.iconBg}`}>
                      <n.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 block">{n.time}</span>
                    </div>
                  </div>
                  {n.unread && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Yesterday Group */}
          <div className="space-y-3">
            <div className="px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yesterday</span>
            </div>

            <div className="space-y-2.5">
              {notificationsYesterday.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl flex-shrink-0 ${n.iconBg}`}>
                      <n.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 block">{n.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 text-center">
            <button
              onClick={() => toast.info('All past 30 days travel logs synchronized.')}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 transition"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
