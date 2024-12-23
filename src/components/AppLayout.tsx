'use client';

import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { ReactNode } from 'react';
import Navbar from './Navbar';

const Layout = styled.div<{ $hasNavbar: boolean }>`
  min-height: 100vh;
  display: flex;
  background: #0E0E0E;
`;

const Main = styled.main<{ $hasNavbar: boolean }>`
  flex: 1;
  padding: 20px;

  ${props => props.$hasNavbar && `
    @media (max-width: 768px) {
      margin-top: 60px;
    }
    @media (min-width: 769px) {
      margin-left: 240px;
    }
  `}
`;

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/404' || pathname.startsWith('/verify');

  return (
    <Layout $hasNavbar={!hideNavbar}>
      {!hideNavbar && <Navbar />}
      <Main $hasNavbar={!hideNavbar}>{children}</Main>
    </Layout>
  );
}
