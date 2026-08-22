'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ItineraryBuilder } from '@/components/itinerary/ItineraryBuilder';

export default function ItineraryBuilderPage({ params }: { params: { tripId: string } }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <ItineraryBuilder tripId={params.tripId} />
    </ProtectedRoute>
  );
}
