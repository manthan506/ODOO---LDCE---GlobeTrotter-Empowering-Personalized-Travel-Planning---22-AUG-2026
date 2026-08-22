import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SharedTrip from '@/models/SharedTrip';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import City from '@/models/City';

export async function GET() {
  try {
    await connectDB();
    const publicShares = await SharedTrip.find({ isPublic: true }).sort({ createdAt: -1 }).limit(20);

    const tripIds = publicShares.map((s) => s.tripId);
    const trips = await Trip.find({ _id: { $in: tripIds } });
    const tripMap = new Map(trips.map((t) => [t._id.toString(), t]));

    const stops = await Stop.find({ tripId: { $in: tripIds } }).sort({ order: 1 });
    const cityIds = stops.map((s) => s.cityId);
    const cities = await City.find({ _id: { $in: cityIds } });
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));

    const result = publicShares
      .map((share) => {
        const trip = tripMap.get(share.tripId.toString());
        if (!trip) return null;

        const tripStops = stops
          .filter((s) => s.tripId.toString() === trip._id.toString())
          .map((s) => {
            const city = cityMap.get(s.cityId.toString());
            return {
              cities: city
                ? {
                    name: city.name,
                    country: city.country,
                    image_url: city.imageUrl || null,
                  }
                : null,
            };
          });

        return {
          share_slug: share.shareSlug,
          trips: {
            id: trip._id.toString(),
            name: trip.name,
            description: trip.description || null,
            start_date: trip.startDate.toISOString().split('T')[0],
            end_date: trip.endDate.toISOString().split('T')[0],
            cover_image_url: trip.coverImageUrl || null,
            stops: tripStops,
          },
        };
      })
      .filter(Boolean);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Fetch public trips error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public trips' },
      { status: 500 }
    );
  }
}
