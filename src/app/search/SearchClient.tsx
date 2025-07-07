'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Movie, TVShow, moviesAPI, tvAPI } from '@/lib/api';
import MovieCard from '@/components/MovieCard';

export default function SearchClient() {
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
        tvAPI.searchShows(currentQuery),
      ])
        .then(([movieResults, tvResults]) => {
          const combined = [
            ...(movieResults.data.results || []),
            ...(tvResults.data.results || []),
          ];
          setResults(combined.sort((a, b) => b.vote_count - a.vote_count));
        })
        .catch((error) => {
          console.error('Search failed:', error);
          setResults([]);
        })
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [searchParams]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center max-w-xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск фильмов и сериалов..."
          className="flex-1 rounded-l-md border border-transparent bg-card px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="rounded-r-md bg-accent px-4 py-2 text-white hover:bg-accent/90"
        >
          Найти
        </button>
      </form>

      {searchParams.get('q') && (
        <h1 className="text-2xl font-bold mb-8 text-center">
          Результаты поиска для: <span className="text-primary">"{searchParams.get('q')}"</span>
        </h1>
      )}

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item) => (
            <MovieCard
              key={`${item.id}-${'title' in item ? 'movie' : 'tv'}`}
              movie={item}
            />
          ))}
        </div>
      ) : (
        searchParams.get('q') && (
          <div className="text-center">Ничего не найдено.</div>
        )
      )}
    </div>
  );
} 