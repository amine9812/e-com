import OrdersManager from '@/components/admin/orders-manager';
import { prisma } from '@/lib/db';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <OrdersManager orders={orders} />
    </div>
  );
}
