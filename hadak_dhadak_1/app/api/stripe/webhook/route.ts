import { NextResponse } from 'next/server';
import { stripe, stripeEnabled } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { logError } from '@/lib/logger';
import { decrementInventory } from '@/lib/cart';

export async function POST(request: Request) {
  if (!stripeEnabled || !stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
  }
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') || '';

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    logError('Webhook signature failed', { error: err.message });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId as string | undefined;
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (order && order.paymentStatus !== 'PAID') {
        await decrementInventory(order.items.map((i) => ({ productId: i.productId as string, quantity: i.quantity })));
        await prisma.order.update({ where: { id: orderId }, data: { status: 'PAID', paymentStatus: 'PAID' } });
        if (order.userId) await prisma.cartItem.deleteMany({ where: { cart: { userId: order.userId } } });
      }
    }
  }

  return NextResponse.json({ received: true });
}
