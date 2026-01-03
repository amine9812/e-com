import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const categoryData = [
    { name: 'Sneakers', slug: 'sneakers' },
    { name: 'Apparel', slug: 'apparel' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Outdoors', slug: 'outdoors' },
    { name: 'Home', slug: 'home' },
  ];

  const categories = await Promise.all(
    categoryData.map((category) =>
      prisma.category.create({ data: category })
    )
  );

  const products = [
    {
      name: 'Air Runner Sneaker',
      sku: 'SNK-001',
      price: 12900,
      stock: 20,
      description: 'Lightweight running sneaker with responsive cushioning.',
      category: 'sneakers',
      images: [
        'https://images.unsplash.com/photo-1528701800489-20be9d1e0d72',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      ],
      isFeatured: true,
    },
    {
      name: 'Trailblazer Hiker',
      sku: 'SNK-002',
      price: 14900,
      stock: 18,
      description: 'Rugged hiking boot built for stability on uneven terrain.',
      category: 'outdoors',
      images: [
        'https://images.unsplash.com/photo-1521093470119-a3acdc43374d',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      ],
      isFeatured: true,
    },
    {
      name: 'Everyday Hoodie',
      sku: 'APP-001',
      price: 6900,
      stock: 30,
      description: 'Soft fleece hoodie with modern fit and front pocket.',
      category: 'apparel',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      ],
      isFeatured: true,
    },
    {
      name: 'Performance Tee',
      sku: 'APP-002',
      price: 3900,
      stock: 40,
      description: 'Breathable, moisture-wicking tee for training.',
      category: 'apparel',
      images: [
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
      ],
      isFeatured: false,
    },
    {
      name: 'Canvas Tote',
      sku: 'ACC-001',
      price: 3200,
      stock: 25,
      description: 'Durable canvas tote bag for daily essentials.',
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae',
      ],
      isFeatured: false,
    },
    {
      name: 'Minimalist Watch',
      sku: 'ACC-002',
      price: 9900,
      stock: 15,
      description: 'Stainless steel watch with minimalist dial.',
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      ],
      isFeatured: true,
    },
    {
      name: 'Trail Backpack 24L',
      sku: 'OUT-001',
      price: 11900,
      stock: 22,
      description: 'Weather-resistant daypack with ventilated back panel.',
      category: 'outdoors',
      images: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      ],
      isFeatured: false,
    },
    {
      name: 'Insulated Bottle',
      sku: 'OUT-002',
      price: 2800,
      stock: 35,
      description: 'Keeps beverages hot or cold for hours.',
      category: 'outdoors',
      images: [
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
      ],
      isFeatured: false,
    },
    {
      name: 'Cozy Throw Blanket',
      sku: 'HOME-001',
      price: 5400,
      stock: 28,
      description: 'Textured throw blanket perfect for the couch.',
      category: 'home',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      ],
      isFeatured: false,
    },
    {
      name: 'Ceramic Mug Set',
      sku: 'HOME-002',
      price: 3600,
      stock: 26,
      description: 'Matte ceramic mugs with ergonomic handle.',
      category: 'home',
      images: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      ],
      isFeatured: false,
    },
    {
      name: 'City Runner Sneaker',
      sku: 'SNK-003',
      price: 11000,
      stock: 24,
      description: 'Versatile sneaker designed for all-day wear.',
      category: 'sneakers',
      images: [
        'https://images.unsplash.com/photo-1528701800489-20be9d1e0d72',
      ],
      isFeatured: false,
    },
    {
      name: 'Studio Joggers',
      sku: 'APP-003',
      price: 6200,
      stock: 33,
      description: 'Slim joggers with stretch waistband.',
      category: 'apparel',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      ],
      isFeatured: false,
    },
    {
      name: 'Wool Beanie',
      sku: 'ACC-003',
      price: 2500,
      stock: 30,
      description: 'Ribbed knit beanie crafted from soft wool.',
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      ],
      isFeatured: false,
    },
    {
      name: 'Leather Belt',
      sku: 'ACC-004',
      price: 4500,
      stock: 20,
      description: 'Full-grain leather belt with matte buckle.',
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
      ],
      isFeatured: false,
    },
    {
      name: 'Camping Lantern',
      sku: 'OUT-003',
      price: 5200,
      stock: 18,
      description: 'Rechargeable lantern with dimming controls.',
      category: 'outdoors',
      images: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      ],
      isFeatured: false,
    },
    {
      name: 'Weighted Blanket',
      sku: 'HOME-003',
      price: 12900,
      stock: 12,
      description: '12lb weighted blanket with breathable cover.',
      category: 'home',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      ],
      isFeatured: false,
    },
    {
      name: 'Classic White Tee',
      sku: 'APP-004',
      price: 2500,
      stock: 45,
      description: 'Pima cotton tee with relaxed fit.',
      category: 'apparel',
      images: [
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
      ],
      isFeatured: false,
    },
    {
      name: 'Weekender Duffel',
      sku: 'ACC-005',
      price: 8900,
      stock: 16,
      description: 'Carry-on friendly duffel with shoe compartment.',
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      ],
      isFeatured: false,
    },
    {
      name: 'Trail Cap',
      sku: 'ACC-006',
      price: 2400,
      stock: 28,
      description: 'Moisture-wicking cap with adjustable strap.',
      category: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      ],
      isFeatured: false,
    },
    {
      name: 'Lounge Pants',
      sku: 'APP-005',
      price: 4800,
      stock: 30,
      description: 'Ultra-soft lounge pants with tapered leg.',
      category: 'apparel',
      images: [
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb',
      ],
      isFeatured: false,
    },
  ];

  for (const product of products) {
    const category = categories.find((c) => c.slug === product.category);
    if (!category) continue;

    await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        slug: product.sku.toLowerCase(),
        description: product.description,
        price: product.price,
        stock: product.stock,
        isFeatured: product.isFeatured,
        categoryId: category.id,
        images: {
          create: product.images.map((url) => ({ url })),
        },
      },
    });
  }

  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      percentOff: 10,
      amountOff: null,
    },
  });

  console.log('Database seeded with admin user and sample catalog.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
