'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'styled-components';
import StyledComponentsRegistry from '@/lib/registry';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const theme = {
  colors: {
    primary: '#3b82f6',
    background: '#0f172a',
    text: '#ffffff',
  },
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StyledComponentsRegistry>
        <ThemeProvider theme={theme}>
          <Navbar />
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </StyledComponentsRegistry>
    </SessionProvider>
  );
}
