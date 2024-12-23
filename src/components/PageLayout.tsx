'use client';

import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main<{ $isSettingsPage: boolean }>`
  flex: 1;
  margin-left: 220px;
  padding: 0;
  overflow: hidden;

  ${props => props.$isSettingsPage && `
    display: flex;
    justify-content: center;
    padding-top: 2rem;
  `}

  @media (max-width: 768px) {
    margin-left: 0;
    padding-top: ${props => props.$isSettingsPage ? 'calc(60px + 2rem)' : '60px'};
  }
`;

const NotFoundContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  text-align: center;
  padding: 2rem;

  h1 {
    font-size: 6rem;
    margin: 0;
    color: #2196f3;
  }

  p {
    font-size: 1.5rem;
    margin: 1rem 0 2rem;
    color: rgba(255, 255, 255, 0.7);
  }

  a {
    color: #2196f3;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSettingsPage = pathname === '/settings';
  const is404Page = pathname === '/404' || pathname.includes('/not-found');

  if (is404Page) {
    return (
      <NotFoundContent>
        <h1>404</h1>
        <p>Страница не найдена</p>
        <a href="/">Вернуться на главную</a>
      </NotFoundContent>
    );
  }

  return (
    <Layout>
      <Navbar />
      <MainContent $isSettingsPage={isSettingsPage}>
        {children}
      </MainContent>
    </Layout>
  );
}
