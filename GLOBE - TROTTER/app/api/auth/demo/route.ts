import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Trip from '@/models/Trip';
import Stop from '@/models/Stop';
import City from '@/models/City';
import Activity from '@/models/Activity';
import Expense from '@/models/Expense';
import SharedTrip from '@/models/SharedTrip';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ensureSeedData } from '@/lib/seedData';

export async function POST() {
  try {
    await connectDB();
    await ensureSeedData();

    // 1. Find or create demo user
    let user = await User.findOne({ email: 'alex@globetrotter.io' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await User.create({
        name: 'Alex Traveler',
        email: 'alex@globetrotter.io',
        password: hashedPassword,
        role: 'user',
      });
    }

    // 2. Ensure user has a rich showcase trip
    const existingTrip = await Trip.findOne({ userId: user._id });
    if (!existingTrip) {
      const trip = await Trip.create({
        userId: user._id,
        name: 'European Grand Tour 2026',
        startDate: new Date('2026-06-15'),
        endDate: new Date('2026-06-28'),
        description: 'Multi-city adventure exploring historic landmarks, culinary capitals, and alpine landscapes.',
        coverImageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        budgetCap: 180000,
        members: [
          {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            color: '#3B82F6',
          },
        ],
      });

      // Find cities
      const paris = await City.findOne({ name: 'Paris' });
      const alps = await City.findOne({ name: 'Swiss Alps' });
      const rome = await City.findOne({ name: 'Rome' });

      if (paris && alps && rome) {
        // Paris stop
        const stop1 = await Stop.create({
          tripId: trip._id,
          cityId: paris._id,
          arriveDate: new Date('2026-06-15'),
          leaveDate: new Date('2026-06-19'),
          order: 0,
          activities: [],
        });

        const parisAct = await Activity.findOne({ cityId: paris._id });
        if (parisAct) {
          stop1.activities.push({
            activityId: parisAct._id,
            scheduledTime: '10:00 AM',
          });
          await stop1.save();
        }

        // Alps stop
        const stop2 = await Stop.create({
          tripId: trip._id,
          cityId: alps._id,
          arriveDate: new Date('2026-06-19'),
          leaveDate: new Date('2026-06-24'),
          order: 1,
          activities: [],
        });

        const alpsAct = await Activity.findOne({ cityId: alps._id });
        if (alpsAct) {
          stop2.activities.push({
            activityId: alpsAct._id,
            scheduledTime: '02:00 PM',
          });
          await stop2.save();
        }

        // Rome stop
        const stop3 = await Stop.create({
          tripId: trip._id,
          cityId: rome._id,
          arriveDate: new Date('2026-06-24'),
          leaveDate: new Date('2026-06-28'),
          order: 2,
          activities: [],
        });

        const romeAct = await Activity.findOne({ cityId: rome._id });
        if (romeAct) {
          stop3.activities.push({
            activityId: romeAct._id,
            scheduledTime: '11:00 AM',
          });
          await stop3.save();
        }

        // Expenses
        await Expense.create({
          tripId: trip._id,
          paidBy: 'Alex Traveler',
          amount: 45000,
          description: 'Roundtrip flights Mumbai - Paris - Rome',
          category: 'flights',
          splitAmong: [user._id.toString()],
        });

        await Expense.create({
          tripId: trip._id,
          paidBy: 'Alex Traveler',
          amount: 32000,
          description: 'Hotels & boutique chalet stays',
          category: 'accommodation',
          splitAmong: [user._id.toString()],
        });

        await Expense.create({
          tripId: trip._id,
          paidBy: 'Alex Traveler',
          amount: 15000,
          description: 'Eiffel Tower & Colosseum passes',
          category: 'activities',
          splitAmong: [user._id.toString()],
        });

        await Expense.create({
          tripId: trip._id,
          paidBy: 'Alex Traveler',
          amount: 18000,
          description: 'Eurail pass across France, Switzerland & Italy',
          category: 'transport',
          splitAmong: [user._id.toString()],
        });

        // Public Share
        await SharedTrip.create({
          tripId: trip._id,
          isPublic: true,
          shareSlug: 'euro-tour-2026',
        });
      }
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Logged in as Demo User',
      },
      { status: 200 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json(
      { error: 'Failed to login demo user' },
      { status: 500 }
    );
  }
}
