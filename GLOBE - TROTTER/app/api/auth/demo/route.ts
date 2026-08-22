import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    await connectDB();

    const demoEmail = 'demo@globetrotter.io';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('DemoPass123!', salt);
      user = await User.create({
        name: 'Sarah Traveler (Demo)',
        email: demoEmail,
        password: hashedPassword,
        role: 'user',
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Logged into demo account',
      },
      { status: 200 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Demo login API error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize demo session' },
      { status: 500 }
    );
  }
}
