import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import City from '@/models/City';
import { ensureSeedData } from '@/lib/seedData';

export async function GET(req: Request) {
  try {
    await connectDB();
    await ensureSeedData();

    const url = new URL(req.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const region = url.searchParams.get('region') || '';

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
      ];
    }
    if (region && region !== 'all' && region !== 'All') {
      filter.region = { $regex: new RegExp(`^${region}$`, 'i') };
    }

    const cities = await City.find(filter).sort({ name: 1 });

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
