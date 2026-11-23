import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { VillageSearch } from '../../../src/presentation/components/map/VillageSearch';
import type { VillageSearchProps } from '../../../src/presentation/components/map/VillageSearch';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';

/**
 * Helper to render VillageSearch wrapped in LanguageProvider with a selected language.
 */
function renderVillageSearchWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  componentProps?: VillageSearchProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(VillageSearch, componentProps)
    )
  );
}

describe('VillageSearch Component (src/presentation/components/map/VillageSearch.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedConsumer(): JSX.Element {
        return React.createElement(VillageSearch);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic section with proper role, id, and aria-labelledby', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi');

      expect(htmlMarkup).toContain('<section id="coverage"');
      expect(htmlMarkup).toContain('role="region"');
      expect(htmlMarkup).toContain('aria-labelledby="village-search-title"');
      expect(htmlMarkup).toContain('class="asj-village-search');
      expect(htmlMarkup).toContain('asj-village-search__container');
    });

    it('should render Hindi section badge, title, and subtitle', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.villageChecker.sectionBadge);
      expect(htmlMarkup).toContain(hindiDict.villageChecker.sectionTitle);
      expect(htmlMarkup).toContain(hindiDict.villageChecker.sectionSubtitle);
    });

    it('should render search form with accessible input and submit button in Hindi', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi');

      expect(htmlMarkup).toContain('role="search"');
      expect(htmlMarkup).toContain('asj-village-search__input');
      expect(htmlMarkup).toContain(hindiDict.villageChecker.searchPlaceholder);
      expect(htmlMarkup).toContain(hindiDict.villageChecker.searchBtn);
    });

    it('should render top covered villages chips section with authentic Devanagari labels', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.villageChecker.coveredVillagesHeading);
      expect(htmlMarkup).toContain('asj-village-search__chips-grid');
      expect(htmlMarkup).toContain('asj-village-search__chip');
      expect(htmlMarkup).toContain('सरसर');
      expect(htmlMarkup).toContain('पुरैना');
    });

    it('should render Sarsar plant location card with Google Maps directions and call CTA', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-village-search__plant-card');
      expect(htmlMarkup).toContain(hindiDict.map.plantTitle);
      expect(htmlMarkup).toContain(hindiDict.brand.plantAddress);
      expect(htmlMarkup).toContain(hindiDict.map.getDirectionsBtn);
      expect(htmlMarkup).toContain(hindiDict.map.callPlantBtn);
      expect(htmlMarkup).toContain('href="tel:8235882384"');
      expect(htmlMarkup).toContain('https://www.google.com/maps/search/?api=1&amp;query=Ashish+Sudh+Jal+Sarsar+Siwan+Bihar');
    });
  });

  describe('English Localization Parity', () => {
    it('should render English section badge, title, and subtitle', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.villageChecker.sectionBadge);
      expect(htmlMarkup).toContain(englishDict.villageChecker.sectionTitle);
      expect(htmlMarkup).toContain(englishDict.villageChecker.sectionSubtitle);
    });

    it('should render English placeholder and search button', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.villageChecker.searchPlaceholder);
      expect(htmlMarkup).toContain(englishDict.villageChecker.searchBtn);
    });

    it('should render English plant action buttons and labels', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.map.plantTitle);
      expect(htmlMarkup).toContain(englishDict.map.getDirectionsBtn);
      expect(htmlMarkup).toContain(englishDict.map.callPlantBtn);
      expect(htmlMarkup).toContain(englishDict.villageChecker.coveredVillagesHeading);
    });
  });

  describe('Props Customization & Display Toggles', () => {
    it('should hide plant info card when showPlantInfo is false', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi', {
        showPlantInfo: false,
      });

      expect(htmlMarkup).not.toContain('<div class="asj-village-search__plant-card"');
      expect(htmlMarkup).not.toContain(hindiDict.map.getDirectionsBtn);
    });

    it('should hide top villages section when showTopVillages is false', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi', {
        showTopVillages: false,
      });

      expect(htmlMarkup).not.toContain('<div class="asj-village-search__chips-section"');
      expect(htmlMarkup).not.toContain(hindiDict.villageChecker.coveredVillagesHeading);
    });

    it('should append custom className to root container', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi', {
        className: 'custom-map-widget-class',
      });

      expect(htmlMarkup).toContain('custom-map-widget-class');
    });

    it('should populate input with initialQuery value', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi', {
        initialQuery: 'सरसर',
      });

      expect(htmlMarkup).toContain('value="सरसर"');
    });
  });

  describe('Accessibility & CSS System Compliance', () => {
    it('should embed pure CSS stylesheet with aquatic tokens and zero runtime CSS frameworks', () => {
      const htmlMarkup = renderVillageSearchWithLanguage('hi');

      expect(htmlMarkup).toContain('<style>');
      expect(htmlMarkup).toContain('.asj-village-search');
      expect(htmlMarkup).toContain('--color-primary-400');
      expect(htmlMarkup).toContain('prefers-reduced-motion');
      expect(htmlMarkup).not.toContain('tailwind');
      expect(htmlMarkup).not.toContain('bootstrap');
    });
  });
});
