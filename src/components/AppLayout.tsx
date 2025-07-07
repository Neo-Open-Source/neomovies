'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex bg-gray-900 text-white">
    {children}
  </div>
);

const Main = ({ children }: { children: ReactNode }) => (
  <main className="flex-1 p-4 md:p-6 lg:p-8">
    {children}
  </main>
);

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/404' || pathname.startsWith('/verify');

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <Layout>
      <Main>{children}</Main>
    </Layout>
  );
}
