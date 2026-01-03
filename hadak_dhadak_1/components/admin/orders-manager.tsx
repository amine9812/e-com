'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/format';

export default function OrdersManager({ orders: initial }: { orders: any[] }) {
  const [orders, setOrders] = useState(initial);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success('Updated');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-semibold">{order.id}</p>
            <p className="text-sm text-slate-500">{order.items.length} items · {formatPrice(order.total)}</p>
            <p className="text-sm text-slate-500">{order.status}</p>
          </div>
          <select
            className="rounded-md border border-slate-200 px-3 py-2"
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      ))}
    </div>
  );
}
