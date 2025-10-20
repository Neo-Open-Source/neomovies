'use client';

import Link from 'next/link';
import { X, Home, Clapperboard, Star } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void; }) => (
  <Link href={href} onClick={onClick} className="flex items-center gap-4 p-4 text-lg rounded-md text-gray-300 hover:bg-gray-800">
    {children}
  </Link>
);

export default function MobileNav({ show, onClose }: { show: boolean; onClose: () => void; }) {
  const { t } = useTranslation();
  
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 md:hidden"
      onClick={onClose}
    >
      <div 
        className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-[#1a1a1a] shadow-xl flex flex-col p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white">{t.nav.menu || 'Меню'}</h2>
          <button onClick={onClose} className="p-2 text-white">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink href="/" onClick={onClose}><Home size={20}/>{t.nav.movies}</NavLink>
          <NavLink href="/categories" onClick={onClose}><Clapperboard size={20}/>{t.nav.categories || 'Категории'}</NavLink>
          <NavLink href="/favorites" onClick={onClose}><Star size={20}/>{t.nav.favorites}</NavLink>
        </nav>
      </div>
    </div>
  );
} 