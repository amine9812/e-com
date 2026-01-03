import Link from 'next/link';
import ProductCard from '@/components/products/product-card';
import { getCategories, getFeaturedProducts } from '@/lib/queries';

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 px-6 py-12 text-white shadow-lg">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wide text-primary-100">New arrivals</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">Find gear that moves with you.</h1>
            <p className="text-primary-100 text-lg">Performance sneakers, apparel, and accessories crafted for everyday adventures.</p>
            <div className="flex gap-3">
              <Link href="/products" className="rounded-md bg-white px-4 py-2 text-primary-700 font-semibold shadow">
                Shop products
              </Link>
              <Link href="/signup" className="rounded-md border border-white/40 px-4 py-2 font-semibold">
                Create account
              </Link>
            </div>
          </div>
          <div className="hidden md:block justify-self-end text-primary-100">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur shadow-xl">
              <p className="text-sm uppercase tracking-wide mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`} className="rounded-lg bg-white/10 px-3 py-2 hover:bg-white/20">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured products</h2>
          <Link href="/products" className="text-primary-600 font-semibold">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Why shop with us</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="rounded-lg bg-slate-50 p-4">Fast shipping and easy returns.</div>
          <div className="rounded-lg bg-slate-50 p-4">Secure checkout with dev-friendly mock mode.</div>
          <div className="rounded-lg bg-slate-50 p-4">Curated catalog seeded for testing.</div>
        </div>
      </section>
    </div>
  );
}
