"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { moviesAPI } from '@/lib/neoApi';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import MoviePage from '../_components/MoviePage';

export default function Page() {
  const { t } = useTranslation();
  const params = useParams();
  const slugParam = params.slug as string[] | undefined;
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sourceId = (() => {
    if (!slugParam || slugParam.length === 0) return '';
    if (slugParam.length === 1) return slugParam[0]; // new: kp_123
    if (slugParam.length >= 2) return `${slugParam[0]}_${slugParam[1]}`; // old: kp/123
    return '';
  })();

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        setError(null);
        const response = await moviesAPI.getMovieBySourceId(sourceId);
        setMovie(response.data);
      } catch (err: any) {
        setError(`${t.common.failedToLoad}: ${err?.message || t.common.unknownError}`);
      } finally {
        setLoading(false);
      }
    }
    if (sourceId) fetchMovie();
  }, [sourceId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>;
  if (error || !movie) return <div className="flex items-center justify-center min-h-screen"><p>{error || t.common.movieNotFound}</p></div>;

  return <MoviePage movieId={movie.id} movie={movie} />;
}
