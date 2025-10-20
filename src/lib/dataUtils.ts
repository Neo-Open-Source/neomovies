import { 
  getMovieTitle, 
  getMovieOriginalTitle, 
  getMoviePoster, 
  getMovieBackdrop,
  getMovieRating,
  getMovieYear,
  getMovieOverview,
  isKPData,
  isTMDBData
} from '@/types/kinopoisk';

export interface UnifiedMovie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  year: string;
  voteAverage: number;
  voteCount: number;
  genres: Array<{ id: number; name: string }>;
  runtime?: number;
  imdbId?: string;
  kinopoiskId?: number;
  mediaType?: string;
  isSerial?: boolean;
  countries?: Array<{ name: string }>;
}

export function unifyMovieData(movie: any): UnifiedMovie {
  const isKP = isKPData(movie);
  const isTMDB = isTMDBData(movie);

  const kpId = movie.kinopoiskId || movie.filmId || movie.kinopoisk_id || (isKP ? movie.id : undefined);
  const tmdbId = isTMDB ? movie.id : undefined;

  return {
    id: kpId || tmdbId || movie.id || 0,
    title: getMovieTitle(movie),
    originalTitle: getMovieOriginalTitle(movie),
    overview: getMovieOverview(movie),
    posterPath: getMoviePoster(movie),
    backdropPath: getMovieBackdrop(movie),
    releaseDate: movie.release_date || movie.first_air_date || (movie.year ? `${movie.year}-01-01` : ''),
    year: getMovieYear(movie),
    voteAverage: getMovieRating(movie),
    voteCount: movie.ratingKinopoiskVoteCount || movie.ratingImdbVoteCount || movie.ratingVoteCount || movie.vote_count || 0,
    genres: unifyGenres(movie),
    runtime: movie.filmLength || movie.runtime || undefined,
    imdbId: movie.imdbId || movie.imdb_id || undefined,
    kinopoiskId: kpId,
    mediaType: movie.media_type || movie.type || undefined,
    isSerial: movie.serial || movie.media_type === 'tv' || movie.type === 'TV_SERIES' || movie.type === 'MINI_SERIES' || undefined,
    countries: unifyCountries(movie)
  };
}

function unifyGenres(movie: any): Array<{ id: number; name: string }> {
  if (movie.genres && Array.isArray(movie.genres)) {
    if (movie.genres[0]?.genre) {
      return movie.genres.map((g: any, index: number) => ({
        id: index,
        name: g.genre
      }));
    }
    if (movie.genres[0]?.name) {
      return movie.genres;
    }
  }
  if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
    return movie.genre_ids.map((id: number) => ({ id, name: '' }));
  }
  return [];
}

function unifyCountries(movie: any): Array<{ name: string }> {
  if (movie.countries && Array.isArray(movie.countries)) {
    if (movie.countries[0]?.country) {
      return movie.countries.map((c: any) => ({ name: c.country }));
    }
    if (movie.countries[0]?.name) {
      return movie.countries;
    }
  }
  if (movie.production_countries && Array.isArray(movie.production_countries)) {
    return movie.production_countries;
  }
  if (movie.origin_country && Array.isArray(movie.origin_country)) {
    return movie.origin_country.map((code: string) => ({ name: code }));
  }
  return [];
}

export function formatRating(rating: number | null | undefined): string {
  if (!rating) return '—';
  return rating.toFixed(1);
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}ч ${mins}м`;
  }
  return `${mins}м`;
}

export function getImageUrl(path: string | null | undefined, size: string = 'original'): string {
  if (!path) return '/images/placeholder.jpg';
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.neomovies.ru';
  // Всегда проксируем через наш API (включая абсолютные URL)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const encoded = encodeURIComponent(path);
    return `${API_URL}/api/v1/images/${size}/${encoded}`;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/api/v1/images/${size}/${cleanPath}`;
}

export function formatYear(year: string | number | null | undefined): string {
  if (!year) return '';
  return year.toString();
}

export function getGenresString(genres: Array<{ id: number; name: string }>): string {
  if (!genres || genres.length === 0) return '';
  return genres.map(g => g.name).filter(Boolean).join(', ');
}

export function getCountriesString(countries: Array<{ name: string }> | undefined): string {
  if (!countries || countries.length === 0) return '';
  return countries.map(c => c.name).filter(Boolean).join(', ');
}

export function isMovie(mediaType: string | undefined): boolean {
  if (!mediaType) return true;
  return mediaType === 'movie' || mediaType === 'FILM';
}

export function isTV(mediaType: string | undefined): boolean {
  if (!mediaType) return false;
  return mediaType === 'tv' || mediaType === 'TV_SERIES' || mediaType === 'MINI_SERIES';
}
