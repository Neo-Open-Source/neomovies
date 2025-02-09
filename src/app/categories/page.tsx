'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { moviesAPI } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/lib/api';

interface Genre {
  id: number;
  name: string;
}

// Styled Components
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const GenreButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const GenreButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: ${props => props.$active ? '#3182ce' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#2b6cb0' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #fc8181;
  text-align: center;
  padding: 2rem;
  background: rgba(252, 129, 129, 0.1);
  border-radius: 0.5rem;
  margin: 2rem 0;
`;

export default function CategoriesPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка жанров при монтировании
  useEffect(() => {
    const fetchGenres = async () => {
      setError(null);
      try {
        console.log('Fetching genres...');
        const response = await moviesAPI.getGenres();
        console.log('Genres response:', response.data);
        
        if (response.data.genres && response.data.genres.length > 0) {
          setGenres(response.data.genres);
          setSelectedGenre(response.data.genres[0].id);
        } else {
          setError('Не удалось загрузить жанры');
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
        setError('Ошибка при загрузке жанров');
      }
    };
    fetchGenres();
  }, []);

  // Загрузка фильмов при изменении выбранного жанра
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (!selectedGenre) return;
      
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching movies for genre:', selectedGenre);
        const response = await moviesAPI.getMoviesByGenre(selectedGenre);
        console.log('Movies response:', {
          total: response.data.results?.length,
          first: response.data.results?.[0]
        });
        
        if (response.data.results) {
          setMovies(response.data.results);
        } else {
          setError('Не удалось загрузить фильмы');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Ошибка при загрузке фильмов');
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [selectedGenre]);

  if (error) {
    return (
      <Container>
        <Title>Категории фильмов</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Категории фильмов</Title>

      {/* Кнопки жанров */}
      <GenreButtons>
        {genres.map((genre) => (
          <GenreButton
            key={genre.id}
            $active={selectedGenre === genre.id}
            onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </GenreButton>
        ))}
      </GenreButtons>

      {/* Сетка фильмов */}
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}
    </Container>
  );
}
