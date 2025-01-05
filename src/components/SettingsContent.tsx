"use client";

import { useSettings } from '@/hooks/useSettings';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: white;
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const PlayerCard = styled.div<{ $isSelected: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid ${props => props.$isSelected ? '#2196f3' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const PlayerName = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
`;

const PlayerDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
`;

const SaveButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1976d2;
  }
`;

export default function SettingsContent() {
  const { settings, updateSettings } = useSettings();
  const router = useRouter();

  const players = [
    {
      id: 'alloha',
      name: 'Alloha',
      description: 'Основной плеер с высоким качеством',
    },
    {
      id: 'collaps',
      name: 'Collaps',
      description: 'Альтернативный плеер с хорошей стабильностью',
    },
    {
      id: 'lumex',
      name: 'Lumex',
      description: 'Плеер с возможностью скачивания фильмов',
    },
  ];

  const handlePlayerSelect = (playerId: string) => {
    updateSettings({ defaultPlayer: playerId as 'alloha' | 'collaps' | 'lumex' });
    // Возвращаемся на предыдущую страницу
    window.history.back();
  };

  return (
    <Container>
      <Title>Настройки плеера</Title>
      <PlayersList>
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            $isSelected={settings.defaultPlayer === player.id}
            onClick={() => handlePlayerSelect(player.id)}
          >
            <PlayerName>{player.name}</PlayerName>
            <PlayerDescription>{player.description}</PlayerDescription>
          </PlayerCard>
        ))}
      </PlayersList>
    </Container>
  );
}
