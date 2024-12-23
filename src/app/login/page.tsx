'use client';

import dynamic from 'next/dynamic';
import styled from 'styled-components';

const LoginClient = dynamic(() => import('./LoginClient'), {
  ssr: false
});

export default function LoginPage() {
  return (
    <Container>
      <GlowingBackground>
        <Glow1 />
        <Glow2 />
        <Glow3 />
      </GlowingBackground>

      <Content>
        <Logo>
          <span>Neo</span> Movies
        </Logo>

        <GlassCard>
          <LoginClient />
        </GlassCard>
      </Content>
    </Container>
  );
}

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

const Logo = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
  text-align: center;

  span {
    color: #2196f3;
  }
`;

const GlassCard = styled.div`
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto;
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
