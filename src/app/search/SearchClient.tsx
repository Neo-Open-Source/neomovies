'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchAPI } from '@/lib/neoApi';
import type { Movie } from '@/lib/neoApi';
import MovieCard from '@/components/MovieCard';
import type { UnifiedSearchItem } from '@/lib/unifiedTypes';
import { useTranslation } from '@/contexts/TranslationContext';

export default function SearchClient() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const currentQuery = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    
    if (currentQuery) {
      setLoading(true);
      setCurrentPage(page);
      
      // Выбор источника: ru -> kp, иначе tmdb
      const source: 'kp' | 'tmdb' = (locale || 'ru') === 'ru' ? 'kp' : 'tmdb';
      searchAPI.multiSearch(currentQuery, source, page)
        .then((body) => {
          const items = (body?.data || []) as UnifiedSearchItem[];
          // Адаптируем к ожидаемой MovieCard структуре
          const mapped: any[] = items.map(it => ({
            id: parseInt(it.id, 10),
            title: it.title,
            name: it.title,
            media_type: it.type === 'tv' ? 'tv' : 'movie',
            release_date: it.releaseDate,
            first_air_date: it.releaseDate,
            poster_path: it.posterUrl?.startsWith('http') ? it.posterUrl : it.posterUrl,
            vote_average: it.rating || 0,
            overview: it.description || ''
          }));
          setResults(mapped);
          setTotalResults(body?.pagination?.totalResults || 0);
          setTotalPages(body?.pagination?.totalPages || 0);
        })
        .catch((error) => {
          console.error('Search failed:', error);
          setResults([]);
          setTotalResults(0);
          setTotalPages(0);
        })
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    }
  }, [searchParams]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    const currentQuery = searchParams.get('q');
    if (currentQuery) {
      router.push(`/search?q=${encodeURIComponent(currentQuery)}&page=${newPage}`);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Предыдущая страница
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 mx-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ←
        </button>
      );
    }

    // Страницы
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 text-sm rounded ${
            i === currentPage
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    // Следующая страница
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 mx-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          →
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center">
          {pages}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground w-full px-4 sm:px-6 lg:px-8 py-8">
      {searchParams.get('q') && (
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {t.search.resultsFor} <span className="text-primary">"{searchParams.get('q')}"</span>
          </h1>
          {totalResults > 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              {t.search.found} {totalResults} {
                totalResults === 1 
                  ? t.search.result_one 
                  : totalResults < 5 
                    ? t.search.result_few 
                    : t.search.result_many
              }
            </p>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>{t.search.loadingResults}</p>
          </div>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <MovieCard
                key={`${item.id}-${item.media_type || 'movie'}`}
                movie={item}
              />
            ))}
          </div>
          {renderPagination()}
        </>
      ) : (
        searchParams.get('q') && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t.search.resultsFor.replace(':', '')} "{searchParams.get('q')}" {t.search.noResults}
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              {t.search.tryDifferent}
            </p>
          </div>
        )
      )}
    </div>
  );
}