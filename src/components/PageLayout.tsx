'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSettingsPage = pathname === '/settings';
  const is404Page = pathname === '/404' || pathname.includes('/not-found');

  if (is404Page) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-8">
        <h1 className="text-6xl font-bold m-0 text-blue-500">404</h1>
        <p className="text-2xl my-4 text-gray-300">Страница не найдена</p>
        <Link href="/" className="text-blue-500 font-medium hover:underline">
          Вернуться на главную
        </Link>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen">
      <main className={`flex-1 overflow-hidden ${isSettingsPage ? 'flex justify-center pt-8' : ''}`}>
        {children}
      </main>
    </div>
  );
}
