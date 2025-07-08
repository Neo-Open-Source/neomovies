import { useState, useEffect } from 'react';
import { favoritesAPI } from '@/lib/favoritesApi';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import cn from 'classnames';

interface FavoriteButtonProps {
  mediaId: string | number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({ mediaId, mediaType, title, posterPath, className, showText = false }: FavoriteButtonProps) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [isFavorite, setIsFavorite] = useState(false);

  const mediaIdString = mediaId.toString();

  useEffect(() => {
    const checkFavorite = async () => {
      if (!token) return;
      try {
        const { data } = await favoritesAPI.checkFavorite(mediaIdString);
        setIsFavorite(!!data.exists);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    checkFavorite();
  }, [token, mediaIdString]);

  const toggleFavorite = async () => {
    if (!token) {
      toast.error('Для добавления в избранное необходимо авторизоваться');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.removeFavorite(mediaIdString);
        toast.success('Удалено из избранного');
        setIsFavorite(false);
      } else {
        await favoritesAPI.addFavorite({
          mediaId: mediaIdString,
          mediaType,
          title,
          posterPath: posterPath || '',
        });
        toast.success('Добавлено в избранное');
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Произошла ошибка');
    }
  };

  const buttonClasses = cn(
    'flex items-center justify-center font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    {
      'rounded-full p-3 text-base': !showText,
      'gap-2 rounded-md px-4 py-3 text-base': showText,
      'bg-red-100 text-red-700 hover:bg-red-200 focus-visible:outline-red-600': isFavorite,
      'bg-warm-200/80 text-warm-800 hover:bg-warm-300/90 backdrop-blur-sm': !isFavorite,
    },
    className
  );

  return (
    <button type="button" onClick={toggleFavorite} className={buttonClasses}>
      <Heart size={20} className={cn({ 'fill-current': isFavorite })} />
      {showText && <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>}
    </button>
  );
}
