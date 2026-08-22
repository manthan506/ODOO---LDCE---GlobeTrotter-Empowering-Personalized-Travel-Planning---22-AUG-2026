import { Navbar } from '@/components/layout/Navbar';
import { ItineraryView } from '@/components/itinerary/ItineraryView';

export default function ItineraryViewPage({ params }: { params: { tripId: string } }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <ItineraryView tripId={params.tripId} />
    </main>
  );
}
