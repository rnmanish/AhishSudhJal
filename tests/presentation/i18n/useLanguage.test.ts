import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  LanguageProvider,
  useLanguage,
  useTranslations,
  normalizeLanguage,
} from '../../../src/presentation/i18n/useLanguage';
import type { UseLanguageReturn } from '../../../src/presentation/i18n/useLanguage';
import { Language } from '../../../src/core/domain/value-objects/Language';
import type { IPreferenceRepository } from '../../../src/core/domain/repositories/IPreferenceRepository';
import {
  hiTranslations,
  enTranslations,
} from '../../../src/presentation/i18n/translations';
import { ContainerProvider } from '../../../src/infrastructure/di/AppProviders';
import { createAppContainer } from '../../../src/infrastructure/di/container';

describe('useLanguage Hook & LanguageProvider (useLanguage.ts)', () => {
  describe('normalizeLanguage Helper', () => {
    it('should return valid supported language codes directly', () => {
      expect(normalizeLanguage('hi')).toBe('hi');
      expect(normalizeLanguage('en')).toBe('en');
    });

    it('should normalize uppercase and whitespace variants', () => {
      expect(normalizeLanguage('HI')).toBe('hi');
      expect(normalizeLanguage('  en  ')).toBe('en');
      expect(normalizeLanguage('Hi ')).toBe('hi');
    });

    it('should resolve Language value objects correctly', () => {
      expect(normalizeLanguage(Language.hindi())).toBe('hi');
      expect(normalizeLanguage(Language.english())).toBe('en');
    });

    it('should throw domain error for unsupported language codes', () => {
      expect(() => normalizeLanguage('fr')).toThrow(
        'Unsupported language code: "fr". Supported codes are \'hi\' and \'en\'.'
      );
      expect(() => normalizeLanguage('es')).toThrow(
        'Unsupported language code: "es". Supported codes are \'hi\' and \'en\'.'
      );
      expect(() => normalizeLanguage('')).toThrow(
        'Unsupported language code: "". Supported codes are \'hi\' and \'en\'.'
      );
    });
  });

  describe('Context Error Boundaries (Outside Provider)', () => {
    it('should throw descriptive error when useLanguage is called outside LanguageProvider', () => {
      function NakedLanguageConsumer() {
        useLanguage();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedLanguageConsumer))).toThrow(
        'useLanguage must be used within a LanguageProvider.'
      );
    });

    it('should throw descriptive error when useTranslations is called outside LanguageProvider', () => {
      function NakedTranslationsConsumer() {
        useTranslations();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedTranslationsConsumer))).toThrow(
        'useLanguage must be used within a LanguageProvider.'
      );
    });
  });

  describe('LanguageProvider Default State (Hindi-First)', () => {
    it('should default to Hindi ("hi") with full dictionary and value object parity', () => {
      let captured: UseLanguageReturn | null = null;
      let capturedTranslations = null;

      function Consumer() {
        captured = useLanguage();
        capturedTranslations = useTranslations();
        return React.createElement('div', null, captured.t.brand.name);
      }

      const html = renderToStaticMarkup(
        React.createElement(LanguageProvider, null, React.createElement(Consumer))
      );

      expect(html).toContain('आशीष शुद्ध जल');
      expect(captured).not.toBeNull();
      const value = captured as unknown as UseLanguageReturn;
      expect(value.language).toBe('hi');
      expect(value.isHindi).toBe(true);
      expect(value.isEnglish).toBe(false);
      expect(value.languageObj.getCode()).toBe('hi');
      expect(value.languageObj.isHindi()).toBe(true);
      expect(value.t).toBe(hiTranslations);
      expect(capturedTranslations).toBe(hiTranslations);
    });
  });

  describe('LanguageProvider Initial Language Overrides', () => {
    it('should initialize with English when string "en" is passed to initialLanguage', () => {
      let captured: UseLanguageReturn | null = null;

      function Consumer() {
        captured = useLanguage();
        return React.createElement('div', null, captured.t.brand.name);
      }

      const html = renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'en' },
          React.createElement(Consumer)
        )
      );

      expect(html).toContain('Ashish Sudh Jal');
      expect(captured).not.toBeNull();
      const value = captured as unknown as UseLanguageReturn;
      expect(value.language).toBe('en');
      expect(value.isHindi).toBe(false);
      expect(value.isEnglish).toBe(true);
      expect(value.languageObj.getCode()).toBe('en');
      expect(value.t).toBe(enTranslations);
    });

    it('should initialize with Language.english() value object', () => {
      let captured: UseLanguageReturn | null = null;

      function Consumer() {
        captured = useLanguage();
        return React.createElement('div', null, captured.language);
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: Language.english() },
          React.createElement(Consumer)
        )
      );

      expect(captured).not.toBeNull();
      const value = captured as unknown as UseLanguageReturn;
      expect(value.language).toBe('en');
    });

    it('should throw error when invalid initialLanguage is provided', () => {
      function Consumer() {
        useLanguage();
        return null;
      }

      expect(() =>
        renderToStaticMarkup(
          React.createElement(
            LanguageProvider,
            { initialLanguage: 'de' as any },
            React.createElement(Consumer)
          )
        )
      ).toThrow('Unsupported language code: "de". Supported codes are \'hi\' and \'en\'.');
    });
  });

  describe('Context Operations: setLanguage & toggleLanguage', () => {
    it('should invoke preferenceRepository.setLanguage when setLanguage is called', () => {
      let captured: UseLanguageReturn | null = null;
      const mockSetLang = vi.fn();
      const mockRepo: IPreferenceRepository = {
        getLanguage: () => 'hi',
        setLanguage: mockSetLang,
        getSavedCustomerDetails: () => null,
        saveCustomerDetails: () => {},
        clearCustomerDetails: () => {},
        clearPreferences: () => {},
      };

      function Consumer() {
        captured = useLanguage();
        return null;
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { preferenceRepository: mockRepo },
          React.createElement(Consumer)
        )
      );

      expect(captured).not.toBeNull();
      const value = captured as unknown as UseLanguageReturn;

      value.setLanguage('en');
      expect(mockSetLang).toHaveBeenCalledWith('en');

      value.setLanguage(Language.hindi());
      expect(mockSetLang).toHaveBeenCalledWith('hi');
    });

    it('should toggle from Hindi to English and call preference repository', () => {
      let captured: UseLanguageReturn | null = null;
      const mockSetLang = vi.fn();
      const mockRepo: IPreferenceRepository = {
        getLanguage: () => 'hi',
        setLanguage: mockSetLang,
        getSavedCustomerDetails: () => null,
        saveCustomerDetails: () => {},
        clearCustomerDetails: () => {},
        clearPreferences: () => {},
      };

      function Consumer() {
        captured = useLanguage();
        return null;
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi', preferenceRepository: mockRepo },
          React.createElement(Consumer)
        )
      );

      const value = captured as unknown as UseLanguageReturn;
      value.toggleLanguage();
      expect(mockSetLang).toHaveBeenCalledWith('en');
    });

    it('should toggle from English to Hindi when current is English', () => {
      let captured: UseLanguageReturn | null = null;
      const mockSetLang = vi.fn();
      const mockRepo: IPreferenceRepository = {
        getLanguage: () => 'en',
        setLanguage: mockSetLang,
        getSavedCustomerDetails: () => null,
        saveCustomerDetails: () => {},
        clearCustomerDetails: () => {},
        clearPreferences: () => {},
      };

      function Consumer() {
        captured = useLanguage();
        return null;
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'en', preferenceRepository: mockRepo },
          React.createElement(Consumer)
        )
      );

      const value = captured as unknown as UseLanguageReturn;
      value.toggleLanguage();
      expect(mockSetLang).toHaveBeenCalledWith('hi');
    });

    it('should throw descriptive error when setLanguage receives unsupported code', () => {
      let captured: UseLanguageReturn | null = null;

      function Consumer() {
        captured = useLanguage();
        return null;
      }

      renderToStaticMarkup(
        React.createElement(LanguageProvider, null, React.createElement(Consumer))
      );

      const value = captured as unknown as UseLanguageReturn;
      expect(() => value.setLanguage('it')).toThrow(
        'Unsupported language code: "it". Supported codes are \'hi\' and \'en\'.'
      );
    });

    it('should handle preferenceRepository throwing without breaking UI', () => {
      let captured: UseLanguageReturn | null = null;
      const faultyRepo: IPreferenceRepository = {
        getLanguage: () => {
          throw new Error('Storage quota exceeded');
        },
        setLanguage: () => {
          throw new Error('Disk full');
        },
        getSavedCustomerDetails: () => null,
        saveCustomerDetails: () => {},
        clearCustomerDetails: () => {},
        clearPreferences: () => {},
      };

      function Consumer() {
        captured = useLanguage();
        return React.createElement('span', null, 'safe');
      }

      const html = renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { preferenceRepository: faultyRepo },
          React.createElement(Consumer)
        )
      );

      expect(html).toContain('safe');
      const value = captured as unknown as UseLanguageReturn;
      expect(() => value.setLanguage('en')).not.toThrow();
    });
  });

  describe('Container DI Wiring Integration', () => {
    it('should automatically consume preferenceRepository from ContainerProvider context', () => {
      let captured: UseLanguageReturn | null = null;
      const mockSetLang = vi.fn();

      const customRepo: IPreferenceRepository = {
        getLanguage: () => 'hi',
        setLanguage: mockSetLang,
        getSavedCustomerDetails: () => null,
        saveCustomerDetails: () => {},
        clearCustomerDetails: () => {},
        clearPreferences: () => {},
      };

      const customContainer = createAppContainer({
        preferenceRepository: customRepo,
      });

      function Consumer() {
        captured = useLanguage();
        return null;
      }

      renderToStaticMarkup(
        React.createElement(
          ContainerProvider,
          { container: customContainer },
          React.createElement(LanguageProvider, null, React.createElement(Consumer))
        )
      );

      expect(captured).not.toBeNull();
      const value = captured as unknown as UseLanguageReturn;
      value.setLanguage('en');

      expect(mockSetLang).toHaveBeenCalledWith('en');
    });
  });

  describe('DOM Document Attribute Synchronization', () => {
    it('should update document.documentElement.lang when document is defined', () => {
      const mockDoc = {
        documentElement: {
          lang: 'hi',
        },
      };

      (globalThis as any).document = mockDoc;

      try {
        let captured: UseLanguageReturn | null = null;

        const Consumer = () => {
          captured = useLanguage();
          return null;
        };

        renderToStaticMarkup(
          React.createElement(LanguageProvider, null, React.createElement(Consumer))
        );

        const value = captured as unknown as UseLanguageReturn;
        value.setLanguage('en');
        expect(mockDoc.documentElement.lang).toBe('en');

        value.setLanguage('hi');
        expect(mockDoc.documentElement.lang).toBe('hi');
      } finally {
        delete (globalThis as any).document;
      }
    });
  });
});
