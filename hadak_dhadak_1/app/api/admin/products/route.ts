import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';
import { ProductSchema } from '@/lib/validations';

export async function GET() {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const products = await prisma.product.findMany({ include: { category: true } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const parsed = ProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      sku: parsed.data.sku,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      categoryId: parsed.data.categoryId,
      isFeatured: parsed.data.isFeatured ?? false,
      images: { create: parsed.data.images.map((url) => ({ url })) },
    },
    include: { category: true },
  });

  return NextResponse.json(product);
}
