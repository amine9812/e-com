'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '@/components/forms/input';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to sign up');
      toast.success('Account created');
      router.push('/signin');
    } catch (err: any) {
      toast.error(err.message || 'Unable to sign up');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-md bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Sign up'}
        </button>
        <p className="text-sm text-slate-600">Already have an account? <a href="/signin" className="text-primary-600">Sign in</a>.</p>
      </div>
    </div>
  );
}
