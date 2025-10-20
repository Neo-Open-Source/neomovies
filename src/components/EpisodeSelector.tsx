'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface EpisodeSelectorProps {
  seasons: number;
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
  episodesPerSeason?: number; // Default episodes per season
}

export default function EpisodeSelector({ 
  seasons, 
  selectedSeason, 
  selectedEpisode, 
  onSeasonChange, 
  onEpisodeChange,
  episodesPerSeason = 24
}: EpisodeSelectorProps) {
  const { t } = useTranslation();
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [episodeOpen, setEpisodeOpen] = useState(false);
  const seasonRef = useRef<HTMLDivElement>(null);
  const episodeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (seasonRef.current && !seasonRef.current.contains(event.target as Node)) {
        setSeasonOpen(false);
      }
      if (episodeRef.current && !episodeRef.current.contains(event.target as Node)) {
        setEpisodeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const seasonList = Array.from({ length: seasons }, (_, i) => i + 1);
  const episodeList = Array.from({ length: episodesPerSeason }, (_, i) => i + 1);

  return (
    <div className="flex gap-3 mb-4">
      {/* Season Selector */}
      <div className="relative" ref={seasonRef}>
        <button
          onClick={() => setSeasonOpen(!seasonOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors min-w-[140px] justify-between"
        >
          <span>{t.player.selectSeason} {selectedSeason}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${seasonOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {seasonOpen && (
          <div className="absolute top-full mt-2 bg-gray-800 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto w-full">
            {seasonList.map((season) => (
              <button
                key={season}
                onClick={() => {
                  onSeasonChange(season);
                  setSeasonOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                  selectedSeason === season ? 'bg-gray-700 text-accent' : 'text-white'
                }`}
              >
                {t.player.selectSeason} {season}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Episode Selector */}
      <div className="relative" ref={episodeRef}>
        <button
          onClick={() => setEpisodeOpen(!episodeOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors min-w-[140px] justify-between"
        >
          <span>{t.player.selectEpisode} {selectedEpisode}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${episodeOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {episodeOpen && (
          <div className="absolute top-full mt-2 bg-gray-800 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto w-full">
            {episodeList.map((episode) => (
              <button
                key={episode}
                onClick={() => {
                  onEpisodeChange(episode);
                  setEpisodeOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                  selectedEpisode === episode ? 'bg-gray-700 text-accent' : 'text-white'
                }`}
              >
                {t.player.selectEpisode} {episode}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
