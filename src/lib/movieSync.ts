export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  year: number;
  rating: number;
}

export const syncMovies = async (): Promise<Movie[]> => {
  // Заглушка для синхронизации фильмов
  console.log('Syncing movies...');
  return [];
};

export const updateMovie = async (movie: Movie): Promise<Movie> => {
  // Заглушка для обновления фильма
  console.log(`Updating movie ${movie.title}`);
  return movie;
};

export const deleteMovie = async (id: string): Promise<boolean> => {
  // Заглушка для удаления фильма
  console.log(`Deleting movie ${id}`);
  return true;
};
