'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { NotificationsContent } from '@/components/trip/NotificationsContent';

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}
