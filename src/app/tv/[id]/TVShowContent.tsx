import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import type { TVShow } from '@/types/movie';
import { tvShowsAPI, getImageUrl } from '@/lib/neoApi';
import MoviePlayer from '@/components/MoviePlayer';
import FavoriteButton from '@/components/FavoriteButton';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Info = styled.div`
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
`;

const Overview = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Details = styled.div`
  flex: 1;
`;

const DetailItem = styled.div`
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Label = styled.span`
  color: rgba(255, 255, 255, 0.6);
  margin-right: 0.5rem;
`;

const Value = styled.span`
  color: white;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const parseRussianDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  const months: { [key: string]: number } = {
    'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
    'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
    'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
  };

  const match = dateStr.match(/(\d+)\s+([а-яё]+)\s+(\d{4})/i);
  if (!match) return null;

  const [, day, month, year] = match;
  const monthIndex = months[month.toLowerCase()];
  
  if (monthIndex === undefined) return null;
  
  return new Date(parseInt(year), monthIndex, parseInt(day));
};

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
    <Container>
      <Content>
        <PosterContainer>
          {show.poster_path && (
            <Image
              src={getImageUrl(show.poster_path, 'w500')}
              alt={show.name}
              width={300}
              height={450}
              priority
            />
          )}
        </PosterContainer>

        <Info>
          <Title>{show.name}</Title>
          <Overview>{show.overview}</Overview>
          
          <Details>
            <DetailItem>
              <Label>Дата выхода:</Label>
              <Value>
                {show.first_air_date ? 
                  (parseRussianDate(show.first_air_date)?.toLocaleDateString('ru-RU') || 'Неизвестно')
                  : 'Неизвестно'
                }
              </Value>
            </DetailItem>
            <DetailItem>
              <Label>Сезонов:</Label>
              <Value>{show.number_of_seasons || 'Неизвестно'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Эпизодов:</Label>
              <Value>{show.number_of_episodes || 'Неизвестно'}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Рейтинг:</Label>
              <Value>{show.vote_average.toFixed(1)}</Value>
            </DetailItem>
          </Details>

          <ButtonContainer>
            <FavoriteButton
              mediaId={tvShowId}
              mediaType="tv"
              title={show.name}
              posterPath={show.poster_path || ''}
            />
          </ButtonContainer>
        </Info>
      </Content>

      {imdbId && (
        <PlayerContainer>
          <MoviePlayer 
            imdbId={imdbId} 
            backdrop={show.backdrop_path ? getImageUrl(show.backdrop_path, 'original') : undefined}
          />
        </PlayerContainer>
      )}
    </Container>
  );
}
