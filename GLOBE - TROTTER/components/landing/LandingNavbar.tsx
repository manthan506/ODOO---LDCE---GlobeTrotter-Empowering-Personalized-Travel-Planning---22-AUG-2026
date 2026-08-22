'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Globe, ChevronDown, ArrowRight, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTripSync } from '@/context/TripSyncContext';
import { AuthModal } from './AuthModal';

export function LandingNavbar({ onOpenAuth }: { onOpenAuth?: (mode?: 'signin' | 'signup') => void }) {
  const { user, signOut } = useAuth();
  const { userProfile } = useTripSync();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [langOpen, setLangOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Track active section
      const sections = ['home', 'features', 'destinations', 'planner', 'pricing'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openAuth = (mode: 'signin' | 'signup') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      setAuthMode(mode);
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition duration-300">
              <Compass size={22} strokeWidth={2.2} />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-sans">
              Globe<span className="text-blue-600">Trotter</span>
            </span>
          </Link>

          {/* CLEAN DESKTOP & TABLET NAVIGATION (NO HAMBURGER MENU) */}
          <nav className="flex items-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('home')}
              className={`relative py-1 transition hover:text-blue-600 cursor-pointer ${
                activeSection === 'home' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Home
              {activeSection === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('features')}
              className={`relative py-1 transition hover:text-blue-600 cursor-pointer ${
                activeSection === 'features' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Features
              {activeSection === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('destinations')}
              className={`relative py-1 transition hover:text-blue-600 cursor-pointer ${
                activeSection === 'destinations' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Destinations
              {activeSection === 'destinations' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('planner')}
              className={`relative py-1 transition hover:text-blue-600 cursor-pointer hidden sm:block ${
                activeSection === 'planner' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Itinerary Planner
              {activeSection === 'planner' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('pricing')}
              className={`relative py-1 transition hover:text-blue-600 cursor-pointer hidden md:block ${
                activeSection === 'pricing' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Pricing
              {activeSection === 'pricing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Resources Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-1 py-1 transition hover:text-blue-600 cursor-pointer"
              >
                Resources <ChevronDown size={13} className={`transition ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="absolute top-8 left-0 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <Link
                    href="/community"
                    className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Community Trips 🌍
                  </Link>
                  <Link
                    href="/explore"
                    className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setResourcesOpen(false)}
                  >
                    City & Activity Finder 🔍
                  </Link>
                  <Link
                    href="/budget"
                    className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setResourcesOpen(false)}
                  >
                    Trip Cost Calculator 💰
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT SIDE: LANGUAGE & AUTH BUTTONS (ALWAYS VISIBLE, NO HAMBURGER) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <Globe size={13} className="text-blue-600" />
                <span>EN</span>
                <ChevronDown size={11} className="text-slate-400" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-9 w-36 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in duration-200 z-50">
                  <button
                    onClick={() => setLangOpen(false)}
                    className="w-full text-left rounded-xl px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50"
                  >
                    English (US)
                  </button>
                  <button
                    onClick={() => setLangOpen(false)}
                    className="w-full text-left rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Hindi (हिन्दी)
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons / Profile */}
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => openAuth('signin')}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 transition active:scale-95 cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        redirectPath="/dashboard"
      />
    </>
  );
}
