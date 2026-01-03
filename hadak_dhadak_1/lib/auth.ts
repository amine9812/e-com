import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { Role, User } from '@prisma/client';
import crypto from 'crypto';
import { logError } from './logger';

export const SESSION_COOKIE = 'session_token';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await prisma.session.create({
    data: { userId, token, expiresAt },
  });
  return { token, expiresAt };
}

export function setSessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
}

function extractToken(req?: NextRequest | Request) {
  if (req instanceof Request) {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) return null;
    const parsed = cookieHeader
      .split(';')
      .map((c) => c.trim().split('='))
      .find(([name]) => name === SESSION_COOKIE);
    return parsed ? parsed[1] : null;
  }
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getUserFromSession(req?: NextRequest | Request): Promise<User | null> {
  try {
    const token = extractToken(req);
    if (!token) return null;
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { token } });
      return null;
    }
    return session.user;
  } catch (err) {
    logError('Failed to get user from session', { err });
    return null;
  }
}

export async function requireUser(role?: Role): Promise<User> {
  const user = await getUserFromSession();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (role && user.role !== role) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function destroySession(token?: string) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { token } });
}

export function requireAdmin(user: User) {
  if (user.role !== Role.ADMIN) {
    throw new Error('FORBIDDEN');
  }
}
