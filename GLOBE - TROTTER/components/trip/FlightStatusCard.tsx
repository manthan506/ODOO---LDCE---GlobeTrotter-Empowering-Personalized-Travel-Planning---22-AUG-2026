'use client';

import { useState } from 'react';
import {
  Plane,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Pencil,
  Copy,
  Paperclip,
  Check,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface FlightStatusCardProps {
  firstStopCity?: string;
  startDate?: string;
}

interface FlightRecord {
  flightNumber: string;
  airline: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  scheduledDep: string;
  actualDep: string;
  scheduledArr: string;
  actualArr: string;
  duration: string;
  terminalDep: string;
  gateDep: string;
  terminalArr: string;
  gateArr: string;
  status: 'ON SCHEDULE' | 'DELAYED' | 'LANDED';
  confirmationCode: string;
  cost: number;
  notes: string;
}

export function FlightStatusCard({
  firstStopCity = 'Tokyo',
  startDate = 'Jan 20',
}: FlightStatusCardProps) {
  const [flightQuery, setFlightQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeFlightIdx, setActiveFlightIdx] = useState<number>(0);
  const [showEditModal, setShowEditModal] = useState(false);

  const [flights, setFlights] = useState<FlightRecord[]>([
    {
      flightNumber: 'UA 1234',
      airline: 'United Airlines',
      fromCode: 'SFO',
      fromCity: 'San Francisco',
      toCode: 'LAX',
      toCity: 'Los Angeles',
      scheduledDep: '5:30pm',
      actualDep: '6:00pm',
      scheduledArr: '5:30pm',
      actualArr: '7:30pm',
      duration: '1 hr 30 min',
      terminalDep: 'A',
      gateDep: '2',
      terminalArr: 'B',
      gateArr: '-',
      status: 'DELAYED',
      confirmationCode: 'XYZ123',
      cost: 10250,
      notes: 'Carry-on luggage included. Seat 14B aisle.',
    },
    {
      flightNumber: 'UA 321',
      airline: 'United Airlines',
      fromCode: 'SFO',
      fromCity: 'San Francisco',
      toCode: 'NRT',
      toCity: 'Tokyo',
      scheduledDep: '9:30am',
      actualDep: '9:30am',
      scheduledArr: '5:45pm',
      actualArr: '5:45pm',
      duration: '11 hr 15 min',
      terminalDep: 'Intl G',
      gateDep: 'G94',
      terminalArr: '1',
      gateArr: '22',
      status: 'ON SCHEDULE',
      confirmationCode: 'KI8724',
      cost: 54000,
      notes: 'In-flight meals & entertainment confirmed. Seat 22K window.',
    },
  ]);

  const handleSearchFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightQuery.trim()) return;

    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      const queryUpper = flightQuery.toUpperCase().trim();
      const newFlight: FlightRecord = {
        flightNumber: queryUpper,
        airline: queryUpper.startsWith('AI')
          ? 'Air India'
          : queryUpper.startsWith('6E')
          ? 'IndiGo'
          : queryUpper.startsWith('BA')
          ? 'British Airways'
          : queryUpper.startsWith('AF')
          ? 'Air France'
          : 'United Airlines',
        fromCode: 'DEL',
        fromCity: 'New Delhi',
        toCode: firstStopCity === 'Tokyo' ? 'HND' : 'CDG',
        toCity: firstStopCity,
        scheduledDep: '14:30',
        actualDep: '14:30',
        scheduledArr: '18:45',
        actualArr: '18:45',
        duration: '8 hr 15 min',
        terminalDep: '3',
        gateDep: 'B12',
        terminalArr: '2E',
        gateArr: '18',
        status: 'ON SCHEDULE',
        confirmationCode: `GT-${Math.floor(10000 + Math.random() * 90000)}`,
        cost: 450.0,
        notes: 'Tracked via live flight status engine.',
      };

      setFlights([newFlight, ...flights]);
      setActiveFlightIdx(0);
      setFlightQuery('');
      toast.success(`Found live flight status for ${queryUpper}: ON SCHEDULE`);
    }, 800);
  };

  const currentFlight = flights[activeFlightIdx] || flights[0];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Subtitle matching Screenshot 4 */}
      <div className="text-center pb-2">
        <h2 className="text-sm font-bold text-slate-500">Track your flight status in real time</h2>
      </div>

      {/* Flight Search Engine Input */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearchFlight} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={flightQuery}
              onChange={(e) => setFlightQuery(e.target.value)}
              placeholder="Search flight number (e.g. UA 1234, AI 202, 6E 505, AF 218)..."
              className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="flex items-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition active:scale-98 disabled:opacity-50"
          >
            {searching ? <RefreshCw size={13} className="animate-spin" /> : <Plane size={13} />}
            <span>{searching ? 'Looking up...' : 'Track Flight'}</span>
          </button>
        </form>
      </div>

      {/* Main Flights Section Card matching Screenshot 4 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Section Header: ^ Flights with 3-dots */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Plane size={18} className="text-slate-700" />
              Flights
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {flights.length} Tracked
            </span>
          </div>

          <button className="text-slate-400 hover:text-slate-700">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Flight Selector Pills if multiple flights tracked */}
        {flights.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {flights.map((f, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFlightIdx(idx)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  activeFlightIdx === idx
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{f.flightNumber}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                  f.status === 'ON SCHEDULE' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {f.status}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Flight Status Card matching Screenshot 4 */}
        <div className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-6 space-y-6 shadow-xs">
          {/* Top Row: Route & Status Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {currentFlight.fromCode} ➔ {currentFlight.toCode}
              </h3>
              <span
                className={`rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                  currentFlight.status === 'ON SCHEDULE'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {currentFlight.status}
              </span>
            </div>

            <button
              onClick={() => toast.success('Ticket attachment opened')}
              className="text-slate-400 hover:text-slate-700"
              title="Attachment"
            >
              <Paperclip size={16} />
            </button>
          </div>

          <p className="text-xs text-slate-500 -mt-4">
            {currentFlight.airline} {currentFlight.flightNumber} • Sat, Jan 20 • {currentFlight.duration}
          </p>

          {/* Departure / Arrival Grid with Gate & Terminal Info (Screenshot 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {/* Departure */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-700">
                  {currentFlight.fromCode} {currentFlight.fromCity}
                </span>
              </div>
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-xl font-black text-slate-900 font-mono">
                  {currentFlight.actualDep}
                </span>
                {currentFlight.status === 'DELAYED' && (
                  <span className="text-xs font-bold text-slate-400 line-through">
                    {currentFlight.scheduledDep}
                  </span>
                )}
              </div>
              <div className="flex gap-4 pl-4 text-xs text-slate-500 pt-1">
                <span>Terminal: <strong className="text-slate-800">{currentFlight.terminalDep}</strong></span>
                <span>Gate: <strong className="text-slate-800">{currentFlight.gateDep}</strong></span>
              </div>
            </div>

            {/* Arrival */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-xs font-bold text-slate-700">
                  {currentFlight.toCode} {currentFlight.toCity}
                </span>
              </div>
              <div className="flex items-baseline gap-2 pl-4">
                <span className="text-xl font-black text-slate-900 font-mono">
                  {currentFlight.actualArr}
                </span>
                {currentFlight.status === 'DELAYED' && (
                  <span className="text-xs font-bold text-slate-400 line-through">
                    {currentFlight.scheduledArr}
                  </span>
                )}
              </div>
              <div className="flex gap-4 pl-4 text-xs text-slate-500 pt-1">
                <span>Terminal: <strong className="text-slate-800">{currentFlight.terminalArr}</strong></span>
                <span>Gate: <strong className="text-slate-800">{currentFlight.gateArr}</strong></span>
              </div>
            </div>
          </div>

          {/* Check-in prompt (Screenshot 4) */}
          <div className="rounded-xl bg-blue-50/60 p-3 flex items-center justify-between text-xs">
            <span className="text-slate-600">Haven&apos;t checked in yet?</span>
            <button
              onClick={() => toast.success(`Redirecting to ${currentFlight.airline} online check-in`)}
              className="font-bold text-blue-600 hover:underline"
            >
              Check in ➔
            </button>
          </div>

          {/* Live Status Pulsing Indicator & Edit (Screenshot 4) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Updating live status</span>
            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="rounded-lg px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition border border-slate-200"
            >
              Edit
            </button>
          </div>

          {/* Confirmation & Notes (Screenshot 4) */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirmation #
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {currentFlight.confirmationCode}
                </span>
              </div>

              <span className="font-mono font-black text-slate-900 text-sm">
                ₹{Math.round(currentFlight.cost).toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Notes
              </span>
              <p className="text-slate-600">{currentFlight.notes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Flight Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Edit Flight Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirmation Code</label>
                <input
                  defaultValue={currentFlight.confirmationCode}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  defaultValue={currentFlight.notes}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 outline-none h-20"
                />
              </div>
              <button
                onClick={() => {
                  toast.success('Flight details updated');
                  setShowEditModal(false);
                }}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
