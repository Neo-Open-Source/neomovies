'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSettings } from '@/hooks/useSettings';
import { moviesAPI } from '@/lib/api';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(settings.defaultPlayer);

  useEffect(() => {
    if (isInitialized) {
      setCurrentPlayer(settings.defaultPlayer);
    }
  }, [settings.defaultPlayer, isInitialized]);

  useEffect(() => {
    const fetchImdbId = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!imdbId) {
          const newImdbId = await moviesAPI.getImdbId(id);
          if (!newImdbId) {
            throw new Error('IMDb ID не найден');
          }
          imdbId = newImdbId;
        }
      } catch (err) {
        console.error('Error fetching IMDb ID:', err);
        setError('Не удалось загрузить плеер. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchImdbId();
  }, [id, imdbId]);

  useEffect(() => {
    if (settings.defaultPlayer === 'lumex') {
      return;
    }

    // Очищаем контейнер при изменении плеера
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const playerDiv = document.createElement('div');
    playerDiv.className = 'kinobox_player';
    containerRef.current?.appendChild(playerDiv);

    const script = document.createElement('script');
    script.src = 'https://kinobox.tv/kinobox.min.js';
    script.async = true;

    script.onload = () => {
      if (window.kbox && containerRef.current) {
        const playerConfig = {
          search: {
            imdb: imdbId,
            title: title
          },
          menu: {
            enable: false,
            default: 'menu_list',
            mobile: 'menu_button',
            format: '{N} :: {T} ({Q})',
            limit: 5,
            open: false,
          },
          notFoundMessage: 'Видео не найдено.',
          players: {
            alloha: { enable: settings.defaultPlayer === 'alloha', position: 1 },
            collaps: { enable: settings.defaultPlayer === 'collaps', position: 2 },
            lumex: { enable: settings.defaultPlayer === 'lumex', position: 3 }
          },
          params: {
            all: {
              poster: poster
            }
          }
        };

        window.kbox('.kinobox_player', playerConfig);
        setLoading(false);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      const existingScript = document.querySelector('script[src="https://kinobox.tv/kinobox.min.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [id, title, poster, imdbId, settings.defaultPlayer]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
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
        {settings.defaultPlayer === 'lumex' && imdbId ? (
          <StyledIframe
            src={`${process.env.NEXT_PUBLIC_LUMEX_URL}?imdb_id=${imdbId}`}
            allow="fullscreen"
            loading="lazy"
          />
        ) : (
          <>
            <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute' }} />
            {loading && <LoadingContainer>Загрузка плеера...</LoadingContainer>}
          </>
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
