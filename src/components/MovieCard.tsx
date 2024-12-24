'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 7) return '#4CAF50';
    if (rating >= 5) return '#FFC107';
    return '#F44336';
  };

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';

  return (
    <Card href={`/movie/${movie.id}`}>
      <PosterWrapper>
        <Poster 
          src={posterUrl} 
          alt={movie.title} 
          width={200} 
          height={300} 
          style={{ objectFit: 'cover' }} 
        />
        <Rating style={{ backgroundColor: getRatingColor(movie.vote_average) }}>
          {movie.vote_average.toFixed(1)}
        </Rating>
      </PosterWrapper>
      <Content>
        <Title>{movie.title}</Title>
        <Year>{new Date(movie.release_date).getFullYear()}</Year>
      </Content>
    </Card>
  );
}

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
  font-size: 12px;
  font-weight: 600;
  color: white;
`;
