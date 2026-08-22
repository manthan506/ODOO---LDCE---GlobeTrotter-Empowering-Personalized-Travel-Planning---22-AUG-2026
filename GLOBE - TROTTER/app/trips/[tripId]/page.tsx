'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ItineraryView } from '@/components/itinerary/ItineraryView';

export default function ItineraryViewPage({ params }: { params: { tripId: string } }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <ItineraryView tripId={params.tripId} />
    </ProtectedRoute>
  );
}
