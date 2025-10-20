import { useState, useEffect } from 'react';
import { favoritesAPI } from '@/lib/favoritesApi';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import cn from 'classnames';
import { useTranslation } from '@/contexts/TranslationContext';

interface FavoriteButtonProps {
  mediaId: string | number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({ mediaId, mediaType, title, posterPath, className, showText = false }: FavoriteButtonProps) {
  const { t } = useTranslation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaIdString = mediaId.toString();

  useEffect(() => {
    const checkFavorite = async () => {
      if (!token) return;
      try {
        const response = await favoritesAPI.checkIsFavorite(mediaIdString, mediaType);
        // Обрабатываем как обёрнутый, так и прямой ответ
        const data = response.data?.data || response.data;
        setIsFavorite(data?.isFavorite || false);
      } catch (error: any) {
        console.error('Error checking favorite status:', error);
        // Если 401, токен уже обновится автоматически через interceptor
        if (error?.response?.status === 401) {
          return; // Подождём автоматического перелогина
        }
        // При других ошибках сбрасываем статус избранного
        setIsFavorite(false);
      }
    };
    checkFavorite();
  }, [token, mediaIdString, mediaType]);

  const toggleFavorite = async () => {
    if (!token) {
      toast.error(t.favorites.loginRequired);
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.removeFavorite(mediaIdString, mediaType);
        toast.success(t.favorites.removedFromFavorites);
        setIsFavorite(false);
      } else {
        await favoritesAPI.addFavorite(mediaIdString, mediaType);
        toast.success(t.favorites.addedToFavorites);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = cn(
    'flex items-center justify-center font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    {
      'rounded-full p-3 text-base': !showText,
      'gap-2 rounded-md px-4 py-3 text-base': showText,
      'bg-red-100 text-red-700 hover:bg-red-200 focus-visible:outline-red-600': isFavorite,
      'bg-warm-200/80 text-warm-800 hover:bg-warm-300/90 backdrop-blur-sm': !isFavorite,
      'opacity-50 cursor-not-allowed': loading,
    },
    className
  );

  return (
    <button type="button" onClick={toggleFavorite} disabled={loading} className={buttonClasses}>
      <Heart size={20} className={cn({ 'fill-current': isFavorite })} />
      {showText && <span>{isFavorite ? t.favorites.inFavorites : t.favorites.addToFavorites}</span>}
    </button>
  );
}
