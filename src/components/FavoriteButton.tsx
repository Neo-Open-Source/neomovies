import { useState, useEffect } from 'react';
import { favoritesAPI } from '@/lib/favoritesApi';
import { Heart } from 'lucide-react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const Button = styled.button<{ $isFavorite: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${props => props.$isFavorite ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: ${props => props.$isFavorite ? '#ff4444' : '#fff'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isFavorite ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
    fill: ${props => props.$isFavorite ? '#ff4444' : 'none'};
    stroke: ${props => props.$isFavorite ? '#ff4444' : '#fff'};
    transition: all 0.2s;
  }
`;

interface FavoriteButtonProps {
  mediaId: string | number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  className?: string;
}

export default function FavoriteButton({ mediaId, mediaType, title, posterPath, className }: FavoriteButtonProps) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [isFavorite, setIsFavorite] = useState(false);

  // Преобразуем mediaId в строку для сравнения
  const mediaIdString = mediaId.toString();

  useEffect(() => {
    const checkFavorite = async () => {
      if (!token) return;

      try {
        const { data } = await favoritesAPI.checkFavorite(mediaIdString);
        setIsFavorite(!!data.isFavorite);
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

  return (
    <Button type="button" onClick={toggleFavorite} $isFavorite={isFavorite} className={className}>
      <Heart />
      {isFavorite ? 'В избранном' : 'В избранное'}
    </Button>
  );
}
