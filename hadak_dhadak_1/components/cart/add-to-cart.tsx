'use client';

import toast from 'react-hot-toast';
import { useState } from 'react';
import { useGuestCart } from './use-guest-cart';

export default function AddToCartButton({
  product,
  isLoggedIn,
}: {
  product: { id: string; name: string; price: number; sku: string; image?: string };
  isLoggedIn: boolean;
}) {
  const guestCart = useGuestCart();
  const [loading, setLoading] = useState(false);

  const add = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        if (!res.ok) throw new Error('Unable to add to cart');
      } else {
        guestCart.add({ productId: product.id, quantity: 1, price: product.price, name: product.name, sku: product.sku, image: product.image });
      }
      toast.success('Added to cart');
    } catch (err) {
      toast.error('Could not add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={add}
      disabled={loading}
      className="rounded-md bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
    >
      {loading ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
