import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';
import { OrderStatusSchema } from '@/lib/validations';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await request.json();
  const parsed = OrderStatusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const updated = await prisma.order.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json(updated);
}
