'use client';

import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { moviesAPI } from '@/lib/neoApi';
import { AlertTriangle, Info } from 'lucide-react';

interface MoviePlayerProps {
  id: string;
  title: string;
  poster: string;
  imdbId?: string;
  isFullscreen?: boolean;
}

export default function MoviePlayer({ id, title, poster, imdbId, isFullscreen = false }: MoviePlayerProps) {
  const { settings, isInitialized } = useSettings();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [resolvedImdb, setResolvedImdb] = useState<string | null>(imdbId ?? null);

  useEffect(() => {
    const fetchImdbId = async () => {
      if (imdbId) {
        setResolvedImdb(imdbId);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data } = await moviesAPI.getMovie(id);
        if (!data?.imdb_id) throw new Error('IMDb ID не найден');
        setResolvedImdb(data.imdb_id);
      } catch (err) {
        console.error('Error fetching IMDb ID:', err);
        setError('Не удалось получить информацию для плеера.');
      } finally {
        setLoading(false);
      }
    };
    fetchImdbId();
  }, [id, imdbId]);

  useEffect(() => {
    if (!isInitialized || !resolvedImdb) return;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE_URL) {
      setError('Переменная окружения NEXT_PUBLIC_API_URL не задана.');
      return;
    }

    const playerEndpoint = settings.defaultPlayer === 'alloha' ? '/api/v1/players/alloha' : '/api/v1/players/lumex';
    
    // Формируем URL, где imdbId является частью пути
    const newIframeSrc = `${API_BASE_URL}${playerEndpoint}/${resolvedImdb}`;
    
    setIframeSrc(newIframeSrc);
    setLoading(false);
  }, [resolvedImdb, isInitialized, settings.defaultPlayer]);

  const handleRetry = () => {
    setError(null);
    if (!resolvedImdb) {
      const event = new Event('fetchImdb');
      window.dispatchEvent(event);
    } else {
      setIframeSrc(null);
      setLoading(true);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_BASE_URL) {
        setError('Переменная окружения NEXT_PUBLIC_API_URL не задана.');
        setLoading(false);
        return;
      }

      const playerEndpoint = settings.defaultPlayer === 'alloha' ? '/api/v1/players/alloha' : '/api/v1/players/lumex';
      const newIframeSrc = `${API_BASE_URL}${playerEndpoint}/${resolvedImdb}`;
      setIframeSrc(newIframeSrc);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-red-100 p-6 text-center text-red-700">
        <AlertTriangle size={32} />
        <p>{error}</p>
        <button
          onClick={handleRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const rootClasses = isFullscreen ? 'w-full h-full' : '';
  const playerContainerClasses = isFullscreen
    ? 'relative w-full h-full bg-black'
    : 'relative w-full overflow-hidden rounded-lg bg-black pt-[56.25%]';

  return (
    <div className={rootClasses}>
      <div className={playerContainerClasses}>
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            allow="fullscreen"
            loading="lazy"
            className="absolute left-0 top-0 h-full w-full border-0"
          />
        ) : (
          loading && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-warm-300">
              Загрузка плеера...
            </div>
          )
        )}
      </div>
      {settings.defaultPlayer !== 'lumex' && !isFullscreen && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-blue-100 p-3 text-sm text-blue-800">
          <Info size={20} />
          <span>Для возможности скачивания фильма выберите плеер Lumex в настройках.</span>
        </div>
      )}
    </div>
  );
}
