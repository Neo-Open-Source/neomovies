'use client';

import { useState } from 'react';
import { debounce } from 'lodash';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  genre_ids: number[];
}

export default function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchMovies(query);
  };

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Поиск фильмов..."
          className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div className="aspect-w-2 aspect-h-3">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/placeholder.jpg'
                  }
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  {new Date(movie.release_date).getFullYear()} • {movie.vote_average.toFixed(1)} ⭐
                </p>
                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                  {movie.overview}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
