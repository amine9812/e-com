'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../forms/input';
import { useGuestCart } from './use-guest-cart';
import { formatPrice } from '@/lib/format';

export default function CheckoutForm({
  userEmail,
  initialSubtotal,
  mode,
  stripeEnabled,
}: {
  userEmail?: string;
  initialSubtotal: number;
  mode: 'guest' | 'user';
  stripeEnabled: boolean;
}) {
  const router = useRouter();
  const guestCart = useGuestCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: userEmail ?? '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const subtotal = mode === 'guest' ? guestCart.items.reduce((s, i) => s + i.price * i.quantity, 0) : initialSubtotal;
  const shipping = subtotal > 10000 ? 0 : 1200;
  const total = subtotal + shipping;

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
          items: mode === 'guest' ? guestCart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })) : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Checkout failed');
      }
      const data = await res.json();
      if (data.orderId) {
        if (data.stripeUrl) {
          window.location.href = data.stripeUrl;
        } else {
          guestCart.clear();
          router.push(`/order/${data.orderId}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not complete checkout');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <Input label="Address line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <Input label="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3 h-fit">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
        <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
        <button
          onClick={submit}
          disabled={loading || subtotal === 0}
          className="w-full rounded-md bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Processing...' : stripeEnabled ? 'Pay with Stripe' : 'Mock payment (DEV)'}
        </button>
        {!stripeEnabled && (
          <p className="text-xs text-amber-600">DEV MOCK: No Stripe keys set. Order will be marked paid for local testing.</p>
        )}
      </div>
    </div>
  );
}
