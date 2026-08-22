'use client';

import Link from 'next/link';
import { CalendarDays, MapPin, ArrowRight, MoreVertical, Trash2, Edit } from 'lucide-react';
import type { Trip } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

interface TripCardProps {
  trip: Trip;
  index?: number;
  onDeleted?: () => void;
}

export function TripCard({ trip, index = 0, onDeleted }: TripCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const dateStr = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const daysCount = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  // Status mapping
  const statusList = ['In Progress', 'Upcoming', 'Planned', 'Draft'];
  const status = statusList[index % statusList.length];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'In Progress':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Upcoming':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Planned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${trip.name}"?`)) return;

    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Trip deleted');
        if (onDeleted) onDeleted();
      }
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <Link href={`/trips/${trip.id}`} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Numbered Circle (1, 2, 3, 4) */}
          <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-xs font-extrabold text-white flex-shrink-0">
            {index + 1}
          </div>

          {/* Thumbnail */}
          <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
            <img
              src={
                trip.cover_image_url ||
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'
              }
              alt={trip.name}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Trip info */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
              {trip.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{dateStr}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">3 Cities • {daysCount} Days</p>

            <div className="mt-1.5">
              <span
                className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* 3-dots action */}
        <div className="relative flex-shrink-0" onClick={(e) => e.preventDefault()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-32 rounded-xl bg-white p-1 shadow-lg border border-slate-200">
              <Link
                href={`/trips/${trip.id}/plan`}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
              >
                <Edit size={12} /> Edit Stops
              </Link>
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
