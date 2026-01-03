import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromSession } from '@/lib/auth';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
