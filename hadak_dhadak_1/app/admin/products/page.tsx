import AdminProductsManager from '@/components/admin/products-manager';
import { prisma } from '@/lib/db';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true } }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <AdminProductsManager products={products} categories={categories} />
    </div>
  );
}
