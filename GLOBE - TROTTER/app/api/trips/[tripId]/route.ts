import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import City from '@/models/City';
import Activity from '@/models/Activity';
import Expense from '@/models/Expense';
import SharedTrip from '@/models/SharedTrip';
import { getAuthUser } from '@/lib/auth';

const updateTripSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().optional(),
  budgetCap: z.number().nullable().optional(),
});

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

    // Ownership check (or admin)
    if (trip.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch stops for this trip
    const stops = await Stop.find({ tripId: trip._id }).sort({ order: 1 });

    // Populate cities & activities manually for exact shape compatibility
    const cityIds = stops.map((s) => s.cityId);
    const cities = await City.find({ _id: { $in: cityIds } });
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));

    const allActivityIds = stops.flatMap((s) => s.activities.map((a) => a.activityId));
    const activities = await Activity.find({ _id: { $in: allActivityIds } });
    const activityMap = new Map(activities.map((a) => [a._id.toString(), a]));

    const mappedStops = stops.map((stop) => {
      const cityDoc = cityMap.get(stop.cityId.toString());
      return {
        id: stop._id.toString(),
        trip_id: stop.tripId.toString(),
        city_id: stop.cityId.toString(),
        arrive_date: stop.arriveDate.toISOString().split('T')[0],
        leave_date: stop.leaveDate.toISOString().split('T')[0],
        order: stop.order,
        lodging: stop.lodging || {},
        reservations: (stop.reservations || []).map((r: any) => ({
          id: r._id ? r._id.toString() : undefined,
          type: r.type,
          name: r.name,
          time: r.time,
          confirmationCode: r.confirmationCode,
        })),
        attachments: (stop.attachments || []).map((a: any) => ({
          id: a._id ? a._id.toString() : undefined,
          name: a.name,
          url: a.url,
          type: a.type,
        })),
        cities: cityDoc
          ? {
              id: cityDoc._id.toString(),
              name: cityDoc.name,
              country: cityDoc.country,
              cost_index: cityDoc.costIndex,
              image_url: cityDoc.imageUrl || null,
              description: cityDoc.description || '',
              lat: cityDoc.lat || 48.8566,
              lng: cityDoc.lng || 2.3522,
            }
          : undefined,
        stop_activities: stop.activities.map((sa) => {
          const actDoc = activityMap.get(sa.activityId.toString());
          return {
            id: sa._id ? sa._id.toString() : sa.activityId.toString(),
            stop_id: stop._id.toString(),
            activity_id: sa.activityId.toString(),
            scheduled_time: sa.scheduledTime || null,
            activities: actDoc
              ? {
                  id: actDoc._id.toString(),
                  city_id: actDoc.cityId.toString(),
                  name: actDoc.name,
                  cost: actDoc.cost,
                  duration_min: actDoc.duration,
                  category: actDoc.category,
                  image_url: actDoc.imageUrl || null,
                  description: actDoc.description || '',
                  includes: actDoc.includes || [],
                  best_time: actDoc.bestTime || '',
                }
              : undefined,
          };
        }),
      };
    });

    const mappedMembers = (trip.members && trip.members.length > 0)
      ? trip.members.map((m) => ({
          id: m.id,
          trip_id: trip._id.toString(),
          name: m.name,
          email: m.email || null,
          color: m.color || '#3B82F6',
          created_at: trip.createdAt.toISOString(),
        }))
      : [
          {
            id: user._id.toString(),
            trip_id: trip._id.toString(),
            name: user.name,
            email: user.email,
            color: '#3B82F6',
            created_at: trip.createdAt.toISOString(),
          },
        ];

    const result = {
      id: trip._id.toString(),
      user_id: trip.userId.toString(),
      name: trip.name,
      start_date: trip.startDate.toISOString().split('T')[0],
      end_date: trip.endDate.toISOString().split('T')[0],
      description: trip.description || null,
      cover_image_url: trip.coverImageUrl || null,
      budget_cap: trip.budgetCap ?? null,
      created_at: trip.createdAt.toISOString(),
      stops: mappedStops,
      trip_members: mappedMembers,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Fetch trip details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip details' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const result = updateTripSchema.safeParse(body);
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

    // Ownership check
    if (trip.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, startDate, endDate, description, coverImageUrl, budgetCap } = result.data;
    if (name !== undefined) trip.name = name;
    if (startDate !== undefined) trip.startDate = new Date(startDate);
    if (endDate !== undefined) trip.endDate = new Date(endDate);
    if (description !== undefined) trip.description = description;
    if (coverImageUrl !== undefined) trip.coverImageUrl = coverImageUrl;
    if (budgetCap !== undefined) trip.budgetCap = budgetCap ?? undefined;

    await trip.save();

    return NextResponse.json({ message: 'Trip updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update trip error:', error);
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Ownership check
    if (trip.userId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cascade delete stops, expenses, shared trips
    await Stop.deleteMany({ tripId: trip._id });
    await Expense.deleteMany({ tripId: trip._id });
    await SharedTrip.deleteMany({ tripId: trip._id });
    await Trip.findByIdAndDelete(tripId);

    return NextResponse.json({ message: 'Trip deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    );
  }
}
