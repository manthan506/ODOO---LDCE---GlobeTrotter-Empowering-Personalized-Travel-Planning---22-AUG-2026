import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Stop from '@/models/Stop';
import Activity from '@/models/Activity';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(
  req: Request,
  { params }: { params: { activityId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityId } = params;
    if (!mongoose.isValidObjectId(activityId)) {
      return NextResponse.json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    await connectDB();

    // Remove from any stops that have this activity scheduled
    await Stop.updateMany(
      { 'activities.activityId': new mongoose.Types.ObjectId(activityId) },
      { $pull: { activities: { activityId: new mongoose.Types.ObjectId(activityId) } } }
    );

    return NextResponse.json({ message: 'Activity removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete activity error:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
