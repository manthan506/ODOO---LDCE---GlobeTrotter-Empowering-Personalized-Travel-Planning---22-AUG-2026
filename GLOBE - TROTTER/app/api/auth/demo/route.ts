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

export async function POST(req: Request) {
  try {
    let provider = 'google';
    try {
      const body = await req.json();
      if (body && body.provider) provider = body.provider;
    } catch {
      // default to google/demo
    }

    await connectDB();
    await ensureSeedData();

    let email = 'alex.google@gmail.com';
    let name = 'Alex Traveler';
    if (provider === 'apple') {
      email = 'sarah.apple@icloud.com';
      name = 'Sarah Explorer';
    } else if (provider === 'demo') {
      email = 'alex@globetrotter.io';
      name = 'Alex Traveler';
    }

    // 1. Find or create demo user
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
      });
    }

    // 2. Ensure user has a rich showcase trip
    const existingTrip = await Trip.findOne({ userId: user._id });
    if (!existingTrip) {
      const trip = await Trip.create({
        userId: user._id,
        name: provider === 'apple' ? 'Mediterranean Cruise & Island Escape' : 'European Grand Tour 2026',
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
      const bali = await City.findOne({ name: 'Bali' });

      const c1 = provider === 'apple' && bali ? bali : paris;
      const c2 = alps || rome;
      const c3 = rome || paris;

      if (c1 && c2 && c3) {
        // Stop 1
        const stop1 = await Stop.create({
          tripId: trip._id,
          cityId: c1._id,
          arriveDate: new Date('2026-06-15'),
          leaveDate: new Date('2026-06-19'),
          order: 0,
          activities: [],
        });

        const act1 = await Activity.findOne({ cityId: c1._id });
        if (act1) {
          stop1.activities.push({
            activityId: act1._id,
            scheduledTime: '10:00 AM',
          });
          await stop1.save();
        }

        // Stop 2
        const stop2 = await Stop.create({
          tripId: trip._id,
          cityId: c2._id,
          arriveDate: new Date('2026-06-19'),
          leaveDate: new Date('2026-06-24'),
          order: 1,
          activities: [],
        });

        const act2 = await Activity.findOne({ cityId: c2._id });
        if (act2) {
          stop2.activities.push({
            activityId: act2._id,
            scheduledTime: '02:00 PM',
          });
          await stop2.save();
        }

        // Stop 3
        const stop3 = await Stop.create({
          tripId: trip._id,
          cityId: c3._id,
          arriveDate: new Date('2026-06-24'),
          leaveDate: new Date('2026-06-28'),
          order: 2,
          activities: [],
        });

        const act3 = await Activity.findOne({ cityId: c3._id });
        if (act3) {
          stop3.activities.push({
            activityId: act3._id,
            scheduledTime: '11:00 AM',
          });
          await stop3.save();
        }

        // Expenses
        await Expense.create({
          tripId: trip._id,
          paidBy: user.name,
          amount: 45000,
          description: 'Roundtrip international flights',
          category: 'flights',
          splitAmong: [user._id.toString()],
        });

        await Expense.create({
          tripId: trip._id,
          paidBy: user.name,
          amount: 32000,
          description: 'Boutique hotel bookings & villa stays',
          category: 'accommodation',
          splitAmong: [user._id.toString()],
        });

        await Expense.create({
          tripId: trip._id,
          paidBy: user.name,
          amount: 15000,
          description: 'Sightseeing, museum & cultural passes',
          category: 'activities',
          splitAmong: [user._id.toString()],
        });

        await Expense.create({
          tripId: trip._id,
          paidBy: user.name,
          amount: 18000,
          description: 'Regional trains & scenic transit passes',
          category: 'transport',
          splitAmong: [user._id.toString()],
        });

        // Public Share
        await SharedTrip.create({
          tripId: trip._id,
          isPublic: true,
          shareSlug: provider === 'apple' ? 'mediterranean-escape' : 'euro-grand-tour',
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
        message: `Logged in via ${provider}`,
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
    console.error('Social login error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate social login' },
      { status: 500 }
    );
  }
}
