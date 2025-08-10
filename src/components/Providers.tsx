'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { useEffect } from 'react';
import { neoApi } from '@/lib/neoApi';

function TokenBootstrap() {
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        neoApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('auth-changed'));
      }
    } catch {}
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TokenBootstrap />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
}