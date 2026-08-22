import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Analytics — GlobeTrotter',
  description: 'Monitor user trends, trip data, and platform usage metrics.',
};

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <Navbar />
        <main>
          <AdminDashboard />
        </main>
      </div>
    </ProtectedRoute>
  );
}
