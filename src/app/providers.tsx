'use client';

import { ThemeProvider } from 'styled-components';
import { SessionProvider } from 'next-auth/react';

const theme = {
  colors: {
    primary: '#2196f3',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    error: '#f44336',
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
    <ThemeProvider theme={theme}>
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
