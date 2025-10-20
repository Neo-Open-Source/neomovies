'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { tvShowsAPI } from '@/lib/neoApi';
import { getImageUrl as getImageUrlOriginal } from '@/lib/neoApi';
import type { TVShowDetails } from '@/lib/neoApi';
import MoviePlayer from '@/components/MoviePlayer';
import TorrentSelector from '@/components/TorrentSelector';
import FavoriteButton from '@/components/FavoriteButton';
import Reactions from '@/components/Reactions';
import PlayerSelector from '@/components/PlayerSelector';
import EpisodeSelector from '@/components/EpisodeSelector';
import { formatDate } from '@/lib/utils';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import { NextSeo } from 'next-seo';
import { useSettings, getAvailablePlayers } from '@/hooks/useSettings';
import { useTranslation } from '@/contexts/TranslationContext';
import { unifyMovieData, formatRating, getImageUrl } from '@/lib/dataUtils';

interface TVContentProps {
  showId: string;
  initialShow: TVShowDetails;
}

export default function TVContent({ showId, initialShow }: TVContentProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [show] = useState<TVShowDetails>(initialShow);
  const unified = unifyMovieData(show);
  const [externalIds, setExternalIds] = useState<any>(null);
  const [imdbId, setImdbId] = useState<string | null>(unified.imdbId || null);
  const [kinopoiskId, setKinopoiskId] = useState<number | null>(unified.kinopoiskId || null);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>(settings.defaultPlayer);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const showEpisodeSelector = selectedPlayer !== 'lumex' && selectedPlayer !== 'vibix' && selectedPlayer !== 'hdvb';

  // Sync selectedPlayer with settings
  useEffect(() => {
    setSelectedPlayer(settings.defaultPlayer);
  }, [settings.defaultPlayer]);

  useEffect(() => {
    console.log('TV Show data:', show);
    console.log('Unified data:', unified);
    
    // Check if we have unified data with externalIds
    if (show.externalIds) {
      console.log('Found externalIds in unified data:', show.externalIds);
      setExternalIds(show.externalIds);
      if (show.externalIds.imdb) {
        console.log('Found imdb_id in externalIds:', show.externalIds.imdb);
        setImdbId(show.externalIds.imdb);
      }
      if (show.externalIds.kp) {
        setKinopoiskId(show.externalIds.kp);
      }
      return;
    }
    
    if (show.imdb_id) {
      setImdbId(show.imdb_id);
    }
    if (show.kinopoisk_id) {
      setKinopoiskId(show.kinopoisk_id);
    }
    if (initialShow.external_ids?.imdb_id) {
      setImdbId(initialShow.external_ids.imdb_id);
    }
    if (initialShow.external_ids?.kinopoisk_id) {
      setKinopoiskId(initialShow.external_ids.kinopoisk_id);
    }
    
    if (!imdbId || !kinopoiskId) {
      const fetchExternalIds = async () => {
        try {
          console.log('Fetching external IDs for TV show:', showId);
          const data = await tvShowsAPI.getExternalIds(showId);
          console.log('External IDs response:', data);
          setExternalIds(data);
          if (data?.imdb_id && !imdbId) {
            setImdbId(data.imdb_id);
          }
          if (data?.kinopoisk_id && !kinopoiskId) {
            setKinopoiskId(data.kinopoisk_id);
          }
        } catch (err) {
          console.error('Error fetching external ids:', err);
        }
      };
      fetchExternalIds();
    }
  }, [showId, initialShow.external_ids, show.imdb_id, show.kinopoisk_id]);

  const showControls = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setIsControlsVisible(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  const handleOpenPlayer = () => {
    setIsPlayerFullscreen(true);
    showControls();
  };
  
  const handleClosePlayer = () => {
    setIsPlayerFullscreen(false);
    if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
    }
  };

  return (
    <>
      <NextSeo
        title={`${unified.title} ${t.details.watchOnline}`}
        description={unified.overview?.slice(0, 150)}
        canonical={`https://neomovies.ru/tv/${unified.id}`}
        openGraph={{
          url: `https://neomovies.ru/tv/${unified.id}`,
          images: [
            {
              url: getImageUrl(unified.posterPath, 'w780'),
              alt: unified.title,
            },
          ],
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TVSeries',
            name: unified.title,
            image: getImageUrl(unified.posterPath, 'w780'),
            description: unified.overview,
            numberOfSeasons: show.number_of_seasons,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: unified.voteAverage,
              ratingCount: unified.voteCount,
            },
          }),
        }}
      />
      <div className="min-h-screen bg-background text-foreground px-4 py-6 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="sticky top-24 max-w-sm mx-auto md:max-w-none md:mx-0">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={getImageUrl(unified.posterPath, 'w500')}
                    alt={unified.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {unified.title}
              </h1>
              {unified.originalTitle && unified.originalTitle !== unified.title && (
                <p className="mt-1 text-sm text-muted-foreground">{unified.originalTitle}</p>
              )}
              {show.tagline && (
                <p className="mt-1 text-lg text-muted-foreground">{show.tagline}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-medium">{t.details.rating}: {formatRating(unified.voteAverage)}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">Сезонов: {show.number_of_seasons}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{unified.year}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {unified.genres.filter(g => g.name).map((genre, idx) => (
                  <span key={idx} className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-base text-muted-foreground">
                <p>{unified.overview}</p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                {(imdbId || kinopoiskId) && (
                  <button
                    onClick={handleOpenPlayer}
                    className="md:hidden flex items-center justify-center gap-2 rounded-md bg-red-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-600"
                  >
                    <PlayCircle size={20} />
                    <span>{t.details.watchNow}</span>
                  </button>
                )}
                <FavoriteButton
                  mediaId={unified.id.toString()}
                  mediaType="tv"
                  title={unified.title}
                  posterPath={unified.posterPath}
                  className="!bg-secondary !text-secondary-foreground hover:!bg-secondary/80"
                  showText={true}
                />
              </div>

              <div className="mt-8">
                <Reactions 
                  mediaId={externalIds?.tmdb ? externalIds.tmdb.toString() : unified.id.toString()} 
                  mediaType="tv" 
                />
              </div>

              {(imdbId || kinopoiskId) && (
                <div className="mt-10 space-y-4">
                  <div id="movie-player" className="rounded-lg bg-secondary/50 p-4 shadow-inner">
                    <PlayerSelector 
                      language={settings.language}
                      selectedPlayer={selectedPlayer}
                      onPlayerChange={setSelectedPlayer}
                    />
                    {showEpisodeSelector && (
                      <EpisodeSelector
                        seasons={show.number_of_seasons || 1}
                        selectedSeason={selectedSeason}
                        selectedEpisode={selectedEpisode}
                        onSeasonChange={setSelectedSeason}
                        onEpisodeChange={setSelectedEpisode}
                      />
                    )}
                    <MoviePlayer
                      id={unified.id.toString()}
                      title={unified.title}
                      poster={unified.posterPath || ''}
                      imdbId={imdbId || undefined}
                      kinopoiskId={kinopoiskId?.toString()}
                      selectedPlayer={selectedPlayer}
                      season={selectedSeason}
                      episode={selectedEpisode}
                    />
                  </div>
                  {imdbId && (
                    <TorrentSelector 
                      imdbId={imdbId}
                      type="tv"
                      title={unified.title}
                      originalTitle={unified.originalTitle}
                      year={unified.year}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isPlayerFullscreen && (imdbId || kinopoiskId) && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onMouseMove={showControls}
          onClick={showControls}
        >
          <div className={`absolute top-4 left-4 z-50 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={handleClosePlayer}
              className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
              aria-label="Назад"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          
          <div className={`w-full px-4 pt-16 pb-4 space-y-3 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <PlayerSelector 
              language={settings.language}
              selectedPlayer={selectedPlayer}
              onPlayerChange={setSelectedPlayer}
            />
            {showEpisodeSelector && (
              <EpisodeSelector
                seasons={show.number_of_seasons || 1}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
                onSeasonChange={setSelectedSeason}
                onEpisodeChange={setSelectedEpisode}
              />
            )}
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center px-4">
            <MoviePlayer
              id={unified.id.toString()}
              title={unified.title}
              poster={unified.posterPath || ''}
              imdbId={imdbId || undefined}
              kinopoiskId={kinopoiskId?.toString()}
              isFullscreen={true}
              selectedPlayer={selectedPlayer}
              season={selectedSeason}
              episode={selectedEpisode}
            />
          </div>
        </div>
      )}
    </>
  );
} 