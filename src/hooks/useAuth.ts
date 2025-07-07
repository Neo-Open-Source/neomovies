"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authAPI } from '../lib/authApi';
import { api } from '../lib/api';

interface PendingRegistration {
  email: string;
  password: string;
  name?: string;
}

export function useAuth() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [pending, setPending] = useState<PendingRegistration | null>(null);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login(email, password);
    if (data?.token) {
      localStorage.setItem('token', data.token);

      // Extract name/email either from API response or JWT payload
      // Пытаемся достать имя/почту из JWT либо из ответа
      let name: string | undefined = undefined;
      let email: string | undefined = undefined;
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        name = payload.name || payload.username || payload.userName || payload.sub || undefined;
        email = payload.email || undefined;
      } catch {
        // silent
      }
      // fallback к полям ответа
      if (!name) name = data.user?.name || data.name || data.userName;
      if (!email) email = data.user?.email || data.email;

      if (name) localStorage.setItem('userName', name);
      if (email) localStorage.setItem('userEmail', email);

      // уведомляем другие компоненты о смене авторизации
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      router.push('/');
    } else {
      throw new Error(data?.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    await authAPI.register({ email, password, name });
    await authAPI.resendCode(email);
    setIsVerifying(true);
    setPending({ email, password, name });
  };

  const verifyCode = async (code: string) => {
    if (!pending) throw new Error('no pending');
    await authAPI.verify(pending.email, code);
    // auto login
    await login(pending.email, pending.password);
    setIsVerifying(false);
    setPending(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
    router.push('/login');
  };

  return { login, register, verifyCode, logout, isVerifying };
}
