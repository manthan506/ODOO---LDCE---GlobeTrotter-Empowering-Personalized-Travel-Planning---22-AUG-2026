'use client';

import { useState, useEffect } from 'react';
import {
  WifiOff,
  ArrowDownCircle,
  CheckCircle2,
  Download,
  HardDrive,
  Sparkles,
  Check,
  RefreshCw,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

interface OfflineAccessViewProps {
  currentTripName?: string;
}

export function OfflineAccessView({ currentTripName = 'Japan trip with friends' }: OfflineAccessViewProps) {
  const [offlineStatus, setOfflineStatus] = useState<'cached' | 'downloading'>('cached');
  const [showTooltip, setShowTooltip] = useState(true);

  const trips = [
    {
      id: 't1',
      title: 'Singapore trip',
      tag: 'In 21 days',
      dates: 'May 2-14 • 20 places',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
      avatars: [],
      isOfflineReady: true,
    },
    {
      id: 't2',
      title: 'Japan trip with friends',
      tag: null,
      dates: 'Mar 21-28 • 20 places',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
      ],
      isOfflineReady: true,
      hasPointer: true,
    },
    {
      id: 't3',
      title: 'Portland weekend trip',
      tag: null,
      dates: 'Nov 2-14, 2019 • 20 places',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
      avatars: [],
      isOfflineReady: true,
    },
    {
      id: 't4',
      title: 'New York girls getaway',
      tag: null,
      dates: 'Jun 21-28, 2019 • 20 places',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80',
      avatars: [],
      isOfflineReady: true,
    },
    {
      id: 't5',
      title: 'Hawaii in March',
      tag: null,
      dates: 'Mar 10-18, 2024 • 14 places',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
      avatars: [],
      isOfflineReady: true,
    },
  ];

  const handleForceSync = () => {
    setOfflineStatus('downloading');
    setTimeout(() => {
      setOfflineStatus('cached');
      toast.success('All trip data, maps, and attachments downloaded for offline access.');
    }, 800);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 7 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Access your trip plans anywhere.</h2>
      </div>

      {/* Main Container Card matching Screenshot 7 */}
      <div className="relative rounded-3xl border border-slate-200 bg-[#f8fafc] p-6 sm:p-10 shadow-sm flex items-center justify-center min-h-[520px]">
        {/* Central Trip Cards List Frame (Screenshot 7) */}
        <div className="relative w-full max-w-sm rounded-3xl bg-white p-4 shadow-xl border border-slate-200 divide-y divide-slate-100">
          {trips.map((trip) => (
            <div key={trip.id} className="py-3.5 flex items-center justify-between gap-3 text-xs group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 w-11 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={trip.image} alt={trip.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  {trip.tag && (
                    <span className="text-[9px] font-bold text-rose-500 block">
                      {trip.tag}
                    </span>
                  )}
                  <h4 className="font-bold text-slate-900 truncate">{trip.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    {trip.avatars.length > 0 && (
                      <div className="flex -space-x-1.5">
                        {trip.avatars.map((av, idx) => (
                          <img
                            key={idx}
                            src={av}
                            alt="Tripmate"
                            className="h-3.5 w-3.5 rounded-full object-cover ring-1 ring-white"
                          />
                        ))}
                      </div>
                    )}
                    <span>{trip.dates}</span>
                  </div>
                </div>
              </div>

              {/* Downloaded Offline Icon (Screenshot 7) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success(`${trip.title} is available offline`)}
                  className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition"
                  title="Available Offline"
                >
                  <Download size={12} />
                </button>
                <button className="text-slate-300 hover:text-slate-600">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Floating Large Circular Icon & Blue Tooltip Popup (Screenshot 7) */}
          <div className="absolute -right-12 sm:-right-24 top-[35%] z-30 flex flex-col items-start gap-2">
            {/* White Circle Arrow Indicator (Screenshot 7) */}
            <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-slate-800 shadow-2xl border border-slate-100 animate-bounce">
              <Download size={22} className="text-slate-700" />
            </div>

            {/* Blue Tooltip Card (Screenshot 7: Saved offline) */}
            {showTooltip && (
              <div className="relative -left-20 sm:-left-24 w-64 rounded-2xl bg-[#3366ff] text-white p-4 shadow-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black tracking-wide">Saved offline</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-50">
                  We automatically download every trip plan you open. This icon means your trip plan is available offline.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
