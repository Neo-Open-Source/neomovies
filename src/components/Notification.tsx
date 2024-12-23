'use client';

import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Container = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: ${({ type }) => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'info':
        return '#2196f3';
    }
  }};
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.3s ease-out;
  z-index: 1000;
`;

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({
  message,
  type,
  onClose,
  duration = 3000,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <Container type={type}>{message}</Container>;
}
