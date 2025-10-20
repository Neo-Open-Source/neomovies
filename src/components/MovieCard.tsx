'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie, TVShow } from '@/types/movie';
import { formatDate } from '@/lib/utils';
import { useImageLoader } from '@/hooks/useImageLoader';
import { useTranslation } from '@/contexts/TranslationContext';
import { unifyMovieData } from '@/lib/dataUtils';

// Тип-гард для проверки, является ли объект сериалом
function isTVShow(media: Movie | TVShow): media is TVShow {
  return 'name' in media && 'first_air_date' in media;
}

interface MovieCardProps {
  movie: Movie | TVShow;
  priority?: boolean;
}

const getRatingColor = (rating: number) => {
  if (rating >= 7) return 'bg-green-600';
  if (rating >= 5) return 'bg-yellow-500';
  return 'bg-red-600';
};

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const { t, locale } = useTranslation();
  const isTV = isTVShow(movie);
  const unified = unifyMovieData(movie);
  
  const title = isTV ? movie.name || t.common.untitled : movie.title || t.common.untitled;
  const date = isTV ? movie.first_air_date : movie.release_date;
  
  const idType = locale === 'ru' ? 'kp' : 'tmdb';
  const id = movie.id;
  const sourceId = `${idType}_${id}`;
  const url = isTV ? `/tv/${sourceId}` : `/movie/${sourceId}`;
  
  // Загружаем изображение с оптимизированным размером для конкретного устройства
  // Используем меньший размер изображения для мобильных устройств
  const { imageUrl, isLoading } = useImageLoader(movie.poster_path, 'w342'); // Используем поддерживаемый размер

  return (
    <Link href={url} className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-md transition-transform duration-300 ease-in-out will-change-transform hover:scale-105">
      <div className="relative aspect-[2/3]">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/50 border-t-primary" />
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Постер ${title}`}
            fill
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 220px"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        )}
        <div className={`absolute top-2 right-2 z-10 rounded-md px-2 py-1 text-xs font-semibold text-white shadow-lg ${getRatingColor(movie.vote_average)}`}>
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1 block truncate text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{date ? formatDate(date) : 'Без даты'}</p>
      </div>
    </Link>
  );
}
