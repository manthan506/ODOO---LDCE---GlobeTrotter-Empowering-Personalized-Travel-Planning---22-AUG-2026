import { Navbar } from '@/components/layout/Navbar';
import { ItineraryBuilder } from '@/components/itinerary/ItineraryBuilder';

export default function ItineraryBuilderPage({ params }: { params: { tripId: string } }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <ItineraryBuilder tripId={params.tripId} />
    </main>
  );
}
