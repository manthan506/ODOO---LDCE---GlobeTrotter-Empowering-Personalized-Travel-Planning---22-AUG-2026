import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import City from '@/models/City';
import { ensureSeedData } from '@/lib/seedData';

export async function GET() {
  try {
    await connectDB();
    await ensureSeedData();

    const cities = await City.find().sort({ name: 1 });
    
    // Map to normalized shape compatible with frontend types
    const mappedCities = cities.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      country: c.country,
      region: c.region,
      cost_index: c.costIndex,
      image_url: c.imageUrl,
      description: c.description,
    }));

    return NextResponse.json(mappedCities, { status: 200 });
  } catch (error) {
    console.error('Fetch cities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
