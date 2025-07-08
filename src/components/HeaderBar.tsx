"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, User, Menu, Settings } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`text-sm font-medium transition-colors ${isActive ? 'text-accent-orange font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-accent-orange dark:hover:text-accent-orange'}`}>
      {children}
    </Link>
  );
};

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />; // placeholder

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default function HeaderBar({ onBurgerClick }: { onBurgerClick?: () => void }) {
  const [userName, setUserName] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('userName') : null
  );
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = () => setUserName(localStorage.getItem('userName'));
    window.addEventListener('auth-changed', handler);
    return () => window.removeEventListener('auth-changed', handler);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-white shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          {/* Hide logo on small screens to give more space to search bar */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Neo<span className="text-red-500">Movies</span>
            </Link>
          </div>

          {/* Search form - now more responsive */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-xl sm:mx-8">
             <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск фильмов и сериалов..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <ThemeToggleButton />
            <Link href="/settings" className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <Settings size={20} className="text-gray-800 dark:text-gray-300 hover:text-accent-orange" />
            </Link>
            {userName ? (
              <Link href="/profile" className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <User size={20} className="text-gray-800 dark:text-gray-300" />
                <span className="text-sm font-medium hidden sm:block text-gray-800 dark:text-white">{userName}</span>
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors">
                Вход
              </Link>
            )}
            <button onClick={onBurgerClick} className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <Menu size={20} className="text-gray-800 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hidden md:flex items-center justify-center h-12 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex items-center space-x-8">
                <NavLink href="/">Фильмы</NavLink>
                <NavLink href="/categories">Категории</NavLink>
                <NavLink href="/favorites">Избранное</NavLink>
            </nav>
        </div>
      </div>
    </header>
  );
}
