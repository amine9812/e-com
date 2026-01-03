import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductImage, Category } from '@prisma/client';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: Product & { images: ProductImage[]; category: Category } }) {
  const image = product.images[0]?.url;
  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-slate-100">
        {image && (
          <Image
            src={`${image}&auto=format&fit=crop&w=500&q=80`}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-primary-600">{product.category.name}</p>
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-base font-semibold">{formatPrice(product.price)}</p>
        <p className="text-xs text-slate-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      </div>
    </Link>
  );
}
