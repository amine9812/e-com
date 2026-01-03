import { describe, expect, it } from 'vitest';
import { formatPrice } from '../../lib/format';

describe('formatPrice', () => {
  it('formats USD cents to currency string', () => {
    expect(formatPrice(12345)).toBe('$123.45');
  });
  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
