'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Input from '../forms/input';
import Select from '../forms/select';

export default function ProductFilters({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <Input
        label="Search"
        placeholder="Search products"
        defaultValue={searchParams.get('q') ?? ''}
        onChange={(e) => update('q', e.target.value)}
      />
      <Select label="Category" defaultValue={searchParams.get('category') ?? ''} onChange={(e) => update('category', e.target.value)}>
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </Select>
      <Input
        label="Min price"
        type="number"
        min={0}
        defaultValue={searchParams.get('minPrice') ?? ''}
        onChange={(e) => update('minPrice', e.target.value)}
      />
      <Input
        label="Max price"
        type="number"
        min={0}
        defaultValue={searchParams.get('maxPrice') ?? ''}
        onChange={(e) => update('maxPrice', e.target.value)}
      />
      <Select label="Sort" defaultValue={searchParams.get('sort') ?? ''} onChange={(e) => update('sort', e.target.value)}>
        <option value="">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </Select>
      <Select label="Stock" defaultValue={searchParams.get('inStock') ?? ''} onChange={(e) => update('inStock', e.target.value)}>
        <option value="">All</option>
        <option value="true">In stock</option>
      </Select>
    </div>
  );
}
