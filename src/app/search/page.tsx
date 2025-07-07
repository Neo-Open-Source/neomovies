'use client';

// Страница использует useSearchParams, поэтому отключаем статическую генерацию
export const dynamic = 'force-dynamic';

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Movie, TVShow, moviesAPI, tvAPI } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentQuery = searchParams.get('q');
    if (currentQuery) {
      setLoading(true);
      Promise.all([
        moviesAPI.searchMovies(currentQuery),
        tvAPI.searchShows(currentQuery)
      ]).then(([movieResults, tvResults]) => {
        const combined = [...(movieResults.data.results || []), ...(tvResults.data.results || [])];
        setResults(combined.sort((a, b) => b.vote_count - a.vote_count));
      }).catch(error => {
        console.error('Search failed:', error);
        setResults([]);
      }).finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [searchParams]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground w-full px- sm:px lg:px-8 py-8">
      {searchParams.get('q') && (
        <h1 className="text-2xl font-bold mb-8">
          Результаты поиска для: <span className="text-primary">&quot;{searchParams.get('q')}&quot;</span>
        </h1>
      )}

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(item => (
            <MovieCard key={`${item.id}-${'title' in item ? 'movie' : 'tv'}`} movie={item} />
          ))}
        </div>
      ) : (
        searchParams.get('q') && <div className="text-center">Ничего не найдено.</div>
      )}
    </div>
  );
} 