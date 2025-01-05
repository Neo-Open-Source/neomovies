'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { favoritesAPI } from '@/lib/favoritesApi';
import { getImageUrl } from '@/lib/neoApi';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
`;

const Card = styled(Link)`
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s;
  text-decoration: none;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Poster = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  overflow: hidden;

  img {
    object-fit: cover;
  }
`;

const Info = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`;

const MediaTitle = styled.h2`
  font-size: 1rem;
  color: white;
  margin: 0;
`;

const MediaType = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 4rem 0;
`;

interface Favorite {
  id: number;
  mediaId: string;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await favoritesAPI.getFavorites();
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user]);

  if (loading) {
    return (
      <Container>
        <Title>Избранное</Title>
        <EmptyState>Загрузка...</EmptyState>
      </Container>
    );
  }

  if (!session?.user) {
    return (
      <Container>
        <Title>Избранное</Title>
        <EmptyState>
          Для доступа к избранному необходимо авторизоваться
        </EmptyState>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container>
        <Title>Избранное</Title>
        <EmptyState>
          У вас пока нет избранных фильмов и сериалов
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Избранное</Title>
      <Grid>
        {favorites.map(favorite => (
          <Card
            key={`${favorite.mediaType}-${favorite.mediaId}`}
            href={`/${favorite.mediaType === 'movie' ? 'movie' : 'tv'}/${favorite.mediaId}`}
          >
            <Poster>
              <Image
                src={favorite.posterPath ? getImageUrl(favorite.posterPath) : '/images/placeholder.jpg'}
                alt={favorite.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                unoptimized
              />
            </Poster>
            <Info>
              <MediaTitle>{favorite.title}</MediaTitle>
              <MediaType>{favorite.mediaType === 'movie' ? 'Фильм' : 'Сериал'}</MediaType>
            </Info>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
