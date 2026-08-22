'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { CreateTripForm } from '@/components/trip/CreateTripForm';

export default function CreateTripPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <CreateTripForm />
    </ProtectedRoute>
  );
}
