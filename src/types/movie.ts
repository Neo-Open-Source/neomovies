export interface Movie {
  _id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  posterUrl: string;
  genres: string[];
  director: string;
  cast: string[];
  duration: number;
  trailerUrl?: string;
  createdAt: string;
  updatedAt: string;
}
