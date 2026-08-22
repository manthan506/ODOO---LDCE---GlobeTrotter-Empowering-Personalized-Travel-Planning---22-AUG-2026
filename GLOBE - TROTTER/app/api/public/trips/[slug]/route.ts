import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SharedTrip from '@/models/SharedTrip';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import City from '@/models/City';
import Activity from '@/models/Activity';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    await connectDB();

    const shared = await SharedTrip.findOne({ shareSlug: slug, isPublic: true });
    if (!shared) {
      return NextResponse.json({ error: 'Shared trip not found' }, { status: 404 });
    }

    const trip = await Trip.findById(shared.tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const stops = await Stop.find({ tripId: trip._id }).sort({ order: 1 });
    const cityIds = stops.map((s) => s.cityId);
    const cities = await City.find({ _id: { $in: cityIds } });
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));

    const allActivityIds = stops.flatMap((s) => s.activities.map((a) => a.activityId));
    const activities = await Activity.find({ _id: { $in: allActivityIds } });
    const activityMap = new Map(activities.map((a) => [a._id.toString(), a]));

    const mappedStops = stops.map((stop) => {
      const city = cityMap.get(stop.cityId.toString());
      return {
        id: stop._id.toString(),
        trip_id: stop.tripId.toString(),
        city_id: stop.cityId.toString(),
        arrive_date: stop.arriveDate.toISOString().split('T')[0],
        leave_date: stop.leaveDate.toISOString().split('T')[0],
        order: stop.order,
        cities: city
          ? {
              name: city.name,
              country: city.country,
              image_url: city.imageUrl || null,
            }
          : null,
        stop_activities: stop.activities.map((sa) => {
          const act = activityMap.get(sa.activityId.toString());
          return {
            id: sa._id ? sa._id.toString() : sa.activityId.toString(),
            scheduled_time: sa.scheduledTime || null,
            activities: act
              ? {
                  name: act.name,
                  cost: act.cost,
                  duration_min: act.duration,
                  category: act.category,
                  image_url: act.imageUrl || null,
                }
              : null,
          };
        }),
      };
    });

    const mappedMembers = trip.members && trip.members.length > 0
      ? trip.members.map((m) => ({
          name: m.name,
          color: m.color || '#3B82F6',
        }))
      : [{ name: 'Traveler', color: '#3B82F6' }];

    const result = {
      trips: {
        id: trip._id.toString(),
        name: trip.name,
        description: trip.description || null,
        start_date: trip.startDate.toISOString().split('T')[0],
        end_date: trip.endDate.toISOString().split('T')[0],
        cover_image_url: trip.coverImageUrl || null,
        stops: mappedStops,
        trip_members: mappedMembers,
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Fetch public trip by slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public trip' },
      { status: 500 }
    );
  }
}
