import { NextResponse } from 'next/server';
import { getAuthUser, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function POST() {
  // Sign out / clear cookie
  const response = NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
