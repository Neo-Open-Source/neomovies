'use client';

import { useEffect, useState } from 'react';
import { useSettings, getAvailablePlayers } from '@/hooks/useSettings';
import { moviesAPI, tvShowsAPI } from '@/lib/neoApi';
import { AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface MoviePlayerProps {
  id: string;
  title: string;
  poster: string;
  imdbId?: string;
  kinopoiskId?: string;
  isFullscreen?: boolean;
  season?: number;
  episode?: number;
  onPlayerChange?: (player: string) => void;
  selectedPlayer?: string;
}

export default function MoviePlayer({ 
  id, 
  title, 
  poster, 
  imdbId,
  kinopoiskId, 
  isFullscreen = false,
  season,
  episode,
  onPlayerChange,
  selectedPlayer
}: MoviePlayerProps) {
  const { t } = useTranslation();
  const { settings, isInitialized } = useSettings();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [resolvedImdb, setResolvedImdb] = useState<string | null>(imdbId ?? null);
  const [resolvedKinopoiskId, setResolvedKinopoiskId] = useState<number | null>(kinopoiskId ? parseInt(kinopoiskId) : null);
  const [currentPlayer, setCurrentPlayer] = useState<string>(selectedPlayer || settings.defaultPlayer);

  useEffect(() => {
    const fetchExternalIds = async () => {
      if (imdbId && kinopoiskId) {
        setResolvedImdb(imdbId);
        setResolvedKinopoiskId(parseInt(kinopoiskId));
        return;
      }
      
      if (imdbId || kinopoiskId) {
        if (imdbId) setResolvedImdb(imdbId);
        if (kinopoiskId) setResolvedKinopoiskId(parseInt(kinopoiskId));
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const externalIdsAPI = season !== undefined ? tvShowsAPI : moviesAPI;
        const externalIds = await externalIdsAPI.getExternalIds(id);
        if (externalIds?.imdb_id) {
          setResolvedImdb(externalIds.imdb_id);
        }
        if (externalIds?.kinopoisk_id) {
          setResolvedKinopoiskId(externalIds.kinopoisk_id);
        }
      } catch (err) {
        console.error('Error fetching external IDs:', err);
        setError(t.player.errorInfo);
      } finally {
        setLoading(false);
      }
    };
    fetchExternalIds();
  }, [id, imdbId, kinopoiskId, season]);

  useEffect(() => {
    if (selectedPlayer) {
      setCurrentPlayer(selectedPlayer);
    }
  }, [selectedPlayer]);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Проверяем, есть ли хотя бы один из ID (IMDB или KP)
    if (!resolvedImdb && !resolvedKinopoiskId) return;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_BASE_URL) {
      setError('Переменная окружения NEXT_PUBLIC_API_URL не задана.');
      return;
    }

    const getPlayerUrl = (player: string, imdbId: string | null, movieId: string, kpId: number | null) => {
      const mediaType = (season !== undefined && episode !== undefined) ? 'tv' : 'movie';
      const queryParams = (season !== undefined && episode !== undefined) 
        ? `?season=${season}&episode=${episode}` 
        : '';

      switch (player) {
        case 'alloha':
          if (kpId) {
            return `${API_BASE_URL}/api/v1/players/alloha/kp/${kpId}${queryParams}`;
          }
          if (imdbId) {
            return `${API_BASE_URL}/api/v1/players/alloha/imdb/${imdbId}${queryParams}`;
          }
          break;
        
        case 'lumex':
          if (kpId) {
            return `${API_BASE_URL}/api/v1/players/lumex/kp/${kpId}`;
          }
          if (imdbId) {
            return `${API_BASE_URL}/api/v1/players/lumex/imdb/${imdbId}`;
          }
          break;
        
        case 'vibix':
          if (kpId) {
            return `${API_BASE_URL}/api/v1/players/vibix/kp/${kpId}`;
          }
          if (imdbId) {
            return `${API_BASE_URL}/api/v1/players/vibix/imdb/${imdbId}`;
          }
          break;
        
        case 'vidsrc':
          if (imdbId) {
            return `${API_BASE_URL}/api/v1/players/vidsrc/${mediaType}/${imdbId}${queryParams}`;
          }
          break;
        
        case 'vidlink':
          if (mediaType === 'movie' && imdbId) {
            return `${API_BASE_URL}/api/v1/players/vidlink/movie/${imdbId}`;
          } else if (mediaType === 'tv') {
            // Vidlink TV использует TMDB ID, но у нас его может не быть
            // Попробуем использовать movieId как fallback
            return `${API_BASE_URL}/api/v1/players/vidlink/tv/${movieId}${queryParams}`;
          }
          break;
        
        case 'hdvb':
          if (kpId) {
            return `${API_BASE_URL}/api/v1/players/hdvb/kp/${kpId}`;
          }
          if (imdbId) {
            return `${API_BASE_URL}/api/v1/players/hdvb/imdb/${imdbId}`;
          }
          break;
        
        default:
          if (kpId) {
            return `${API_BASE_URL}/api/v1/players/alloha/kp/${kpId}${queryParams}`;
          }
          if (imdbId) {
            return `${API_BASE_URL}/api/v1/players/alloha/imdb/${imdbId}${queryParams}`;
          }
          break;
      }
      
      // Если не удалось построить URL для выбранного плеера, пробуем fallback
      if (kpId) {
        return `${API_BASE_URL}/api/v1/players/alloha/kp/${kpId}${queryParams}`;
      }
      if (imdbId) {
        return `${API_BASE_URL}/api/v1/players/alloha/imdb/${imdbId}${queryParams}`;
      }
      
      return null;
    };

    const newIframeSrc = getPlayerUrl(currentPlayer, resolvedImdb, id, resolvedKinopoiskId);
    
    // Детальное логирование для отладки
    console.log('🎬 MoviePlayer URL Generation:', {
      player: currentPlayer,
      imdbId: resolvedImdb,
      kinopoiskId: resolvedKinopoiskId,
      movieId: id,
      season,
      episode,
      generatedUrl: newIframeSrc
    });
    
    if (newIframeSrc) {
      setIframeSrc(newIframeSrc);
      setLoading(false);
    } else {
      setError('Не удалось построить URL плеера для доступных ID');
      setLoading(false);
    }
  }, [resolvedImdb, isInitialized, currentPlayer, id, season, episode]);

  const handleRetry = () => {
    setError(null);
    if (!resolvedImdb && !resolvedKinopoiskId) {
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

      const getPlayerUrl = (player: string, imdbId: string | null, movieId: string, kpId: number | null) => {
        const mediaType = (season !== undefined && episode !== undefined) ? 'tv' : 'movie';
        const queryParams = (season !== undefined && episode !== undefined) 
          ? `?season=${season}&episode=${episode}` 
          : '';
        
        switch (player) {
          case 'alloha':
            if (kpId) return `${API_BASE_URL}/api/v1/players/alloha/kp/${kpId}${queryParams}`;
            if (imdbId) return `${API_BASE_URL}/api/v1/players/alloha/imdb/${imdbId}${queryParams}`;
            break;
          case 'lumex':
            if (kpId) return `${API_BASE_URL}/api/v1/players/lumex/kp/${kpId}`;
            if (imdbId) return `${API_BASE_URL}/api/v1/players/lumex/imdb/${imdbId}`;
            break;
          case 'vibix':
            if (kpId) return `${API_BASE_URL}/api/v1/players/vibix/kp/${kpId}`;
            if (imdbId) return `${API_BASE_URL}/api/v1/players/vibix/imdb/${imdbId}`;
            break;
          case 'vidsrc':
            if (imdbId) return `${API_BASE_URL}/api/v1/players/vidsrc/${mediaType}/${imdbId}${queryParams}`;
            break;
          case 'vidlink':
            if (mediaType === 'movie' && imdbId) return `${API_BASE_URL}/api/v1/players/vidlink/movie/${imdbId}`;
            if (mediaType === 'tv') return `${API_BASE_URL}/api/v1/players/vidlink/tv/${movieId}${queryParams}`;
            break;
          case 'hdvb':
            if (kpId) return `${API_BASE_URL}/api/v1/players/hdvb/kp/${kpId}`;
            if (imdbId) return `${API_BASE_URL}/api/v1/players/hdvb/imdb/${imdbId}`;
            break;
          default:
            if (kpId) return `${API_BASE_URL}/api/v1/players/alloha/kp/${kpId}${queryParams}`;
            if (imdbId) return `${API_BASE_URL}/api/v1/players/alloha/imdb/${imdbId}${queryParams}`;
            break;
        }
        
        return null;
      };

      const newIframeSrc = getPlayerUrl(settings.defaultPlayer, resolvedImdb, id, resolvedKinopoiskId);
      if (newIframeSrc) {
        setIframeSrc(newIframeSrc);
        setLoading(false);
      } else {
        setError('Не удалось построить URL плеера для доступных ID');
        setLoading(false);
      }
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
              {t.player.loading}
            </div>
          )
        )}
      </div>
      {settings.defaultPlayer !== 'lumex' && !isFullscreen && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-blue-100 p-3 text-sm text-blue-800">
          <Info size={20} />
          <span>{t.player.downloadHint}</span>
        </div>
      )}
    </div>
  );
}