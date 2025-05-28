'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/lib/api';
import CategoryCard from '@/components/CategoryCard';

// Styled Components
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
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

interface CategoryWithBackground extends Category {
  backgroundUrl?: string;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка категорий и фоновых изображений для них
  useEffect(() => {
    async function fetchCategoriesAndBackgrounds() {
      setError(null);
      setLoading(true);
      
      try {
        // Получаем список категорий
        const categoriesResponse = await categoriesAPI.getCategories();
        
        if (!categoriesResponse.data.categories || categoriesResponse.data.categories.length === 0) {
          setError('Не удалось загрузить категории');
          setLoading(false);
          return;
        }
        
        // Добавляем фоновые изображения для каждой категории
        const categoriesWithBackgrounds: CategoryWithBackground[] = await Promise.all(
          categoriesResponse.data.categories.map(async (category: Category) => {
            try {
              // Сначала пробуем получить фильм для фона
              const moviesResponse = await categoriesAPI.getMoviesByCategory(category.id, 1);
              
              // Проверяем, есть ли фильмы в данной категории
              if (moviesResponse.data.results && moviesResponse.data.results.length > 0) {
                const backgroundUrl = moviesResponse.data.results[0].backdrop_path || 
                                    moviesResponse.data.results[0].poster_path;
                
                return {
                  ...category,
                  backgroundUrl
                };
              } else {
                // Если фильмов нет, пробуем получить сериалы
                const tvResponse = await categoriesAPI.getTVShowsByCategory(category.id, 1);
                
                if (tvResponse.data.results && tvResponse.data.results.length > 0) {
                  const backgroundUrl = tvResponse.data.results[0].backdrop_path || 
                                      tvResponse.data.results[0].poster_path;
                  
                  return {
                    ...category,
                    backgroundUrl
                  };
                }
              }
              
              // Если ни фильмов, ни сериалов не найдено
              return {
                ...category,
                backgroundUrl: undefined
              };
            } catch (error) {
              console.error(`Error fetching background for category ${category.id}:`, error);
              return category; // Возвращаем категорию без фона в случае ошибки
            }
          })
        );
        
        setCategories(categoriesWithBackgrounds);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Ошибка при загрузке категорий');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategoriesAndBackgrounds();
  }, []);

  if (error) {
    return (
      <Container>
        <Title>Категории</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Категории</Title>
      <Subtitle>Различные жанры фильмов и сериалов</Subtitle>
      
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <Grid>
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              backgroundUrl={category.backgroundUrl}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default CategoriesPage;
