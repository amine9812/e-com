import { NextResponse } from 'next/server';
import { destroySession, clearSessionCookie, SESSION_COOKIE } from '@/lib/auth';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader
    ?.split(';')
    .map((c) => c.trim().split('='))
    .find(([name]) => name === SESSION_COOKIE)?.[1];
  if (token) await destroySession(token);
  const response = NextResponse.redirect(new URL('/', request.url));
  clearSessionCookie(response);
  return response;
}
