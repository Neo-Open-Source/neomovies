'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setUserName(localStorage.getItem('userName'));
      setUserEmail(localStorage.getItem('userEmail'));
      setLoading(false);
    }
  }, [router]);

  const handleSignOut = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F6EE] dark:bg-gray-900">
        <Loader2 className="h-16 w-16 animate-spin text-red-500" />
      </div>
    );
  }

  if (!userName) {
    // This can happen briefly before redirect, or if localStorage is cleared.
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#F9F6EE] dark:bg-[#1e1e1e] pt-24 sm:pt-32">
      <div className="flex justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#49372E] p-8 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-4xl font-bold text-gray-700 dark:text-gray-200 ring-4 ring-gray-100 dark:ring-white/5">
              {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userName}</h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{userEmail}</p>
            <button
              onClick={handleSignOut}
              className="mt-8 inline-flex items-center gap-2.5 rounded-lg bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

