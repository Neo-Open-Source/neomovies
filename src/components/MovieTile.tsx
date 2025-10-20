"use client";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl as getImageUrlOriginal } from "@/lib/neoApi";
import { formatDate } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import { unifyMovieData, formatRating, getImageUrl } from '@/lib/dataUtils';
import { useTranslation } from '@/contexts/TranslationContext';

export interface MovieLike {
  id: number;
  poster_path: string | null;
  title: string;
  release_date?: string;
  vote_average?: number;
}

export default function MovieTile({ movie }: { movie: MovieLike }) {
  const { locale } = useTranslation();
  const unified = unifyMovieData(movie);
  const fullDate = unified.releaseDate ? formatDate(unified.releaseDate) : "";
  const posterUrl = getImageUrl(unified.posterPath, "w342");
  const rating = formatRating(unified.voteAverage);
  
  const idType = locale === 'ru' ? 'kp' : 'tmdb';
  
  return (
    <div className="w-full flex-shrink-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800 shadow-sm">
        <Link href={`/movie/${idType}_${unified.id}`}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={unified.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              no image
            </div>
          )}
        </Link>
        <div className="absolute right-1 top-1 z-10">
          <FavoriteButton
            mediaId={unified.id.toString()}
            mediaType={unified.isSerial ? "tv" : "movie"}
            title={unified.title}
            posterPath={unified.posterPath}
          />
        </div>
      </div>
      <Link href={`/movie/${idType}_${unified.id}`} className="mt-2 block text-sm font-medium leading-snug text-foreground hover:text-accent">
        {unified.title}
      </Link>
      <span className="text-xs text-muted-foreground">
        {fullDate} {rating !== '—' ? `· ${rating}` : ""}
      </span>
    </div>
  );
}
