import { Navbar } from '@/components/layout/Navbar';
import { CreateTripForm } from '@/components/trip/CreateTripForm';

export default function CreateTripPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Navbar />
      <CreateTripForm />
    </main>
  );
}
