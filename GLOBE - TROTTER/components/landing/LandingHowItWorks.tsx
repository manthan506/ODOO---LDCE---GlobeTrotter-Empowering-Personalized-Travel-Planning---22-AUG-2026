'use client';

import { MapPin, Calendar, Wallet, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    step: '1',
    title: 'Choose Destinations',
    description: 'Search and pick the cities you want to visit across the globe.',
    icon: MapPin,
  },
  {
    step: '2',
    title: 'Build Itinerary',
    description: 'Add dates, experiences, activities, and organize daily schedules.',
    icon: Calendar,
  },
  {
    step: '3',
    title: 'Set Budget',
    description: 'Get real-time cost estimates in ₹ INR and manage expense limits.',
    icon: Wallet,
  },
  {
    step: '4',
    title: 'Share & Go!',
    description: 'Share your plan with friends, copy trips, and start your adventure.',
    icon: Send,
  },
];

export function LandingHowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Distinctive Light-Blue Rounded Container matching Reference Visual */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-blue-50/90 via-sky-50/50 to-blue-50/70 border border-blue-100/90 p-8 sm:p-12 lg:p-16 shadow-xl shadow-blue-500/5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Plan your trip in 4 simple steps
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-2">
              From raw wanderlust to a seamless itinerary in minutes.
            </p>
          </div>

          {/* 4 Steps Grid with Numbered Badges & Connecting Line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Dotted Line for Desktop */}
            <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-blue-300/80 -z-0 pointer-events-none" />

            {STEPS.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center text-center space-y-3.5 group"
                >
                  {/* Numbered Circle with Icon matching Reference Visual */}
                  <div className="relative">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white border-2 border-blue-200 text-blue-600 shadow-md group-hover:scale-110 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconComponent size={24} strokeWidth={2.2} />
                    </div>
                    <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white text-[11px] font-black shadow-xs">
                      {step.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs mx-auto mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-blue-500/30 transition hover:shadow-xl active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
