'use client';

import { useState } from 'react';
import { searchAPI } from '@/lib/neoApi';
import type { Movie } from '@/lib/neoApi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';

export function useSearch() {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchFailed, setSearchFailed] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { locale } = useTranslation();

  const filterMovies = (movies: Movie[]) => {
    return movies.filter(movie => {
      // Убираем фильтр по русским буквам, так как API KP может возвращать фильмы с оригинальными названиями
      if (!movie.title && !movie.name) return false;
      const title = movie.title || movie.name || '';
      if (/^\d+$/.test(title)) return false; // Исключаем чисто числовые названия
      // Убираем фильтр по дате релиза, так как это может быть неточно
      return true;
    });
  };

  const searchMovies = async (query: string) => {
    try {
      if (!query.trim()) {
        setResults([]);
        setHasMore(false);
        setCurrentPage(1);
        setCurrentQuery('');
        setSearchFailed(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setSearchFailed(false);
      setCurrentQuery(query);
      setCurrentPage(1);

      // Выбор источника: ru -> kp, иначе tmdb
      const source: 'kp' | 'tmdb' = (locale || 'ru') === 'ru' ? 'kp' : 'tmdb';
      const response = await searchAPI.multiSearch(query, source, 1);
      
      // Адаптируем новый унифицированный формат к старому
      const searchResults = response?.data || [];
      const adaptedResults = searchResults.map((item: any) => ({
        id: parseInt(item.id, 10),
        title: item.title,
        name: item.title,
        media_type: item.type === 'tv' ? 'tv' : 'movie',
        release_date: item.releaseDate,
        first_air_date: item.releaseDate,
        poster_path: item.posterUrl?.startsWith('http') ? item.posterUrl : item.posterUrl,
        vote_average: item.rating || 0,
        overview: item.description || '',
        genre_ids: []
      }));
      
      const filteredMovies = filterMovies(adaptedResults);
      
      if (filteredMovies.length === 0) {
        setSearchFailed(true);
      }

      setResults(filteredMovies);
      setHasMore(response?.pagination?.totalPages > 1);
    } catch (err) {
      console.error('Ошибка при поиске:', err);
      setError('Произошла ошибка при поиске');
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore || !currentQuery) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      
      // Выбор источника: ru -> kp, иначе tmdb
      const source: 'kp' | 'tmdb' = (locale || 'ru') === 'ru' ? 'kp' : 'tmdb';
      const response = await searchAPI.multiSearch(currentQuery, source, nextPage);
      
      // Адаптируем новый унифицированный формат к старому
      const searchResults = response?.data || [];
      const adaptedResults = searchResults.map((item: any) => ({
        id: parseInt(item.id, 10),
        title: item.title,
        name: item.title,
        media_type: item.type === 'tv' ? 'tv' : 'movie',
        release_date: item.releaseDate,
        first_air_date: item.releaseDate,
        poster_path: item.posterUrl?.startsWith('http') ? item.posterUrl : item.posterUrl,
        vote_average: item.rating || 0,
        overview: item.description || '',
        genre_ids: []
      }));
      const filteredMovies = filterMovies(adaptedResults);
      
      setResults(prev => [...prev, ...filteredMovies]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < (response?.pagination?.totalPages || 0) && nextPage < 5); // Ограничиваем до 5 страниц
    } catch (err) {
      console.error('Ошибка при загрузке дополнительных результатов:', err);
      setError('Произошла ошибка при загрузке дополнительных результатов');
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    hasMore,
    searchFailed,
    searchMovies,
    loadMore
  };
}
