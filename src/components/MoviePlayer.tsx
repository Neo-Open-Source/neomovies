'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSettings } from '@/hooks/useSettings';
import { moviesAPI, api } from '@/lib/api';

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const StyledIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`;

const ErrorContainer = styled.div`
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  background: #3b82f6;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const DownloadMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(13, 37, 73, 0.8);
  border: 1px solid rgba(33, 150, 243, 0.2);
  border-radius: 8px;
  color: rgba(33, 150, 243, 0.9);
  font-size: 14px;
  backdrop-filter: blur(10px);

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

interface MoviePlayerProps {
  id: string;
  title: string;
  poster: string;
  imdbId?: string;
}

export default function MoviePlayer({ id, title, poster, imdbId }: MoviePlayerProps) {
  const { settings, isInitialized } = useSettings();
  // containerRef removed – using direct iframe integration
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [resolvedImdb, setResolvedImdb] = useState<string | null>(imdbId ?? null);

  useEffect(() => {
    if (isInitialized) {
      // setCurrentPlayer(settings.defaultPlayer);
    }
  }, [settings.defaultPlayer, isInitialized]);

  useEffect(() => {
    const fetchImdbId = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!imdbId) {
          const { data } = await moviesAPI.getMovie(id);
          if (!data?.imdb_id) {
            throw new Error('IMDb ID не найден');
          }
          setResolvedImdb(data.imdb_id);
        }
      } catch (err) {
        console.error('Error fetching IMDb ID:', err);
        setError('Не удалось загрузить плеер. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (!resolvedImdb) {
      fetchImdbId();
    }
  }, [id, resolvedImdb]);

  useEffect(() => {
    const loadPlayer = async () => {
      if (!isInitialized || !resolvedImdb) return;
      try {
        setLoading(true);
        setError(null);

        const basePath = settings.defaultPlayer === 'alloha' ? '/players/alloha' : '/players/lumex';
        const queryParams = { imdb_id: resolvedImdb };

        try {
          const response = await api.get(basePath, { params: queryParams });
          if (!response.data) {
            throw new Error('Empty response');
          }

          let src: string | null = null;
          if (response.data.iframe) {
            src = response.data.iframe;
          } else if (response.data.src) {
            src = response.data.src;
          } else if (response.data.url) {
            src = response.data.url;
          } else if (typeof response.data === 'string') {
            const match = response.data.match(/<iframe[^>]*src="([^"]+)"/i);
            if (match && match[1]) src = match[1];
          }
          if (!src) {
            throw new Error('Invalid response format');
          }
          setIframeSrc(src);
        } catch (err) {
          console.error(err);
          setError('Не удалось загрузить плеер. Попробуйте позже.');
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить плеер. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [id, resolvedImdb, isInitialized, settings.defaultPlayer]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    setLoading(false);
  };

  if (error) {
    return (
      <ErrorContainer>
        <div>{error}</div>
        <RetryButton onClick={handleRetry}>Попробовать снова</RetryButton>
      </ErrorContainer>
    );
  }

  return (
    <>
      <PlayerContainer>
        {iframeSrc ? (
          <StyledIframe src={iframeSrc} allow="fullscreen" loading="lazy" />
        ) : (
          loading && <LoadingContainer>Загрузка плеера...</LoadingContainer>
        )}
      </PlayerContainer>
      {settings.defaultPlayer !== 'lumex' && (
        <DownloadMessage>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Для возможности скачивания фильма выберите плеер Lumex в настройках
        </DownloadMessage>
      )}

    </>
  );
}
