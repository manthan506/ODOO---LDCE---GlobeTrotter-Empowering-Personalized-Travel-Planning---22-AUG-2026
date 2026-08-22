import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import Expense from '@/models/Expense';
import { getAuthUser } from '@/lib/auth';

const addExpenseSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['flights', 'accommodation', 'activities', 'transport', 'food', 'other']),
  stopId: z.string().optional().nullable(),
  paidBy: z.string().optional(),
  splitAmong: z.array(z.string()).optional(),
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
    const expenses = await Expense.find({ tripId: new mongoose.Types.ObjectId(tripId) }).sort({
      createdAt: -1,
    });

    const mapped = expenses.map((e) => ({
      id: e._id.toString(),
      trip_id: e.tripId.toString(),
      stop_id: e.stopId ? e.stopId.toString() : null,
      paid_by_member_id: e.paidBy || 'Me',
      amount: e.amount,
      description: e.description,
      category: e.category,
      split_among: e.splitAmong || [],
      created_at: e.createdAt.toISOString(),
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error('Fetch expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
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
    const result = addExpenseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    if (trip.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { amount, description, category, stopId, paidBy, splitAmong } = result.data;

    const expense = await Expense.create({
      tripId: trip._id,
      stopId: stopId && mongoose.isValidObjectId(stopId) ? new mongoose.Types.ObjectId(stopId) : undefined,
      paidBy: paidBy || user.name || 'Me',
      amount,
      description,
      category,
      splitAmong: splitAmong || [user._id.toString()],
    });

    return NextResponse.json(
      {
        id: expense._id.toString(),
        trip_id: expense.tripId.toString(),
        stop_id: expense.stopId ? expense.stopId.toString() : null,
        paid_by_member_id: expense.paidBy,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        split_among: expense.splitAmong,
        created_at: expense.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId } = params;
    const url = new URL(req.url);
    const expenseId = url.searchParams.get('id');

    if (!mongoose.isValidObjectId(tripId) || !expenseId || !mongoose.isValidObjectId(expenseId)) {
      return NextResponse.json({ error: 'Invalid ID parameters' }, { status: 400 });
    }

    await connectDB();
    const trip = await Trip.findById(tripId);
    if (!trip || (trip.userId.toString() !== user._id.toString() && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Expense.findByIdAndDelete(expenseId);

    return NextResponse.json({ message: 'Expense deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}
