export interface UnifiedGenre { id: string; name: string }
export interface UnifiedCastMember { id: string; name: string; character?: string }
export interface UnifiedExternalIDs { kp?: number | null; tmdb?: number | null; imdb: string }
export interface UnifiedSeason {
  id: string;
  sourceId: string;
  name: string;
  seasonNumber: number;
  episodeCount: number;
  releaseDate: string;
  posterUrl: string;
}
export interface UnifiedContent {
  id: string;
  sourceId: string;
  title: string;
  originalTitle: string;
  description: string;
  releaseDate: string;
  endDate?: string | null;
  type: 'movie' | 'tv';
  genres: UnifiedGenre[];
  rating: number;
  posterUrl: string;
  backdropUrl: string;
  director: string;
  cast: UnifiedCastMember[];
  duration: number;
  country: string;
  language: string;
  budget?: number | null;
  revenue?: number | null;
  imdbId?: string;
  externalIds: UnifiedExternalIDs;
  seasons?: UnifiedSeason[];
}
export interface UnifiedSearchItem {
  id: string;
  sourceId: string;
  title: string;
  type: 'movie' | 'tv';
  releaseDate: string;
  posterUrl: string;
  rating: number;
  description: string;
  externalIds: UnifiedExternalIDs;
}
