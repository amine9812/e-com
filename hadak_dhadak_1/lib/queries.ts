import { prisma } from './db';
import { Prisma } from '@prisma/client';

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { images: true, category: true },
  });
}

export type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'newest';
  page?: number;
  pageSize?: number;
};

export async function getProducts(filters: ProductFilters) {
  const { search, category, minPrice, maxPrice, inStock, sort, page = 1, pageSize = 12 } = filters;
  const where: Prisma.ProductWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (minPrice !== undefined) where.price = { ...(where.price as any), gte: minPrice };
  if (maxPrice !== undefined) where.price = { ...(where.price as any), lte: maxPrice };
  if (inStock) where.stock = { gt: 0 };

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };
  if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { images: true, category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
}

export async function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, address: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true, user: true },
  });
}
