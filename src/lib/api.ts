import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  tagline: string;
  budget: number;
  revenue: number;
  videos: {
    results: Video[];
  };
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  number_of_episodes: number;
  number_of_seasons: number;
  tagline: string;
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  seasons: Array<{
    id: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
  }>;
  external_ids?: {
    imdb_id: string | null;
    tvdb_id: number | null;
    tvrage_id: number | null;
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export const moviesAPI = {
  // Получение популярных фильмов
  getPopular(page = 1) {
    return api.get<MovieResponse>('/movies/popular', {
      params: { page }
    });
  },

  // Получение данных о фильме по его TMDB ID
  getMovie(id: string | number) {
    return api.get<MovieDetails>(`/movies/${id}`);
  },

  // Получение IMDb ID по TMDB ID для плеера
  getImdbId(tmdbId: string | number) {
    return api.get<{ imdb_id: string }>(`/movies/${tmdbId}/external-ids`);
  },

  // Получение видео по TMDB ID для плеера
  getVideo(tmdbId: string | number) {
    return api.get<{ results: Video[] }>(`/movies/${tmdbId}/videos`);
  },

  // Поиск фильмов
  searchMovies(query: string, page = 1) {
    return api.get<MovieResponse>('/movies/search', {
      params: { query, page }
    });
  },

  // Получение предстоящих фильмов
  getUpcoming(page = 1) {
    return api.get<MovieResponse>('/movies/upcoming', {
      params: { page }
    });
  },

  // Получение лучших фильмов
  getTopRated(page = 1) {
    return api.get<MovieResponse>('/movies/top-rated', {
      params: { page }
    });
  },

  // Получение фильмов по жанру
  getMoviesByGenre(genreId: number, page = 1) {
    return api.get<MovieResponse>('/movies/genre/' + genreId, {
      params: { page }
    });
  }
};

export const tvAPI = {
  // Получение популярных сериалов
  getPopular(page = 1) {
    return api.get<TVShowResponse>('/tv/popular', {
      params: { page }
    });
  },

  // Получение данных о сериале по его TMDB ID
  getShow(id: string | number) {
    return api.get<TVShowDetails>(`/tv/${id}`);
  },

  // Получение IMDb ID по TMDB ID для плеера
  getImdbId(tmdbId: string | number) {
    return api.get<{ imdb_id: string }>(`/tv/${tmdbId}/external-ids`);
  },

  // Поиск сериалов
  searchShows(query: string, page = 1) {
    return api.get<TVShowResponse>('/tv/search', {
      params: { query, page }
    });
  }
};

// Мультипоиск (фильмы и сериалы)
export const searchAPI = {
  multiSearch(query: string, page = 1) {
    return api.get('/search/multi', {
      params: { query, page }
    });
  }
};
