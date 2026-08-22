import { Navbar } from '@/components/layout/Navbar';
import { TripListContent } from '@/components/trip/TripListContent';

export default function TripsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <TripListContent />
    </main>
  );
}
