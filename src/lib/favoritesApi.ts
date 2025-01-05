import axios from 'axios';

// Создаем экземпляр axios
const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

export const favoritesAPI = {
  // Получить все избранные
  getFavorites() {
    return api.get('/api/favorites');
  },

  // Добавить в избранное
  addFavorite(data: { mediaId: string; mediaType: 'movie' | 'tv'; title: string; posterPath?: string }) {
    return api.post('/api/favorites', data);
  },

  // Удалить из избранного
  removeFavorite(mediaId: string, mediaType: 'movie' | 'tv') {
    return api.delete(`/api/favorites/${mediaId}?mediaType=${mediaType}`);
  },

  // Проверить есть ли в избранном
  checkFavorite(mediaId: string, mediaType: 'movie' | 'tv') {
    return api.get(`/api/favorites/check/${mediaId}?mediaType=${mediaType}`);
  }
};
