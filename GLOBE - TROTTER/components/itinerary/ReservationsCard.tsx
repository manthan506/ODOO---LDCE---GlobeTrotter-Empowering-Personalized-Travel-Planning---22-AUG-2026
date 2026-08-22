'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2, Tag, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Reservation } from '@/types';

interface ReservationsCardProps {
  stopId: string;
  reservations?: Reservation[];
  onUpdated: () => void;
}

export function ReservationsCard({
  stopId,
  reservations = [],
  onUpdated,
}: ReservationsCardProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState('Restaurant');
  const [name, setName] = useState('');
  const [time, setTime] = useState('19:30');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    const updated = [
      ...reservations,
      {
        type,
        name,
        time,
        confirmationCode: code,
      },
    ];

    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations: updated }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Reservation saved');
        setName('');
        setCode('');
        setShowAdd(false);
        onUpdated();
      }
    } catch {
      toast.error('Failed to add reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (index: number) => {
    const updated = reservations.filter((_, i) => i !== index);
    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations: updated }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Reservation removed');
        onUpdated();
      }
    } catch {
      toast.error('Failed to delete reservation');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <Calendar size={16} />
          </div>
          <span className="text-xs font-bold text-slate-900">Bookings & Reservations</span>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="space-y-2 rounded-xl bg-slate-50 p-3 border border-slate-200">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
            >
              <option value="Restaurant">Restaurant</option>
              <option value="Train">Train / Transit</option>
              <option value="Museum">Museum / Attraction</option>
              <option value="Car Rental">Car Rental</option>
              <option value="Spa">Spa & Wellness</option>
            </select>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name / Place"
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time (e.g. 19:30)"
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Voucher code"
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {reservations.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-1">No reservations attached to this stop.</p>
      ) : (
        <div className="space-y-1.5">
          {reservations.map((res, i) => (
            <div
              key={res.id || i}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-700">
                    {res.type}
                  </span>
                  <span className="font-bold text-slate-900">{res.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                  {res.time && <span>Time: {res.time}</span>}
                  {res.confirmationCode && (
                    <span className="font-mono font-semibold text-blue-600">
                      • Code: {res.confirmationCode}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(i)}
                className="text-slate-400 hover:text-red-600 p-1"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
