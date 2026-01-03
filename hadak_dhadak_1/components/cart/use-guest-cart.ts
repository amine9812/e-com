'use client';

import { useEffect, useState } from 'react';

export type GuestCartItem = { productId: string; quantity: number; price: number; name: string; sku: string; image?: string };

const STORAGE_KEY = 'guest_cart';

function readCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch (err) {
    return [];
  }
}

function writeCart(items: GuestCartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useGuestCart(initial: GuestCartItem[] = []) {
  const [items, setItems] = useState<GuestCartItem[]>(initial);

  useEffect(() => {
    setItems(readCart().length ? readCart() : initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (next: GuestCartItem[]) => {
    setItems(next);
    writeCart(next);
  };

  const add = (item: GuestCartItem) => {
    const existing = items.find((i) => i.productId === item.productId);
    if (existing) {
      save(
        items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      );
    } else {
      save([...items, item]);
    }
  };

  const update = (productId: string, quantity: number) => {
    if (quantity <= 0) return remove(productId);
    save(items.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const remove = (productId: string) => {
    save(items.filter((i) => i.productId !== productId));
  };

  const clear = () => save([]);

  return { items, add, update, remove, clear };
}
