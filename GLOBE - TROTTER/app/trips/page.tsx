'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { TripListContent } from '@/components/trip/TripListContent';

export default function TripsPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <TripListContent />
    </ProtectedRoute>
  );
}
