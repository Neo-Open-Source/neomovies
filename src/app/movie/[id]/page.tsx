import { Metadata } from 'next';
import { moviesAPI } from '@/lib/api';
import MoviePage from '@/app/movie/[id]/MoviePage';

interface PageProps {
  params: {
    id: string;
  };
}

// Генерация метаданных для страницы
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  try {
    const { data: movie } = await moviesAPI.getMovie(id);
    return {
      title: `${movie.title} - NeoMovies`,
      description: movie.overview,
    };
  } catch (error) {
    return {
      title: 'Фильм - NeoMovies',
    };
  }
}

// Получение данных для страницы
async function getData(id: string) {
  try {
    const { data: movie } = await moviesAPI.getMovie(id);
    return { id, movie };
  } catch (error) {
    throw new Error('Failed to fetch movie');
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const data = await getData(id);
  return <MoviePage movieId={data.id} movie={data.movie} />;
}