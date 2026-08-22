'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Share2, Copy, Check, Users, Sparkles, MessageCircle, Twitter, Facebook, Link2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function LandingSharing() {
  const [copied, setCopied] = useState(false);
  const [cloneCount, setCloneCount] = useState(342);

  const handleCopyLink = () => {
    setCopied(true);
    toast.success('Public Itinerary link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloneTrip = () => {
    setCloneCount((prev) => prev + 1);
    toast.success('Cloned "Europe Summer Escape" into your personal trip planner!');
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* ============================================================ */}
          {/* LEFT: TEXT CONTENT                                           */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2 block">
              Shared & Public Itineraries
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Your trip. Your people.
              <br />
              <span className="text-blue-600">Your plan.</span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Travel is better together. GlobeTrotter lets you generate sleek, read-only public links, collaborate live with co-travelers, and inspire thousands in the global traveler community with 1-click trip cloning.
            </p>

            <div className="space-y-3.5 pt-1">
              <div className="flex items-center gap-3 justify-center lg:justify-start text-sm font-bold text-slate-800">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
                <span>1-Click "Copy Trip" lets friends duplicate your entire route</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start text-sm font-bold text-slate-800">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
                <span>Shareable cards with live currency conversion in ₹ INR</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start text-sm font-bold text-slate-800">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
                <span>Native sharing for WhatsApp, Twitter/X, Instagram, and LinkedIn</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition active:scale-95"
              >
                <span>Explore Community Trips</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: PUBLIC ITINERARY CARD MOCKUP                          */}
          {/* ============================================================ */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl shadow-slate-900/5 space-y-5">
              {/* Card Header with Cover Image */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80"
                  alt="Europe Summer Escape"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-white">
                    🌐 Public
                  </span>
                  <span className="rounded-full bg-black/40 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                    15 Days
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-black">Europe Summer Escape</h3>
                  <p className="text-xs text-slate-200 mt-0.5 font-medium">
                    Paris → Rome → Barcelona → Amsterdam
                  </p>
                </div>
              </div>

              {/* Collaborators & Stats Strip */}
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" alt="Avatar" className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-2xs" />
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80" alt="Avatar" className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-2xs" />
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80" alt="Avatar" className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-2xs" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">3 Co-Planners</span>
                </div>

                <span className="text-xs font-black text-slate-900 font-mono">
                  Est. ₹2,85,000 INR
                </span>
              </div>

              {/* Action Buttons: Copy Trip & Share */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCloneTrip}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-extrabold text-white shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Copy size={15} />
                  <span>Copy Trip ({cloneCount})</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 py-3 text-xs font-bold text-slate-800 transition active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={15} className="text-emerald-600" />
                      <span className="text-emerald-600 font-extrabold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={15} />
                      <span>Share Itinerary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Icon Strip */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.open('https://api.whatsapp.com', '_blank')}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                  title="WhatsApp"
                >
                  <MessageCircle size={16} />
                </button>
                <button
                  onClick={() => window.open('https://twitter.com', '_blank')}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition cursor-pointer"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </button>
                <button
                  onClick={() => window.open('https://facebook.com', '_blank')}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                  title="Facebook"
                >
                  <Facebook size={16} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  title="Copy Direct URL"
                >
                  <Link2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
