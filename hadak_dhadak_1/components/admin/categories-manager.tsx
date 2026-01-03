'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CategoriesManager({ categories: initial }: { categories: { id: string; name: string; slug: string }[] }) {
  const [categories, setCategories] = useState(initial);
  const [form, setForm] = useState({ name: '', slug: '' });

  async function create() {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create category');
      setCategories([data, ...categories]);
      toast.success('Category created');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('Deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const inputClass = 'rounded-md border border-slate-200 px-3 py-2 w-full';

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-2">
        <h3 className="font-semibold">Create category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
        <button onClick={create} className="rounded-md bg-primary-600 px-4 py-2 text-white font-semibold">Save</button>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-2">
        <h3 className="font-semibold">Existing categories</h3>
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-slate-500">{c.slug}</p>
            </div>
            <button onClick={() => remove(c.id)} className="text-sm text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
