'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { neoApi, getImageUrl } from '@/lib/neoApi';
import { Loader2, HeartCrack } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface Favorite {
  id: number;
  mediaId: string;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response = await neoApi.get('/api/v1/favorites');
        // Обрабатываем как обёрнутый, так и прямой ответ
        const data = response.data?.data || response.data;
        setFavorites(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to fetch favorites:', error);
        // 401 ошибки теперь обрабатываются автоматически через interceptor
        // Здесь просто устанавливаем пустой массив при ошибке
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HeartCrack size={80} className="mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold text-foreground mb-4">{t.favorites.empty}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {t.favorites.emptyDescription}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            {t.favorites.goToMovies}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.favorites.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ваша коллекция любимых фильмов и сериалов
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favorites.map(favorite => (
            <Link
              key={`${favorite.mediaType}-${favorite.mediaId}`}
              href={`/${favorite.mediaType === 'movie' ? 'movie' : 'tv'}/${favorite.mediaId}`}
              className="group"
            >
              <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={favorite.posterPath ? getImageUrl(favorite.posterPath) : '/images/placeholder.jpg'}
                    alt={favorite.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="mt-3 px-1">
                <h3 className="font-semibold text-base text-foreground truncate group-hover:text-accent transition-colors">
                  {favorite.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {favorite.mediaType === 'movie' ? 'Фильм' : 'Сериал'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}