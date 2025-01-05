'use client';

import styled from 'styled-components';
import PageLayout from '@/components/PageLayout';
import TVShowContent from './TVShowContent';
import type { TVShow } from '@/types/movie';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0 24px;
`;

interface TVShowPageProps {
  tvShowId: string;
  show: TVShow | null;
}

export default function TVShowPage({ tvShowId, show }: TVShowPageProps) {
  if (!show) {
    return (
      <PageLayout>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Сериал не найден</h1>
            <p className="text-gray-400">К сожалению, запрашиваемый сериал не существует или был удален.</p>
          </div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container>
        <TVShowContent tvShowId={tvShowId} initialShow={show} />
      </Container>
    </PageLayout>
  );
}