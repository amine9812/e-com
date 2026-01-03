import { describe, expect, it } from 'vitest';
import { calculateCartTotal } from '../../lib/cart';

describe('calculateCartTotal', () => {
  it('sums subtotal and shipping', () => {
    const { subtotal, shipping, total } = calculateCartTotal([
      { price: 1000, quantity: 2 },
      { price: 2500, quantity: 1 },
    ], 500);
    expect(subtotal).toBe(4500);
    expect(shipping).toBe(500);
    expect(total).toBe(5000);
  });
});
