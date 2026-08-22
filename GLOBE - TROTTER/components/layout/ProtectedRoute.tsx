'use client';

import { ReactNode } from 'react';

// Auth is managed client-side via localStorage (AuthContext).
// No server-side session = no redirect needed here.
// Components that need user data should use useAuth() directly.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
