import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import Activity from '@/models/Activity';
import Expense from '@/models/Expense';
import { getAuthUser } from '@/lib/auth';

export async function GET(
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

    await connectDB();
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    if (trip.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Live query expenses
    const expenses = await Expense.find({ tripId: trip._id }).sort({ createdAt: -1 });

    // 2. Live query stops & scheduled activities
    const stops = await Stop.find({ tripId: trip._id });
    let activityCostSum = 0;
    for (const stop of stops) {
      for (const sa of stop.activities || []) {
        const act = await Activity.findById(sa.activityId);
        if (act && act.cost) {
          activityCostSum += act.cost;
        }
      }
    }

    const categoryTotals: Record<string, number> = {
      flights: 0,
      accommodation: 0,
      activities: activityCostSum,
      transport: 0,
      food: 0,
      other: 0,
    };

    let totalCost = activityCostSum;
    expenses.forEach((e) => {
      const cat = e.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
      totalCost += e.amount;
    });

    // Color mapping matching UI reference
    const categoryColors: Record<string, string> = {
      flights: '#3B82F6', // Blue
      accommodation: '#6366F1', // Indigo / Purple
      activities: '#F97316', // Orange
      transport: '#10B981', // Emerald
      food: '#F59E0B', // Amber
      other: '#8B5CF6', // Violet
    };

    const breakdown = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalCost > 0 ? Math.round((amount / totalCost) * 100) : 0,
        color: categoryColors[category] || '#6B7280',
      }));

    return NextResponse.json(
      {
        totalCost,
        budgetCap: trip.budgetCap || null,
        remainingBudget: trip.budgetCap ? Math.max(0, trip.budgetCap - totalCost) : null,
        isOverBudget: trip.budgetCap ? totalCost > trip.budgetCap : false,
        breakdown,
        expensesCount: expenses.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch budget breakdown error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate budget' },
      { status: 500 }
    );
  }
}
