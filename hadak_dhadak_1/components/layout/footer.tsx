export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-sm text-slate-600">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Hadak Dhadak. All rights reserved.</p>
        <p className="text-slate-500">Built with Next.js, Prisma, and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
