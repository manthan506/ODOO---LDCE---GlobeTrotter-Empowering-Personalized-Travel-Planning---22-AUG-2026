'use client';

import { useState } from 'react';
import { Compass, Sparkles, Sliders, Mic, Mountain, User, Car, Users, Check } from 'lucide-react';
import { toast } from 'sonner';

export type TravelStyle = 'adventure' | 'solo' | 'roadtrip' | 'family';

interface PlanTripStepProps {
  budgetCap: number;
  onBudgetChange: (val: number) => void;
  travelStyle: TravelStyle;
  onTravelStyleChange: (style: TravelStyle) => void;
  destinationHint?: string;
  onDestinationSelect?: (city: string) => void;
}

export function PlanTripStep({
  budgetCap,
  onBudgetChange,
  travelStyle,
  onTravelStyleChange,
  destinationHint = 'Mount Fuji, Japan',
  onDestinationSelect,
}: PlanTripStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([14, 15, 16, 17, 18, 19, 20]);

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(true);
    toast.info('Listening for destination... (Demo voice input)');
    setTimeout(() => {
      setIsRecording(false);
      const suggestions = ['Swiss Alps, Switzerland', 'Paris, France', 'Rome, Italy', 'Bali, Indonesia'];
      const picked = suggestions[Math.floor(Math.random() * suggestions.length)];
      if (onDestinationSelect) onDestinationSelect(picked);
      toast.success(`Heard destination: "${picked}"`);
    }, 1800);
  };

  const travelStyles = [
    {
      id: 'adventure',
      title: 'Adventure',
      icon: Mountain,
      desc: 'Hikes, outdoors & thrill',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80',
    },
    {
      id: 'solo',
      title: 'Solo Travel',
      icon: User,
      desc: 'Freedom, reflection & culture',
      img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&q=80',
    },
    {
      id: 'roadtrip',
      title: 'Road Trip',
      icon: Car,
      desc: 'Scenic routes & flexibility',
      img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&q=80',
    },
    {
      id: 'family',
      title: 'Family Tour',
      icon: Users,
      desc: 'Kid-friendly & relaxed pace',
      img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&q=80',
    },
  ];

  return (
    <div className="space-y-6 pt-2">
      {/* Destination Hero Card with Voice / Mic icon */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Compass size={22} className="text-white animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">Suggested Destination</p>
              <h3 className="text-lg font-bold text-white">{destinationHint}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
              isRecording ? 'bg-red-500 animate-ping' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md'
            }`}
            title="Voice Search Destination"
          >
            <Mic size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Date & Budget section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Date & Budget</h4>
          <span className="text-xs font-semibold text-blue-600">Saved</span>
        </div>

        {/* Days chip selector */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-2 px-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {[14, 15, 16, 17, 18, 19, 20].map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`flex h-9 items-center justify-center rounded-full text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Amount slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Budget Amount</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              ₹{budgetCap ? budgetCap.toLocaleString('en-IN') : '1,10,000'}
            </span>
          </div>
          <input
            type="range"
            min="20000"
            max="300000"
            step="5000"
            value={budgetCap || 110000}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
          />
          <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-1">
            <span>₹20,000</span>
            <span>₹3,00,000</span>
          </div>
        </div>
      </div>

      {/* Travel Style Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Travel Style</h4>
          <span className="text-xs font-semibold text-blue-600">Select style</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {travelStyles.map((item) => {
            const isSelected = travelStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTravelStyleChange(item.id as TravelStyle)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <div className={`mb-2 grid h-10 w-10 place-items-center rounded-xl transition ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <item.icon size={20} />
                </div>
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
