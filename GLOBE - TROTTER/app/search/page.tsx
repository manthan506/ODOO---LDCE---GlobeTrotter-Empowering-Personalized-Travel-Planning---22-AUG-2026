import { Navbar } from '@/components/layout/Navbar';
import { ExploreContent } from '@/components/explore/ExploreContent';

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <ExploreContent />
    </main>
  );
}
