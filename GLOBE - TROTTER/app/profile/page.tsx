import { Navbar } from '@/components/layout/Navbar';
import { ProfileContent } from '@/components/trip/ProfileContent';

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <ProfileContent />
    </main>
  );
}
