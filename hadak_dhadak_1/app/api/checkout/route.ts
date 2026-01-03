import { NextResponse } from 'next/server';
import { CheckoutSchema } from '@/lib/validations';
import { getUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { decrementInventory } from '@/lib/cart';
import { stripe, stripeEnabled } from '@/lib/stripe';
import { logError } from '@/lib/logger';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession(request as any);
    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid checkout data' }, { status: 400 });

    let items: { productId: string; quantity: number; price: number; sku: string; name: string }[] = [];

    if (user) {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
      });
      if (!cart || cart.items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      items = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        sku: item.product.sku,
        name: item.product.name,
      }));
    } else {
      if (!parsed.data.items || parsed.data.items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      const products = await prisma.product.findMany({ where: { id: { in: parsed.data.items.map((i) => i.productId) } } });
      items = parsed.data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error('Product missing');
        return { productId: item.productId, quantity: item.quantity, price: product.price, sku: product.sku, name: product.name };
      });
    }

    const shipping = items.reduce((sum, i) => sum + i.price * i.quantity, 0) > 10000 ? 0 : 1200;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0) + shipping;

    const address = await prisma.address.create({
      data: {
        userId: user?.id,
        line1: parsed.data.address.line1,
        line2: parsed.data.address.line2,
        city: parsed.data.address.city,
        state: parsed.data.address.state,
        postalCode: parsed.data.address.postalCode,
        country: parsed.data.address.country,
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shipping,
        total,
        addressId: address.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Mock flow when Stripe not configured
    if (!stripeEnabled || !stripe) {
      await decrementInventory(items);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID', paymentStatus: 'PAID', mockPayment: true },
      });
      if (user) await prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } });
      return NextResponse.json({ orderId: order.id });
    }

    // Stripe checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: { orderId: order.id },
      client_reference_id: order.id,
      success_url: `${APP_URL}/order/${order.id}`,
      cancel_url: `${APP_URL}/checkout`,
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: item.price,
          product_data: {
            name: item.name,
            metadata: { sku: item.sku },
          },
        },
        quantity: item.quantity,
      })),
    });

    if (!session.url) throw new Error('Unable to create checkout session');

    return NextResponse.json({ orderId: order.id, stripeUrl: session.url });
  } catch (err: any) {
    logError('Checkout failed', { error: err.message });
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
