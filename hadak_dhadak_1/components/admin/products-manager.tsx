'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminProductsManager({
  products,
  categories,
}: {
  products: any[];
  categories: { id: string; name: string }[];
}) {
  const [items, setItems] = useState(products);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    slug: '',
    price: 0,
    stock: 0,
    categoryId: categories[0]?.id ?? '',
    description: '',
    images: '',
    isFeatured: false,
  });

  async function createProduct() {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
          images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
      setItems([data, ...items]);
      toast.success('Product created');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function updateStock(id: string, stock: number) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
      setItems(items.map((p) => (p.id === id ? { ...p, stock } : p)));
      toast.success('Stock updated');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setItems(items.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const inputClass = 'rounded-md border border-slate-200 px-3 py-2 w-full';

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h3 className="font-semibold">Create product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={inputClass} placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value, slug: e.target.value.toLowerCase() })} />
          <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className={inputClass} placeholder="Price cents" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input className={inputClass} placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <select className={inputClass} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <textarea className={`${inputClass} md:col-span-2`} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className={`${inputClass} md:col-span-2`} placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            Featured
          </label>
        </div>
        <button onClick={createProduct} className="rounded-md bg-primary-600 px-4 py-2 text-white font-semibold">Save</button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Existing products</h3>
        <div className="space-y-2">
          {items.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">{p.sku} · {p.category.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="w-20 rounded-md border border-slate-200 px-2 py-1"
                  value={p.stock}
                  onChange={(e) => updateStock(p.id, Number(e.target.value))}
                />
                <button onClick={() => remove(p.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
