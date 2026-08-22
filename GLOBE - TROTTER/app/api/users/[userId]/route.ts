import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  photoUrl: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;
    if (!mongoose.isValidObjectId(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    if (user._id.toString() !== userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: result.data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        role: updated.role,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
