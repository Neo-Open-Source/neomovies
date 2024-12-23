'use client';

import GlobalStyles from '@/styles/GlobalStyles';

export default function StyleProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  );
}
