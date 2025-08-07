'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, AlertTriangle, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { torrentsAPI, type TorrentResult } from '@/lib/neoApi';

interface TorrentSelectorProps {
  imdbId: string | null;
  type: 'movie' | 'tv';
  title?: string;
  originalTitle?: string;
  year?: string;
}

interface ParsedTorrent extends TorrentResult {
  quality?: string;
  season?: number;
  sizeFormatted?: string;
}

export default function TorrentSelector({ imdbId, type, title, originalTitle, year }: TorrentSelectorProps) {
  const [torrents, setTorrents] = useState<ParsedTorrent[] | null>(null);
  const [availableSeasons, setAvailableSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMagnet, setCopiedMagnet] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parseQuality = (title: string): string => {
    const qualityRegex = /(2160p|4K|UHD|1080p|FHD|720p|HD|480p|SD|CAMRip|TS|TC|DVDRip|BDRip|WEBRip|HDTV)/i;
    const match = title.match(qualityRegex);
    if (match) {
      const quality = match[1].toUpperCase();
      if (quality === 'UHD' || quality === '4K') return '4K';
      if (quality === 'FHD') return '1080P';
      if (quality === 'HD' && !title.match(/720p/i)) return '720P';
      if (quality === 'SD') return '480P';
      return quality;
    }
    return 'UNKNOWN';
  };

  const parseSeason = (title: string): number | undefined => {
    const seasonRegexes = [
      /(?:S|Season\s*)(\d+)/i,
      /Сезон\s*(\d+)/i,
      /Season\s*(\d+)/i,
      /S(\d+)E\d+/i,
      /(\d+)\s*сезон/i
    ];
    
    for (const regex of seasonRegexes) {
      const match = title.match(regex);
      if (match) {
        return parseInt(match[1], 10);
      }
    }
    return undefined;
  };

  const formatSize = (size: string | number): string => {
    if (!size) return '';
    let sizeNum = Number(size);
    if (!isNaN(sizeNum) && sizeNum > 0) {
      if (sizeNum > 1024 * 1024 * 1024) {
        return (sizeNum / (1024 * 1024 * 1024)).toFixed(2) + ' ГБ';
      } else if (sizeNum > 1024 * 1024) {
        return (sizeNum / (1024 * 1024)).toFixed(2) + ' МБ';
      } else {
        return (sizeNum / 1024).toFixed(2) + ' КБ';
      }
    }
    return size.toString();
  };

  useEffect(() => {
    if (type === 'tv' && torrents && torrents.length > 0) {
      const seasons = [...new Set(
        torrents
          .map(t => t.season)
          .filter(s => s !== undefined)
          .sort((a, b) => a! - b!)
      )] as number[];
      setAvailableSeasons(seasons);
    }
  }, [type, torrents]);

  useEffect(() => {
    if (!imdbId) return;
    fetchTorrents();
  }, [imdbId, type]);

  const fetchTorrents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await torrentsAPI.searchTorrents(imdbId!, type);
      if (response.data.total === 0) {
        setError('Торренты не найдены.');
      } else {
        const parsedTorrents: ParsedTorrent[] = response.data.results.map(torrent => ({
          ...torrent,
          quality: parseQuality(torrent.title || ''),
          season: type === 'tv' ? parseSeason(torrent.title || '') : undefined,
          sizeFormatted: formatSize(torrent.size || 0)
        }));
        setTorrents(parsedTorrents);
      }
    } catch (err) {
      setError('Не удалось загрузить список торрентов.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTorrents = useMemo(() => {
    if (!torrents) return [];
    
    let filtered = torrents;
    
    if (type === 'tv' && selectedSeason !== null && availableSeasons.length > 0) {
      filtered = filtered.filter(torrent => torrent.season === selectedSeason);
    }
    
    if (selectedQuality !== 'all') {
      filtered = filtered.filter(torrent => torrent.quality === selectedQuality);
    }
    
    return filtered.sort((a, b) => {
      const qualityOrder = ['4K', '2160P', '1080P', '720P', '480P', 'HDTV', 'WEBRIP', 'BDRIP', 'DVDRIP'];
      const aQualityIndex = qualityOrder.indexOf(a.quality || '');
      const bQualityIndex = qualityOrder.indexOf(b.quality || '');
      
      if (aQualityIndex === -1 && bQualityIndex === -1) return 0;
      if (aQualityIndex === -1) return 1;
      if (bQualityIndex === -1) return -1;
      return aQualityIndex - bQualityIndex;
    });
  }, [torrents, selectedSeason, selectedQuality, type, availableSeasons]);

  const availableQualities = useMemo(() => {
    if (!torrents) return [];
    const qualities = [...new Set(torrents.map(t => t.quality).filter(q => q && q !== 'UNKNOWN'))];
    return qualities.sort((a, b) => {
      const order = ['4K', '2160P', '1080P', '720P', '480P', 'HDTV', 'WEBRIP', 'BDRIP', 'DVDRIP', 'CAMRIP', 'TS', 'TC'];
      const indexA = order.indexOf(a!);
      const indexB = order.indexOf(b!);
      if (indexA === -1 && indexB === -1) return a!.localeCompare(b!);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [torrents]);

  const handleCopy = (magnet: string) => {
    navigator.clipboard.writeText(magnet);
    setCopiedMagnet(magnet);
    setTimeout(() => setCopiedMagnet(null), 2000);
  };

  const handleDownload = (magnet: string) => {
    window.open(magnet, '_blank');
  };

  const TorrentCard = ({ torrent }: { torrent: ParsedTorrent }) => {
    const getAdditionalInfo = (title: string) => {
      const info: string[] = [];
      
      if (title.match(/rus/i)) info.push('RUS');
      if (title.match(/eng/i)) info.push('ENG');
      if (title.match(/x264/i)) info.push('x264');
      if (title.match(/x265|HEVC/i)) info.push('HEVC');
      if (title.match(/HDR/i)) info.push('HDR');
      if (title.match(/Dolby/i)) info.push('Dolby');
      
      return info;
    };

    const additionalInfo = getAdditionalInfo(torrent.title || '');

    return (
      <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white dark:bg-zinc-800 hover:bg-gray-50 transition-colors dark:hover:bg-zinc-700">
        <div className="flex flex-col gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight break-words line-clamp-2 text-gray-900 dark:text-gray-50">
              {torrent.title || 'Раздача'}
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {torrent.quality && torrent.quality !== 'UNKNOWN' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {torrent.quality}
                </span>
              )}
              {type === 'tv' && torrent.season && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Сезон {torrent.season}
                </span>
              )}
              {torrent.sizeFormatted && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {torrent.sizeFormatted}
                </span>
              )}
              {additionalInfo.map(info => (
                <span key={info} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {info}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => handleCopy(torrent.magnet)}
            variant="outline"
            size="sm"
            className="flex-1 border-gray-300 text-gray-700 dark:border-zinc-600 dark:text-zinc-300"
          >
            {copiedMagnet === torrent.magnet ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Копировать
              </>
            )}
          </Button>
          
          <Button
            onClick={() => handleDownload(torrent.magnet)}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Скачать
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-4 flex items-center justify-center p-4">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300">Загрузка торрентов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400">
        <AlertTriangle size={20} className="text-red-600 dark:text-red-500" />
        <span>{error}</span>
      </div>
    );
  }

  if (!torrents || torrents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Скачать ({torrents.length} {torrents.length === 1 ? 'раздача' : torrents.length < 5 ? 'раздачи' : 'раздач'})
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-50">
              Выберите раздачу для скачивания
            </DialogTitle>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Найдено {filteredTorrents.length} из {torrents.length} раздач
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-4">
              {availableQualities.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-900 dark:text-gray-50">Качество</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedQuality === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedQuality('all')}
                      className={selectedQuality === 'all' ? 'bg-zinc-800 text-white dark:bg-white dark:text-black' : 'text-gray-700 border-gray-300 dark:text-zinc-300 dark:border-zinc-600'}
                    >
                      Все ({torrents.length})
                    </Button>
                    {availableQualities.map(quality => {
                      const count = torrents.filter(t => 
                        t.quality === quality && 
                        (type !== 'tv' || selectedSeason === null || availableSeasons.length === 0 || t.season === selectedSeason)
                      ).length;
                      return (
                        <Button
                          key={quality}
                          variant={selectedQuality === quality ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedQuality(quality!)}
                          className={selectedQuality === quality ? 'bg-zinc-800 text-white dark:bg-white dark:text-black' : 'text-gray-700 border-gray-300 dark:text-zinc-300 dark:border-zinc-600'}
                        >
                          {quality} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {type === 'tv' && availableSeasons.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-3 block text-gray-900 dark:text-gray-50">Сезон</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedSeason === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSeason(null)}
                      className={selectedSeason === null ? 'bg-zinc-800 text-white dark:bg-white dark:text-black' : 'text-gray-700 border-gray-300 dark:text-zinc-300 dark:border-zinc-600'}
                    >
                      Все сезоны
                    </Button>
                    {availableSeasons.map(season => {
                      const count = torrents?.filter(t => t.season === season && (selectedQuality === 'all' || t.quality === selectedQuality)).length || 0;
                      return (
                        <Button
                          key={season}
                          variant={selectedSeason === season ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSeason(season)}
                          className={selectedSeason === season ? 'bg-zinc-800 text-white dark:bg-white dark:text-black' : 'text-gray-700 border-gray-300 dark:text-zinc-300 dark:border-zinc-600'}
                        >
                          Сезон {season} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              {filteredTorrents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Нет раздач, соответствующих выбранным фильтрам
                </div>
              ) : (
                filteredTorrents.map((torrent, index) => (
                  <TorrentCard key={`${torrent.magnet}-${index}`} torrent={torrent} />
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
