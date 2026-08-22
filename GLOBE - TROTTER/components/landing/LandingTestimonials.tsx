'use client';

import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'GlobeTrotter made planning our 3-week Europe trip so easy. The multi-city itinerary builder and ₹ INR budget breakdowns were absolute game changers.',
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    trip: 'Grand Europe Tour (18 Days)',
  },
  {
    quote:
      'I love how I can discover activities, see transparent costs upfront, and organize day-by-day schedules with effortless drag-and-drop. Super helpful and beautifully designed.',
    name: 'Michael Chen',
    location: 'Toronto, Canada',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80',
    trip: 'Japan Autumn Discovery (12 Days)',
  },
  {
    quote:
      'Finally, a travel planner that truly understands travelers! Sharing itineraries with friends and splitting expense logs is seamless. Best tool for our group vacations.',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    trip: 'Swiss Alps & Italy Getaway (14 Days)',
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
            Travelers Love GlobeTrotter
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
            What our travelers say
          </h2>
          <p className="text-base text-slate-500 font-medium mt-2">
            Real experiences from people planning their next adventure.
          </p>
        </div>

        {/* 3 Testimonial Cards matching Reference Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/50 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:bg-white hover:border-blue-300 transition-all duration-300 relative"
            >
              <div>
                {/* Quote Icon */}
                <div className="text-blue-500 mb-4 opacity-80 group-hover:scale-110 transition">
                  <Quote size={28} />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="text-xs font-black text-slate-800 ml-1.5">{test.rating.toFixed(1)} ★</span>
                </div>

                {/* Quote Body */}
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Author Strip */}
              <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-200/80">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900">{test.name}</h4>
                  <span className="text-xs text-slate-500 font-medium block">{test.location}</span>
                  <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{test.trip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
