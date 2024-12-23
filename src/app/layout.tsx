import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Neo Movies',
  description: 'Смотрите фильмы онлайн',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
