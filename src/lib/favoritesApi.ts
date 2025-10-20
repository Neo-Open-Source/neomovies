import { neoApi } from './neoApi';

export const favoritesAPI = {
  // Получение всех избранных
  getFavorites() {
    return neoApi.get('/api/v1/favorites');
  },

  // Добавление в избранное
  addFavorite(mediaId: string, mediaType: 'movie' | 'tv' = 'movie') {
    return neoApi.post(`/api/v1/favorites/${mediaId}?type=${mediaType}`);
  },

  // Удаление из избранного
  removeFavorite(mediaId: string, mediaType: 'movie' | 'tv' = 'movie') {
    return neoApi.delete(`/api/v1/favorites/${mediaId}?type=${mediaType}`);
  },

  // Проверка статуса избранного
  checkIsFavorite(mediaId: string, mediaType: 'movie' | 'tv' = 'movie') {
    return neoApi.get(`/api/v1/favorites/${mediaId}/check?type=${mediaType}`);
  }
};
