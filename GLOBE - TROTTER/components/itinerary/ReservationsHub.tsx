'use client';

import { useState } from 'react';
import {
  Plane,
  Hotel,
  Car,
  Paperclip,
  Train,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  DollarSign,
  X,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import type { TripWithDetails } from '@/types';

interface ReservationsHubProps {
  trip?: TripWithDetails | null;
  tripId: string;
}

export function ReservationsHub({ trip, tripId }: ReservationsHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [flightsExpanded, setFlightsExpanded] = useState(true);
  const [hotelsExpanded, setHotelsExpanded] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Reservation items matching Screenshot 8
  const [flights, setFlights] = useState([
    {
      id: 'f1',
      fromCode: 'SFO',
      fromCity: 'San Francisco',
      toCode: 'NRT',
      toCity: 'Tokyo',
      schedule: 'Sat, Jan 20 9:30am — 5:45pm+1',
      airline: 'UNITED AIRLINES UA 321',
      confirmationCode: 'KI8724',
      notes: 'For Rose Chen',
      cost: 1290.75,
      hasAttachment: true,
    },
    {
      id: 'f2',
      fromCode: 'HND',
      fromCity: 'Tokyo',
      toCode: 'SFO',
      toCity: 'San Francisco',
      schedule: 'Sat, Jan 27 6:15pm — 11:30am',
      airline: 'UNITED AIRLINES UA 876',
      confirmationCode: 'KI8725',
      notes: 'Return flight confirmed',
      cost: 1150.0,
      hasAttachment: true,
    },
  ]);

  const [lodging, setLodging] = useState([
    {
      id: 'l1',
      hotelName: 'Hilton Tokyo',
      address: '12 Japan Address, Shinjuku, Tokyo',
      schedule: 'Sat, Jan 20 — Fri, Jan 27',
      details: '7 nights • 1 room, 2 guests',
      confirmationCode: 'WY0242',
      notes: 'Breakfast included, high-floor executive room',
      cost: 1840.0,
      hasAttachment: true,
    },
  ]);

  const [rentalCars, setRentalCars] = useState([
    {
      id: 'r1',
      company: 'Nippon Rent-A-Car',
      carType: 'Compact SUV (Toyota Yaris Cross)',
      schedule: 'Jan 22 — Jan 25',
      confirmationCode: 'RC9901',
      notes: 'ETC toll card included',
      cost: 320.0,
      hasAttachment: true,
    },
  ]);

  const totalSpent = 3750.0;

  const handleAddReservation = (type: string) => {
    toast.success(`New ${type} reservation form opened`);
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 8 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Import your flight and hotel reservations</h2>
      </div>

      {/* Central Browser Frame Card matching Screenshot 8 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Split: Category Icons (Left) & Budgeting Widget (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-100 pb-6">
          {/* Category Icons Grid matching Screenshot 8 (8 cols) */}
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Reservations and attachments
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'flights', label: 'Flights', icon: Plane, count: 2 },
                { id: 'lodging', label: 'Lodging', icon: Hotel, count: 1 },
                { id: 'cars', label: 'Rental cars', icon: Car, count: 1 },
                { id: 'attachments', label: 'Attachment', icon: Paperclip, count: null },
                { id: 'trains', label: 'Trains', icon: Train, count: null },
                { id: 'other', label: 'Other', icon: MoreHorizontal, count: null },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition ${
                    selectedCategory === cat.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat.count && (
                    <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-slate-700 text-white text-[9px] font-black">
                      {cat.count}
                    </span>
                  )}
                  <cat.icon size={16} className="mb-1 text-slate-600" />
                  <span className="text-[10px] font-semibold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budgeting Widget matching Screenshot 8 (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 text-center md:text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Budgeting
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              ${totalSpent.toFixed(2)}
            </h3>
            <button
              onClick={() => toast.info('Navigating to Budgeting breakdown')}
              className="text-xs font-bold text-blue-600 hover:underline inline-block pt-1"
            >
              View details ➔
            </button>
          </div>
        </div>

        {/* SECTION 1: Flights (Screenshot 8) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plane size={16} className="text-blue-600" />
              Flights
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlightsExpanded(!flightsExpanded)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                {flightsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button className="text-slate-400 hover:text-slate-700 p-1">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {flightsExpanded && (
            <div className="space-y-3">
              {flights.map((f) => (
                <div
                  key={f.id}
                  className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-300"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">
                        {f.fromCode} ➔ {f.toCode}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {f.fromCity} ➔ {f.toCity}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{f.schedule}</p>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      {f.airline}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Confirmation #
                      </span>
                      <span className="font-mono font-bold text-slate-900">{f.confirmationCode}</span>
                      <span className="text-[10px] text-slate-500 block">Notes: {f.notes}</span>
                      <span className="font-mono font-black text-slate-900 text-sm block mt-1">
                        ${f.cost.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => toast.success('Ticket attachment downloaded')}
                      className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Attachment"
                    >
                      <Paperclip size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Hotels and Lodging (Screenshot 8) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Hotel size={16} className="text-purple-600" />
              Hotels and lodging
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHotelsExpanded(!hotelsExpanded)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                {hotelsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button className="text-slate-400 hover:text-slate-700 p-1">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {hotelsExpanded && (
            <div className="space-y-3">
              {lodging.map((l) => (
                <div
                  key={l.id}
                  className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-300"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900">{l.hotelName}</h4>
                    <p className="text-xs text-slate-500">{l.address}</p>
                    <p className="text-xs font-semibold text-slate-700">{l.schedule}</p>
                    <span className="text-[10px] text-slate-400">{l.details}</span>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Confirmation #
                      </span>
                      <span className="font-mono font-bold text-slate-900">{l.confirmationCode}</span>
                      <span className="text-[10px] text-slate-500 block">Notes: {l.notes}</span>
                      <span className="font-mono font-black text-slate-900 text-sm block mt-1">
                        ${l.cost.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => toast.success('Hotel voucher attachment opened')}
                      className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Attachment"
                    >
                      <Paperclip size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
