import CategoriesManager from '@/components/admin/categories-manager';
import { prisma } from '@/lib/db';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>
      <CategoriesManager categories={categories} />
    </div>
  );
}
