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
      return NextResponse.json({ error: 'Public trip not found' }, { status: 404 });
    }

    const trip = await Trip.findById(shared.tripId);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    const stops = await Stop.find({ tripId: trip._id }).sort({ order: 1 });
    const populatedStops = await Promise.all(
      stops.map(async (s) => {
        const city = await City.findById(s.cityId);
        const acts = await Promise.all(
          (s.activities || []).map(async (sa) => {
            const act = await Activity.findById(sa.activityId);
            return {
              id: sa._id ? sa._id.toString() : sa.activityId.toString(),
              stop_id: s._id.toString(),
              activity_id: sa.activityId.toString(),
              scheduled_time: sa.scheduledTime || '10:00 AM',
              activities: act
                ? {
                    id: act._id.toString(),
                    city_id: act.cityId.toString(),
                    name: act.name,
                    cost: act.cost,
                    duration_min: act.duration,
                    category: act.category,
                    image_url: act.imageUrl,
                  }
                : null,
            };
          })
        );

        return {
          id: s._id.toString(),
          trip_id: s.tripId.toString(),
          city_id: s.cityId.toString(),
          arrive_date: s.arriveDate.toISOString().split('T')[0],
          leave_date: s.leaveDate.toISOString().split('T')[0],
          order: s.order,
          cities: city
            ? {
                id: city._id.toString(),
                name: city.name,
                country: city.country,
                cost_index: city.costIndex,
                image_url: city.imageUrl,
              }
            : null,
          stop_activities: acts,
        };
      })
    );

    const publicTrip = {
      id: trip._id.toString(),
      name: trip.name,
      start_date: trip.startDate.toISOString().split('T')[0],
      end_date: trip.endDate.toISOString().split('T')[0],
      description: trip.description || null,
      cover_image_url: trip.coverImageUrl || null,
      budget_cap: trip.budgetCap ?? null,
      stops: populatedStops,
      trip_members: trip.members || [],
    };

    return NextResponse.json({ trips: publicTrip }, { status: 200 });
  } catch (error) {
    console.error('Fetch public trip error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public trip' },
      { status: 500 }
    );
  }
}
