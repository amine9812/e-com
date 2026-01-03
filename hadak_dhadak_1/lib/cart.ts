import { prisma } from './db';
import { logError } from './logger';
import { Prisma } from '@prisma/client';

export async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

export async function getCartWithItems(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true, category: true },
          },
        },
      },
    },
  });
}

export async function addItemToCart(userId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new Error('Product not found');
  }
  if (quantity < 1) {
    throw new Error('Quantity must be positive');
  }
  const cart = await getOrCreateCart(userId);
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  const desiredQty = (existing?.quantity ?? 0) + quantity;
  if (desiredQty > product.stock) {
    throw new Error('Not enough stock available');
  }
  if (existing) {
    return prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: desiredQty } });
  }
  return prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (!item) {
    throw new Error('Item not found in cart');
  }
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return null;
  }
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || quantity > product.stock) {
    throw new Error('Not enough stock available');
  }
  return prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
}

export async function removeCartItem(userId: string, productId: string) {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (!item) return null;
  await prisma.cartItem.delete({ where: { id: item.id } });
  return item;
}

export async function clearCart(userId: string) {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function mergeCart(userId: string, items: { productId: string; quantity: number }[]) {
  const cart = await getOrCreateCart(userId);
  for (const item of items) {
    try {
      await addItemToCart(userId, item.productId, item.quantity);
    } catch (err) {
      logError('Unable to merge cart item', { item, err });
    }
  }
  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });
}

export function calculateCartTotal(items: { price: number; quantity: number }[], shipping = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

export async function decrementInventory(items: { productId: string; quantity: number }[], tx = prisma) {
  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new Error('Product not found');
    if (product.stock < item.quantity) throw new Error('Not enough stock');
    await tx.product.update({ where: { id: item.productId }, data: { stock: product.stock - item.quantity } });
  }
}
