import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import Expense from '@/models/Expense';
import { getAuthUser } from '@/lib/auth';

const updateStopSchema = z.object({
  arriveDate: z.string().optional(),
  leaveDate: z.string().optional(),
  order: z.number().optional(),
  lodging: z
    .object({
      name: z.string().optional(),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      confirmationCode: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  reservations: z
    .array(
      z.object({
        type: z.string().optional(),
        name: z.string(),
        time: z.string().optional(),
        confirmationCode: z.string().optional(),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.string().optional(),
      })
    )
    .optional(),
});

export async function PUT(
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
    const result = updateStopSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
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

    const { arriveDate, leaveDate, order, lodging, reservations, attachments } = result.data;
    if (arriveDate !== undefined) stop.arriveDate = new Date(arriveDate);
    if (leaveDate !== undefined) stop.leaveDate = new Date(leaveDate);
    if (order !== undefined) stop.order = order;
    if (lodging !== undefined) stop.lodging = lodging;
    if (reservations !== undefined) stop.reservations = reservations as any;
    if (attachments !== undefined) stop.attachments = attachments as any;

    await stop.save();

    return NextResponse.json({ message: 'Stop updated successfully', stop }, { status: 200 });
  } catch (error) {
    console.error('Update stop error:', error);
    return NextResponse.json(
      { error: 'Failed to update stop' },
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

    await Expense.deleteMany({ stopId: stop._id });
    await Stop.findByIdAndDelete(stopId);

    return NextResponse.json({ message: 'Stop deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete stop error:', error);
    return NextResponse.json(
      { error: 'Failed to delete stop' },
      { status: 500 }
    );
  }
}
