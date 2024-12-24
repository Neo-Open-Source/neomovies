import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'process.env.TMDB_API_KEY';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
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

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export const moviesAPI = {
  // Получение популярных фильмов
  getPopular: (page = 1) => 
    api.get<MovieResponse>('/movie/popular', { 
      params: { 
        page,
        language: 'ru-RU',
      } 
    }),

  // Получение данных о фильме по его TMDB ID
  getMovie: (id: string | number) => 
    api.get<MovieDetails>(`/movie/${id}`, { 
      params: { 
        language: 'ru-RU',
        append_to_response: 'credits,videos,similar'
      } 
    }),

  // Получение IMDb ID по TMDB ID для плеера
  getImdbId: async (tmdbId: string | number) => {
    try {
      const response = await api.get(`/movie/${tmdbId}/external_ids`);
      return response.data.imdb_id;
    } catch (error) {
      console.error('Ошибка при получении IMDb ID:', error);
      return null;
    }
  },

  // Получение видео по TMDB ID для плеера
  getVideo: async (tmdbId: string | number) => {
    try {
      const response = await api.get(`/movie/${tmdbId}/videos`, {
        params: {
          language: 'ru-RU',
        },
      });
      return response.data.results;
    } catch (error) {
      console.error('Ошибка при получении видео:', error);
      return [];
    }
  },

  // Поиск фильмов
  searchMovies: (query: string, page = 1) => 
    api.get<MovieResponse>('/search/movie', { 
      params: { 
        query, 
        page, 
        language: 'ru-RU',
      } 
    }),

  // Получение предстоящих фильмов
  getUpcoming: (page = 1) => 
    api.get('/movie/upcoming', {
      params: {
        page,
        language: 'ru-RU',
      }
    }),

  // Получение лучших фильмов
  getTopRated: (page = 1) => 
    api.get('/movie/top_rated', {
      params: {
        page,
        language: 'ru-RU',
        'vote_count.gte': 100
      }
    }),

  // Получение фильмов по жанру
  getMoviesByGenre: (genreId: number, page = 1) => 
    api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        language: 'ru-RU',
        'vote_count.gte': 100,
        'vote_average.gte': 1,
        sort_by: 'popularity.desc',
        include_adult: false,
        'primary_release_date.lte': new Date().toISOString().split('T')[0]
      }
    }),
};

export const tvAPI = {
  // Получение популярных сериалов
  getPopular: (page = 1) =>
    api.get<TVShowResponse>('/tv/popular', {
      params: {
        page,
        language: 'ru-RU',
      }
    }),

  // Получение данных о сериале по его TMDB ID
  getShow: (id: string | number) =>
    api.get<TVShowDetails>(`/tv/${id}`, {
      params: {
        language: 'ru-RU',
        append_to_response: 'credits,external_ids',
      }
    }),

  // Получение IMDb ID по TMDB ID для плеера
  getImdbId: (tmdbId: string | number) =>
    api.get<{ imdb_id: string | null }>(`/tv/${tmdbId}/external_ids`),

  // Поиск сериалов
  searchShows: (query: string, page = 1) =>
    api.get<TVShowResponse>('/search/tv', {
      params: {
        query,
        page,
        language: 'ru-RU',
      }
    }),
};

// Мультипоиск (фильмы и сериалы)
export const searchAPI = {
  multiSearch: (query: string, page = 1) =>
    api.get('/search/multi', {
      params: {
        query,
        page,
        language: 'ru-RU',
      }
    }),
};
