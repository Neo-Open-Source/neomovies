'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { HeartIcon } from '@/components/Icons/HeartIcon';
import MovieCard from '@/components/MovieCard';
import { useMovies } from '@/hooks/useMovies';
import Pagination from '@/components/Pagination';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px;
  padding-top: 84px;

  @media (min-width: 769px) {
    padding-left: 264px;
  }
`;

const FeaturedMovie = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background-size: cover;
  background-position: center;
  margin-bottom: 2rem;
  border-radius: 24px;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
  display: flex;
  align-items: center;
  padding: 2rem;
`;

const FeaturedContent = styled.div`
  max-width: 600px;
  color: white;
`;

const GenreTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GenreTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Description = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const WatchButton = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FavoriteButton = styled(WatchButton)`
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export default function HomePage() {
  const { movies, featuredMovie, loading, error, totalPages, currentPage, setPage } = useMovies(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  if (loading && !movies.length) {
    return (
      <Container>
        <div>Загрузка...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div>{error}</div>
      </Container>
    );
  }

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genre_ids.includes(parseInt(selectedGenre)))
    : movies;

  return (
    <Container>
      {featuredMovie && (
        <FeaturedMovie
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <Overlay>
            <FeaturedContent>
              <GenreTags>
                {featuredMovie.genres?.map(genre => (
                  <GenreTag key={genre.id}>{genre.name}</GenreTag>
                ))}
              </GenreTags>
              <Title>{featuredMovie.title}</Title>
              <Description>{featuredMovie.overview}</Description>
              <ButtonGroup>
                <Link href={`/movie/${featuredMovie.id}`}>
                  <WatchButton>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Смотреть
                  </WatchButton>
                </Link>
                <FavoriteButton as="button">
                  <HeartIcon />
                  В избранное
                </FavoriteButton>
              </ButtonGroup>
            </FeaturedContent>
          </Overlay>
        </FeaturedMovie>
      )}

      <MoviesGrid>
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </MoviesGrid>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </Container>
  );
}
