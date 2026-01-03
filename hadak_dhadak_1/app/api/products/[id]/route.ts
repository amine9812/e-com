import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/queries';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}
