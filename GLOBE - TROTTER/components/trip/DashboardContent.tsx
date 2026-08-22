'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from '@/components/trip/TripCard';
import { FlightDealsCard } from '@/components/trip/FlightDealsCard';
import {
  MapPin,
  Plus,
  Compass,
  CalendarDays,
  Loader2,
  Search,
  Mic,
  MicOff,
  SlidersHorizontal,
  Luggage,
  Sparkles,
  Lightbulb,
  Wallet,
  ArrowRight,
  TrendingUp,
  Bell,
  CheckCircle2,
  Layers,
  ArrowRightLeft,
  Users,
  CheckSquare,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function DashboardContent() {
  const { user } = useAuth();
  const { trips, loading } = useTrips();
  const [search, setSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const userName = user?.name || user?.email?.split('@')[0] || 'Traveler';
  const upcomingTrip = trips.length > 0 ? trips[0] : null;

  // Real Web Speech API implementation
  const handleToggleVoiceSearch = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice search is not supported in this browser. Try Google Chrome.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('🎙️ Listening... Speak your destination or activity!');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setSearch(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied. Please allow mic access in your browser.');
        } else {
          toast.error('Could not hear voice input. Please try speaking again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      toast.error('Error starting voice recognition');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Greeting & Notification matching Screen 3 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Hi, {userName}! 👋
          </h1>
          <p className="text-xs text-slate-500 font-medium">Where will you go next?</p>
        </div>

        <Link
          href="/notifications"
          className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 animate-ping" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600" />
        </Link>
      </div>

      {/* Real Speech Mic Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`h-12 w-full rounded-2xl border bg-white pl-11 pr-20 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition shadow-xs ${
            isListening
              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
              : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }`}
          placeholder={isListening ? '🎙️ Listening... speak destination now' : 'Search destinations, activities...'}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleVoiceSearch}
            className={`p-2 rounded-xl transition ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
            }`}
            title="Real Voice Search (Mic)"
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        </div>
      </div>

      {/* Quick Action Category Pills (Screen 3) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        <Link
          href="/trips"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-blue-50/70 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Luggage size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Trips</span>
        </Link>

        <Link
          href="/explore"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Sparkles size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Activities</span>
        </Link>

        <Link
          href="/community"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-100 hover:border-amber-300 hover:bg-amber-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-600 text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Compass size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Community</span>
        </Link>

        <Link
          href="/trips/new"
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-rose-50/70 border border-rose-100 hover:border-rose-300 hover:bg-rose-50 transition text-center group"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff5a36] text-white mb-2 shadow-xs group-hover:scale-105 transition">
            <Plus size={18} />
          </div>
          <span className="text-xs font-bold text-slate-800">Plan Trip</span>
        </Link>
      </div>

      {/* Upcoming Trip Progress Card */}
      {upcomingTrip && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Upcoming Adventure
            </span>
            <Link
              href={`/trips/${upcomingTrip.id}`}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Open Trip <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">{upcomingTrip.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date(upcomingTrip.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(upcomingTrip.end_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              Active Plan
            </span>
          </div>
        </div>
      )}

      {/* "Features to replace all your other tools" matching Screenshot 12 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Features to replace all your other tools
          </h2>
          <p className="text-xs text-slate-500">
            The all-in-one travel planner built for individuals and group adventures
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Add places from guides with 1 click',
              desc: "We crawled the web so you don't have to. Easily add mentioned places to your plan.",
              icon: Sparkles,
              color: 'text-amber-500 bg-amber-50',
            },
            {
              title: 'Expense tracking and splitting',
              desc: 'Keep track of your budget and split the cost fairly between your tripmates.',
              icon: ArrowRightLeft,
              color: 'text-emerald-500 bg-emerald-50',
            },
            {
              title: 'Collaborate with friends in real time',
              desc: 'Plan along with your friends with live syncing, active cursors, and collaborative editing.',
              icon: Users,
              color: 'text-blue-500 bg-blue-50',
            },
            {
              title: 'Checklists for anything',
              desc: 'Stay organized with a packing list, to-do list, shopping list, any kind of list.',
              icon: CheckSquare,
              color: 'text-purple-500 bg-purple-50',
            },
            {
              title: 'Get personalized recommendations',
              desc: 'Find the best places to visit with smart recommendations based on your itinerary.',
              icon: Lightbulb,
              color: 'text-rose-500 bg-rose-50',
            },
            {
              title: 'Import flight and hotel reservations',
              desc: 'Track confirmation vouchers, gates, and schedules organized in one clean dashboard.',
              icon: Ticket,
              color: 'text-indigo-500 bg-indigo-50',
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2 hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className={`grid h-8 w-8 place-items-center rounded-xl ${feat.color}`}>
                  <feat.icon size={16} />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-11">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Buttons matching Screenshot 12 */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/trips/new"
            className="w-full sm:w-auto rounded-full bg-[#ff5a36] hover:bg-[#e04826] px-8 py-3 text-xs font-black text-white shadow-md shadow-orange-500/25 transition active:scale-95 text-center"
          >
            Start planning ➔
          </Link>
        </div>
      </div>

      {/* Flight Deals in INR */}
      <FlightDealsCard />
    </div>
  );
}
