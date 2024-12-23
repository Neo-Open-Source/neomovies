import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN) {
  throw new Error('TMDB_ACCESS_TOKEN is not defined in environment variables');
}

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

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
    getPopular: (page = 1) =>
        api.get('/discover/movie', {
            params: {
                page,
                language: 'ru-RU',
                'vote_count.gte': 100, // минимальное количество голосов
                'vote_average.gte': 1, // минимальный рейтинг
                sort_by: 'popularity.desc',
                include_adult: false,
                'primary_release_date.lte': new Date().toISOString().split('T')[0], // только вышедшие фильмы
            }
        }),

    // Получение данных о фильме по его TMDB ID
    getMovie: (id: string | number) =>
        api.get(`/movie/${id}`, {
            params: {
                language: 'ru-RU',
                append_to_response: 'credits,videos,similar' // дополнительная информация
            }
        }),

    // Поиск фильмов
    searchMovies: (query: string, page = 1) =>
        api.get('/search/movie', {
            params: {
                query,
                page,
                language: 'ru-RU',
                include_adult: false,
                'primary_release_date.lte': new Date().toISOString().split('T')[0]
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

    // Получение IMDb ID по TMDB ID для плеера
    getImdbId: async (tmdbId: string | number) => {
        try {
            const response = await api.get(`/movie/${tmdbId}`, {
                params: {
                    language: 'en-US', // Язык для IMDb ID
                },
            });
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
                    language: 'en-US', // Язык для видео
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('Ошибка при получении видео:', error);
            return [];
        }
    }
};