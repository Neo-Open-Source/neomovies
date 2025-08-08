'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { neoApi } from '@/lib/neoApi';

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        localStorage.setItem('token', token);
        neoApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const resp = await neoApi.get('/api/v1/auth/profile');
        const user = resp.data;
        if (user?.name) localStorage.setItem('userName', user.name);
        if (user?.email) localStorage.setItem('userEmail', user.email);
      } catch {
        // ignore, proceed to home
      } finally {
        window.dispatchEvent(new Event('auth-changed'));
        router.replace('/');
      }
    };

    run();
  }, [router]);

  return null;
}