import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/queries';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('q') || undefined;
  const category = url.searchParams.get('category') || undefined;
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const inStock = url.searchParams.get('inStock') === 'true';
  const sort = (url.searchParams.get('sort') as any) || undefined;
  const page = Number(url.searchParams.get('page') ?? 1) || 1;
  const pageSize = Number(url.searchParams.get('pageSize') ?? 12) || 12;

  const result = await getProducts({
    search,
    category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    inStock,
    sort,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}
