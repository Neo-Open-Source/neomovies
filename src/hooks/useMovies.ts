'use client';

import { useState, useEffect, useCallback } from 'react';
import { moviesAPI } from '@/lib/neoApi';
import type { Movie } from '@/lib/neoApi';

export function useMovies(initialPage = 1) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  // Получаем featured фильм всегда с первой страницы
  const fetchFeaturedMovie = useCallback(async () => {
    try {
      const response = await moviesAPI.getPopular(1);
      if (response.data.results.length > 0) {
        const firstMovie = response.data.results[0];
        if (firstMovie.id) {
          const movieDetails = await moviesAPI.getMovie(firstMovie.id);
          setFeaturedMovie(movieDetails.data);
        }
      }
    } catch (err) {
      console.error('Ошибка при загрузке featured фильма:', err);
    }
  }, []);

  // Загружаем фильмы для текущей страницы
  const fetchMovies = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      setMovies([]); // Очищаем текущие фильмы перед загрузкой новых

      console.log('Загрузка страницы:', pageNum);
      const response = await moviesAPI.getPopular(pageNum);
      console.log('Получены данные:', {
        page: response.data.page,
        results: response.data.results.length,
        totalPages: response.data.total_pages
      });
      
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err);
      setError('Произошла ошибка при загрузке фильмов');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загружаем featured фильм при монтировании
  useEffect(() => {
    fetchFeaturedMovie();
  }, [fetchFeaturedMovie]);

  // Загружаем фильмы при изменении страницы
  useEffect(() => {
    console.log('Изменение страницы на:', page);
    fetchMovies(page);
  }, [page, fetchMovies]);

  // Обработчик изменения страницы
  const handlePageChange = useCallback(async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    console.log('Смена страницы на:', newPage);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  return {
    movies,
    featuredMovie,
    loading,
    error,
    totalPages,
    currentPage: page,
    setPage: handlePageChange
  };
}
