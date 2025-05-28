'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Movie, TVShow } from '@/types/movie';
import { formatDate } from '@/lib/utils';
import { useImageLoader } from '@/hooks/useImageLoader';

// Тип-гард для проверки, является ли объект сериалом
function isTVShow(media: Movie | TVShow): media is TVShow {
  return 'name' in media && 'first_air_date' in media;
}

interface MovieCardProps {
  movie: Movie | TVShow;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  // Определяем, это фильм или сериал с помощью тип-гарда
  const isTV = isTVShow(movie);
  
  // Используем правильный заголовок и дату в зависимости от типа
  const title = isTV ? movie.name || 'Без названия' : movie.title || 'Без названия';
  const date = isTV ? movie.first_air_date : movie.release_date;
  
  // Выбираем правильный URL
  const url = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  
  // Загружаем изображение с оптимизированным размером для конкретного устройства
  // Используем меньший размер изображения для мобильных устройств
  const { imageUrl, isLoading } = useImageLoader(movie.poster_path, 'w342'); // Используем поддерживаемый размер

  return (
    <Card href={url}>
      <PosterWrapper>
        {isLoading ? (
          <LoadingPlaceholder aria-label="Загрузка постера">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          </LoadingPlaceholder>
        ) : imageUrl ? (
          <Poster 
            src={imageUrl} 
            alt={`Постер ${title}`} 
            fill
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className="object-cover"
            unoptimized // Отключаем оптимизацию Next.js, так как используем CDN
          />
        ) : (
          <NoImagePlaceholder aria-label="Нет изображения">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </NoImagePlaceholder>
        )}
        <Rating style={{ backgroundColor: getRatingColor(movie.vote_average) }}>
          {movie.vote_average.toFixed(1)}
        </Rating>
      </PosterWrapper>
      <Content>
        <Title>{title}</Title>
        <Year>{date ? formatDate(date) : 'Без даты'}</Year>
      </Content>
    </Card>
  );
}

// Функция для определения цвета рейтинга
const getRatingColor = (rating: number) => {
  if (rating >= 7) return '#4CAF50';
  if (rating >= 5) return '#FFC107';
  return '#F44336';
};

// Оптимизированные стилевые компоненты для мобильных устройств
const Card = styled(Link)`
  position: relative;
  border-radius: 12px; /* Уменьшили радиус для компактности */
  overflow: hidden;
  background: #1c1c1c; /* Темнее фон для лучшего контраста */
  text-decoration: none;
  color: inherit;
  will-change: transform; /* Подсказка браузеру для оптимизации */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex; /* Используем flexbox для лучшего контроля над высотой */
  flex-direction: column;
  height: 100%; /* Занимаем всю доступную высоту */

  @media (max-width: 640px) {
    border-radius: 8px; /* Еще меньше радиус на малых экранах */
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  aspect-ratio: 2/3;
`;

const Poster = styled(Image)`
  width: 100%;
  height: 100%;
`;

// Плейсхолдер для загрузки
const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a;
`;

// Плейсхолдер для отсутствующих изображений
const NoImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1c1c1c;
  color: #6b7280;
`;

const Content = styled.div`
  padding: 12px;
  flex-grow: 1; /* Занимаем все оставшееся пространство */
  display: flex;
  flex-direction: column;
  
  @media (max-width: 640px) {
    padding: 8px 10px; /* Уменьшенные отступы для мобильных устройств */
  }
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal; /* Важно: разрешаем перенос текста */
  max-height: 2.8em; /* Фиксированная высота для заголовка */
  
  @media (max-width: 640px) {
    font-size: 13px; /* Уменьшенный размер шрифта для мобильных устройств */
    line-height: 1.3;
  }
`;

const Year = styled.p`
  font-size: 12px;
  color: #aaa;
  margin: 0;
  
  @media (max-width: 640px) {
    font-size: 11px; /* Уменьшенный размер шрифта для мобильных устройств */
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #2196F3;
  color: white;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
  
  @media (max-width: 640px) {
    padding: 2px 5px;
    font-size: 11px;
    top: 6px;
    right: 6px;
    border-radius: 3px;
  }
`;
