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
  const { id } = props.params;
  const data = await getData(id);
  return <TVShowPage tvShowId={data.id} show={data.show} />;
}
