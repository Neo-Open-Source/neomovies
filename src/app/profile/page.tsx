'use client';

import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/authApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, User, LogOut, Trash2, ArrowLeft } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/TranslationContext';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleConfirmDelete = async () => {
    try {
      await authAPI.deleteAccount();
      toast.success(t.profile.accountDeleted);
      setIsModalOpen(false);
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error(t.profile.deleteFailed);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t.common.back}</span>
          </button>
        </div>
        <div className="bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-8 text-center mb-6">
          <div className="mb-6 mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-4xl font-bold text-gray-700 dark:text-gray-200 ring-4 ring-gray-100 dark:ring-white/5">
            {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || ''}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{userName}</h1>
          <p className="mt-2 text-base text-muted-foreground">{userEmail}</p>
        </div>
        
        <div className="bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 text-left">{t.profile.accountManagement}</h2>
          <button
              onClick={logout}
              className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              <span>{t.profile.logout}</span>
          </button>
        </div>

        <div className="bg-red-500/10 border-2 border-dashed border-red-500/50 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">{t.profile.dangerZone}</h2>
            <p className="text-red-400 mb-6">{t.profile.deleteWarning}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center gap-2"
            >
              <Trash2 size={20} />
              <span>{t.profile.deleteAccount}</span>
          </button>
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        title={t.profile.confirmDelete}
      >
        <p>{t.profile.confirmDeleteText}</p>
      </Modal>
    </div>
  );
}

