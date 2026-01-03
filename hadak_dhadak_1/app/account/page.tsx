import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth';
import { getOrdersForUser } from '@/lib/queries';
import { formatPrice } from '@/lib/format';

export default async function AccountPage() {
  const user = await getUserFromSession();
  if (!user) redirect('/signin');
  const orders = await getOrdersForUser(user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="font-semibold">{user.email}</p>
        <p className="text-sm text-slate-500">Role: {user.role}</p>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Orders</h2>
        {orders.length === 0 && <p className="text-sm text-slate-600">No orders yet.</p>}
        <div className="grid grid-cols-1 gap-3">
          {orders.map((order) => (
            <a key={order.id} href={`/order/${order.id}`} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between hover:border-primary-200">
              <div>
                <p className="font-semibold">Order {order.id.slice(0, 10)}...</p>
                <p className="text-sm text-slate-500">{order.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <p className="text-sm text-slate-500">{order.status}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
