import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import Activity from '@/models/Activity';
import Expense from '@/models/Expense';
import { getAuthUser } from '@/lib/auth';

const addActivitySchema = z.object({
  activityId: z.string().min(1, 'Activity ID is required'),
  scheduledTime: z.string().optional().nullable(),
});

export async function POST(
  req: Request,
  { params }: { params: { stopId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stopId } = params;
    if (!mongoose.isValidObjectId(stopId)) {
      return NextResponse.json({ error: 'Invalid stop ID' }, { status: 400 });
    }

    const body = await req.json();
    const result = addActivitySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { activityId, scheduledTime } = result.data;
    if (!mongoose.isValidObjectId(activityId)) {
      return NextResponse.json({ error: 'Invalid activity ID' }, { status: 400 });
    }

    await connectDB();
    const stop = await Stop.findById(stopId);
    if (!stop) {
      return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
    }

    const trip = await Trip.findById(stop.tripId);
    if (!trip || (trip.userId.toString() !== user._id.toString() && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const activityDoc = await Activity.findById(activityId);
    if (!activityDoc) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    stop.activities.push({
      activityId: new mongoose.Types.ObjectId(activityId),
      scheduledTime: scheduledTime || undefined,
    });

    await stop.save();

    // Auto-create an activity expense for the trip
    await Expense.create({
      tripId: trip._id,
      stopId: stop._id,
      paidBy: user.name || 'Me',
      amount: activityDoc.cost || 0,
      description: activityDoc.name,
      category: 'activities',
      splitAmong: [user._id.toString()],
    });

    return NextResponse.json({ message: 'Activity added to stop' }, { status: 201 });
  } catch (error) {
    console.error('Add activity to stop error:', error);
    return NextResponse.json(
      { error: 'Failed to add activity to stop' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { stopId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stopId } = params;
    const url = new URL(req.url);
    const stopActivityId = url.searchParams.get('id');

    if (!mongoose.isValidObjectId(stopId)) {
      return NextResponse.json({ error: 'Invalid stop ID' }, { status: 400 });
    }

    await connectDB();
    const stop = await Stop.findById(stopId);
    if (!stop) {
      return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
    }

    const trip = await Trip.findById(stop.tripId);
    if (!trip || (trip.userId.toString() !== user._id.toString() && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (stopActivityId) {
      stop.activities = stop.activities.filter(
        (a) => a._id?.toString() !== stopActivityId && a.activityId.toString() !== stopActivityId
      );
    } else {
      stop.activities = [];
    }

    await stop.save();

    return NextResponse.json({ message: 'Activity removed from stop' }, { status: 200 });
  } catch (error) {
    console.error('Delete activity from stop error:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity from stop' },
      { status: 500 }
    );
  }
}
