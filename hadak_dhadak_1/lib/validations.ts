import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(50),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const CategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
});

export const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  sku: z.string().min(2).max(50),
  slug: z.string().min(2).max(100),
  description: z.string().min(10),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.string().url()).min(1),
});

export const CartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const CheckoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(2),
    country: z.string().min(2),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).optional(),
});

export const OrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'REFUNDED']),
});
