'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-warm-900 dark:text-warm-50 placeholder:text-warm-400"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-warm-900 dark:text-warm-50 placeholder:text-warm-400"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-warm-900 dark:text-warm-50 placeholder:text-warm-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-warm-200 dark:border-warm-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-warm-50 dark:bg-warm-900 text-warm-500">или</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-warm-200 dark:border-warm-700 rounded-lg bg-white dark:bg-warm-800 hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-900 dark:text-warm-50 transition-colors"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Продолжить с Google
        </button>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-warm-600 dark:text-warm-400">
          {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent hover:underline focus:outline-none"
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}
