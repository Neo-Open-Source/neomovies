'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

const CodeInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 2rem;
  letter-spacing: 0.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
  }

  &::placeholder {
    letter-spacing: normal;
    color: rgba(255, 255, 255, 0.3);
  }
`;

const VerifyButton = styled.button`
  width: 100%;
  background: linear-gradient(to right, #2196f3, #1e88e5);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to right, #1e88e5, #1976d2);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export function VerificationClient({ email }: { email: string }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Код должен состоять из 6 цифр');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка верификации');
      }

      // Выполняем вход после успешной верификации
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password: localStorage.getItem('password'),
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Не удалось отправить код');
      }

      setCountdown(60);
    } catch (err) {
      setError('Не удалось отправить код');
    }
  };

  return (
    <Container>
      <div>
        <Title>Подтвердите ваш email</Title>
        <Subtitle>Мы отправили код подтверждения на {email}</Subtitle>
      </div>

      <div>
        <CodeInput
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setCode(value);
            setError('');
          }}
          placeholder="Введите код"
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>

      <div>
        <VerifyButton
          onClick={handleVerify}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Проверка...' : 'Подтвердить'}
        </VerifyButton>

        <ResendButton
          onClick={handleResend}
          disabled={countdown > 0 || isLoading}
        >
          {countdown > 0
            ? `Отправить код повторно (${countdown}с)`
            : 'Отправить код повторно'}
        </ResendButton>
      </div>
    </Container>
  );
}
