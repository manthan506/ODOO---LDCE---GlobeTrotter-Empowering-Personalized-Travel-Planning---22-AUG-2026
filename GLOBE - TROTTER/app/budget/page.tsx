import { Navbar } from '@/components/layout/Navbar';
import { BudgetBreakdown } from '@/components/itinerary/BudgetBreakdown';

export default function BudgetPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <BudgetBreakdown tripId="66c6de59b583f7b2cb1e8921" />
      </div>
    </main>
  );
}
