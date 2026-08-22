import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Activity from '@/models/Activity';
import { ensureSeedData } from '@/lib/seedData';

export async function GET(
  req: Request,
  { params }: { params: { cityId: string } }
) {
  try {
    const { cityId } = params;
    await connectDB();
    await ensureSeedData();

    let query: Record<string, unknown> = {};
    if (cityId && cityId !== 'all' && mongoose.isValidObjectId(cityId)) {
      query = { cityId: new mongoose.Types.ObjectId(cityId) };
    }

    const activities = await Activity.find(query).sort({ name: 1 });

    const mappedActivities = activities.map((a) => ({
      id: a._id.toString(),
      city_id: a.cityId.toString(),
      name: a.name,
      cost: a.cost,
      duration_min: a.duration,
      category: a.category,
      description: a.description,
      image_url: a.imageUrl,
      best_time: a.bestTime,
      includes: a.includes,
    }));

    return NextResponse.json(mappedActivities, { status: 200 });
  } catch (error) {
    console.error('Fetch activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
