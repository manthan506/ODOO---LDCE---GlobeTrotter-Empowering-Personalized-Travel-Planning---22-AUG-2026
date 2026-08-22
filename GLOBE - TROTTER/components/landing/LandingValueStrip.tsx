'use client';

import { Layers, Wallet, Compass, Calendar, Share2, Sparkles } from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Layers,
    title: 'Multi-City Itineraries',
    description: 'Plan complex trips with ease across multiple cities.',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    description: 'Get real-time cost estimates and budget breakdowns.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    icon: Compass,
    title: 'Discover & Explore',
    description: 'Find activities, attractions and hidden gems.',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    icon: Calendar,
    title: 'Visual Itineraries',
    description: 'See your trip come to life with beautiful timelines.',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    icon: Share2,
    title: 'Share & Collaborate',
    description: 'Share plans and collaborate with friends & family.',
    color: 'bg-teal-50 text-teal-600 border-teal-200',
  },
];

export function LandingValueStrip() {
  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {VALUE_PROPS.map((prop, idx) => {
            const IconComponent = prop.icon;
            return (
              <div
                key={idx}
                className="group flex flex-col items-start p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/70 hover:border-slate-200 transition-all duration-300 shadow-2xs hover:shadow-sm"
              >
                {/* Circular Icon Container matching Reference */}
                <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${prop.color} mb-3.5 group-hover:scale-110 transition duration-300 shadow-2xs`}>
                  <IconComponent size={20} strokeWidth={2.2} />
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-1">
                  {prop.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
