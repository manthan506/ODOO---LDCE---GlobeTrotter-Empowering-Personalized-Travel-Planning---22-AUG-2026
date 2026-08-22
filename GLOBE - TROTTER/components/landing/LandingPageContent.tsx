'use client';

import { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingSearchPlanner } from './LandingSearchPlanner';
import { LandingValueStrip } from './LandingValueStrip';
import { LandingProductShowcase } from './LandingProductShowcase';
import { LandingDestinations } from './LandingDestinations';
import { LandingCitySearch } from './LandingCitySearch';
import { LandingActivityDiscovery } from './LandingActivityDiscovery';
import { LandingBudgeting } from './LandingBudgeting';
import { LandingTimeline } from './LandingTimeline';
import { LandingHowItWorks } from './LandingHowItWorks';
import { LandingSharing } from './LandingSharing';
import { LandingTestimonials } from './LandingTestimonials';
import { LandingSocialProof } from './LandingSocialProof';
import { LandingCTA } from './LandingCTA';
import { LandingFooter } from './LandingFooter';
import { AuthModal } from './AuthModal';

export function LandingPageContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [redirectTarget, setRedirectTarget] = useState('/dashboard');

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin', redirect: string = '/dashboard') => {
    setAuthMode(mode);
    setRedirectTarget(redirect);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col scroll-smooth">
      {/* 1. STICKY FIGMA HEADER / NAVBAR (WITHOUT 3-LINE HAMBURGER MENU) */}
      <LandingNavbar onOpenAuth={(mode) => handleOpenAuth(mode, '/dashboard')} />

      <main className="flex-1">
        {/* 2. HERO SECTION WITH BLENDED EARTH/LANDMARKS ARTWORK */}
        <LandingHero onOpenAuth={(mode) => handleOpenAuth(mode, '/trips/new')} />

        {/* 3. HERO FLOATING SEARCH / TRIP PLANNER BAR */}
        <LandingSearchPlanner />

        {/* 4. QUICK VALUE PROPOSITION STRIP (5 ICON BLOCKS) */}
        <LandingValueStrip />

        {/* 5. PRODUCT SHOWCASE SECTION (MY EUROPE TRIP MOCKUP) */}
        <LandingProductShowcase />

        {/* 6. POPULAR DESTINATIONS GRID (5 HORIZONTAL CARDS IN ₹ INR) */}
        <LandingDestinations />

        {/* 7. CITY SEARCH / DISCOVERY MARKETING (FEATURE 7) */}
        <LandingCitySearch />

        {/* 8. ACTIVITY DISCOVERY SECTION (FEATURE 8) */}
        <LandingActivityDiscovery />

        {/* 9. BUDGETING SECTION (FEATURE 9 IN ₹ INR) */}
        <LandingBudgeting />

        {/* 10. ITINERARY / TIMELINE SECTION (FEATURE 10) */}
        <LandingTimeline />

        {/* 11. HOW IT WORKS (4 STEPS LIGHT-BLUE ROUNDED CONTAINER) */}
        <LandingHowItWorks />

        {/* 12. SHARING & COLLABORATION SECTION (FEATURE 11) */}
        <LandingSharing />

        {/* 13. TESTIMONIAL SECTION (3 REAL TRAVELER REVIEWS) */}
        <LandingTestimonials />

        {/* 14. TRUST & COMMUNITY SOCIAL PROOF STRIP */}
        <LandingSocialProof />

        {/* 15. FINAL CINEMATIC MOUNTAIN CTA */}
        <LandingCTA onOpenAuth={(mode) => handleOpenAuth(mode, '/signup')} />
      </main>

      {/* 16. DARK NAVY SAAS FOOTER */}
      <LandingFooter />

      {/* GLOBAL SIGN IN / SIGN UP MODAL OVER SCREEN */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        redirectPath={redirectTarget}
      />
    </div>
  );
}
