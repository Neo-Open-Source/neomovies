'use client';

import styled from 'styled-components';
import { Providers } from './Providers';
import { Toaster } from 'react-hot-toast';
import PageLayout from './PageLayout';

const MainContent = styled.div`
  width: 100%;
  min-height: 100vh;
`;

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  return (
    <Providers>
      <PageLayout>
        <MainContent>
          {children}
        </MainContent>
      </PageLayout>
      <Toaster />
    </Providers>
  );
}
