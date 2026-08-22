import { Navbar } from '@/components/layout/Navbar';
import { CalendarViewContent } from '@/components/itinerary/CalendarViewContent';

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <CalendarViewContent />
    </main>
  );
}
