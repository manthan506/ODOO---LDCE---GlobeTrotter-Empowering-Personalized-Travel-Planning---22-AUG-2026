import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import City from '@/models/City';
import Stop from '@/models/Stop';
import { getAuthUser } from '@/lib/auth';
import { geocodeCity } from '@/lib/api/openApis';

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip destination/name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  budgetCap: z.number().nullable().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const trips = await Trip.find({ userId: user._id }).sort({ createdAt: -1 });

    const mappedTrips = trips.map((t) => ({
      id: t._id.toString(),
      user_id: t.userId.toString(),
      name: t.name,
      start_date: t.startDate.toISOString().split('T')[0],
      end_date: t.endDate.toISOString().split('T')[0],
      description: t.description || null,
      cover_image_url: t.coverImageUrl || null,
      budget_cap: t.budgetCap ?? null,
      created_at: t.createdAt.toISOString(),
    }));

    return NextResponse.json(mappedTrips, { status: 200 });
  } catch (error) {
    console.error('Fetch trips error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createTripSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, startDate, endDate, description, coverImageUrl, budgetCap } = result.data;
    await connectDB();

    // 1. Resolve city lat/lng via Nominatim Geocoding
    const geo = await geocodeCity(name);

    // 2. Find or create matching City with real geocoded coordinates
    let city = await City.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (!city) {
      try {
        city = await City.create({
          name: geo.name || name,
          country: geo.displayName.split(',').pop()?.trim() || 'Global',
          region: 'Asia',
          costIndex: 2,
          lat: geo.lat || 28.6139,
          lng: geo.lng || 77.209,
          imageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
          description: `Travel destination geocoded via OpenStreetMap: ${geo.displayName}`,
        });
      } catch (cityErr) {
        console.warn('City creation fallback:', cityErr);
        city = await City.findOne();
      }
    }

    // 3. Create the Trip
    const trip = await Trip.create({
      userId: user._id,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description: description || '',
      coverImageUrl: coverImageUrl || city?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
      budgetCap: budgetCap || undefined,
      members: [
        {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          color: '#3B82F6',
        },
      ],
    });

    // 4. Automatically create initial stop with geocoded city
    if (city) {
      try {
        await Stop.create({
          tripId: trip._id,
          cityId: city._id,
          arriveDate: new Date(startDate),
          leaveDate: new Date(endDate),
          order: 0,
          activities: [],
          lodging: {
            name: `Grand Hotel ${name}`,
            checkIn: '14:00',
            checkOut: '11:00',
          },
        });
      } catch (stopErr) {
        console.warn('Stop creation warning:', stopErr);
      }
    }

    const mappedTrip = {
      id: trip._id.toString(),
      user_id: trip.userId.toString(),
      name: trip.name,
      start_date: trip.startDate.toISOString().split('T')[0],
      end_date: trip.endDate.toISOString().split('T')[0],
      description: trip.description || null,
      cover_image_url: trip.coverImageUrl || null,
      budget_cap: trip.budgetCap ?? null,
      created_at: trip.createdAt.toISOString(),
    };

    return NextResponse.json(mappedTrip, { status: 201 });
  } catch (error: any) {
    console.error('Create trip error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create trip' },
      { status: 500 }
    );
  }
}
