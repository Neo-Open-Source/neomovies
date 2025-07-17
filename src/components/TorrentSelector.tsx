'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Copy, Check } from 'lucide-react';

interface Torrent {
  magnet: string;
  title?: string;
  name?: string;
  quality?: string;
  seeders?: number;
  size_gb?: number;
}

interface GroupedTorrents {
  [quality: string]: Torrent[];
}

interface SeasonGroupedTorrents {
  [season: string]: GroupedTorrents;
}

interface TorrentSelectorProps {
  imdbId: string | null;
  type: 'movie' | 'tv';
  totalSeasons?: number;
}

export default function TorrentSelector({ imdbId, type, totalSeasons }: TorrentSelectorProps) {
  const [torrents, setTorrents] = useState<Torrent[] | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(type === 'movie' ? 1 : null);
  const [selectedMagnet, setSelectedMagnet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Для TV показов автоматически выбираем первый сезон
  useEffect(() => {
    if (type === 'tv' && totalSeasons && totalSeasons > 0 && !selectedSeason) {
      setSelectedSeason(1);
    }
  }, [type, totalSeasons, selectedSeason]);

  useEffect(() => {
    if (!imdbId) return;
    
    // Для фильмов загружаем сразу
    if (type === 'movie') {
      fetchTorrents();
    }
    // Для TV показов загружаем только когда выбран сезон
    else if (type === 'tv' && selectedSeason) {
      fetchTorrents();
    }
  }, [imdbId, type, selectedSeason]);

  const fetchTorrents = async () => {
    setLoading(true);
    setError(null);
    setSelectedMagnet(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('API URL не настроен');
      }
      
      let url = `${apiUrl}/torrents/search/${imdbId}?type=${type}`;
      
      if (type === 'tv' && selectedSeason) {
        url += `&season=${selectedSeason}`;
      }
      
      console.log('API URL:', url, 'IMDB:', imdbId, 'season:', selectedSeason);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch torrents');
      }
      const data = await res.json();
      if (data.total === 0) {
        setError('Торренты не найдены.');
      } else {
        setTorrents(data.results as Torrent[]);
      }
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить список торрентов.');
    } finally {
      setLoading(false);
    }
  };

  const handleQualitySelect = (torrent: Torrent) => {
    setSelectedMagnet(torrent.magnet);
    setIsCopied(false);
  };

  const handleCopy = () => {
    if (!selectedMagnet) return;
    navigator.clipboard.writeText(selectedMagnet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="mt-4 flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Загрузка торрентов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-700">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (!torrents) return null;

  const renderTorrentButtons = (list: Torrent[]) => {
    if (!list?.length) {
      return (
        <p className="text-sm text-muted-foreground">
          Торрентов для выбранного сезона нет.
        </p>
      );
    }

    return list.map(torrent => {
      const size = torrent.size_gb;
      const label = torrent.title || torrent.name || 'Раздача';

      return (
        <Button
          key={torrent.magnet}
          asChild
          onClick={() => handleQualitySelect(torrent)}
          variant="outline"
          className="w-full items-center text-left px-3 py-2"
        >
          <a
            href={torrent.magnet}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center"
          >
            <span className="flex-1 truncate whitespace-nowrap overflow-hidden">{label}</span>
            {size !== undefined && (
              <span className="text-xs text-muted-foreground">{size.toFixed(2)} GB</span>
            )}
          </a>
        </Button>
      );
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {type === 'tv' && totalSeasons && totalSeasons > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Сезоны</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(season => (
              <Button 
                key={season} 
                onClick={() => {setSelectedSeason(season); setSelectedMagnet(null);}} 
                variant={selectedSeason === season ? 'default' : 'outline'}
              >
                Сезон {season}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedSeason && torrents && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Раздачи</h3>
          <div className="space-y-2">
            {renderTorrentButtons(torrents)}
          </div>
        </div>
      )}

      {selectedMagnet && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Magnet-ссылка</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border bg-secondary/50 px-3 py-2 text-sm">
              {selectedMagnet}
            </div>
            <Button onClick={handleCopy} size="icon" variant="outline">
              {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
