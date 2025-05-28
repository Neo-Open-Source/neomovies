'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { categoriesAPI } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { Movie, Category } from '@/lib/api';

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

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1.5rem;
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: ${props => props.$active ? '#3182ce' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 2.5rem;

  &:hover {
    background: ${props => props.$active ? '#2b6cb0' : 'rgba(255, 255, 255, 0.2)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

type MediaType = 'movies' | 'tv';

function CategoryPage() {
  // Используем хук useParams вместо props
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('movies');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [moviesAvailable, setMoviesAvailable] = useState(true);
  const [tvShowsAvailable, setTvShowsAvailable] = useState(true);

  // Загрузка информации о категории
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await categoriesAPI.getCategory(categoryId);
        setCategory(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Не удалось загрузить информацию о категории');
      }
    }
    
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  // Загрузка фильмов по категории
  useEffect(() => {
    async function fetchMovies() {
      if (!categoryId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await categoriesAPI.getMoviesByCategory(categoryId, page);
        
        if (response.data.results) {
          // Добавляем дебаг-логи
          console.log(`Получены фильмы для категории ${categoryId}, страница ${page}:`, {
            count: response.data.results.length,
            ids: response.data.results.slice(0, 5).map(m => m.id),
            titles: response.data.results.slice(0, 5).map(m => m.title)
          });
          
          // Проверяем, есть ли фильмы в этой категории
          const hasMovies = response.data.results.length > 0;
          setMoviesAvailable(hasMovies);
          
          // Если фильмов нет, а выбран тип "movies", пробуем переключиться на сериалы
          if (!hasMovies && mediaType === 'movies' && tvShowsAvailable) {
            setMediaType('tv');
          } else {
            setMovies(response.data.results);
            
            // Устанавливаем общее количество страниц
            if (response.data.total_pages) {
              setTotalPages(response.data.total_pages);
            }
          }
        } else {
          setMoviesAvailable(false);
          if (mediaType === 'movies' && tvShowsAvailable) {
            setMediaType('tv');
          } else {
            setError('Не удалось загрузить фильмы');
          }
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMoviesAvailable(false);
        if (mediaType === 'movies' && tvShowsAvailable) {
          setMediaType('tv');
        } else {
          setError('Ошибка при загрузке фильмов');
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (mediaType === 'movies') {
      fetchMovies();
    }
  }, [categoryId, mediaType, page, tvShowsAvailable]);

  // Загрузка сериалов по категории
  useEffect(() => {
    async function fetchTVShows() {
      if (!categoryId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await categoriesAPI.getTVShowsByCategory(categoryId, page);
        
        if (response.data.results) {
          // Добавляем дебаг-логи
          console.log(`Получены сериалы для категории ${categoryId}, страница ${page}:`, {
            count: response.data.results.length,
            ids: response.data.results.slice(0, 5).map(tv => tv.id),
            names: response.data.results.slice(0, 5).map(tv => tv.name)
          });
          
          // Проверяем, есть ли сериалы в этой категории
          const hasTVShows = response.data.results.length > 0;
          setTvShowsAvailable(hasTVShows);
          
          // Если сериалов нет, а выбран тип "tv", пробуем переключиться на фильмы
          if (!hasTVShows && mediaType === 'tv' && moviesAvailable) {
            setMediaType('movies');
          } else {
            setTvShows(response.data.results);
            
            // Устанавливаем общее количество страниц
            if (response.data.total_pages) {
              setTotalPages(response.data.total_pages);
            }
          }
        } else {
          setTvShowsAvailable(false);
          if (mediaType === 'tv' && moviesAvailable) {
            setMediaType('movies');
          } else {
            setError('Не удалось загрузить сериалы');
          }
        }
      } catch (error) {
        console.error('Error fetching TV shows:', error);
        setTvShowsAvailable(false);
        if (mediaType === 'tv' && moviesAvailable) {
          setMediaType('movies');
        } else {
          setError('Ошибка при загрузке сериалов');
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (mediaType === 'tv') {
      fetchTVShows();
    }
  }, [categoryId, mediaType, page, moviesAvailable]);

  function handleGoBack() {
    window.history.back();
  }
  
  // Функции для пагинации
  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  function renderPagination() {
    if (totalPages <= 1) return null;
    
    const pageButtons = [];
    // Отображаем максимум 5 страниц вокруг текущей
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    // Кнопка "Предыдущая"
    pageButtons.push(
      <PaginationButton 
        key="prev" 
        onClick={() => handlePageChange(page - 1)} 
        disabled={page === 1}
      >
        &lt;
      </PaginationButton>
    );
    
    // Отображаем первую страницу и многоточие, если startPage > 1
    if (startPage > 1) {
      pageButtons.push(
        <PaginationButton 
          key="1" 
          onClick={() => handlePageChange(1)}
          $active={page === 1}
        >
          1
        </PaginationButton>
      );
      
      if (startPage > 2) {
        pageButtons.push(
          <span key="dots1" style={{ color: 'white' }}>...</span>
        );
      }
    }
    
    // Отображаем страницы вокруг текущей
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <PaginationButton 
          key={i} 
          onClick={() => handlePageChange(i)}
          $active={page === i}
        >
          {i}
        </PaginationButton>
      );
    }
    
    // Отображаем многоточие и последнюю страницу, если endPage < totalPages
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="dots2" style={{ color: 'white' }}>...</span>
        );
      }
      
      pageButtons.push(
        <PaginationButton 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)}
          $active={page === totalPages}
        >
          {totalPages}
        </PaginationButton>
      );
    }
    
    // Кнопка "Следующая"
    pageButtons.push(
      <PaginationButton 
        key="next" 
        onClick={() => handlePageChange(page + 1)} 
        disabled={page === totalPages}
      >
        &gt;
      </PaginationButton>
    );
    
    return <PaginationContainer>{pageButtons}</PaginationContainer>;
  }

  if (error) {
    return (
      <Container>
        <BackButton onClick={handleGoBack}>
          <span>←</span> Назад к категориям
        </BackButton>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={handleGoBack}>
        <span>←</span> Назад к категориям
      </BackButton>
      
      <Title>{category?.name || 'Загрузка...'}</Title>
      
      <ButtonsContainer>
        <TabButton 
          $active={mediaType === 'movies'} 
          onClick={() => {
            if (moviesAvailable) {
              setMediaType('movies');
              setPage(1); // Сбрасываем страницу при переключении типа контента
            }
          }}
          disabled={!moviesAvailable}
          style={{ opacity: moviesAvailable ? 1 : 0.5, cursor: moviesAvailable ? 'pointer' : 'not-allowed' }}
        >
          Фильмы
        </TabButton>
        <TabButton 
          $active={mediaType === 'tv'} 
          onClick={() => {
            if (tvShowsAvailable) {
              setMediaType('tv');
              setPage(1); // Сбрасываем страницу при переключении типа контента
            }
          }}
          disabled={!tvShowsAvailable}
          style={{ opacity: tvShowsAvailable ? 1 : 0.5, cursor: tvShowsAvailable ? 'pointer' : 'not-allowed' }}
        >
          Сериалы
        </TabButton>
      </ButtonsContainer>
      
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <>
          <MediaGrid>
            {mediaType === 'movies' ? (
              movies.length > 0 ? (
                movies.map(movie => (
                  <MovieCard
                    key={`movie-${categoryId}-${movie.id}-${page}`}
                    movie={movie}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
                  Нет фильмов в этой категории
                </div>
              )
            ) : (
              tvShows.length > 0 ? (
                tvShows.map(tvShow => (
                  <MovieCard
                    key={`tv-${categoryId}-${tvShow.id}-${page}`}
                    movie={tvShow}
                  />
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
                  Нет сериалов в этой категории
                </div>
              )
            )}
          </MediaGrid>
          
          {/* Отображаем пагинацию */}
          {renderPagination()}
        </>
      )}
    </Container>
  );
}

export default CategoryPage;
