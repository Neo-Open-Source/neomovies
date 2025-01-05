'use client';

import { useState } from 'react';
import { debounce } from 'lodash';
import { getImageUrl } from '@/lib/neoApi';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  genre_ids: number[];
}

interface MovieCardProps {
  children: React.ReactNode;
}

const MovieCard: React.FC<MovieCardProps> = ({ children }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {children}
    </div>
  );
};

interface PosterContainerProps {
  children: React.ReactNode;
}

const PosterContainer: React.FC<PosterContainerProps> = ({ children }) => {
  return (
    <div className="aspect-w-2 aspect-h-3">
      {children}
    </div>
  );
};

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const Image: React.FC<ImageProps> = ({ src, alt, width, height, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="object-cover w-full h-full"
      {...props}
    />
  );
};

interface MovieInfoProps {
  children: React.ReactNode;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ children }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <h3 className="font-semibold text-lg mb-2">{children}</h3>
  );
};

interface YearProps {
  children: React.ReactNode;
}

const Year: React.FC<YearProps> = ({ children }) => {
  return (
    <p className="text-sm text-gray-400 mb-4">{children}</p>
  );
};

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
            <MovieCard key={movie.id}>
              <PosterContainer>
                <Image
                  src={movie.poster_path ? getImageUrl(movie.poster_path) : '/placeholder.jpg'}
                  alt={movie.title}
                  width={200}
                  height={300}
                />
              </PosterContainer>
              <MovieInfo>
                <Title>{movie.title}</Title>
                <Year>{new Date(movie.release_date).getFullYear()}</Year>
                <p className="text-sm text-gray-400 mb-4">
                  {movie.vote_average.toFixed(1)} ⭐
                </p>
                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                  {movie.overview}
                </p>
              </MovieInfo>
            </MovieCard>
          ))}
        </div>
      )}
    </div>
  );
}
