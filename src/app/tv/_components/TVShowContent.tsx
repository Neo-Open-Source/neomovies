import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { TVShow } from '@/types/movie';
import { tvShowsAPI, getImageUrl } from '@/lib/neoApi';
import MoviePlayer from '@/components/MoviePlayer';
import FavoriteButton from '@/components/FavoriteButton';
import { formatDate } from '@/lib/utils';

interface TVShowContentProps {
  tvShowId: string;
  initialShow: TVShow;
}

export default function TVShowContent({ tvShowId, initialShow }: TVShowContentProps) {
  const [show] = useState<TVShow>(initialShow);
  const [imdbId, setImdbId] = useState<string | null>(null);

  useEffect(() => {
    const fetchImdbId = async () => {
      try {
        const newImdbId = await tvShowsAPI.getImdbId(tvShowId);
        if (newImdbId) {
          setImdbId(newImdbId);
        }
      } catch (err) {
        console.error('Error fetching IMDb ID:', err);
      }
    };
    fetchImdbId();
  }, [tvShowId]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-8">
        <div className="relative w-full h-[450px] rounded-lg overflow-hidden">
          {show.poster_path && (
            <Image
              src={getImageUrl(show.poster_path, 'w500')}
              alt={show.name}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          )}
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">{show.name}</h1>
          <p className="text-gray-300 leading-relaxed mb-4">{show.overview}</p>
          
          <div className="flex-1">
            <div className="mb-2 text-gray-300">
              <span className="text-gray-400 mr-2">Дата выхода:</span>
              <span className="text-white">
                {show.first_air_date ? formatDate(show.first_air_date) : 'Неизвестно'}
              </span>
            </div>
            <div className="mb-2 text-gray-300">
              <span className="text-gray-400 mr-2">Сезонов:</span>
              <span className="text-white">{show.number_of_seasons || 'Неизвестно'}</span>
            </div>
            <div className="mb-2 text-gray-300">
              <span className="text-gray-400 mr-2">Эпизодов:</span>
              <span className="text-white">{show.number_of_episodes || 'Неизвестно'}</span>
            </div>
            <div className="mb-2 text-gray-300">
              <span className="text-gray-400 mr-2">Рейтинг:</span>
              <span className="text-white">{show.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <div className="mt-4">
            <FavoriteButton
              mediaId={tvShowId}
              mediaType="tv"
              title={show.name}
              posterPath={show.poster_path || ''}
              showText={true}
            />
          </div>
        </div>
      </div>

      {imdbId && (
        <div className="relative w-full aspect-video bg-black/30 rounded-lg overflow-hidden">
          <MoviePlayer 
            id={tvShowId}
            imdbId={imdbId} 
            title={show.name}
            poster={show.poster_path || ''}
            isFullscreen={false}
          />
        </div>
      )}
    </div>
  );
}
