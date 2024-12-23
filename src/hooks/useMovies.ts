'use client';

import { useState, useEffect, useCallback } from 'react';
import { moviesAPI } from '@/lib/api';
import type { Movie } from '@/lib/api';

export function useMovies(initialPage = 1) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);

  const filterMovies = useCallback((movies: Movie[]) => {
    return movies.filter(movie => {
      if (movie.vote_average === 0) return false;
      const hasRussianLetters = /[а-яА-ЯёЁ]/.test(movie.title);
      if (!hasRussianLetters) return false;
      if (/^\d+$/.test(movie.title)) return false;
      const releaseDate = new Date(movie.release_date);
      const now = new Date();
      if (releaseDate > now) return false;
      return true;
    });
  }, []);

  const fetchFeaturedMovie = useCallback(async () => {
    try {
      const response = await moviesAPI.getPopular(1);
      const filteredMovies = filterMovies(response.data.results);
      if (filteredMovies.length > 0) {
        const featuredMovieData = await moviesAPI.getMovie(filteredMovies[0].id);
        setFeaturedMovie(featuredMovieData.data);
      }
    } catch (err) {
      console.error('Ошибка при загрузке featured фильма:', err);
    }
  }, [filterMovies]);

  const fetchMovies = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await moviesAPI.getPopular(pageNum);
      const filteredMovies = filterMovies(response.data.results);
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Ошибка при загрузке фильмов:', err);
      setError('Произошла ошибка при загрузке фильмов');
    } finally {
      setLoading(false);
    }
  }, [filterMovies]);

  useEffect(() => {
    fetchFeaturedMovie();
  }, [fetchFeaturedMovie]);

  useEffect(() => {
    fetchMovies(page);
  }, [page, fetchMovies]);

  const handlePageChange = useCallback((newPage: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(newPage);
  }, []);

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
