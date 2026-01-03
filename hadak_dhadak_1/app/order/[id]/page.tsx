import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { getOrder } from '@/lib/queries';

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Order confirmation</h1>
      {order.mockPayment && (
        <p className="rounded-md bg-amber-100 px-3 py-2 text-sm text-amber-800">DEV MOCK PAYMENT: This order was marked paid without Stripe.</p>
      )}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">Order ID</p>
            <p className="font-semibold">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Status</p>
            <p className="font-semibold">{order.status}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Shipping</h3>
            <p className="text-sm text-slate-700">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ''}
              <br />
              {order.address.city}, {order.address.state} {order.address.postalCode}
              <br />
              {order.address.country}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Summary</h3>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(order.total - order.shipping)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Items</h3>
          <div className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-slate-500">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p>{formatPrice(item.price)}</p>
                  <p className="text-slate-500">Qty {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
