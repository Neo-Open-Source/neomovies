'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '@/styles/GlobalStyles';

const theme = {
  colors: {
    primary: '#2196f3',
    background: '#0a0a0a',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    error: '#ff5252',
    success: '#4caf50',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
