'use client';

import { Navbar } from '@/components/layout/Navbar';
import { DashboardContent } from '@/components/trip/DashboardContent';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <DashboardContent />
    </main>
  );
}
