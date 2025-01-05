import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const neoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // Увеличиваем таймаут до 30 секунд
});

// Добавляем перехватчики запросов
neoApi.interceptors.request.use(
  (config) => {
    if (config.params?.page) {
      const page = parseInt(config.params.page);
      if (isNaN(page) || page < 1) {
        config.params.page = 1;
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Добавляем перехватчики ответов
neoApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Функция для получения URL изображения
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/images/placeholder.jpg';
  // Извлекаем только ID изображения из полного пути
  const imageId = path.split('/').pop();
  if (!imageId) return '/images/placeholder.jpg';
  return `${API_URL}/images/${size}/${imageId}`;
};

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
  genres?: Genre[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const searchAPI = {
  // Мультипоиск (фильмы и сериалы)
  multiSearch(query: string, page = 1) {
    return neoApi.get<MovieResponse>('/search/multi', {
      params: {
        query,
        page
      },
      timeout: 30000 // Увеличиваем таймаут до 30 секунд
    });
  }
};

export const moviesAPI = {
  // Получение популярных фильмов
  getPopular(page = 1) {
    return neoApi.get<MovieResponse>('/movies/popular', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение данных о фильме по его ID
  getMovie(id: string | number) {
    return neoApi.get(`/movies/${id}`, { timeout: 30000 });
  },

  // Поиск фильмов
  searchMovies(query: string, page = 1) {
    return neoApi.get<MovieResponse>('/movies/search', {
      params: {
        query,
        page
      },
      timeout: 30000
    });
  },

  // Получение IMDB ID
  getImdbId(id: string | number) {
    return neoApi.get(`/movies/${id}/external-ids`, { timeout: 30000 }).then(res => res.data.imdb_id);
  }
};

export const tvShowsAPI = {
  // Получение популярных сериалов
  getPopular(page = 1) {
    return neoApi.get('/tv/popular', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение данных о сериале по его ID
  getTVShow(id: string | number) {
    return neoApi.get(`/tv/${id}`, { timeout: 30000 });
  },

  // Поиск сериалов
  searchTVShows(query: string, page = 1) {
    return neoApi.get('/tv/search', {
      params: {
        query,
        page
      },
      timeout: 30000
    });
  },

  // Получение IMDB ID
  getImdbId(id: string | number) {
    return neoApi.get(`/tv/${id}/external-ids`, { timeout: 30000 }).then(res => res.data.imdb_id);
  }
};
