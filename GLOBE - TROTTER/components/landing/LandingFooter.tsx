'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, Instagram, Facebook, Twitter, Youtube, Send, Heart, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function LandingFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to GlobeTrotter travel updates!');
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid matching Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-900">
          {/* Col 1: Brand & Socials (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Compass size={20} strokeWidth={2.2} />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Globe<span className="text-blue-500">Trotter</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
              Your all-in-one travel planning companion. Plan smarter, travel better, and create unforgettable memories across the globe.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <button
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                title="Instagram"
              >
                <Instagram size={15} />
              </button>
              <button
                onClick={() => window.open('https://facebook.com', '_blank')}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                title="Facebook"
              >
                <Facebook size={15} />
              </button>
              <button
                onClick={() => window.open('https://twitter.com', '_blank')}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-white transition cursor-pointer"
                title="X / Twitter"
              >
                <Twitter size={15} />
              </button>
              <button
                onClick={() => window.open('https://youtube.com', '_blank')}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 hover:bg-red-600 hover:text-white transition cursor-pointer"
                title="YouTube"
              >
                <Youtube size={15} />
              </button>
            </div>
          </div>

          {/* Col 2: Product (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="hover:text-blue-400 transition">Features</Link>
              </li>
              <li>
                <Link href="/trips" className="hover:text-blue-400 transition">Itinerary Planner</Link>
              </li>
              <li>
                <Link href="/budget" className="hover:text-blue-400 transition">Budget Calculator</Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-blue-400 transition">Calendar Timeline</Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-blue-400 transition">Community Trips</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">About Us</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Careers</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Travel Blog</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Press Kit</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="hover:text-blue-400 transition">Travel Guides</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Help Center</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/#home" className="hover:text-blue-400 transition">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter (2-3 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get travel tips & exclusive deals straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 pr-10 text-xs text-white placeholder:text-slate-500 outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                  title="Subscribe"
                >
                  <Send size={13} />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 size={13} /> Subscribed successfully!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 font-medium">
          <p>© 2026 GlobeTrotter. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={13} className="text-rose-500 fill-rose-500 inline" /> for travelers around the world.
          </p>
        </div>
      </div>
    </footer>
  );
}
