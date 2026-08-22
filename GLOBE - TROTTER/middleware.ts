import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// All routes are public for this demo — no server-side auth needed.
// Auth state is managed client-side via localStorage in AuthContext.tsx.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
