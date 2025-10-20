"use client";

import { useState, useEffect } from 'react';
import { useSettings, getAvailablePlayers } from '@/hooks/useSettings';
import { useTranslation } from '@/contexts/TranslationContext';
import { Globe, AlertTriangle } from 'lucide-react';

export default function SettingsContent() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  
  const allPlayers = {
    alloha: {
      id: 'alloha',
      name: 'Alloha',
      description: 'Основной плеер с высоким качеством и быстрой загрузкой.',
      language: 'ru',
    },
    lumex: {
      id: 'lumex',
      name: 'Lumex',
      description: 'Альтернативный плеер, может быть полезен при проблемах с основным.',
      language: 'ru',
    },
    vibix: {
      id: 'vibix',
      name: 'Vibix',
      description: 'Современный плеер с адаптивным качеством и стабильной работой.',
      language: 'ru',
    },
    hdvb: {
      id: 'hdvb',
      name: 'HDVB',
      description: 'Плеер с поддержкой Kinopoisk ID и русской озвучкой.',
      language: 'ru',
    },
    vidsrc: {
      id: 'vidsrc',
      name: 'Vidsrc',
      description: 'Популярный плеер с большой базой контента и множеством источников.',
      language: 'en',
    },
    vidlink: {
      id: 'vidlink',
      name: 'Vidlink',
      description: 'Стабильный плеер с надежной работой и хорошим качеством.',
      language: 'en',
    },
  };

  const availablePlayerIds = getAvailablePlayers(settings.language);
  const players = availablePlayerIds
    .map(id => allPlayers[id as keyof typeof allPlayers])
    .filter(player => player !== undefined);

  const handlePlayerSelect = (playerId: string) => {
    updateSettings({ defaultPlayer: playerId as any });
  };

  const handleInterfaceLanguageChange = (interfaceLanguage: 'ru' | 'en') => {
    updateSettings({ interfaceLanguage });
  };

  const handlePlayerLanguageChange = (language: 'ru' | 'en') => {
    updateSettings({ language });
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Interface Language Selection */}
      <div className="bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-foreground">{t.settings.language}</h2>
        </div>
        <p className="text-muted-foreground mb-6">{t.settings.languageDescription}</p>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => handleInterfaceLanguageChange('ru')}
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all text-center ${
              settings.interfaceLanguage === 'ru'
                ? 'border-accent bg-accent/10'
                : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
            }`}
          >
            <h3 className="font-semibold text-foreground">{t.settings.russian}</h3>
          </div>
          <div
            onClick={() => handleInterfaceLanguageChange('en')}
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all text-center ${
              settings.interfaceLanguage === 'en'
                ? 'border-accent bg-accent/10'
                : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
            }`}
          >
            <h3 className="font-semibold text-foreground">{t.settings.english}</h3>
          </div>
        </div>
      </div>

      {/* Player Language Selection */}
      <div className="bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">{t.settings.playerLanguage}</h2>
        <p className="text-muted-foreground mb-6">{t.settings.playerLanguageDescription}</p>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => handlePlayerLanguageChange('ru')}
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all text-center ${
              settings.language === 'ru'
                ? 'border-accent bg-accent/10'
                : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
            }`}
          >
            <h3 className="font-semibold text-foreground">{t.settings.russian}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.settings.russianPlayers}</p>
          </div>
          <div
            onClick={() => handlePlayerLanguageChange('en')}
            className={`rounded-lg p-4 cursor-pointer border-2 transition-all text-center ${
              settings.language === 'en'
                ? 'border-accent bg-accent/10'
                : 'border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-800 hover:border-accent/50'
            }`}
          >
            <h3 className="font-semibold text-foreground">{t.settings.english}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.settings.englishPlayers}</p>
          </div>
        </div>
        
        {/* AdBlocker Warning for English Players */}
        {settings.language === 'en' && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                  {t.settings.adBlockerWarning}
                </h3>
                <p className="text-yellow-800 dark:text-yellow-300 text-sm mb-2">
                  {t.settings.adBlockerText}
                </p>
                <p className="text-yellow-800 dark:text-yellow-300 text-sm font-semibold">
                  {t.settings.adBlockerRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Selection */}
      <div className="bg-warm-50 dark:bg-warm-900 rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-xl font-bold text-foreground mb-4">{t.settings.playerSettings}</h2>
        <p className="text-muted-foreground mb-6">{t.settings.playerSettingsDescription}</p>
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
              <h3 className="font-semibold text-foreground mb-2">{player.name}</h3>
              <p className="text-sm text-muted-foreground">{player.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
