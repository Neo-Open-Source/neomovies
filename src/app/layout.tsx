import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';
import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';
import { Analytics } from "@vercel/analytics/react";
import { TermsChecker } from './providers/terms-check';

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
        <Providers>
            <ClientLayout>{children}</ClientLayout>
          </Providers>
	<TermsChecker />
	<Analytics />
      </body>
    </html>
  );
}
