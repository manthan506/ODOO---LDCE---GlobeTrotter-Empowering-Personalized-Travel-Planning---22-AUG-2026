'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileContent } from '@/components/trip/ProfileContent';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ProfileContent />
    </ProtectedRoute>
  );
}
