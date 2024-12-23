'use client';

import styled from 'styled-components';
import PageLayout from '@/components/PageLayout';
import MovieContent from './MovieContent';
import type { MovieDetails } from '@/lib/api';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 0 24px;
`;

interface MoviePageProps {
  movieId: string;
  movie: MovieDetails | null;
}

export default function MoviePage({ movieId, movie }: MoviePageProps) {
  if (!movie) {
    return (
      <PageLayout>
        <Container>
          <div>Фильм не найден</div>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container>
        <MovieContent movieId={movieId} initialMovie={movie} />
      </Container>
    </PageLayout>
  );
}
