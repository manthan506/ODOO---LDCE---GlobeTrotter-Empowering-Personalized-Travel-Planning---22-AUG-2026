import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

const signupSchema = z.object({
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  additionalInfo: z.string().optional(),
  photoUrl: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = result.data;
    const email = data.email.toLowerCase();
    const displayName =
      data.name ||
      (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.firstName || email.split('@')[0]);

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      name: displayName,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email,
      phoneNumber: data.phoneNumber || '',
      city: data.city || '',
      country: data.country || '',
      additionalInfo: data.additionalInfo || '',
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      password: hashedPassword,
      role: 'user',
    });

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
        message: 'Account created successfully',
      },
      { status: 201 }
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
