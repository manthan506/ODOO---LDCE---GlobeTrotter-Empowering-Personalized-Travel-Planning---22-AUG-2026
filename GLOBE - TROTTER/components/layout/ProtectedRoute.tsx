'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || redirecting) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#e3e9e5] border-t-[#1e4d45]" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
