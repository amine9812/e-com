import { NextResponse } from 'next/server';
import { addItemToCart, getCartWithItems, removeCartItem, updateCartItem } from '@/lib/cart';
import { getUserFromSession } from '@/lib/auth';
import { CartItemSchema } from '@/lib/validations';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const cart = await getCartWithItems(user.id);
  return NextResponse.json({ items: cart?.items ?? [] });
}

export async function POST(request: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const parsed = CartItemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  try {
    await addItemToCart(user.id, parsed.data.productId, parsed.data.quantity);
    const cart = await getCartWithItems(user.id);
    return NextResponse.json({ items: cart?.items ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unable to add item' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const parsed = CartItemSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  try {
    await updateCartItem(user.id, parsed.data.productId, parsed.data.quantity);
    const cart = await getCartWithItems(user.id);
    return NextResponse.json({ items: cart?.items ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unable to update item' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const parsed = CartItemSchema.pick({ productId: true }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  await removeCartItem(user.id, parsed.data.productId);
  const cart = await getCartWithItems(user.id);
  return NextResponse.json({ items: cart?.items ?? [] });
}
