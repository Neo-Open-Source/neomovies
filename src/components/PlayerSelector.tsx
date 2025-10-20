'use client';

import { getAvailablePlayers } from '@/hooks/useSettings';

interface PlayerSelectorProps {
  language: 'ru' | 'en';
  selectedPlayer: string;
  onPlayerChange: (player: string) => void;
}

const playerNames: Record<string, string> = {
  alloha: 'Alloha',
  lumex: 'Lumex',
  vibix: 'Vibix',
  vidsrc: 'Vidsrc',
  vidlink: 'Vidlink',
  hdvb: 'HDVB',
};

export default function PlayerSelector({ language, selectedPlayer, onPlayerChange }: PlayerSelectorProps) {
  const availablePlayers = getAvailablePlayers(language);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {availablePlayers.map((playerId) => (
        <button
          key={playerId}
          onClick={() => onPlayerChange(playerId)}
          className={`px-4 py-2 rounded-md font-medium transition-all ${
            selectedPlayer === playerId
              ? 'bg-accent text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {playerNames[playerId]}
        </button>
      ))}
    </div>
  );
}
