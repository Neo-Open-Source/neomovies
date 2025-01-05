'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/neoApi';
import { Movie, TVShow } from '@/lib/api';

const ResultsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
`;

const ResultItem = styled.div`
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

interface SearchResultsProps {
  results: (Movie | TVShow)[];
  onItemClick: () => void;
}

const getYear = (date: string | undefined | null): string => {
  if (!date) return '';
  const year = date.split(' ')[2]; // Получаем год из формата "DD месяц YYYY г."
  return year ? year : '';
};

export default function SearchResults({ results, onItemClick }: SearchResultsProps) {
  return (
    <ResultsContainer>
      {results.map((item) => (
        <Link
          key={`${item.id}-${item.media_type}`}
          href={`/${item.media_type}/${item.id}`}
          onClick={onItemClick}
        >
          <ResultItem>
            <PosterContainer>
              <Image
                src={item.poster_path ? getImageUrl(item.poster_path, 'w92') : '/images/placeholder.jpg'}
                alt={item.title || item.name}
                width={46}
                height={69}
              />
            </PosterContainer>
            <ItemInfo>
              <Title>{item.title || item.name}</Title>
              <Year>
                {getYear(item.release_date || item.first_air_date)}
              </Year>
            </ItemInfo>
          </ResultItem>
        </Link>
      ))}
    </ResultsContainer>
  );
}
