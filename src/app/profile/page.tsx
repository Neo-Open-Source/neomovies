'use client';

import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import GlassCard from '@/components/GlassCard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
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

  if (!session) {
    return null;
  }

  return (
    <Container>
      <Content>
        <GlassCard>
          <ProfileHeader>
            <Avatar>
              {session.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
            </Avatar>
            <Name>{session.user?.name}</Name>
            <Email>{session.user?.email}</Email>
          </ProfileHeader>
          <SignOutButton onClick={() => router.push('/settings')}>
            Настройки
          </SignOutButton>
        </GlassCard>
      </Content>
    </Container>
  );
}
