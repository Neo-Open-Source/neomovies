'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '../../lib/authApi';

export default function VerificationClient() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { verifyCode, login } = useAuth();

  useEffect(() => {
    if (!email) {
      router.replace('/login');
      return;
    }

    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error('Не удалось получить email для подтверждения');
      }
      await verifyCode(code);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || !email) return;
    
    setError('');
    setIsResending(true);
    
    try {
      await authAPI.resendCode(email);
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить код');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-bold text-center mb-2 text-foreground">Подтверждение email</h2>
      <p className="text-muted-foreground text-center mb-8">
        Мы отправили код подтверждения на {email}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Введите код"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-warm-900 dark:text-warm-50 placeholder:text-warm-400 text-center text-lg tracking-wider"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="w-full py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Проверка...' : 'Подтвердить'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={countdown > 0 || isResending}
          className="text-accent hover:underline focus:outline-none disabled:opacity-50 disabled:no-underline text-sm"
        >
          {isResending
            ? 'Отправка...'
            : countdown > 0
            ? `Отправить код повторно через ${countdown} сек`
            : 'Отправить код повторно'}
        </button>
      </div>
    </div>
  );
}
