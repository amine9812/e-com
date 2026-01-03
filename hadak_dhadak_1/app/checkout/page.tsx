import CheckoutForm from '@/components/cart/checkout-form';
import { getCartWithItems } from '@/lib/cart';
import { getUserFromSession } from '@/lib/auth';
import { stripeEnabled } from '@/lib/stripe';

export default async function CheckoutPage() {
  const user = await getUserFromSession();
  const cart = user ? await getCartWithItems(user.id) : null;
  const subtotal = cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
      <CheckoutForm
        userEmail={user?.email ?? undefined}
        initialSubtotal={subtotal}
        mode={user ? 'user' : 'guest'}
        stripeEnabled={stripeEnabled}
      />
    </div>
  );
}
