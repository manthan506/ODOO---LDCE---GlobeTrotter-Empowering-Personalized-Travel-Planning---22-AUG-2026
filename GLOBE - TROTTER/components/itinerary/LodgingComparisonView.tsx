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
  DollarSign,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';
import type { TripWithDetails } from '@/types';

interface LodgingComparisonViewProps {
  trip?: TripWithDetails | null;
  tripId: string;
}

export function LodgingComparisonView({ trip, tripId }: LodgingComparisonViewProps) {
  const [destination, setDestination] = useState('Paris');
  const [dates, setDates] = useState('Feb 15 - Feb 17');
  const [guests, setGuests] = useState('1 room, 2 guests');
  const [activeHotelId, setActiveHotelId] = useState<string>('h1');
  const [showPricePopup, setShowPricePopup] = useState(true);

  const formatINR = (val: number) =>
    '₹' + Math.round(val).toLocaleString('en-IN');

  // Hotel Cards in INR matching Screenshot 9
  const hotels = [
    {
      id: 'h1',
      name: 'Grand Hotel Central Paris',
      badge: null,
      rating: '10.0',
      ratingText: 'Exceptional',
      reviewCount: 787,
      details: '4-star hotel • Free WiFi • Free breakfast • Eiffel Tower view • Spa',
      pricePerNight: 8500,
      totalPrice: 17000,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
      mapPin: '₹17,000',
      x: '38%',
      y: '58%',
      rates: [
        { provider: 'GlobeTrotter Direct', price: 15800, isBest: true, isOfficial: false },
        { provider: 'GrandHotelParis.com', price: 16200, isBest: false, isOfficial: true },
        { provider: 'Booking.com', price: 17500, isBest: false, isOfficial: false },
        { provider: 'Expedia.co.in', price: 18200, isBest: false, isOfficial: false },
      ],
    },
    {
      id: 'h2',
      name: 'Le Marais Boutique Hotel',
      badge: null,
      rating: '10.0',
      ratingText: 'Exceptional',
      reviewCount: 234,
      details: '4-star boutique hotel • Free WiFi • Organic breakfast • Central Paris',
      pricePerNight: 7200,
      totalPrice: 14400,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
      mapPin: '₹14,400',
      x: '75%',
      y: '42%',
      rates: [
        { provider: 'GlobeTrotter Direct', price: 14400, isBest: true, isOfficial: false },
        { provider: 'Booking.com', price: 15900, isBest: false, isOfficial: false },
      ],
    },
    {
      id: 'h3',
      name: 'Montmartre Artists Loft',
      badge: 'AIRBNB',
      rating: '10.0',
      ratingText: 'Exceptional',
      reviewCount: 963,
      details: 'Luxury studio • Free WiFi • Kitchenette • Sacré-Cœur views',
      pricePerNight: 4800,
      totalPrice: 9600,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
      mapPin: '₹9,600',
      x: '82%',
      y: '32%',
      rates: [
        { provider: 'Airbnb', price: 9600, isBest: true, isOfficial: true },
        { provider: 'Vrbo', price: 10800, isBest: false, isOfficial: false },
      ],
    },
  ];

  // Map Price Pins in INR matching Screenshot 9
  const mapPins = [
    { id: 'p1', hotelId: 'h1', label: '₹17,000', x: '38%', y: '58%', isSelected: true },
    { id: 'p2', hotelId: 'h3', label: '₹9,600', x: '82%', y: '32%', isSelected: false },
    { id: 'p3', hotelId: 'h2', label: '₹14,400', x: '75%', y: '42%', isSelected: false },
    { id: 'p4', hotelId: null, label: '₹35,000', x: '72%', y: '22%', isSelected: false },
    { id: 'p5', hotelId: null, label: '₹26,500', x: '45%', y: '72%', isSelected: false },
    { id: 'p6', hotelId: null, label: '₹18,200', x: '58%', y: '74%', isSelected: false },
    { id: 'p7', hotelId: null, label: '₹52,000', x: '68%', y: '82%', isSelected: false },
    { id: 'p8', hotelId: null, label: '₹22,500', x: '85%', y: '76%', isSelected: false },
    { id: 'p9', hotelId: null, label: '₹15,000', x: '60%', y: '90%', isSelected: false },
  ];

  const activeHotel = hotels.find((h) => h.id === activeHotelId) || hotels[0];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {/* Subtitle matching Screenshot 9 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">
          Find and book the perfect lodging{' '}
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
            <h3 className="text-lg font-black text-slate-900">Hotels and lodging</h3>
          </div>

          {/* Search Filter Bar in INR */}
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

          {/* Hotel List in INR */}
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
                  {hotel.badge && (
                    <span className="absolute top-2 left-2 rounded bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5">
                      {hotel.badge}
                    </span>
                  )}
                </div>

                {/* Hotel Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{hotel.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <span className="text-blue-700 font-extrabold">{hotel.rating}★</span>
                    <span className="text-slate-600">{hotel.ratingText}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({hotel.reviewCount})</span>
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
                      toast.success(`Booking ${hotel.name} for ${formatINR(hotel.totalPrice)}`);
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

        {/* RIGHT COLUMN: Interactive Map with Live INR Price Pins & Price Popup (5 cols) */}
        <div className="lg:col-span-5 relative bg-[#e2e8f0] h-[400px] lg:h-auto overflow-hidden">
          {/* Map Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] pointer-events-none" />

          {/* Interactive Price Pins in INR */}
          {mapPins.map((pin) => {
            const isSelected = activeHotel.mapPin === pin.label;
            return (
              <div
                key={pin.id}
                onClick={() => {
                  if (pin.hotelId) {
                    setActiveHotelId(pin.hotelId);
                    setShowPricePopup(true);
                  }
                }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] font-black shadow-lg cursor-pointer transition transform hover:scale-125 ${
                  isSelected
                    ? 'bg-slate-900 text-white ring-2 ring-white scale-110 z-30'
                    : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                }`}
                style={{ left: pin.x, top: pin.y }}
              >
                {pin.label}
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
