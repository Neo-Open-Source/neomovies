'use client';

import { GlassCard } from '@/components/GlassCard';
import { VerificationClient } from './VerificationClient';
import styled from 'styled-components';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #0a0a0a;
  overflow: hidden;
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const GlowingBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
`;

const Glow = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-30px, 30px); }
  }
`;

const Glow1 = styled(Glow)`
  background: #2196f3;
  width: 600px;
  height: 600px;
  top: -200px;
  left: -200px;
  animation-delay: 0s;
`;

const Glow2 = styled(Glow)`
  background: #9c27b0;
  width: 500px;
  height: 500px;
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
`;

const Glow3 = styled(Glow)`
  background: #00bcd4;
  width: 400px;
  height: 400px;
  bottom: 100px;
  left: 30%;
  animation-delay: -10s;
`;

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <Container>
      <GlowingBackground>
        <Glow1 />
        <Glow2 />
        <Glow3 />
      </GlowingBackground>
      <Content>
        <GlassCard>
          <VerificationClient email={email} />
        </GlassCard>
      </Content>
    </Container>
  );
}

export default function VerificationPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
