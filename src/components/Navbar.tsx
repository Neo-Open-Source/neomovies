'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import styled from 'styled-components';
import SearchModal from './SearchModal';

// Типы
type MenuItem = {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

// Компоненты
const DesktopSidebar = styled.aside`
  display: none;
  flex-direction: column;
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(18, 18, 23, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  z-index: 40;

  @media (min-width: 769px) {
    display: flex;
  }
`;

const LogoContainer = styled.div`
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
`;

const MenuContainer = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const SidebarMenuItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MobileNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(18, 18, 23, 0.8);
  backdrop-filter: blur(10px);
  z-index: 50;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  
  span {
    color: #3b82f6;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(18, 18, 23, 0.95);
  backdrop-filter: blur(10px);
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  padding: 1rem;
  z-index: 49;
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.2s;
  font-size: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserProfile = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: white;
  width: 100%;
  cursor: pointer;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  min-width: 0;

  div:first-child {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div:last-child {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const AuthButtons = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Скрываем навбар на определенных страницах
  if (pathname === '/login' || pathname === '/404' || pathname.startsWith('/verify')) {
    return null;
  }

  // Если сессия загружается, показываем плейсхолдер
  if (status === 'loading') {
    return null;
  }

  const handleNavigation = (href: string, onClick?: () => void) => {
    if (onClick) {
      onClick();
    } else if (href !== '#') {
      router.push(href);
    }
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    {
      label: 'Главная',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Поиск',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      onClick: () => setIsSearchOpen(true)
    },
    {
      label: 'Категории',
      href: '/categories',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    {
      label: 'Избранное',
      href: '/favorites',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      label: 'Настройки',
      href: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar>
        <LogoContainer>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <Logo as="div">
              Neo <span>Movies</span>
            </Logo>
          </div>
        </LogoContainer>

        <MenuContainer>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNavigation(item.href, item.onClick)}
              style={{ cursor: 'pointer' }}
            >
              <SidebarMenuItem 
                as="div"
                $active={pathname === item.href}
              >
                {item.icon}
                {item.label}
              </SidebarMenuItem>
            </div>
          ))}
        </MenuContainer>

        {session ? (
          <UserProfile>
            <UserButton onClick={() => router.push('/profile')} style={{ cursor: 'pointer' }}>
              <UserAvatar>
                {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
              </UserAvatar>
              <UserInfo>
                <div>{session.user?.name}</div>
                <div>{session.user?.email}</div>
              </UserInfo>
            </UserButton>
          </UserProfile>
        ) : (
          <AuthButtons>
            <div onClick={() => router.push('/login')} style={{ cursor: 'pointer' }}>
              <MobileMenuItem as="div" style={{ justifyContent: 'center', background: '#3b82f6' }}>
                Войти
              </MobileMenuItem>
            </div>
          </AuthButtons>
        )}
      </DesktopSidebar>

      {/* Mobile Navigation */}
      <MobileNav>
        <Logo href="/">
          Neo <span>Movies</span>
        </Logo>
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </MobileMenuButton>
      </MobileNav>

      {/* Mobile Menu */}
      <MobileMenu $isOpen={isMobileMenuOpen}>
        {session ? (
          <UserProfile>
            <UserButton onClick={() => signOut()}>
              <UserAvatar>
                {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
              </UserAvatar>
              <UserInfo>
                <div>{session.user?.name}</div>
                <div>{session.user?.email}</div>
              </UserInfo>
            </UserButton>
          </UserProfile>
        ) : null}

        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleNavigation(item.href, item.onClick)}
            style={{ cursor: 'pointer' }}
          >
            <MobileMenuItem 
              as="div"
              style={{
                background: pathname === item.href ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              {item.icon}
              {item.label}
            </MobileMenuItem>
          </div>
        ))}

        {!session && (
          <AuthButtons>
            <div onClick={() => {
              router.push('/login');
              setIsMobileMenuOpen(false);
            }} style={{ cursor: 'pointer' }}>
              <MobileMenuItem as="div" style={{ justifyContent: 'center', background: '#3b82f6' }}>
                Войти
              </MobileMenuItem>
            </div>
          </AuthButtons>
        )}
      </MobileMenu>

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}
