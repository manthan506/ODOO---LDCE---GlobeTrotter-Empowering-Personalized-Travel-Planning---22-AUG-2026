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
import { getDestinationInfo } from '@/lib/destinationData';

interface ReservationsHubProps {
  trip?: TripWithDetails | null;
  tripId: string;
  destinationCity?: string;
}

export function ReservationsHub({
  trip,
  tripId,
  destinationCity = 'Delhi',
}: ReservationsHubProps) {
  const dest = getDestinationInfo(destinationCity || trip?.name);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [flightsExpanded, setFlightsExpanded] = useState(true);
  const [hotelsExpanded, setHotelsExpanded] = useState(true);

  const formatINR = (val: number) =>
    '₹' + Math.round(val).toLocaleString('en-IN');

  const flights = dest.flights;
  const hotel = dest.hotels[0] || {
    name: `The Grand Palace ${dest.name}`,
    pricePerNight: 8500,
    totalPrice: 17000,
  };

  const totalSpent = flights.reduce((a, b) => a + b.cost, 0) + hotel.totalPrice;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle with dynamic destination */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Confirmed flights, hotel bookings & vouchers for {dest.name}
        </h2>
      </div>

      {/* Central Browser Frame Card in INR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Split: Category Icons (Left) & Budgeting Widget (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-100 pb-6">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Reservations and attachments ({dest.name})
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'flights', label: 'Flights', icon: Plane, count: flights.length },
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

          {/* Budgeting Widget in INR */}
          <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 text-center md:text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Reservations Total
            </span>
            <h3 className="text-2xl font-black text-slate-900 font-mono">
              {formatINR(totalSpent)}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 block">
              ✓ All bookings confirmed
            </span>
          </div>
        </div>

        {/* SECTION 1: Flights for Destination */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plane size={16} className="text-blue-600" />
              Flights to {dest.name}
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
              {flights.map((f, idx) => (
                <div
                  key={idx}
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
                    <p className="text-xs font-semibold text-slate-700">
                      {f.depTime} — {f.arrTime} ({f.duration})
                    </p>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      {f.airline} {f.flightNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        PNR / Booking
                      </span>
                      <span className="font-mono font-bold text-slate-900">{f.confirmationCode}</span>
                      <span className="font-mono font-black text-slate-900 text-sm block mt-1">
                        {formatINR(f.cost)}
                      </span>
                    </div>

                    <button
                      onClick={() => toast.success('Flight ticket PDF downloaded')}
                      className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      title="Download Ticket"
                    >
                      <Paperclip size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Hotel for Destination */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Hotel size={16} className="text-purple-600" />
              Hotel in {dest.name}
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
              <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-300">
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-900">{hotel.name}</h4>
                  <p className="text-xs text-slate-500">{dest.name}, {dest.country}</p>
                  <p className="text-xs font-semibold text-slate-700">Check-in: 14:00 • 2 nights</p>
                  <span className="text-[10px] text-slate-400">1 Room • 2 Guests • Executive Suite</span>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Voucher Code
                    </span>
                    <span className="font-mono font-bold text-slate-900">WY-DEL841</span>
                    <span className="font-mono font-black text-slate-900 text-sm block mt-1">
                      {formatINR(hotel.totalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => toast.success('Hotel voucher attachment opened')}
                    className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                    title="Download Voucher"
                  >
                    <Paperclip size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
