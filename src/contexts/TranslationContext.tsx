'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ru, en, type Translation } from '@/locales';

interface TranslationContextType {
  t: Translation;
  locale: 'ru' | 'en';
  setLocale: (locale: 'ru' | 'en') => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  ru,
  en,
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<'ru' | 'en'>('ru');

  useEffect(() => {
    // Читаем язык из localStorage при загрузке
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setLocaleState(settings.interfaceLanguage || 'ru');
        }
      } catch (error) {
        console.error('Error reading translation settings:', error);
      }

      // Слушаем изменения настроек
      const handleSettingsChange = (e: CustomEvent) => {
        if (e.detail?.interfaceLanguage) {
          setLocaleState(e.detail.interfaceLanguage);
        }
      };

      window.addEventListener('settings-changed' as any, handleSettingsChange);
      return () => window.removeEventListener('settings-changed' as any, handleSettingsChange);
    }
  }, []);

  const setLocale = (newLocale: 'ru' | 'en') => {
    setLocaleState(newLocale);
    
    // Обновляем localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('settings');
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        settings.interfaceLanguage = newLocale;
        localStorage.setItem('settings', JSON.stringify(settings));
        
        // Диспатчим событие для синхронизации
        window.dispatchEvent(new CustomEvent('settings-changed', { detail: settings }));
      } catch (error) {
        console.error('Error saving language:', error);
      }
    }
  };

  const t = translations[locale] || translations.ru;

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
