import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/cart/add-to-cart';
import { getProduct } from '@/lib/queries';
import { getUserFromSession } from '@/lib/auth';
import { formatPrice } from '@/lib/format';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return notFound();
  const user = await getUserFromSession();
  const image = product.images[0]?.url;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3">
        {image && (
          <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <Image
              src={`${image}&auto=format&fit=crop&w=900&q=80`}
              alt={product.name}
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((img) => (
            <div key={img.id} className="aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-100">
              <Image src={`${img.url}&auto=format&fit=crop&w=200&q=70`} alt={product.name} width={200} height={200} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-primary-600">{product.category.name}</p>
        <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
        <p className="text-xl font-semibold">{formatPrice(product.price)}</p>
        <p className="text-slate-700 leading-relaxed">{product.description}</p>
        <p className="text-sm text-slate-600">SKU: {product.sku}</p>
        <p className="text-sm text-slate-600">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div className="pt-2">
          <AddToCartButton
            product={{ id: product.id, name: product.name, price: product.price, sku: product.sku, image }}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </div>
  );
}
