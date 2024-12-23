'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #2196f3;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
  }
`;

const Button = styled.button`
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
  margin-top: 1rem;

  &:hover {
    background: linear-gradient(to right, #1e88e5, #1976d2);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 2rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const DividerText = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  padding: 0 1rem;
`;

const GoogleButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: 2rem;

  button {
    color: #2196f3;
    background: none;
    border: none;
    padding: 0;
    margin-left: 0.5rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 82, 82, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
`;

export default function LoginClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          if (result.error === 'EMAIL_NOT_VERIFIED') {
            router.push(`/verify?email=${encodeURIComponent(email)}`);
            return;
          }
          throw new Error(result.error);
        }

        router.push('/');
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Ошибка при регистрации');
        }

        const data = await response.json();
        
        // Сохраняем пароль для автовхода после верификации
        localStorage.setItem('password', password);
        
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <Container>
      <div>
        <Title>{isLogin ? 'С возвращением!' : 'Создать аккаунт'}</Title>
        <Subtitle>
          {isLogin
            ? 'Войдите в свой аккаунт для доступа к фильмам'
            : 'Зарегистрируйтесь для доступа ко всем возможностям'}
        </Subtitle>
      </div>

      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <InputGroup>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          </InputGroup>
        )}

        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Form>

      <Divider>
        <DividerText>или</DividerText>
      </Divider>

      <GoogleButton type="button" onClick={handleGoogleSignIn}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            fill="#4285f4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34a853"
          />
          <path
            d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.046l3.007-2.339z"
            fill="#fbbc05"
          />
          <path
            d="M9 3.582c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.3C4.672 5.173 6.656 3.582 9 3.582z"
            fill="#ea4335"
          />
        </svg>
        Продолжить с Google
      </GoogleButton>

      <ToggleText>
        {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </ToggleText>
    </Container>
  );
}
