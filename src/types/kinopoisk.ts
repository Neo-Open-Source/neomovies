export interface KPCountry {
  country: string;
}

export interface KPGenre {
  genre: string;
}

export interface KPFilm {
  kinopoiskId: number;
  imdbId: string | null;
  nameRu: string | null;
  nameEn: string | null;
  nameOriginal: string | null;
  countries: KPCountry[];
  genres: KPGenre[];
  ratingKinopoisk: number | null;
  ratingImdb: number | null;
  year: number | null;
  type: string;
  posterUrl: string;
  posterUrlPreview: string;
  coverUrl: string | null;
  logoUrl: string | null;
  description: string | null;
  shortDescription: string | null;
  slogan: string | null;
  filmLength: number | null;
  ratingAgeLimits: string | null;
  startYear: number | null;
  endYear: number | null;
  serial: boolean;
  completed: boolean;
  ratingKinopoiskVoteCount: number;
  ratingImdbVoteCount: number;
  webUrl: string;
}

export interface KPFilmShort {
  filmId: number;
  nameRu: string | null;
  nameEn: string | null;
  type: string;
  year: string;
  description: string | null;
  filmLength: string | null;
  countries: KPCountry[];
  genres: KPGenre[];
  rating: string | null;
  ratingVoteCount: number;
  posterUrl: string;
  posterUrlPreview: string;
}

export interface KPSearchResponse {
  keyword: string;
  pagesCount: number;
  films: KPFilmShort[];
  searchFilmsCountResult: number;
}

export interface NormalizedMovie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genres: Array<{ id: number; name: string }>;
  countries: Array<{ name: string }>;
  runtime: number | null;
  imdbId: string | null;
  kinopoiskId: number | null;
  type?: string;
  isSerial?: boolean;
}

export function normalizeKPFilm(kpFilm: KPFilm | null): NormalizedMovie | null {
  if (!kpFilm) return null;

  const title = kpFilm.nameRu || kpFilm.nameEn || kpFilm.nameOriginal || 'Без названия';
  const originalTitle = kpFilm.nameOriginal || kpFilm.nameEn || kpFilm.nameRu || '';
  const overview = kpFilm.description || kpFilm.shortDescription || '';
  const posterPath = kpFilm.posterUrlPreview || kpFilm.posterUrl || '';
  const backdropPath = kpFilm.coverUrl || '';
  const releaseDate = kpFilm.year ? `${kpFilm.year}-01-01` : '';
  const voteAverage = kpFilm.ratingKinopoisk || kpFilm.ratingImdb || 0;
  const voteCount = kpFilm.ratingKinopoiskVoteCount || kpFilm.ratingImdbVoteCount || 0;

  const genres = (kpFilm.genres || []).map((g, index) => ({
    id: index,
    name: g.genre
  }));

  const countries = (kpFilm.countries || []).map(c => ({
    name: c.country
  }));

  return {
    id: kpFilm.kinopoiskId,
    title,
    originalTitle,
    overview,
    posterPath,
    backdropPath,
    releaseDate,
    voteAverage,
    voteCount,
    popularity: voteAverage * 100,
    genres,
    countries,
    runtime: kpFilm.filmLength,
    imdbId: kpFilm.imdbId,
    kinopoiskId: kpFilm.kinopoiskId,
    type: kpFilm.type,
    isSerial: kpFilm.serial
  };
}

export function normalizeKPFilmShort(kpFilm: KPFilmShort | null): NormalizedMovie | null {
  if (!kpFilm) return null;

  const title = kpFilm.nameRu || kpFilm.nameEn || 'Без названия';
  const originalTitle = kpFilm.nameEn || kpFilm.nameRu || '';
  const overview = kpFilm.description || '';
  const posterPath = kpFilm.posterUrlPreview || kpFilm.posterUrl || '';
  const releaseDate = kpFilm.year ? `${kpFilm.year}-01-01` : '';
  const voteAverage = kpFilm.rating ? parseFloat(kpFilm.rating) : 0;

  const genres = (kpFilm.genres || []).map((g, index) => ({
    id: index,
    name: g.genre
  }));

  const countries = (kpFilm.countries || []).map(c => ({
    name: c.country
  }));

  const runtime = kpFilm.filmLength ? parseInt(kpFilm.filmLength) : null;

  return {
    id: kpFilm.filmId,
    title,
    originalTitle,
    overview,
    posterPath,
    backdropPath: '',
    releaseDate,
    voteAverage,
    voteCount: kpFilm.ratingVoteCount,
    popularity: voteAverage * 100,
    genres,
    countries,
    runtime,
    imdbId: null,
    kinopoiskId: kpFilm.filmId,
    type: kpFilm.type
  };
}

export function getMovieTitle(movie: any): string {
  if (movie.nameRu) return movie.nameRu;
  if (movie.nameEn) return movie.nameEn;
  if (movie.nameOriginal) return movie.nameOriginal;
  if (movie.title) return movie.title;
  if (movie.name) return movie.name;
  return 'Без названия';
}

export function getMovieOriginalTitle(movie: any): string {
  if (movie.nameOriginal) return movie.nameOriginal;
  if (movie.nameEn) return movie.nameEn;
  if (movie.original_title) return movie.original_title;
  if (movie.original_name) return movie.original_name;
  return '';
}

export function getMoviePoster(movie: any): string {
  if (movie.posterUrlPreview) return movie.posterUrlPreview;
  if (movie.posterUrl) return movie.posterUrl;
  if (movie.poster_path) return movie.poster_path;
  return '';
}

export function getMovieBackdrop(movie: any): string {
  if (movie.coverUrl) return movie.coverUrl;
  if (movie.backdrop_path) return movie.backdrop_path;
  return '';
}

export function getMovieRating(movie: any): number {
  if (movie.ratingKinopoisk) return movie.ratingKinopoisk;
  if (movie.ratingImdb) return movie.ratingImdb;
  if (movie.rating && typeof movie.rating === 'string') return parseFloat(movie.rating);
  if (movie.vote_average) return movie.vote_average;
  return 0;
}

export function getMovieYear(movie: any): string {
  if (movie.year) {
    return typeof movie.year === 'number' ? movie.year.toString() : movie.year;
  }
  if (movie.release_date) {
    return movie.release_date.split('-')[0];
  }
  if (movie.first_air_date) {
    return movie.first_air_date.split('-')[0];
  }
  return '';
}

export function getMovieOverview(movie: any): string {
  if (movie.description) return movie.description;
  if (movie.shortDescription) return movie.shortDescription;
  if (movie.overview) return movie.overview;
  return '';
}

export function isKPData(movie: any): boolean {
  return !!(
    movie.kinopoiskId || 
    movie.filmId || 
    movie.nameRu || 
    movie.nameEn || 
    movie.nameOriginal ||
    movie.posterUrlPreview || 
    movie.posterUrl ||
    movie.ratingKinopoisk ||
    (movie.poster_path && typeof movie.poster_path === 'string' && movie.poster_path.includes('kinopoiskapiunofficial'))
  );
}

export function isTMDBData(movie: any): boolean {
  if (isKPData(movie)) return false;
  return !!(movie.poster_path || movie.backdrop_path || movie.vote_average);
}
