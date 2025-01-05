'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Movie } from '@/types/movie';
import { formatDate } from '@/lib/utils';
import { useImageLoader } from '@/hooks/useImageLoader';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const { imageUrl, isLoading } = useImageLoader(movie.poster_path, 'w342');

  return (
    <Card href={`/movie/${movie.id}`}>
      <PosterWrapper>
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-700">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
          </div>
        ) : imageUrl ? (
          <Poster 
            src={imageUrl} 
            alt={movie.title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-opacity duration-300 group-hover:opacity-75"
            unoptimized // Отключаем оптимизацию Next.js, так как используем CDN
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-700 text-gray-400">
            No Image
          </div>
        )}
        <Rating style={{ backgroundColor: getRatingColor(movie.vote_average) }}>
          {movie.vote_average.toFixed(1)}
        </Rating>
      </PosterWrapper>
      <Content>
        <Title>{movie.title}</Title>
        <Year>{formatDate(movie.release_date)}</Year>
      </Content>
    </Card>
  );
}

const getRatingColor = (rating: number) => {
  if (rating >= 7) return '#4CAF50';
  if (rating >= 5) return '#FFC107';
  return '#F44336';
};

const Card = styled(Link)`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #242424;
  text-decoration: none;
  color: inherit;
`;

const PosterWrapper = styled.div`
  position: relative;
  aspect-ratio: 2/3;
`;

const Poster = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  padding: 12px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Year = styled.div`
  font-size: 12px;
  color: #808191;
  margin-top: 4px;
`;

const Rating = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 17px;
  font-weight: 600;
  color: white;
`;
