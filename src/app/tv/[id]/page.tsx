import { Metadata } from 'next';
import TVShowPage from './TVShowPage';

export const dynamic = 'force-dynamic';
import { tvShowsAPI } from '@/lib/neoApi';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate SEO metadata
export async function generateMetadata(
  props: { params: { id: string } }
): Promise<Metadata> {
  try {
    const showId = props.params.id;
    const { data: show } = await tvShowsAPI.getTVShow(showId);
    return {
      title: `${show.name} - NeoMovies`,
      description: show.overview,
    };
  } catch (error) {
    console.error('Error generating TV metadata', error);
    return {
      title: 'Сериал - NeoMovies',
    };
  }
}

async function getData(id: string) {
  try {
    const response = await tvShowsAPI.getTVShow(id).then(res => res.data);
    return { id, show: response };
  } catch (error) {
    console.error('Error fetching show:', error);
    return { id, show: null };
  }
}

export default async function Page(props: PageProps) {
  // В Next.js 14 нужно сначала использовать параметры в асинхронной функции
  try {
    const tvShowId = props.params.id;
    const data = await getData(tvShowId);
    return <TVShowPage tvShowId={data.id} show={data.show} />;
  } catch (error) {
    console.error('Error loading TV show page:', error);
    return <div>Ошибка загрузки страницы сериала</div>;
  }
}
