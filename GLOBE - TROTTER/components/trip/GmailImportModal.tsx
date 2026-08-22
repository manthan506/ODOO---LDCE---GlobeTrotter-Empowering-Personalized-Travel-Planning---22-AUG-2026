'use client';

import { useState } from 'react';
import { Mail, Check, Loader2, Sparkles, Hotel, Plane, Calendar, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface FoundReservation {
  id: string;
  type: 'hotel' | 'flight' | 'activity';
  title: string;
  details: string;
  date: string;
  code: string;
  imported?: boolean;
}

interface GmailImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportReservations: (reservations: FoundReservation[]) => void;
}

export function GmailImportModal({
  isOpen,
  onClose,
  onImportReservations,
}: GmailImportModalProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [selected, setSelected] = useState<string[]>(['res-1', 'res-2', 'res-3']);

  const foundReservations: FoundReservation[] = [
    {
      id: 'res-1',
      type: 'flight',
      title: 'Air France Flight AF 218',
      details: 'CDG Paris Terminal 2E',
      date: 'May 20, 2025 · 14:30',
      code: 'AF-89421',
    },
    {
      id: 'res-2',
      type: 'hotel',
      title: 'Hotel Le Marais Boutique Suites',
      details: 'Check-in: 15:00 · 3 Nights (Paris)',
      date: 'May 20 – May 23, 2025',
      code: 'BK-774920',
    },
    {
      id: 'res-3',
      type: 'activity',
      title: 'Louvre Museum Guided VIP Access',
      details: '2 Adults · Priority Entrance',
      date: 'May 21, 2025 · 10:00 AM',
      code: 'LVR-9921',
    },
  ];

  if (!isOpen) return null;

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      toast.success('Found 3 travel confirmations in your inbox!');
    }, 2000);
  };

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleImport = () => {
    const toImport = foundReservations.filter((r) => selected.includes(r.id));
    onImportReservations(toImport);
    toast.success(`Imported ${toImport.length} reservations to your itinerary!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-600">
              <Mail size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Sync Gmail Reservations</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {!scanned && !scanning && (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600">
              <Sparkles size={28} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Automatic Inbox Scanning</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Scan your email confirmations for hotel vouchers, flights, and booked tours to automatically populate your trip itinerary.
              </p>
            </div>
            <button
              onClick={startScan}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition active:scale-98"
            >
              <Mail size={16} /> Scan Inbox
            </button>
          </div>
        )}

        {scanning && (
          <div className="text-center py-10 space-y-4">
            <Loader2 size={36} className="mx-auto animate-spin text-blue-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Scanning your inbox...</h4>
              <p className="text-xs text-slate-400 mt-0.5">Searching for booking vouchers & e-tickets</p>
            </div>
          </div>
        )}

        {scanned && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Found {foundReservations.length} Confirmations:</span>
              <span className="text-blue-600 font-semibold">{selected.length} selected</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {foundReservations.map((item) => {
                const isChecked = selected.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`cursor-pointer rounded-2xl border p-3.5 transition flex items-start justify-between gap-3 ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-slate-200 text-blue-600 flex-shrink-0 mt-0.5">
                        {item.type === 'flight' ? (
                          <Plane size={15} />
                        ) : item.type === 'hotel' ? (
                          <Hotel size={15} />
                        ) : (
                          <Calendar size={15} />
                        )}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                        <p className="text-[10px] text-slate-500">{item.details}</p>
                        <span className="text-[10px] font-mono text-blue-700 font-bold mt-0.5 block">
                          Code: {item.code}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`grid h-5 w-5 place-items-center rounded-full border transition flex-shrink-0 ${
                        isChecked
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selected.length === 0}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Import to Itinerary ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
