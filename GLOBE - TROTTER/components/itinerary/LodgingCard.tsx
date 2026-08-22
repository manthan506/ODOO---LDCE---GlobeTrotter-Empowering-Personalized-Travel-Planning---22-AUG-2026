'use client';

import { useState } from 'react';
import { Hotel, Edit, Save, Check, MapPin, KeyRound, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { Lodging } from '@/types';

interface LodgingCardProps {
  stopId: string;
  lodging?: Lodging;
  cityName?: string;
  onUpdated: () => void;
}

export function LodgingCard({
  stopId,
  lodging = {},
  cityName = 'Paris',
  onUpdated,
}: LodgingCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(lodging.name || '');
  const [checkIn, setCheckIn] = useState(lodging.checkIn || '15:00');
  const [checkOut, setCheckOut] = useState(lodging.checkOut || '11:00');
  const [confirmationCode, setConfirmationCode] = useState(lodging.confirmationCode || '');
  const [address, setAddress] = useState(lodging.address || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/stops/${stopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lodging: {
            name,
            checkIn,
            checkOut,
            confirmationCode,
            address,
          },
        }),
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Lodging details updated');
        setEditing(false);
        onUpdated();
      }
    } catch {
      toast.error('Failed to save lodging');
    } finally {
      setSaving(false);
    }
  };

  const hasData = lodging.name || name;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
            <Hotel size={16} />
          </div>
          <span className="text-xs font-bold text-slate-900">Hotel & Lodging</span>
        </div>

        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {editing ? (
            saving ? 'Saving...' : <><Check size={14} /> Save</>
          ) : (
            <><Edit size={12} /> {hasData ? 'Edit' : 'Add Hotel'}</>
          )}
        </button>
      </div>

      {editing ? (
        <div className="space-y-2 pt-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
            placeholder="Hotel / Airbnb name (e.g. Grand Hotel Central)"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400">Check-in</label>
              <input
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs"
                placeholder="15:00"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400">Check-out</label>
              <input
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs"
                placeholder="11:00"
              />
            </div>
          </div>
          <input
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
            placeholder="Confirmation / Voucher code (e.g. H-88392)"
          />
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
            placeholder="Address / Neighborhood"
          />
        </div>
      ) : hasData ? (
        <div className="rounded-xl bg-slate-50 p-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900">{lodging.name || name}</h5>
            {(lodging.confirmationCode || confirmationCode) && (
              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                {lodging.confirmationCode || confirmationCode}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Check-in: {lodging.checkIn || checkIn}</span>
            <span>•</span>
            <span>Check-out: {lodging.checkOut || checkOut}</span>
          </div>
          {(lodging.address || address) && (
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
              <MapPin size={10} /> {lodging.address || address}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic py-1">No lodging booked for this stop yet.</p>
      )}
    </div>
  );
}
