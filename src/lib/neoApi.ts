import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.neomovies.ru';

// Создание экземпляра Axios с базовыми настройками
export const neoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
});

// Перехватчик запросов
neoApi.interceptors.request.use(
  (config) => {
    // Получение токена из localStorage или другого хранилища
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        token = localStorage.getItem('token');
      } catch {
        token = null;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Добавляем язык из настроек к запросам
    if (typeof window !== 'undefined') {
      try {
        const settings = localStorage.getItem('settings');
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          const interfaceLanguage = parsedSettings.interfaceLanguage || 'ru';
          
          // Добавляем параметр lang только если его еще нет
          if (!config.params) {
            config.params = {};
          }
          if (!config.params.lang && !config.params.language) {
            config.params.lang = interfaceLanguage;
          }
        }
      } catch (error) {
        console.error('Error reading language from settings:', error);
      }
    }
    
    // Логика для пагинации
    if (config.params?.page) {
      const page = parseInt(config.params.page);
      if (isNaN(page) || page < 1) {
        config.params.page = 1;
      }
    }
    
    console.log('🔵 Making request to:', config.baseURL + config.url, 'Params:', config.params);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Функция для обновления токена
const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
      refreshToken
    });

    const data = response.data.data || response.data;
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    if (newAccessToken && newRefreshToken) {
      localStorage.setItem('token', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Очищаем токены при ошибке обновления
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Отправляем событие для обновления UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
    
    return null;
  }
};

// Перехватчик ответов
neoApi.interceptors.response.use(
  (response) => {
    // Не обрабатываем изображения и плееры, которые могут иметь другую структуру
    const url = response.config?.url || '';
    const shouldUnwrap = !url.includes('/images/') &&
                        !url.includes('/players/');
    
    if (shouldUnwrap && response.data && response.data.success && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Проверяем на 401 ошибку и что запрос еще не был повторен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return neoApi(originalRequest);
      } else {
        // Если не удалось обновить токен, перенаправляем на логин
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    console.error('❌ Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/images/placeholder.jpg';
  // Всегда проксируем через наш API для обхода геоблока
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Передаём абсолютный URL как часть path (API теперь поддерживает это)
    const encoded = encodeURIComponent(path);
    return `${API_URL}/api/v1/images/${size}/${encoded}`;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}/api/v1/images/${size}/${cleanPath}`;
};

export interface Genre {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  genres?: Genre[];
  popularity?: number;
  media_type?: string;
  adult?: boolean;
  original_language?: string;
  origin_country?: string[];
  imdb_id?: string;
  kinopoisk_id?: number;
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
  posterUrl?: string;
  posterUrlPreview?: string;
  coverUrl?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  description?: string;
  shortDescription?: string;
  filmLength?: number;
  filmId?: number;
  type?: string;
  year?: string | number;
  countries?: Array<{ country: string }>;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  title: string;
  release_date: string;
  runtime: number;
  genres: Genre[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_countries?: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  spoken_languages?: Array<{
    iso_639_1: string;
    name: string;
  }>;
  status?: string;
  homepage?: string;
  imdb_id?: string;
  kinopoisk_id?: number;
  external_ids?: {
    imdb_id?: string;
    kinopoisk_id?: number;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
  };
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
  posterUrl?: string;
  posterUrlPreview?: string;
  coverUrl?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  description?: string;
  shortDescription?: string;
  filmLength?: number;
  countries?: Array<{ country: string }>;
}

export interface TVShowDetails {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  tagline?: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time?: number[];
  in_production?: boolean;
  languages?: string[];
  networks?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
  status?: string;
  type?: string;
  external_ids?: {
    imdb_id?: string;
    kinopoisk_id?: number;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    tvdb_id?: number;
  };
  imdb_id?: string;
  kinopoisk_id?: number;
  nameRu?: string;
  nameEn?: string;
  nameOriginal?: string;
  posterUrl?: string;
  posterUrlPreview?: string;
  coverUrl?: string;
  ratingKinopoisk?: number;
  ratingImdb?: number;
  description?: string;
  shortDescription?: string;
  serial?: boolean;
  startYear?: number;
  endYear?: number;
  completed?: boolean;
  countries?: Array<{ country: string }>;
}

export interface TorrentResult {
  title: string;
  tracker: string;
  size: string;
  seeders: number;
  peers: number;
  leechers: number;
  quality: string;
  voice?: string[];
  types?: string[];
  seasons?: number[];
  category: string;
  magnet: string;
  torrent_link?: string;
  details?: string;
  publish_date: string;
  added_date?: string;
  source: string;
}

export interface TorrentSearchResponse {
  query: string;
  results: TorrentResult[];
  total: number;
}

export interface AvailableSeasonsResponse {
  title: string;
  originalTitle: string;
  year: string;
  seasons: number[];
  total: number;
}

export const searchAPI = {
  // Унифицированный мультипоиск
  async multiSearch(query: string, source: 'kp' | 'tmdb', page = 1) {
    try {
      const response = await neoApi.get('/api/v1/search', {
        params: { query, source, page },
        timeout: 30000
      });
      // Unified API возвращает другую структуру, интерсептор может не развернуть её
      // Проверяем, развернул ли интерсептор данные
      if (response.data && response.data.success && response.data.data !== undefined) {
        // Данные не развернуты, возвращаем полную структуру unified API
        return response.data;
      }
      // Данные уже развернуты интерсептором, оборачиваем обратно в unified формат
      return {
        data: response.data,
        pagination: { page, totalPages: 1, totalResults: response.data?.length || 0, pageSize: response.data?.length || 0 }
      };
    } catch (error) {
      console.error('Error in multiSearch:', error);
      throw error;
    }
  }
};

export const moviesAPI = {
  // Получение популярных фильмов
  getPopular(page = 1) {
    return neoApi.get<MovieResponse>('/api/v1/movies/popular', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение фильмов с высоким рейтингом
  getTopRated(page = 1) {
    return neoApi.get<MovieResponse>('/api/v1/movies/top-rated', {
      params: { page },
      timeout: 30000
    });
  },

  // Получение новинок
  getNowPlaying(page = 1) {
    return neoApi.get<MovieResponse>('/api/v1/movies/now-playing', {
      params: { page },
      timeout: 30000
    });
  },

  // Получение предстоящих фильмов
  getUpcoming(page = 1) {
    return neoApi.get<MovieResponse>('/api/v1/movies/upcoming', {
      params: { page },
      timeout: 30000
    });
  },

  // Получение данных о фильме по униф. ID (kp_123 / tmdb_123)
  getMovieBySourceId(sourceId: string) {
    return neoApi.get(`/api/v1/movie/${sourceId}`, { timeout: 30000 });
  },

  // Поиск фильмов (устаревший, используйте searchAPI.multiSearch)
  searchMovies(query: string, page = 1) {
    return neoApi.get<MovieResponse>('/api/v1/movies/search', {
      params: {
        query,
        page
      },
      timeout: 30000
    });
  },

  // Получение IMDB и других external ids
  getExternalIds(id: string | number) {
    return neoApi.get(`/api/v1/movies/${id}/external-ids`, { timeout: 30000 }).then(res => res.data);
  }
};

export const tvShowsAPI = {
  // Получение популярных сериалов
  getPopular(page = 1) {
    return neoApi.get('/api/v1/tv/popular', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение сериалов с высоким рейтингом
  getTopRated(page = 1) {
    return neoApi.get('/api/v1/tv/top-rated', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение сериалов в эфире
  getOnTheAir(page = 1) {
    return neoApi.get('/api/v1/tv/on-the-air', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение сериалов, которые выходят сегодня
  getAiringToday(page = 1) {
    return neoApi.get('/api/v1/tv/airing-today', { 
      params: { page },
      timeout: 30000
    });
  },

  // Получение данных о сериале по униф. ID (kp_123 / tmdb_123)
  getTVBySourceId(sourceId: string) {
    return neoApi.get(`/api/v1/tv/${sourceId}`, { timeout: 30000 });
  },

  // Поиск сериалов (устаревший, используйте searchAPI.multiSearch)
  searchTVShows(query: string, page = 1) {
    return neoApi.get('/api/v1/tv/search', {
      params: {
        query,
        page
      },
      timeout: 30000
    });
  },

  // Получение IMDB и других external ids
  getExternalIds(id: string | number) {
    return neoApi.get(`/api/v1/tv/${id}/external-ids`, { timeout: 30000 }).then(res => res.data);
  }
};

export const torrentsAPI = {
  // Поиск торрентов по IMDB ID
  searchTorrents(imdbId: string, type: 'movie' | 'tv', options?: {
    season?: number;
    quality?: string;
    minQuality?: string;
    maxQuality?: string;
    excludeQualities?: string;
    hdr?: boolean;
    hevc?: boolean;
    sortBy?: string;
    sortOrder?: string;
    groupByQuality?: boolean;
    groupBySeason?: boolean;
  }) {
    const params: any = { type };
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'excludeQualities' && Array.isArray(value)) {
            params[key] = value.join(',');
          } else {
            params[key] = value;
          }
        }
      });
    }

    return neoApi.get<TorrentSearchResponse>(`/api/v1/torrents/search/${imdbId}`, {
      params,
      timeout: 30000
    });
  },

  // Получение доступных сезонов для сериала
  getAvailableSeasons(title: string, originalTitle?: string, year?: string) {
    const params: any = { title };
    if (originalTitle) params.originalTitle = originalTitle;
    if (year) params.year = year;

    return neoApi.get<AvailableSeasonsResponse>('/api/v1/torrents/seasons', {
      params,
      timeout: 30000
    });
  },

  // Универсальный поиск торрентов по запросу
  searchByQuery(query: string, type: 'movie' | 'tv' | 'anime' = 'movie', year?: string) {
    const params: any = { query, type };
    if (year) params.year = year;

    return neoApi.get<TorrentSearchResponse>('/api/v1/torrents/search', {
      params,
      timeout: 30000
    });
  }
};

export const categoriesAPI = {
  // Получение всех категорий
  getCategories() {
    return neoApi.get<Category[]>('/api/v1/categories');
  },

  // Получение медиа по категории (унифицировано)
  getMediaByCategory(
    categoryId: number,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
    language?: string,
    source?: 'kp' | 'tmdb',
    name?: string
  ) {
    const params: any = { page, type };
    if (language) params.language = language;
    if (source) params.source = source;
    if (name) params.name = name;
    return neoApi.get(`/api/v1/categories/${categoryId}/media`, { params }).then(res => res.data);
  },

  // Обратная совместимость (фильмы по категории)
  getMoviesByCategory(categoryId: number, page = 1) {
    return neoApi.get<MovieResponse>(`/api/v1/categories/${categoryId}/movies`, {
      params: { page }
    });
  }
};

// Новый API-клиент для работы с аутентификацией и профилем
export const authAPI = {
  // Новый метод для удаления аккаунта
  deleteAccount() {
    return neoApi.delete('/api/v1/profile');
  }
};