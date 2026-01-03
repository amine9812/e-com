import ProductCard from '@/components/products/product-card';
import ProductFilters from '@/components/products/product-filters';
import { getCategories, getProducts } from '@/lib/queries';

export default async function ProductsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const categories = await getCategories();
  const page = Number(searchParams.page ?? 1) || 1;
  const pageSize = 12;
  const filters = {
    search: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    inStock: searchParams.inStock === 'true',
    sort: typeof searchParams.sort === 'string' ? (searchParams.sort as any) : undefined,
    page,
    pageSize,
  };

  const { items, total } = await getProducts(filters);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 text-sm">Search, filter, and sort through our catalog.</p>
        </div>
        <p className="text-sm text-slate-500">{total} items</p>
      </div>

      <ProductFilters categories={categories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <a
          className={`rounded-md border px-3 py-1 text-sm ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
          href={`?${new URLSearchParams({ ...searchParams, page: String(page - 1) } as any)}`}
        >
          Previous
        </a>
        <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
        <a
          className={`rounded-md border px-3 py-1 text-sm ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
          href={`?${new URLSearchParams({ ...searchParams, page: String(page + 1) } as any)}`}
        >
          Next
        </a>
      </div>
    </div>
  );
}
