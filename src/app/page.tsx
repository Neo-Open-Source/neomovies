'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { HeartIcon } from '@/components/Icons/HeartIcon';
import MovieCard from '@/components/MovieCard';
import { useMovies } from '@/hooks/useMovies';
import Pagination from '@/components/Pagination';
import { getImageUrl } from '@/lib/neoApi';
import FavoriteButton from '@/components/FavoriteButton';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 24px;
  padding-top: 84px;

  @media (min-width: 769px) {
    padding-left: 264px;
  }
`;

const FeaturedMovie = styled.div<{ $backdrop: string }>`
  position: relative;
  width: 100%;
  height: 600px;
  background-image: ${props => `url(${props.$backdrop})`};
  background-size: cover;
  background-position: center;
  margin-bottom: 2rem;
  border-radius: 24px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 2rem;
`;

const FeaturedContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 2rem;
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
`;

const Overview = styled.p`
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const WatchButton = styled.button`
  padding: 0.75rem 2rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f40612;
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
        <FeaturedMovie $backdrop={getImageUrl(featuredMovie.backdrop_path, 'original')}>
          <Overlay>
            <FeaturedContent>
              <GenreTags>
                {featuredMovie.genres?.map(genre => (
                  <GenreTag key={genre.id}>{genre.name}</GenreTag>
                ))}
              </GenreTags>
              <Title>{featuredMovie.title}</Title>
              <Overview>{featuredMovie.overview}</Overview>
              <ButtonContainer>
                <Link href={`/movie/${featuredMovie.id}`}>
                  <WatchButton>Смотреть</WatchButton>
                </Link>
                <FavoriteButton
                  mediaId={featuredMovie.id.toString()}
                  mediaType="movie"
                  title={featuredMovie.title}
                  posterPath={featuredMovie.poster_path}
                />
              </ButtonContainer>
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
