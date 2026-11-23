import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ProductGrid,
  DEFAULT_CATALOG_PRODUCTS,
} from '../../../src/presentation/components/catalog/ProductGrid';
import type { ProductGridProps } from '../../../src/presentation/components/catalog/ProductGrid';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';

/**
 * Helper to escape HTML characters that react-dom/server escapes in static markup.
 */
function escapeHtmlEntities(textValue: string): string {
  return textValue.replace(/&/g, '&amp;');
}

/**
 * Helper to render ProductGrid wrapped in LanguageProvider with a selected language.
 */
function renderProductGridWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  gridProps?: ProductGridProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(ProductGrid, gridProps)
    )
  );
}

describe('ProductGrid Component (src/presentation/components/catalog/ProductGrid.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedConsumer(): JSX.Element {
        return React.createElement(ProductGrid);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Catalog Rendering', () => {
    it('should render section container with role="region" and anchor id="products"', () => {
      const htmlMarkup = renderProductGridWithLanguage('hi');

      expect(htmlMarkup).toContain('<section id="products"');
      expect(htmlMarkup).toContain('role="region"');
      expect(htmlMarkup).toContain('aria-labelledby="catalog-title"');
      expect(htmlMarkup).toContain('asj-catalog');
      expect(htmlMarkup).toContain('asj-catalog__container');
    });

    it('should render section header with badge, heading, and subtitle in Hindi', () => {
      const htmlMarkup = renderProductGridWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.products.sectionBadge);
      expect(htmlMarkup).toContain(hindiDict.products.sectionTitle);
      expect(htmlMarkup).toContain(hindiDict.products.sectionSubtitle);
    });

    it('should render interactive category filter tabs in Hindi', () => {
      const htmlMarkup = renderProductGridWithLanguage('hi');

      expect(htmlMarkup).toContain('role="tablist"');
      expect(htmlMarkup).toContain('aria-label="उत्पाद श्रेणियां"');
      expect(htmlMarkup).toContain('सभी उत्पाद (4)');
      expect(htmlMarkup).toContain('20L पानी जार');
      expect(htmlMarkup).toContain('पैकेज्ड बोतलें');
      expect(htmlMarkup).toContain('समारोह आपूर्ति');
    });

    it('should render all 4 confirmed products in the catalog grid', () => {
      const htmlMarkup = renderProductGridWithLanguage('hi');

      // 1. Normal Jar
      expect(htmlMarkup).toContain('asj-product-card--jar-normal');
      expect(htmlMarkup).toContain('20 लीटर नॉर्मल आरओ पानी जार');
      expect(htmlMarkup).toContain('₹25 प्रति जार (₹5 नियमित ग्राहक छूट)');
      expect(htmlMarkup).toContain('₹150 एकमुश्त रिफंडेबल डिपॉजिट');

      // 2. Chilled Jar
      expect(htmlMarkup).toContain('asj-product-card--jar-chilled');
      expect(htmlMarkup).toContain('20 लीटर ठंडा आरओ पानी जार');

      // 3. Bulk Packaged Bottles
      expect(htmlMarkup).toContain('asj-product-card--bulk-bottles');
      expect(htmlMarkup).toContain('पैकेज्ड पानी बोतल');
      expect(htmlMarkup).toContain('थोक मूल्य हेतु संपर्क करें');
      expect(htmlMarkup).toContain('₹0 अमानत राशि');

      // 4. Event Supply
      expect(htmlMarkup).toContain('asj-product-card--event-supply');
      expect(htmlMarkup).toContain('इवेंट / पार्टी / समारोह जल आपूर्ति');
      expect(htmlMarkup).toContain('कस्टम कोटेशन / संपर्क करें');
      expect(htmlMarkup).toContain('आयोजनों पर शून्य (₹0) डिपॉजिट');
    });

    it('should render trust and deposit guarantee strip in Hindi', () => {
      const htmlMarkup = renderProductGridWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-catalog__guarantee-strip');
      expect(htmlMarkup).toContain('100% रिफंडेबल अमानत राशि');
      expect(htmlMarkup).toContain('जार व नल वापसी पर पूरी राशि वापस');
      expect(htmlMarkup).toContain('समारोहों पर ₹0 अमानत राशि');
      expect(htmlMarkup).toContain('शादी-विवाह में कोई सिक्योरिटी डिपॉजिट नहीं');
      expect(htmlMarkup).toContain('सरसर व 15+ गांवों में आपूर्ति');
    });
  });

  describe('English Catalog Rendering', () => {
    it('should render section header with badge, heading, and subtitle in English', () => {
      const htmlMarkup = renderProductGridWithLanguage('en');

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.products.sectionBadge));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.products.sectionTitle));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.products.sectionSubtitle));
    });

    it('should render all 4 products with English copy', () => {
      const htmlMarkup = renderProductGridWithLanguage('en');

      expect(htmlMarkup).toContain('20L Normal RO Water Jar');
      expect(htmlMarkup).toContain('20L Chilled / Cool RO Water Jar');
      expect(htmlMarkup).toContain('Packaged Water Bottles');
      expect(htmlMarkup).toContain('Contact for Bulk Pricing');
      expect(htmlMarkup).toContain('Event / Party / Social Gathering Water Supply');
      expect(htmlMarkup).toContain('Custom Quote on Request');
      expect(htmlMarkup).toContain('₹0 Deposit on Events');
    });

    it('should render filter tabs in English', () => {
      const htmlMarkup = renderProductGridWithLanguage('en');

      expect(htmlMarkup).toContain('All Options (4)');
      expect(htmlMarkup).toContain('20L Jars');
      expect(htmlMarkup).toContain('Bottles');
      expect(htmlMarkup).toContain('Events');
    });

    it('should render guarantee banner in English', () => {
      const htmlMarkup = renderProductGridWithLanguage('en');

      expect(htmlMarkup).toContain('100% Refundable Deposit');
      expect(htmlMarkup).toContain('Zero Deposit on Events');
      expect(htmlMarkup).toContain('Serving 15+ Siwan Villages');
    });
  });

  describe('Strict Zero Reference to RO Servicing', () => {
    it('should confirm absolute zero reference to RO servicing in the entire catalog section', () => {
      const hindiMarkup = renderProductGridWithLanguage('hi');
      const englishMarkup = renderProductGridWithLanguage('en');

      const prohibitedKeywords = [
        'servicing',
        'repair',
        'filter change',
        'सर्विसिंग',
        'मरम्मत',
        'सर्विस',
      ];

      for (const keyword of prohibitedKeywords) {
        expect(hindiMarkup.toLowerCase()).not.toContain(keyword.toLowerCase());
        expect(englishMarkup.toLowerCase()).not.toContain(keyword.toLowerCase());
      }
    });
  });

  describe('Custom Products Injection', () => {
    it('should render custom subset of products when passed via props', () => {
      const subsetProducts = [DEFAULT_CATALOG_PRODUCTS[0]];
      const htmlMarkup = renderProductGridWithLanguage('hi', {
        products: subsetProducts,
      });

      expect(htmlMarkup).toContain('asj-product-card--jar-normal');
      expect(htmlMarkup).not.toContain('asj-product-card--jar-chilled');
      expect(htmlMarkup).not.toContain('asj-product-card--bulk-bottles');
      expect(htmlMarkup).not.toContain('asj-product-card--event-supply');
    });
  });
});
