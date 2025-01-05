'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Movie } from '@/lib/api';

const api = axios.create({
  baseURL: '/api/bridge/tmdb',
  headers: {
    'Content-Type': 'application/json'
  }
});

export function useTMDBMovies(initialPage = 1) {
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
      const response = await api.get('/movie/popular', {
        params: {
          page: 1,
          language: 'ru-RU'
        }
      });
      const filteredMovies = filterMovies(response.data.results);
      if (filteredMovies.length > 0) {
        const featuredMovieData = await api.get(`/movie/${filteredMovies[0].id}`, {
          params: {
            language: 'ru-RU',
            append_to_response: 'credits,videos'
          }
        });
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
      const response = await api.get('/discover/movie', {
        params: {
          page: pageNum,
          language: 'ru-RU',
          'vote_count.gte': 100,
          'vote_average.gte': 1,
          sort_by: 'popularity.desc',
          include_adult: false
        }
      });
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

  const searchMovies = useCallback(async (query: string, pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/search/movie', {
        params: {
          query,
          page: pageNum,
          language: 'ru-RU',
          include_adult: false
        }
      });
      const filteredMovies = filterMovies(response.data.results);
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Ошибка при поиске фильмов:', err);
      setError('Произошла ошибка при поиске фильмов');
    } finally {
      setLoading(false);
    }
  }, [filterMovies]);

  const getUpcomingMovies = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/movie/upcoming', {
        params: {
          page: pageNum,
          language: 'ru-RU',
          'vote_count.gte': 100,
          'vote_average.gte': 1
        }
      });
      const filteredMovies = filterMovies(response.data.results);
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Ошибка при загрузке предстоящих фильмов:', err);
      setError('Произошла ошибка при загрузке предстоящих фильмов');
    } finally {
      setLoading(false);
    }
  }, [filterMovies]);

  const getTopRatedMovies = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/movie/top_rated', {
        params: {
          page: pageNum,
          language: 'ru-RU',
          'vote_count.gte': 100,
          'vote_average.gte': 1
        }
      });
      const filteredMovies = filterMovies(response.data.results);
      setMovies(filteredMovies);
      setTotalPages(response.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Ошибка при загрузке топ фильмов:', err);
      setError('Произошла ошибка при загрузке топ фильмов');
    } finally {
      setLoading(false);
    }
  }, [filterMovies]);

  return {
    movies,
    featuredMovie,
    loading,
    error,
    totalPages,
    currentPage: page,
    setPage: handlePageChange,
    searchMovies,
    getUpcomingMovies,
    getTopRatedMovies
  };
}
