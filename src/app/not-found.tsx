'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0a0a0a;
  overflow: hidden;
  z-index: 9999;
`;

const Content = styled.div`
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
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: 700;
  color: #2196f3;
  margin: 0;
  line-height: 1;
  letter-spacing: 4px;
  text-shadow: 0 4px 32px rgba(33, 150, 243, 0.3);
`;

const Title = styled.h2`
  font-size: 24px;
  color: #FFFFFF;
  margin: 20px 0;
  font-weight: 600;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background: #2196f3;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #1976d2;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
  }
`;

const GlowingBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.visible {
    opacity: 1;
  }
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

export default function NotFound() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Container>
      {isClient && (
        <GlowingBackground className={isClient ? 'visible' : ''}>
          <Glow1 />
          <Glow2 />
          <Glow3 />
        </GlowingBackground>
      )}
      
      <Content>
        <GlassCard>
          <ErrorCode>404</ErrorCode>
          <Title>Упс... Страница не найдена</Title>
          <Description>
            К сожалению, запрашиваемая страница не найдена.
            <br />
            Возможно, она была удалена или перемещена.
          </Description>
          <HomeButton href="/">Вернуться на главную</HomeButton>
        </GlassCard>
      </Content>
    </Container>
  );
}
