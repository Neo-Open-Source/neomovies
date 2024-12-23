'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { Movie, TVShow } from '@/lib/api';

const ResultsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
`;

const ResultItem = styled(Link)`
  display: flex;
  padding: 0.75rem;
  gap: 1rem;
  text-decoration: none;
  color: white;
  transition: background-color 0.2s;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 45px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 0.25rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
`;

const ItemInfo = styled.div`
  flex-grow: 1;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Year = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const Type = styled.span`
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
`;

interface SearchResultsProps {
  results: (Movie | TVShow)[];
  onItemClick: () => void;
}

export default function SearchResults({ results, onItemClick }: SearchResultsProps) {
  const getYear = (date: string) => {
    if (!date) return '';
    return new Date(date).getFullYear();
  };

  const isMovie = (item: Movie | TVShow): item is Movie => {
    return 'title' in item;
  };

  return (
    <ResultsContainer>
      {results.map((item) => (
        <ResultItem 
          key={item.id} 
          href={isMovie(item) ? `/movie/${item.id}` : `/tv/${item.id}`}
          onClick={onItemClick}
        >
          <PosterContainer>
            <Image
              src={item.poster_path 
                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                : '/placeholder.png'}
              alt={isMovie(item) ? item.title : item.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </PosterContainer>
          <ItemInfo>
            <Title>
              {isMovie(item) ? item.title : item.name}
              <Type>{isMovie(item) ? 'Фильм' : 'Сериал'}</Type>
            </Title>
            <Year>
              {getYear(isMovie(item) ? item.release_date : item.first_air_date)}
            </Year>
          </ItemInfo>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
}
