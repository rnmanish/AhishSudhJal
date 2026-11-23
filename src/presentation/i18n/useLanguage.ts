'use client';

import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { SupportedLanguage } from '../../core/domain/value-objects/Language';
import { Language } from '../../core/domain/value-objects/Language';
import type { IPreferenceRepository } from '../../core/domain/repositories/IPreferenceRepository';
import { ContainerContext } from '../../infrastructure/di/AppProviders';
import type { AppTranslations } from './translations';
import {
  DEFAULT_LANGUAGE,
  getTranslations,
  isSupportedLanguage,
} from './translations';

export interface UseLanguageReturn {
  readonly language: SupportedLanguage;
  readonly languageObj: Language;
  readonly isHindi: boolean;
  readonly isEnglish: boolean;
  readonly setLanguage: (newLang: SupportedLanguage | Language | string) => void;
  readonly toggleLanguage: () => void;
  readonly t: AppTranslations;
}

export const LanguageContext = createContext<UseLanguageReturn | null>(null);

export interface LanguageProviderProps {
  readonly children?: ReactNode;
  readonly initialLanguage?: SupportedLanguage | Language;
  readonly preferenceRepository?: IPreferenceRepository;
}

/**
 * Normalizes input language representations into a valid SupportedLanguage ('hi' | 'en').
 */
export function normalizeLanguage(input: SupportedLanguage | Language | string): SupportedLanguage {
  if (input instanceof Language) {
    return input.getCode();
  }
  const normalized = String(input).trim().toLowerCase();
  if (isSupportedLanguage(normalized)) {
    return normalized;
  }
  throw new Error(`Unsupported language code: "${input}". Supported codes are 'hi' and 'en'.`);
}

/**
 * LanguageProvider manages bilingual application state (Hindi-first).
 * Integrates with IPreferenceRepository via props or ContainerContext DI,
 * persists user choice across sessions, and ensures SSR hydration safety.
 */
export function LanguageProvider({
  children,
  initialLanguage,
  preferenceRepository: explicitPreferenceRepo,
}: LanguageProviderProps): JSX.Element {
  const containerContext = useContext(ContainerContext);
  const preferenceRepo = explicitPreferenceRepo ?? containerContext?.preferenceRepository;

  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    if (initialLanguage) {
      return normalizeLanguage(initialLanguage);
    }
    return DEFAULT_LANGUAGE;
  });

  // Client-side hydration sync with persisted preference
  useEffect(() => {
    if (!preferenceRepo) {
      return;
    }
    try {
      const savedLang = preferenceRepo.getLanguage();
      if (savedLang && isSupportedLanguage(savedLang) && savedLang !== currentLang) {
        setCurrentLang(savedLang);
      }
    } catch {
      // Graceful fallback for restricted storage environments
    }
  }, [preferenceRepo, currentLang]);

  // Synchronize document lang attribute with active language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);

  const handleSetLanguage = useCallback(
    (newLangInput: SupportedLanguage | Language | string) => {
      const nextLang = normalizeLanguage(newLangInput);
      setCurrentLang(nextLang);

      if (preferenceRepo) {
        try {
          preferenceRepo.setLanguage(nextLang);
        } catch {
          // Graceful fallback
        }
      }

      if (typeof document !== 'undefined') {
        document.documentElement.lang = nextLang;
      }
    },
    [preferenceRepo]
  );

  const handleToggleLanguage = useCallback(() => {
    handleSetLanguage(currentLang === 'hi' ? 'en' : 'hi');
  }, [currentLang, handleSetLanguage]);

  const contextValue: UseLanguageReturn = useMemo(() => {
    const langObj = currentLang === 'hi' ? Language.hindi() : Language.english();
    return {
      language: currentLang,
      languageObj: langObj,
      isHindi: currentLang === 'hi',
      isEnglish: currentLang === 'en',
      setLanguage: handleSetLanguage,
      toggleLanguage: handleToggleLanguage,
      t: getTranslations(currentLang),
    };
  }, [currentLang, handleSetLanguage, handleToggleLanguage]);

  return React.createElement(LanguageContext.Provider, { value: contextValue }, children);
}

/**
 * Hook to access active language state, dictionary, and toggle operations.
 * Throws a descriptive error if accessed outside of a LanguageProvider.
 */
export function useLanguage(): UseLanguageReturn {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }
  return context;
}

/**
 * Convenience hook to access the active translation dictionary directly.
 */
export function useTranslations(): AppTranslations {
  return useLanguage().t;
}
