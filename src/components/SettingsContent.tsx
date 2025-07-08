"use client";

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsContent() {
  const { settings, updateSettings } = useSettings();
  
  const players = [
    {
      id: 'alloha',
      name: 'Alloha',
      description: 'Основной плеер с высоким качеством и быстрой загрузкой.',
    },
    {
      id: 'lumex',
      name: 'Lumex',
      description: 'Альтернативный плеер, может быть полезен при проблемах с основным.',
    },
  ];

  const handlePlayerSelect = (playerId: string) => {
    updateSettings({ defaultPlayer: playerId as 'alloha' | 'lumex' });
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Настройки плеера</h2>
        <p className="text-muted-foreground mb-6">Выберите плеер, который будет использоваться по умолчанию для просмотра.</p>
        <div className="space-y-4">
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => handlePlayerSelect(player.id)}
              className={`rounded-lg p-4 cursor-pointer border-2 transition-all ${
                settings.defaultPlayer === player.id
                  ? 'border-accent bg-accent/10'
                  : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
              }`}
            >
              <h3 className="font-semibold text-foreground">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
