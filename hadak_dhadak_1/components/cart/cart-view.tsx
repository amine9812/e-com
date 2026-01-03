'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';
import { useGuestCart, GuestCartItem } from './use-guest-cart';

type ServerCartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    images: { url: string }[];
  };
};

export default function CartView({
  mode,
  serverItems,
}: {
  mode: 'guest' | 'user';
  serverItems: ServerCartItem[];
}) {
  const guest = useGuestCart(
    serverItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      sku: item.product.sku,
      image: item.product.images[0]?.url,
    }))
  );
  const [userItems, setUserItems] = useState(serverItems);

  const rawItems = mode === 'guest' ? guest.items : userItems;
  const items = rawItems.map((item) =>
    'product' in item
      ? {
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
          sku: item.product.sku,
          image: item.product.images[0]?.url,
        }
      : item
  );

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 1200; // free over $100
  const total = subtotal + shipping;

  async function updateUserItem(productId: string, quantity: number) {
    const res = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) {
      toast.error('Could not update cart');
      return;
    }
    const data = await res.json();
    setUserItems(data.items);
  }

  async function removeUserItem(productId: string) {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) {
      toast.error('Could not remove item');
      return;
    }
    const data = await res.json();
    setUserItems(data.items);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
            Your cart is empty.
          </div>
        )}
        {items.map((item) => (
          <div key={item.productId}
            className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            {item.image && (
              <div className="h-24 w-24 overflow-hidden rounded-md bg-slate-100">
                <Image
                  src={`${item.image}&auto=format&fit=crop&w=200&q=70`}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.sku}</p>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">{formatPrice(item.price)}</p>
                </div>
                <button
                  onClick={() => {
                    if (mode === 'guest') guest.remove(item.productId);
                    else removeUserItem(item.productId);
                  }}
                  className="text-sm text-red-600"
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="text-sm text-slate-600">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const qty = Number(e.target.value);
                    if (mode === 'guest') guest.update(item.productId, qty);
                    else updateUserItem(item.productId, qty);
                  }}
                  className="w-20 rounded-md border border-slate-200 px-2 py-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm h-fit space-y-3">
        <h3 className="text-lg font-semibold">Summary</h3>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping (placeholder)</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="block text-center rounded-md bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
        >
          Proceed to checkout
        </Link>
        {mode === 'guest' && (
          <p className="text-xs text-slate-500">Cart saves in your browser. Log in to sync.</p>
        )}
      </div>
    </div>
  );
}
