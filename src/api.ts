import axios from 'axios';

const BASE_URL = '/api/movies';

if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN) {
  throw new Error('TMDB_ACCESS_TOKEN is not defined in environment variables');
}

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number;
    tagline: string;
    budget: number;
    revenue: number;
    videos: {{
      "page": 1,
      "results": [
        {
          "id": 123,
          "title": "Movie Title",
          "overview": "Movie description",
          "poster_path": "/path/to/poster.jpg",
          ...
        },
        ...
      ],
      "total_pages": 500,
      "total_results": 10000
    }
        results: Video[];
    };
    credits: {
        cast: Cast[];
        crew: Crew[];
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

export const moviesAPI = {
    // Получение популярных фильмов
    async getPopular(page = 1) {
        const response = await api.get(`/popular?page=${page}`);
        return response.data;
    },

    // Получение данных о фильме
    async getMovie(id: string | number) {
        const response = await api.get(`/${id}`);
        return response.data;
    },

    // Поиск фильмов
    async searchMovies(query: string, page = 1) {
        const response = await api.get(`/search?query=${encodeURIComponent(query)}&page=${page}`);
        return response.data;
    },

    // Получение предстоящих фильмов
    async getUpcoming(page = 1) {
        const response = await api.get(`/upcoming?page=${page}`);
        return response.data;
    },

    // Получение топ рейтинговых фильмов
    async getTopRated(page = 1) {
        const response = await api.get(`/top-rated?page=${page}`);
        return response.data;
    }
};