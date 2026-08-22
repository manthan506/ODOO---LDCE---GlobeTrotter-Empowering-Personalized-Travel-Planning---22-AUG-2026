'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardContent } from '@/components/trip/DashboardContent';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardContent />
    </ProtectedRoute>
  );
}
