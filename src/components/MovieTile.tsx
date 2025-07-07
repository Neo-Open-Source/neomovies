"use client";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/neoApi";
import { formatDate } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";

export interface MovieLike {
  id: number;
  poster_path: string | null;
  title: string;
  release_date?: string;
  vote_average?: number;
}

export default function MovieTile({ movie }: { movie: MovieLike }) {
  const fullDate = movie.release_date ? formatDate(movie.release_date) : "";
  return (
    <div className="w-full flex-shrink-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800 shadow-sm">
        <Link href={`/movie/${movie.id}`}>
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path, "w342")}
              alt={movie.title}
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
            mediaId={movie.id.toString()}
            mediaType="movie"
            title={movie.title}
            posterPath={movie.poster_path}
          />
        </div>
      </div>
      <Link href={`/movie/${movie.id}`} className="mt-2 block text-sm font-medium leading-snug text-foreground hover:text-accent">
        {movie.title}
      </Link>
      <span className="text-xs text-muted-foreground">
        {fullDate} {movie.vote_average ? `· ${movie.vote_average.toFixed(1)}` : ""}
      </span>
    </div>
  );
}
