"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tvShowsAPI } from '@/lib/neoApi';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import TVPage from '../_components/TVPage';

export default function Page() {
  const { t } = useTranslation();
  const params = useParams();
  const slugParam = params.slug as string[] | undefined;
  const [show, setShow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sourceId = (() => {
    if (!slugParam || slugParam.length === 0) return '';
    if (slugParam.length === 1) return slugParam[0]; // new: tmdb_1399
    if (slugParam.length >= 2) return `${slugParam[0]}_${slugParam[1]}`; // old: tmdb/1399
    return '';
  })();

  useEffect(() => {
    async function fetchShow() {
      try {
        setLoading(true);
        setError(null);
        const response = await tvShowsAPI.getTVBySourceId(sourceId);
        setShow(response.data);
      } catch (err: any) {
        setError(`${t.common.failedToLoad}: ${err?.message || t.common.unknownError}`);
      } finally {
        setLoading(false);
      }
    }
    if (sourceId) fetchShow();
  }, [sourceId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>;
  if (error || !show) return <div className="flex items-center justify-center min-h-screen"><p>{error || t.common.tvNotFound}</p></div>;

  return <TVPage showId={show.id} show={show} />;
}
