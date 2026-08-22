'use client';

import { useState } from 'react';
import {
  Hotel,
  Calendar,
  Users,
  Search,
  Star,
  ExternalLink,
  ChevronDown,
  Check,
  MapPin,
  Sparkles,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';
import type { TripWithDetails } from '@/types';
import { getDestinationInfo } from '@/lib/destinationData';

interface LodgingComparisonViewProps {
  trip?: TripWithDetails | null;
  tripId: string;
  destinationCity?: string;
}

export function LodgingComparisonView({
  trip,
  tripId,
  destinationCity = 'Delhi',
}: LodgingComparisonViewProps) {
  const dest = getDestinationInfo(destinationCity || trip?.name);
  const [destination, setDestination] = useState(dest.name);
  const [dates, setDates] = useState('Feb 15 - Feb 17');
  const [guests, setGuests] = useState('1 room, 2 guests');
  const [activeHotelId, setActiveHotelId] = useState<string>(dest.hotels[0]?.id || 'h1');
  const [showPricePopup, setShowPricePopup] = useState(true);

  const formatINR = (val: number) =>
    '₹' + Math.round(val).toLocaleString('en-IN');

  const hotels = dest.hotels;
  const activeHotel = hotels.find((h) => h.id === activeHotelId) || hotels[0];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Subtitle with real city name */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Find and book verified stays in {dest.name}, {dest.country}{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">Learn more ➔</span>
        </h2>
      </div>

      {/* Main Lodging Browser Frame in INR */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* LEFT COLUMN: Hotel Cards & Search Bar (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto max-h-[660px]">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Hotel size={18} className="text-[#ff5a36]" />
            <h3 className="text-lg font-black text-slate-900">Hotels and lodging in {dest.name}</h3>
          </div>

          {/* Search Filter Bar */}
          <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-3 grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Where
              </span>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 outline-none text-xs"
              />
            </div>
            <div className="border-l border-slate-200 pl-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                When
              </span>
              <span className="font-bold text-slate-900 text-xs block truncate">{dates}</span>
            </div>
            <div className="border-l border-slate-200 pl-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Rooms, guests
              </span>
              <span className="font-bold text-slate-900 text-xs block truncate">{guests}</span>
            </div>
          </div>

          {/* Hotel List */}
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => {
                  setActiveHotelId(hotel.id);
                  setShowPricePopup(true);
                }}
                className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 cursor-pointer transition ${
                  activeHotelId === hotel.id
                    ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-100 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Hotel Photo */}
                <div className="relative h-24 sm:h-28 w-full sm:w-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
                </div>

                {/* Hotel Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{hotel.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <span className="text-blue-700 font-extrabold">{hotel.rating}★</span>
                    <span className="text-slate-600">{hotel.ratingText}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({hotel.reviews})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {hotel.details}
                  </p>
                </div>

                {/* Price in INR & CTA */}
                <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-end flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-mono">
                      {formatINR(hotel.pricePerNight)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/night</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      {formatINR(hotel.totalPrice)} total
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success(`Booking reserved for ${hotel.name}: ${formatINR(hotel.totalPrice)}`);
                    }}
                    className="mt-2 rounded-xl bg-[#ff5a36] hover:bg-[#e04826] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition active:scale-95"
                  >
                    View deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Map with Real Hotel Location Pins */}
        <div className="lg:col-span-5 relative bg-[#e2e8f0] h-[400px] lg:h-auto overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('${dest.coverImage}')`,
            }}
          />
          <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Interactive Price Pins for Real Hotels */}
          {hotels.map((hotel, idx) => {
            const isSelected = activeHotel.id === hotel.id;
            const leftPct = `${35 + idx * 22}%`;
            const topPct = `${40 + idx * 18}%`;
            return (
              <div
                key={hotel.id}
                onClick={() => {
                  setActiveHotelId(hotel.id);
                  setShowPricePopup(true);
                }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[10px] font-black shadow-lg cursor-pointer transition transform hover:scale-125 ${
                  isSelected
                    ? 'bg-slate-900 text-white ring-2 ring-white scale-110 z-30'
                    : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                }`}
                style={{ left: leftPct, top: topPct }}
              >
                {formatINR(hotel.totalPrice)}
              </div>
            );
          })}

          {/* Floating Rate Comparison Popup in INR */}
          {showPricePopup && activeHotel && (
            <div className="absolute bottom-6 left-6 right-6 z-30 rounded-2xl bg-white/98 backdrop-blur-md p-4 shadow-2xl border border-slate-200 space-y-2.5 animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="text-xs font-black text-slate-900 truncate">
                  {activeHotel.name}
                </h5>
                <span className="text-[10px] font-bold text-slate-400">Live Rates (INR)</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {activeHotel.rates.map((rate, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-none">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800">{rate.provider}</span>
                      {rate.isOfficial && (
                        <span className="rounded bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.2 uppercase">
                          OFFICIAL SITE
                        </span>
                      )}
                      {rate.isBest && (
                        <span className="rounded bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.2 uppercase">
                          BEST DEAL
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatINR(rate.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
