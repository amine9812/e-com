import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const data: any = {};
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (stock < 0) return NextResponse.json({ error: 'Stock cannot be negative' }, { status: 400 });
    data.stock = stock;
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (price < 0) return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
    data.price = price;
  }
  const updated = await prisma.product.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
