'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, ArrowUpDown, ArrowRight, CheckCircle2, GripVertical, Sparkles, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const DAY_SCHEDULE = [
  { id: 't-1', time: '09:00 AM', title: 'Artisan Croissant & Cafe Au Lait', location: 'Le Marais, Paris', category: 'Breakfast', cost: '₹1,200', tag: 'Dining' },
  { id: 't-2', time: '11:00 AM', title: 'Eiffel Tower Summit & Champagne Access', location: 'Champ de Mars', category: 'Sightseeing', cost: '₹3,800', tag: 'Confirmed' },
  { id: 't-3', time: '02:00 PM', title: 'Bistro Lunch by the Seine River', location: 'Quai de la Tournelle', category: 'Lunch', cost: '₹2,400', tag: 'Dining' },
  { id: 't-4', time: '04:00 PM', title: 'Louvre Museum Priority Guided Tour', location: 'Rue de Rivoli', category: 'Culture', cost: '₹4,200', tag: 'Confirmed' },
  { id: 't-5', time: '07:30 PM', title: 'Classic French 3-Course Gourmet Dinner', location: 'Montmartre', category: 'Dinner', cost: '₹5,500', tag: 'Reservation' },
];

export function LandingTimeline() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [schedule, setSchedule] = useState(DAY_SCHEDULE);

  const handleReorder = (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === schedule.length - 1) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    const list = [...schedule];
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    setSchedule(list);
    toast.success('Activity moved in timeline schedule!');
  };

  return (
    <section id="planner" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
            Trip Calendar & Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            See your entire journey at a glance.
          </h2>
          <p className="text-base text-slate-500 font-medium mt-2">
            Switch effortlessly between chronological vertical timelines, monthly calendar grids, and expandable day-wise lists.
          </p>

          {/* Switcher Tabs matching Figma wireframe */}
          <div className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200 mt-6 shadow-2xs">
            {(['timeline', 'calendar', 'list'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2 text-xs font-black capitalize transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab === 'timeline' ? 'Timeline View' : tab === 'calendar' ? 'Calendar Grid' : 'List Summary'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Interactive Container */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white font-black text-xs shadow-xs">
                D1
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Day 01: Paris Arrival & Iconic Sights</h3>
                <span className="text-xs text-slate-500 font-semibold">September 10, 2026 • 5 Activities</span>
              </div>
            </div>

            <Link
              href="/calendar"
              className="rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition"
            >
              Open Full Calendar →
            </Link>
          </div>

          {/* Activity Cards List with Drag & Reorder Affordances */}
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 hover:bg-white hover:border-blue-300 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => handleReorder(idx, 'up')}
                      disabled={idx === 0}
                      className="text-slate-400 hover:text-blue-600 disabled:opacity-20 text-xs cursor-pointer"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <GripVertical size={16} className="text-slate-400" />
                    <button
                      onClick={() => handleReorder(idx, 'down')}
                      disabled={idx === schedule.length - 1}
                      className="text-slate-400 hover:text-blue-600 disabled:opacity-20 text-xs cursor-pointer"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-blue-600 font-mono">
                        {item.time}
                      </span>
                      <span className="rounded-md bg-blue-100/70 px-1.5 py-0.2 text-[9px] font-bold text-blue-800">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate mt-0.5">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-slate-400" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Cost</span>
                  <p className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                    {item.cost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
