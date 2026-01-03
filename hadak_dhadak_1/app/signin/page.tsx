'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '@/components/forms/input';
import { useGuestCart } from '@/components/cart/use-guest-cart';

export default function SignInPage() {
  const router = useRouter();
  const guestCart = useGuestCart();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');

      if (guestCart.items.length) {
        await fetch('/api/cart/merge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: guestCart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
        });
        guestCart.clear();
      }

      toast.success('Signed in');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-md bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-sm text-slate-600">No account? <a href="/signup" className="text-primary-600">Create one</a>.</p>
      </div>
    </div>
  );
}
