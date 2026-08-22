import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from './db';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_hackathon_2026';
export const AUTH_COOKIE_NAME = 'auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name?: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req?: Request): Promise<IUser | null> {
  try {
    let token: string | undefined;

    // Try authorization header first if request provided
    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // Otherwise read from next/headers cookies
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    return user;
  } catch (error) {
    console.error('getAuthUser error:', error);
    return null;
  }
}
