import { NextResponse } from 'next/server';
import { mergeCart } from '@/lib/cart';
import { getUserFromSession } from '@/lib/auth';
import { CartItemSchema } from '@/lib/validations';

export async function POST(request: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const items = (body.items as any[]) ?? [];
  for (const item of items) {
    const parsed = CartItemSchema.safeParse(item);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
  }
  const merged = await mergeCart(user.id, items);
  return NextResponse.json({ items: merged?.items ?? [] });
}
