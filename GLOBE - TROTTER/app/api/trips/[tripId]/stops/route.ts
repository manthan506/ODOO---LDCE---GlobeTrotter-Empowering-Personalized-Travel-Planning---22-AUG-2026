import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import City from '@/models/City';
import Activity from '@/models/Activity';
import { getAuthUser } from '@/lib/auth';

const addStopSchema = z.object({
  cityId: z.string().min(1, 'City is required'),
  arriveDate: z.string().min(1, 'Arrival date is required'),
  leaveDate: z.string().min(1, 'Leave date is required'),
  order: z.number().optional(),
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
    const stops = await Stop.find({ tripId: new mongoose.Types.ObjectId(tripId) }).sort({ order: 1 });

    const cityIds = stops.map((s) => s.cityId);
    const cities = await City.find({ _id: { $in: cityIds } });
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));

    const allActivityIds = stops.flatMap((s) => s.activities.map((a) => a.activityId));
    const activities = await Activity.find({ _id: { $in: allActivityIds } });
    const activityMap = new Map(activities.map((a) => [a._id.toString(), a]));

    const mapped = stops.map((stop) => {
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
              id: city._id.toString(),
              name: city.name,
              country: city.country,
              cost_index: city.costIndex,
              image_url: city.imageUrl || null,
            }
          : undefined,
        stop_activities: stop.activities.map((sa) => {
          const act = activityMap.get(sa.activityId.toString());
          return {
            id: sa._id ? sa._id.toString() : sa.activityId.toString(),
            stop_id: stop._id.toString(),
            activity_id: sa.activityId.toString(),
            scheduled_time: sa.scheduledTime || null,
            activities: act
              ? {
                  id: act._id.toString(),
                  city_id: act.cityId.toString(),
                  name: act.name,
                  cost: act.cost,
                  duration_min: act.duration,
                  category: act.category,
                  image_url: act.imageUrl || null,
                }
              : undefined,
          };
        }),
      };
    });

    return NextResponse.json(mapped, { status: 200 });
  } catch (error) {
    console.error('Fetch stops error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stops' },
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
    const result = addStopSchema.safeParse(body);
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

    const { cityId, arriveDate, leaveDate, order } = result.data;

    let stopOrder = order;
    if (stopOrder === undefined) {
      const highestOrder = await Stop.findOne({ tripId: trip._id }).sort({ order: -1 });
      stopOrder = highestOrder ? highestOrder.order + 1 : 0;
    }

    const stop = await Stop.create({
      tripId: trip._id,
      cityId: new mongoose.Types.ObjectId(cityId),
      arriveDate: new Date(arriveDate),
      leaveDate: new Date(leaveDate),
      order: stopOrder,
      activities: [],
    });

    return NextResponse.json(
      {
        id: stop._id.toString(),
        trip_id: stop.tripId.toString(),
        city_id: stop.cityId.toString(),
        arrive_date: stop.arriveDate.toISOString().split('T')[0],
        leave_date: stop.leaveDate.toISOString().split('T')[0],
        order: stop.order,
        activities: [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create stop error:', error);
    return NextResponse.json(
      { error: 'Failed to create stop' },
      { status: 500 }
    );
  }
}
