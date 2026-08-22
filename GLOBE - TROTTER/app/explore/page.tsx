'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { ExploreContent } from '@/components/explore/ExploreContent';

export default function ExplorePage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ExploreContent />
    </ProtectedRoute>
  );
}
