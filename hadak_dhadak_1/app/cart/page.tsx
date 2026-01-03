import CartView from '@/components/cart/cart-view';
import { getCartWithItems } from '@/lib/cart';
import { getUserFromSession } from '@/lib/auth';

export default async function CartPage() {
  const user = await getUserFromSession();
  const cart = user ? await getCartWithItems(user.id) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Your cart</h1>
      <CartView mode={user ? 'user' : 'guest'} serverItems={cart?.items ?? []} />
    </div>
  );
}
