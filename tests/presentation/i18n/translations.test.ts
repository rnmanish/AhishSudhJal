import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  getTranslations,
  interpolate,
  hiTranslations,
  enTranslations,
  translations,
} from '../../../src/presentation/i18n/translations';

describe('i18n Translations Engine (translations.ts)', () => {
  describe('Language Constants & Type Guards', () => {
    it('should have Hindi as default language per Fortune 500 Hindi-first specification', () => {
      expect(DEFAULT_LANGUAGE).toBe('hi');
    });

    it('should declare supported languages containing "hi" and "en"', () => {
      expect(SUPPORTED_LANGUAGES).toEqual(['hi', 'en']);
      expect(SUPPORTED_LANGUAGES).toHaveLength(2);
    });

    it('should identify valid supported languages with isSupportedLanguage', () => {
      expect(isSupportedLanguage('hi')).toBe(true);
      expect(isSupportedLanguage('en')).toBe(true);
    });

    it('should reject invalid or unsupported values with isSupportedLanguage', () => {
      expect(isSupportedLanguage('')).toBe(false);
      expect(isSupportedLanguage('fr')).toBe(false);
      expect(isSupportedLanguage('es')).toBe(false);
      expect(isSupportedLanguage('HI')).toBe(false);
      expect(isSupportedLanguage(123)).toBe(false);
      expect(isSupportedLanguage(null)).toBe(false);
      expect(isSupportedLanguage(undefined)).toBe(false);
      expect(isSupportedLanguage({})).toBe(false);
    });
  });

  describe('getTranslations Helper', () => {
    it('should return Hindi translations for "hi"', () => {
      const result = getTranslations('hi');
      expect(result).toBe(hiTranslations);
      expect(result.brand.name).toBe('आशीष शुद्ध जल');
    });

    it('should return English translations for "en"', () => {
      const result = getTranslations('en');
      expect(result).toBe(enTranslations);
      expect(result.brand.name).toBe('Ashish Sudh Jal');
    });

    it('should fallback to Hindi translations for unsupported or empty language strings', () => {
      expect(getTranslations('fr')).toBe(hiTranslations);
      expect(getTranslations('')).toBe(hiTranslations);
      expect(getTranslations('unknown')).toBe(hiTranslations);
    });

    it('should expose both languages in the translations dictionary record', () => {
      expect(translations.hi).toBe(hiTranslations);
      expect(translations.en).toBe(enTranslations);
    });
  });

  describe('Dictionary Completeness & Parity Audit', () => {
    it('should have 100% key parity between Hindi and English dictionaries across all sections', () => {
      function compareKeys(obj1: Record<string, unknown>, obj2: Record<string, unknown>, path = '') {
        const keys1 = Object.keys(obj1).sort();
        const keys2 = Object.keys(obj2).sort();
        expect(keys1, `Key mismatch at path "${path}"`).toEqual(keys2);

        for (const key of keys1) {
          const val1 = obj1[key];
          const val2 = obj2[key];
          const subPath = path ? `${path}.${key}` : key;

          if (val1 && typeof val1 === 'object' && !Array.isArray(val1)) {
            expect(typeof val2, `Expected object at "${subPath}" in English`).toBe('object');
            compareKeys(val1 as Record<string, unknown>, val2 as Record<string, unknown>, subPath);
          } else if (Array.isArray(val1)) {
            expect(Array.isArray(val2), `Expected array at "${subPath}" in English`).toBe(true);
            expect((val2 as unknown[]).length).toBeGreaterThan(0);
          } else {
            expect(typeof val1, `Value type mismatch at "${subPath}"`).toBe('string');
            expect(typeof val2, `Value type mismatch at "${subPath}"`).toBe('string');
            expect((val1 as string).trim().length, `Empty Hindi string at "${subPath}"`).toBeGreaterThan(0);
            expect((val2 as string).trim().length, `Empty English string at "${subPath}"`).toBeGreaterThan(0);
          }
        }
      }

      compareKeys(
        hiTranslations as unknown as Record<string, unknown>,
        enTranslations as unknown as Record<string, unknown>
      );
    });

    it('should contain authentic Devanagari characters in Hindi dictionary', () => {
      const devanagariRegex = /[\u0900-\u097F]/;
      expect(devanagariRegex.test(hiTranslations.brand.name)).toBe(true);
      expect(devanagariRegex.test(hiTranslations.hero.title)).toBe(true);
      expect(devanagariRegex.test(hiTranslations.products.jarNormal.name)).toBe(true);
      expect(devanagariRegex.test(hiTranslations.tds.sources.chapakal)).toBe(true);
      expect(devanagariRegex.test(hiTranslations.wizard.steps.step1)).toBe(true);
    });

    it('should contain Latin characters in English dictionary', () => {
      expect(enTranslations.brand.name).toBe('Ashish Sudh Jal');
      expect(enTranslations.hero.highlight).toContain('Right to Your Doorstep');
      expect(enTranslations.products.jarNormal.priceDisplay).toBe('₹30');
      expect(enTranslations.products.jarNormal.recurringDisplay).toBe('₹25');
    });
  });

  describe('Business Invariants & Catalog Verification', () => {
    it('should correctly configure 20L Jar pricing and ₹150 refundable deposit', () => {
      // Hindi
      expect(hiTranslations.products.jarNormal.priceDisplay).toBe('₹30');
      expect(hiTranslations.products.jarNormal.recurringDisplay).toBe('₹25');
      expect(hiTranslations.products.jarNormal.depositBadge).toContain('₹150');
      expect(hiTranslations.products.jarChilled.priceDisplay).toBe('₹30');
      expect(hiTranslations.products.jarChilled.recurringDisplay).toBe('₹25');
      expect(hiTranslations.products.jarChilled.depositBadge).toContain('₹150');

      // English
      expect(enTranslations.products.jarNormal.priceDisplay).toBe('₹30');
      expect(enTranslations.products.jarNormal.recurringDisplay).toBe('₹25');
      expect(enTranslations.products.jarNormal.depositBadge).toContain('₹150');
      expect(enTranslations.products.jarChilled.priceDisplay).toBe('₹30');
      expect(enTranslations.products.jarChilled.recurringDisplay).toBe('₹25');
      expect(enTranslations.products.jarChilled.depositBadge).toContain('₹150');
    });

    it('should enforce zero deposit on event orders per business specification', () => {
      expect(hiTranslations.products.eventSupply.depositBadge).toContain('₹0');
      expect(enTranslations.products.eventSupply.depositBadge).toContain('Zero Deposit');
      expect(hiTranslations.wizard.summary.eventZeroDepositNotice).toContain('₹0');
      expect(enTranslations.wizard.summary.eventZeroDepositNotice).toContain('Zero');
    });

    it('should specify bulk bottle options without mandatory deposit', () => {
      expect(hiTranslations.products.bulkBottles.depositBadge).toContain('₹0');
      expect(enTranslations.products.bulkBottles.depositBadge).toContain('₹0');
    });

    it('must have ZERO mention of RO Servicing or repair across the entire dictionary', () => {
      const hiString = JSON.stringify(hiTranslations).toLowerCase();
      const enString = JSON.stringify(enTranslations).toLowerCase();

      expect(hiString).not.toContain('servicing');
      expect(hiString).not.toContain('सर्विसिंग');
      expect(hiString).not.toContain('मरम्मत');
      expect(hiString).not.toContain('repair');

      expect(enString).not.toContain('servicing');
      expect(enString).not.toContain('repair');
    });

    it('should contain correct plant location in Sarsar, Siwan and contact hotline', () => {
      expect(hiTranslations.brand.plantAddress).toContain('सरसर');
      expect(hiTranslations.brand.plantAddress).toContain('सिवान');
      expect(hiTranslations.brand.hotline).toBe('+91 82358 82384');
      expect(hiTranslations.brand.hotlineNumber).toBe('8235882384');

      expect(enTranslations.brand.plantAddress).toContain('Sarsar');
      expect(enTranslations.brand.plantAddress).toContain('Ward No-1');
      expect(enTranslations.brand.plantAddress).toContain('Siwan');
      expect(enTranslations.brand.hotline).toBe('+91 82358 82384');
      expect(enTranslations.brand.hotlineNumber).toBe('8235882384');
    });

    it('should unify plantAddress strictly across brand, map, and footer sections without duplication', () => {
      // Hindi address unification
      expect(hiTranslations.brand.plantAddress).toBe(hiTranslations.map.plantAddress);
      expect(hiTranslations.brand.plantAddress).toBe(hiTranslations.footer.plantAddress);

      // English address unification
      expect(enTranslations.brand.plantAddress).toBe(enTranslations.map.plantAddress);
      expect(enTranslations.brand.plantAddress).toBe(enTranslations.footer.plantAddress);
      expect(enTranslations.brand.plantAddress).toContain('Ward No-1');
    });

    it('should include localized FAQs and testimonials derived from centralized site data', () => {
      expect(hiTranslations.faqs.items.length).toBeGreaterThanOrEqual(5);
      expect(enTranslations.faqs.items.length).toBe(hiTranslations.faqs.items.length);

      expect(hiTranslations.testimonials.items.length).toBeGreaterThanOrEqual(4);
      expect(enTranslations.testimonials.items.length).toBe(hiTranslations.testimonials.items.length);
    });
  });

  describe('interpolate Utility Function', () => {
    it('should replace single placeholder accurately', () => {
      const template = 'डिलीवरी: {time} के भीतर';
      const result = interpolate(template, { time: '1 घंटे' });
      expect(result).toBe('डिलीवरी: 1 घंटे के भीतर');
    });

    it('should replace multiple placeholders accurately', () => {
      const template = 'गाँव: {village}, दूरी: {distance} किमी, समय: {sla}';
      const result = interpolate(template, {
        village: 'पुरैना',
        distance: 2.5,
        sla: '1 घंटा',
      });
      expect(result).toBe('गाँव: पुरैना, दूरी: 2.5 किमी, समय: 1 घंटा');
    });

    it('should leave unmatched placeholders intact', () => {
      const template = 'नमस्ते {name}, आपका ऑर्डर #{orderId} बुक हो गया है।';
      const result = interpolate(template, { name: 'रमेश' });
      expect(result).toBe('नमस्ते रमेश, आपका ऑर्डर #{orderId} बुक हो गया है।');
    });

    it('should return empty string for empty template', () => {
      expect(interpolate('', { foo: 'bar' })).toBe('');
    });
  });
});
