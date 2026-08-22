import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Activity from '@/models/Activity';
import { ensureSeedData } from '@/lib/seedData';

export async function GET(req: Request) {
  try {
    await connectDB();
    await ensureSeedData();

    const url = new URL(req.url);
    const type = url.searchParams.get('type') || url.searchParams.get('category');
    const maxCost = url.searchParams.get('cost') || url.searchParams.get('maxCost');
    const maxDuration = url.searchParams.get('duration') || url.searchParams.get('maxDuration');
    const cityId = url.searchParams.get('cityId');

    const filter: any = {};
    if (type && type !== 'all' && type !== 'All') {
      filter.category = { $regex: new RegExp(`^${type}$`, 'i') };
    }
    if (maxCost && !isNaN(Number(maxCost))) {
      filter.cost = { $lte: Number(maxCost) };
    }
    if (maxDuration && !isNaN(Number(maxDuration))) {
      filter.duration = { $lte: Number(maxDuration) };
    }
    if (cityId && mongoose.isValidObjectId(cityId)) {
      filter.cityId = new mongoose.Types.ObjectId(cityId);
    }

    const activities = await Activity.find(filter).sort({ name: 1 });

    const mapped = activities.map((a) => ({
      id: a._id.toString(),
      city_id: a.cityId.toString(),
      name: a.name,
      cost: a.cost,
      duration_min: a.duration,
      category: a.category,
      description: a.description,
      image_url: a.imageUrl,
      includes: a.includes,
      best_time: a.bestTime,
    }));

    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error('Fetch activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
