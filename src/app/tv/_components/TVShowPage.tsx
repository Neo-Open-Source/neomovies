'use client';

import PageLayout from '@/components/PageLayout';
import TVShowContent from './TVShowContent';
import type { TVShow } from '@/types/movie';

interface TVShowPageProps {
  showId: string;
  show: TVShow | null;
}

export default function TVShowPage({ showId, show }: TVShowPageProps) {
  if (!show) {
    return (
      <PageLayout>
        <div className="w-full min-h-screen">
          <div>Сериал не найден</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="w-full">
        <TVShowContent tvShowId={showId} initialShow={show} />
      </div>
    </PageLayout>
  );
}