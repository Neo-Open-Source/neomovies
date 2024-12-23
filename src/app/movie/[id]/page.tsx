import MoviePage from './MoviePage';
import { moviesAPI } from '@/lib/api';

interface PageProps {
  params: {
    id: string;
  };
}

async function getData(id: string) {
  try {
    const response = await moviesAPI.getMovie(id);
    return { id, movie: response.data };
  } catch (error) {
    console.error('Error fetching movie:', error);
    return { id, movie: null };
  }
}

export default async function Page({ params }: PageProps) {
  const data = await getData(params.id);
  return <MoviePage movieId={data.id} movie={data.movie} />;
}