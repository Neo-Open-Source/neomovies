'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import type { TVShowDetails } from '@/lib/api';
import MoviePlayer from '@/components/MoviePlayer';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const ShowInfo = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const InfoContent = styled.div`
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Overview = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  span {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  padding-top: 1rem;
`;

const PlayerSection = styled(Section)`
  margin-top: 2rem;
  min-height: 500px;
`;

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const CastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CastCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CastImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 225px;
`;

const CastInfo = styled.div`
  padding: 0.75rem;
`;

const CastName = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: white;
`;

const Character = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

interface TVShowContentProps {
  tvShowId: string;
  initialShow: TVShowDetails;
}

export default function TVShowContent({ tvShowId, initialShow }: TVShowContentProps) {
  const [show] = useState<TVShowDetails>(initialShow);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <ShowInfo>
        <PosterContainer>
          {show.poster_path && (
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
        </PosterContainer>

        <InfoContent>
          <Title>{show.name}</Title>
          <Overview>{show.overview}</Overview>

          <Stats>
            <StatItem>
              <span>Дата выхода: </span>
              {formatDate(show.first_air_date)}
            </StatItem>
            <StatItem>
              <span>Сезонов: </span>
              {show.number_of_seasons}
            </StatItem>
            <StatItem>
              <span>Эпизодов: </span>
              {show.number_of_episodes}
            </StatItem>
          </Stats>
        </InfoContent>
      </ShowInfo>

      <PlayerSection>
        <SectionTitle>Смотреть онлайн</SectionTitle>
        <PlayerContainer>
          <MoviePlayer
            id={tvShowId}
            title={show.name}
            poster={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : ''}
            imdbId={show.external_ids?.imdb_id}
          />
        </PlayerContainer>
      </PlayerSection>

      {show.credits.cast.length > 0 && (
        <Section>
          <SectionTitle>В ролях</SectionTitle>
          <CastGrid>
            {show.credits.cast.slice(0, 12).map(actor => (
              <CastCard key={actor.id}>
                <CastImageContainer>
                  <Image
                    src={actor.profile_path
                      ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                      : '/placeholder.png'}
                    alt={actor.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </CastImageContainer>
                <CastInfo>
                  <CastName>{actor.name}</CastName>
                  <Character>{actor.character}</Character>
                </CastInfo>
              </CastCard>
            ))}
          </CastGrid>
        </Section>
      )}
    </Container>
  );
}
