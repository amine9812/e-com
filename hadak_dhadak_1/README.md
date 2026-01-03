# Hadak Dhadak Shop

Full-stack e-commerce app built with Next.js App Router, TypeScript, Tailwind, Prisma (SQLite), and optional Stripe checkout with a safe DEV MOCK fallback. Includes role-based admin, seeded catalog, carts for guests/users, and tests (Vitest + Playwright).

## Stack
- Next.js (App Router, TypeScript, SSR)
- Tailwind CSS
- Prisma ORM + SQLite (local)
- Custom session auth (email/password with bcrypt, httpOnly cookie)
- Optional Stripe Checkout; mock payment when keys are missing
- Vitest unit tests + Playwright e2e

## Getting started
Prereqs: Node 18+, pnpm (recommended). From repo root:

1) Install deps
```bash
pnpm install
```

2) Prepare database (runs migration + seed)
```bash
pnpm prisma:migrate --name init
pnpm prisma:seed
```

3) Run dev server
```bash
pnpm dev
```
Visit http://localhost:3000.

## Environment
Copy `.env.example` to `.env` and set:
- `DATABASE_URL` (default `file:./dev.db`)
- `APP_URL` (e.g. `http://localhost:3000`)
- `AUTH_SECRET` (random string for cookie signing)
- `STRIPE_SECRET_KEY` (optional)
- `STRIPE_PUBLIC_KEY` (optional)
- `STRIPE_WEBHOOK_SECRET` (optional)

If Stripe vars are missing, checkout uses **DEV MOCK** and immediately marks orders paid for local testing.

## Seed data
- Admin user: `admin@example.com` / `Admin123!`
- 5 categories, 20+ products with placeholder images
- Sample coupon `WELCOME10`

## Available scripts
- `pnpm dev` – start Next.js dev server
- `pnpm build` / `pnpm start` – production build & run
- `pnpm lint` – ESLint
- `pnpm prisma:migrate` – run Prisma migrate dev
- `pnpm prisma:seed` – seed database
- `pnpm test` – Vitest unit tests
- `pnpm e2e` – Playwright e2e (requires running dev server in another terminal)

Before running e2e the first time: `pnpm exec playwright install`.

## Testing notes
- Unit: price formatting and cart totals (Vitest)
- E2E smoke: browse products → add to cart → checkout with mock payment → see order confirmation (Playwright)

## Implementation highlights
- Server-rendered storefront pages with filters, sorting, pagination
- Carts persisted per-user in DB; guests in `localStorage`; merge on sign-in
- Checkout creates orders + addresses; Stripe Checkout if configured, else DEV MOCK
- Admin-only CRUD for products/categories and order status updates
- Basic rate limiting on auth endpoints; input validation via Zod
- Logging helper for server errors

## Troubleshooting
- If Prisma errors mention missing migration, rerun `pnpm prisma:migrate --name init`
- For Stripe webhooks: set `STRIPE_WEBHOOK_SECRET` and run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Reset local data: delete `prisma/dev.db*` then rerun migrate + seed

