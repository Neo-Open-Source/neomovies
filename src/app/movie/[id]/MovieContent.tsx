'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { moviesAPI } from '@/lib/neoApi';
import { getImageUrl } from '@/lib/neoApi';
import type { MovieDetails } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';
import MoviePlayer from '@/components/MoviePlayer';
import FavoriteButton from '@/components/FavoriteButton';
import { formatDate } from '@/lib/utils';

declare global {
  interface Window {
    kbox: any;
  }
}

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0 24px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding-top: 1rem;
  }
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
  position: relative;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
  }
`;

const Poster = styled.img`
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 200px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    width: 160px;
  }
`;

const Details = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Info = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    gap: 0.75rem;
  }
`;

const InfoItem = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.35rem 0.6rem;
    border-radius: 4px;
  }
`;

const GenreList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Genre = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
    background: rgba(59, 130, 246, 0.15);
  }
`;

const Tagline = styled.div`
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: 0.9rem;
  }
`;

const Overview = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    text-align: justify;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 1rem;
  }
`;

const WatchButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
  }
  
  &:hover {
    background: #f40612;
  }
`;

const PlayerSection = styled.div`
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ff4444;
`;

import { useParams } from 'next/navigation';

interface MovieContentProps {
  movieId: string;
  initialMovie: MovieDetails;
}

export default function MovieContent({ movieId, initialMovie }: MovieContentProps) {
  const { settings } = useSettings();
  const [movie] = useState<MovieDetails>(initialMovie);
  const [imdbId, setImdbId] = useState<string | null>(null);

  useEffect(() => {
    const fetchImdbId = async () => {
      try {
        const { data } = await moviesAPI.getMovie(movieId);
        if (data?.imdb_id) {
          setImdbId(data.imdb_id);
        }
      } catch (err) {
        console.error('Error fetching IMDb ID:', err);
      }
    };
    fetchImdbId();
  }, [movieId]);

  return (
    <Container>
      <Content>
        <MovieInfo>
          <PosterContainer>
            <Poster
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              loading="eager"
            />
          </PosterContainer>

          <Details>
            <Title>{movie.title}</Title>
            <Info>
              <InfoItem>Рейтинг: {movie.vote_average.toFixed(1)}</InfoItem>
              <InfoItem>Длительность: {movie.runtime} мин.</InfoItem>
              <InfoItem>Дата выхода: {formatDate(movie.release_date)}</InfoItem>
            </Info>
            <GenreList>
              {movie.genres.map(genre => (
                <Genre key={genre.id}>{genre.name}</Genre>
              ))}
            </GenreList>
            {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
            <Overview>{movie.overview}</Overview>
            
            <ActionButtons>
              {imdbId && (
                <WatchButton
                  onClick={() => document.getElementById('movie-player')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor" />
                  </svg>
                  Смотреть
                </WatchButton>
              )}
              <FavoriteButton
                mediaId={movie.id.toString()}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.poster_path}
              />
            </ActionButtons>
          </Details>
        </MovieInfo>

        {imdbId && (
          <PlayerSection id="movie-player">
            <MoviePlayer 
              imdbId={imdbId}
            />
          </PlayerSection>
        )}
      </Content>
    </Container>
  );
}
