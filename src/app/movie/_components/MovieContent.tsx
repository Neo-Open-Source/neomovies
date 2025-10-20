'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { moviesAPI } from '@/lib/neoApi';
import { getImageUrl as getImageUrlOriginal } from '@/lib/neoApi';
import type { MovieDetails } from '@/lib/neoApi';
import MoviePlayer from '@/components/MoviePlayer';
import TorrentSelector from '@/components/TorrentSelector';
import FavoriteButton from '@/components/FavoriteButton';
import Reactions from '@/components/Reactions';
import PlayerSelector from '@/components/PlayerSelector';
import { formatDate } from '@/lib/utils';
import { PlayCircle, ArrowLeft } from 'lucide-react';
import { NextSeo } from 'next-seo';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/contexts/TranslationContext';
import { unifyMovieData, formatRating, formatRuntime, getImageUrl } from '@/lib/dataUtils';

interface MovieContentProps {
  movieId: string;
  initialMovie: MovieDetails;
}

export default function MovieContent({ movieId, initialMovie }: MovieContentProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [movie] = useState<MovieDetails>(initialMovie);
  const unified = unifyMovieData(movie);
  const [externalIds, setExternalIds] = useState<any>(null);
  const [imdbId, setImdbId] = useState<string | null>(unified.imdbId || null);
  const [kinopoiskId, setKinopoiskId] = useState<number | null>(unified.kinopoiskId || null);
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>(settings.defaultPlayer);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync selectedPlayer with settings
  useEffect(() => {
    setSelectedPlayer(settings.defaultPlayer);
  }, [settings.defaultPlayer]);

  useEffect(() => {
    console.log('Movie data:', movie);
    
    // Check if we have unified data with externalIds
    if (movie.externalIds) {
      console.log('Found externalIds in unified data:', movie.externalIds);
      setExternalIds(movie.externalIds);
      if (movie.externalIds.imdb) {
        console.log('Found imdb_id in externalIds:', movie.externalIds.imdb);
        setImdbId(movie.externalIds.imdb);
      }
      return;
    }
    
    // Check if imdb_id is already in movie details
    if (movie.imdb_id) {
      console.log('Found imdb_id in movie details:', movie.imdb_id);
      setImdbId(movie.imdb_id);
      return;
    }
    
    // If not, fetch from external_ids endpoint
    const fetchExternalIds = async () => {
      try {
        console.log('Fetching external IDs for movie:', movieId);
        const data = await moviesAPI.getExternalIds(movieId);
        console.log('External IDs response:', data);
        setExternalIds(data);
        if (data?.imdb_id) {
          console.log('Found imdb_id in external_ids:', data.imdb_id);
          setImdbId(data.imdb_id);
        } else {
          console.warn('No imdb_id found in external_ids response');
        }
      } catch (err) {
        console.error('Error fetching external ids:', err);
      }
    };
    fetchExternalIds();
  }, [movieId, movie.imdb_id]);

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
        canonical={`https://neomovies.ru/movie/${unified.id}`}
        openGraph={{
          url: `https://neomovies.ru/movie/${unified.id}`,
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
            '@type': 'Movie',
            name: unified.title,
            image: getImageUrl(unified.posterPath, 'w780'),
            description: unified.overview,
            datePublished: unified.releaseDate,
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
              {movie.tagline && (
                <p className="mt-1 text-lg text-muted-foreground">{movie.tagline}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-medium">{t.details.rating}: {formatRating(unified.voteAverage)}</span>
                <span className="text-muted-foreground">|</span>
                {unified.runtime && (
                  <>
                    <span className="text-muted-foreground">{formatRuntime(unified.runtime)}</span>
                    <span className="text-muted-foreground">|</span>
                  </>
                )}
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
                {/* Mobile-only Watch Button */}
                {imdbId && (
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
                  mediaType="movie"
                  title={unified.title}
                  posterPath={unified.posterPath}
                  className="!bg-secondary !text-secondary-foreground hover:!bg-secondary/80"
                  showText={true}
                />
              </div>

              <div className="mt-8">
                <Reactions 
                  mediaId={externalIds?.tmdb ? externalIds.tmdb.toString() : unified.id.toString()} 
                  mediaType="movie" 
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
                    <MoviePlayer
                      id={unified.id.toString()}
                      title={unified.title}
                      poster={unified.posterPath || ''}
                      imdbId={imdbId || undefined}
                      kinopoiskId={kinopoiskId?.toString()}
                      selectedPlayer={selectedPlayer}
                    />
                  </div>
                  {imdbId && (
                    <TorrentSelector 
                      imdbId={imdbId}
                      type="movie"
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
          
          <div className={`w-full px-4 pt-16 pb-4 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <PlayerSelector 
              language={settings.language}
              selectedPlayer={selectedPlayer}
              onPlayerChange={setSelectedPlayer}
            />
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center">
            <MoviePlayer
              id={unified.id.toString()}
              title={unified.title}
              poster={unified.posterPath || ''}
              imdbId={imdbId || undefined}
              kinopoiskId={kinopoiskId?.toString()}
              selectedPlayer={selectedPlayer}
            />
          </div>
        </div>
      )}
    </>
  );
}
