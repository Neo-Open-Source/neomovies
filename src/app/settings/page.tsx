'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
        </div>
        <SettingsContent />
      </div>
    </div>
  );
}