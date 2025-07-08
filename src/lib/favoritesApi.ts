import { api } from './api';


export const favoritesAPI = {
  // Получить все избранные
  getFavorites() {
    return api.get('/favorites');
  },

  // Добавить в избранное
  addFavorite(data: { mediaId: string; mediaType: 'movie' | 'tv', title: string, posterPath: string }) {
    const { mediaId, mediaType, title, posterPath } = data;
    return api.post(`/favorites/${mediaId}?mediaType=${mediaType}`, { title, posterPath });
  },

  // Удалить из избранного
  removeFavorite(mediaId: string) {
    return api.delete(`/favorites/${mediaId}`);
  },

  // Проверить есть ли в избранном
  checkFavorite(mediaId: string) {
    return api.get(`/favorites/check/${mediaId}`);
  }
};
