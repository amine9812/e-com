import './globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Hadak Dhadak Shop',
  description: 'Modern e-commerce storefront built with Next.js, Prisma, and Tailwind.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
