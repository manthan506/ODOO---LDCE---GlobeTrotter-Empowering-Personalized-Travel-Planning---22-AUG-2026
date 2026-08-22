import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import SharedTrip from '@/models/SharedTrip';
import { getAuthUser } from '@/lib/auth';

const shareSchema = z.object({
  isPublic: z.boolean().optional(),
  shareSlug: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    if (!mongoose.isValidObjectId(tripId)) {
      return NextResponse.json({ error: 'Invalid trip ID' }, { status: 400 });
    }

    await connectDB();
    const shared = await SharedTrip.findOne({ tripId: new mongoose.Types.ObjectId(tripId) });

    if (!shared) {
      return NextResponse.json({ share_slug: null, is_public: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        share_slug: shared.shareSlug,
        is_public: shared.isPublic,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch share info error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch share details' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId } = params;
    if (!mongoose.isValidObjectId(tripId)) {
      return NextResponse.json({ error: 'Invalid trip ID' }, { status: 400 });
    }

    const body = await req.json();
    const result = shareSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const trip = await Trip.findById(tripId);
    if (!trip || (trip.userId.toString() !== user._id.toString() && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let shared = await SharedTrip.findOne({ tripId: trip._id });
    const isPublic = result.data.isPublic !== undefined ? result.data.isPublic : true;
    const shareSlug = result.data.shareSlug || (shared ? shared.shareSlug : crypto.randomBytes(6).toString('hex'));

    if (shared) {
      shared.isPublic = isPublic;
      if (result.data.shareSlug) shared.shareSlug = result.data.shareSlug;
      await shared.save();
    } else {
      shared = await SharedTrip.create({
        tripId: trip._id,
        isPublic,
        shareSlug,
      });
    }

    return NextResponse.json(
      {
        share_slug: shared.shareSlug,
        is_public: shared.isPublic,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update share info error:', error);
    return NextResponse.json(
      { error: 'Failed to update share settings' },
      { status: 500 }
    );
  }
}
