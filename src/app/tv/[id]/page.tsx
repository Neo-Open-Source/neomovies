import TVShowPage from './TVShowPage';
import { tvShowsAPI } from '@/lib/neoApi';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
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
