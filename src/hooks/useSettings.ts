'use client';

import { useState, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  notifications: boolean;
  defaultPlayer: 'alloha' | 'collaps' | 'lumex';
}

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'ru',
  notifications: true,
  defaultPlayer: 'alloha',
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
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  }, [settings, isInitialized]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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
