'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { moviesAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/neoApi';
import type { MovieDetails } from '@/lib/api';
import { useSettings } from '@/hooks/useSettings';
import MoviePlayer from '@/components/MoviePlayer';
import FavoriteButton from '@/components/FavoriteButton';

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
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PosterContainer = styled.div`
  flex-shrink: 0;
`;

const Poster = styled.img`
  width: 300px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const Details = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
`;

const Info = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const InfoItem = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const GenreList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Genre = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Tagline = styled.div`
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const Overview = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const PlayerSection = styled.div`
  margin-top: 2rem;
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
        const newImdbId = await moviesAPI.getImdbId(movieId);
        if (newImdbId) {
          setImdbId(newImdbId);
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
            />
          </PosterContainer>

          <Details>
            <Title>{movie.title}</Title>
            <Info>
              <InfoItem>Рейтинг: {movie.vote_average.toFixed(1)}</InfoItem>
              <InfoItem>Длительность: {movie.runtime} мин.</InfoItem>
              <InfoItem>Дата выхода: {new Date(movie.release_date).toLocaleDateString('ru-RU')}</InfoItem>
            </Info>
            <GenreList>
              {movie.genres.map(genre => (
                <Genre key={genre.id}>{genre.name}</Genre>
              ))}
            </GenreList>
            {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
            <Overview>{movie.overview}</Overview>
            <div style={{ marginTop: '1rem' }}>
              <FavoriteButton
                mediaId={movie.id.toString()}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.poster_path}
              />
            </div>
          </Details>
        </MovieInfo>

        {imdbId && (
          <PlayerSection>
            <MoviePlayer 
              imdbId={imdbId}
            />
          </PlayerSection>
        )}
      </Content>
    </Container>
  );
}
