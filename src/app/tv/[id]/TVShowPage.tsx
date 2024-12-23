'use client';

import styled from 'styled-components';
import PageLayout from '@/components/PageLayout';
import TVShowContent from './TVShowContent';
import type { TVShowDetails } from '@/lib/api';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0 24px;
`;

interface TVShowPageProps {
  tvShowId: string;
  show: TVShowDetails | null;
}

export default function TVShowPage({ tvShowId, show }: TVShowPageProps) {
  if (!show) {
    return (
      <PageLayout>
        <Container>
          <div>Сериал не найден</div>
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