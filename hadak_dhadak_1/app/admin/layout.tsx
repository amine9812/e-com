import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getUserFromSession } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromSession();
  if (!user || user.role !== 'ADMIN') redirect('/signin');

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
        <p className="font-semibold">Admin</p>
        <a href="/admin" className="text-sm text-primary-600">Dashboard</a>
        <a href="/admin/products" className="text-sm text-primary-600">Products</a>
        <a href="/admin/categories" className="text-sm text-primary-600">Categories</a>
        <a href="/admin/orders" className="text-sm text-primary-600">Orders</a>
      </div>
      {children}
    </div>
  );
}
