'use client';

import { useState, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  interfaceLanguage: 'ru' | 'en';
  notifications: boolean;
  defaultPlayer: 'alloha' | 'lumex' | 'vibix' | 'vidsrc' | 'vidlink' | 'hdvb';
}

// Определяем язык браузера
const detectBrowserLanguage = (): 'ru' | 'en' => {
  if (typeof window === 'undefined') return 'ru';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // Если язык начинается с 'ru', используем русский
  if (browserLang.startsWith('ru')) return 'ru';
  
  // Для всех остальных - английский
  return 'en';
};

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'ru',
  interfaceLanguage: detectBrowserLanguage(),
  notifications: true,
  defaultPlayer: 'alloha',
};

// Определяем плееры для русского и английского языка
export const getAvailablePlayers = (language: 'ru' | 'en') => {
  const russianPlayers = ['alloha', 'lumex', 'vibix', 'hdvb'];
  const englishPlayers = ['vidsrc', 'vidlink'];
  
  return language === 'ru' ? russianPlayers : englishPlayers;
};

export const getDefaultPlayerForLanguage = (language: 'ru' | 'en') => {
  return language === 'ru' ? 'alloha' : 'vidsrc';
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...defaultSettings, ...parsedSettings }));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('settings', JSON.stringify(settings));
        // Диспатчим событие для моментального обновления переводов
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('settings-changed', { detail: settings }));
        }
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  }, [settings, isInitialized]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Если изменился язык, обновляем плеер на подходящий для этого языка
      if (newSettings.language && newSettings.language !== prev.language) {
        const availablePlayers = getAvailablePlayers(newSettings.language);
        if (!availablePlayers.includes(updated.defaultPlayer)) {
          updated.defaultPlayer = getDefaultPlayerForLanguage(newSettings.language) as any;
        }
      }
      
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isInitialized,
  };
}