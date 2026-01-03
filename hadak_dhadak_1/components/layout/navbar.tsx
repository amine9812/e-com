import Link from 'next/link';
import { getUserFromSession } from '@/lib/auth';

export default async function Navbar() {
  const user = await getUserFromSession();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-primary-600">
          Hadak Dhadak
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <Link href="/cart" className="hover:text-primary-600">Cart</Link>
          {user ? (
            <>
              <Link href="/account" className="hover:text-primary-600">Account</Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-primary-600">Admin</Link>
              )}
              <Link href="/api/auth/logout" className="hover:text-primary-600">Sign out</Link>
            </>
          ) : (
            <>
              <Link href="/signin" className="hover:text-primary-600">Sign in</Link>
              <Link href="/signup" className="hover:text-primary-600">Create account</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
