'use client';

import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import GlassCard from '@/components/GlassCard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  background-color: #0a0a0a;
`;

const Content = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #2196f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  border: 4px solid #fff;
`;

const Name = styled.h1`
  color: #fff;
  font-size: 2rem;
  margin: 0;
`;

const Email = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0;
`;

const SignOutButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #ff2020;
  }
`;

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setUserName(localStorage.getItem('userName'));
      setUserEmail(localStorage.getItem('userEmail'));
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    logout();
  };

  if (loading) {
    return (
      <Container>
        <Content>
          <GlassCard>
            <div>Загрузка...</div>
          </GlassCard>
        </Content>
      </Container>
    );
  }

  if (!userName) {
    return null;
  }

  return (
    <Container>
      <Content>
        <GlassCard>
          <ProfileHeader>
            <Avatar>
              {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
            </Avatar>
            <Name>{userName}</Name>
            <Email>{userEmail}</Email>
            <SignOutButton onClick={handleSignOut}>Выйти</SignOutButton>
          </ProfileHeader>
        </GlassCard>
      </Content>
    </Container>
  );
}
