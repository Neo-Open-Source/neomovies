'use client';

import HeaderBar from './HeaderBar';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './ThemeProvider';
import { useState } from 'react';
import MobileNav from './MobileNav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex flex-col min-h-screen">
        <HeaderBar onBurgerClick={() => setIsMobileMenuOpen(true)} />
        <MobileNav show={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 w-full">{children}</main>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  );
}
