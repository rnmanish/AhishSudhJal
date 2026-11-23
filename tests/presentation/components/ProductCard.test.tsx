import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProductCard } from '../../../src/presentation/components/catalog/ProductCard';
import type { ProductCardProps } from '../../../src/presentation/components/catalog/ProductCard';
import { DEFAULT_CATALOG_PRODUCTS } from '../../../src/presentation/components/catalog/ProductGrid';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';

/**
 * Helper to render ProductCard wrapped in LanguageProvider with a selected language.
 */
function renderProductCardWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  cardProps: ProductCardProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(ProductCard, cardProps)
    )
  );
}

describe('ProductCard Component (src/presentation/components/catalog/ProductCard.tsx)', () => {
  const normalJarProduct = DEFAULT_CATALOG_PRODUCTS.find(
    (productItem) => productItem.getId() === 'jar-normal'
  )!;
  const chilledJarProduct = DEFAULT_CATALOG_PRODUCTS.find(
    (productItem) => productItem.getId() === 'jar-chilled'
  )!;
  const bulkBottlesProduct = DEFAULT_CATALOG_PRODUCTS.find(
    (productItem) => productItem.getId() === 'bulk-bottles'
  )!;
  const eventSupplyProduct = DEFAULT_CATALOG_PRODUCTS.find(
    (productItem) => productItem.getId() === 'event-supply'
  )!;

  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedConsumer(): JSX.Element {
        return React.createElement(ProductCard, { product: normalJarProduct });
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('20L Normal RO Water Jar Card', () => {
    it('should render ₹30 price, ₹5 recurring discount badge, and ₹150 refundable deposit note in Hindi', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: normalJarProduct,
        isFeatured: true,
      });

      expect(htmlMarkup).toContain('asj-product-card');
      expect(htmlMarkup).toContain('asj-product-card--featured');
      expect(htmlMarkup).toContain(normalJarProduct.getName('hi'));
      expect(htmlMarkup).toContain('₹');
      expect(htmlMarkup).toContain('30');
      expect(htmlMarkup).toContain(hindiDict.products.perJar);
      expect(htmlMarkup).toContain('₹25 प्रति जार (₹5 नियमित ग्राहक छूट)');
      expect(htmlMarkup).toContain('₹150 एकमुश्त रिफंडेबल डिपॉजिट');
      expect(htmlMarkup).toContain('asj-product-card__featured-pill');
    });

    it('should render ₹30 price, ₹5 recurring discount badge, and ₹150 deposit note in English', () => {
      const htmlMarkup = renderProductCardWithLanguage('en', {
        product: normalJarProduct,
      });

      expect(htmlMarkup).toContain(normalJarProduct.getName('en'));
      expect(htmlMarkup).toContain('30');
      expect(htmlMarkup).toContain(englishDict.products.perJar);
      expect(htmlMarkup).toContain('₹25 / jar on subscription (Save ₹5)');
      expect(htmlMarkup).toContain('₹150 One-time refundable deposit');
    });

    it('should render direct WhatsApp order link with prefilled 20L Normal Jar message', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: normalJarProduct,
      });

      const expectedMessage = encodeURIComponent(
        'नमस्ते आशीष शुद्ध जल, मुझे 20L नॉर्मल आरओ पानी जार (₹30) का ऑर्डर करना है।'
      );
      expect(htmlMarkup).toContain(`https://wa.me/918235882384?text=${expectedMessage}`);
      expect(htmlMarkup).toContain('target="_blank"');
      expect(htmlMarkup).toContain('rel="noopener noreferrer"');
    });
  });

  describe('20L Chilled RO Water Jar Card', () => {
    it('should render ₹30 price, ₹5 recurring discount, and ₹150 refundable deposit note', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: chilledJarProduct,
      });

      expect(htmlMarkup).toContain(chilledJarProduct.getName('hi'));
      expect(htmlMarkup).toContain('30');
      expect(htmlMarkup).toContain('₹25 प्रति जार (₹5 नियमित ग्राहक छूट)');
      expect(htmlMarkup).toContain('₹150 एकमुश्त रिफंडेबल डिपॉजिट');
    });

    it('should render direct WhatsApp link with prefilled 20L Chilled Jar message', () => {
      const htmlMarkup = renderProductCardWithLanguage('en', {
        product: chilledJarProduct,
      });

      const expectedMessage = encodeURIComponent(
        'Hello Ashish Sudh Jal, I would like to order a 20L Chilled RO Water Jar (₹30).'
      );
      expect(htmlMarkup).toContain(`https://wa.me/918235882384?text=${expectedMessage}`);
    });
  });

  describe('Bulk Packaged Bottles Card', () => {
    it('should display Contact for Pricing and ₹0 Deposit note in Hindi', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: bulkBottlesProduct,
      });

      expect(htmlMarkup).toContain(bulkBottlesProduct.getName('hi'));
      expect(htmlMarkup).toContain('थोक मूल्य हेतु संपर्क करें');
      expect(htmlMarkup).toContain('₹0 अमानत राशि (पैकेज्ड बोतलों पर कोई सिक्योरिटी डिपॉजिट नहीं)');
    });

    it('should display Contact for Bulk Pricing and ₹0 Deposit note in English', () => {
      const htmlMarkup = renderProductCardWithLanguage('en', {
        product: bulkBottlesProduct,
      });

      expect(htmlMarkup).toContain(bulkBottlesProduct.getName('en'));
      expect(htmlMarkup).toContain('Contact for Bulk Pricing');
      expect(htmlMarkup).toContain('₹0 Deposit (No security deposit required)');
    });

    it('should render WhatsApp link requesting bulk bottles quote', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: bulkBottlesProduct,
      });

      const expectedMessage = encodeURIComponent(
        'नमस्ते आशीष शुद्ध जल, मुझे पैकेज्ड पानी बोतलों (250ml/500ml/1L) के थोक मूल्य (Bulk Pricing) की जानकारी चाहिए।'
      );
      expect(htmlMarkup).toContain(`https://wa.me/918235882384?text=${expectedMessage}`);
    });
  });

  describe('Event / Party / Social Gathering Supply Card', () => {
    it('should display Custom Quote and ₹0 Deposit note for events in Hindi', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: eventSupplyProduct,
      });

      expect(htmlMarkup).toContain(eventSupplyProduct.getName('hi'));
      expect(htmlMarkup).toContain('कस्टम कोटेशन / संपर्क करें');
      expect(htmlMarkup).toContain('आयोजनों पर शून्य (₹0) डिपॉजिट');
    });

    it('should display Custom Quote on Request and ₹0 Deposit note for events in English', () => {
      const htmlMarkup = renderProductCardWithLanguage('en', {
        product: eventSupplyProduct,
      });

      expect(htmlMarkup).toContain(eventSupplyProduct.getName('en'));
      expect(htmlMarkup).toContain('Custom Quote on Request');
      expect(htmlMarkup).toContain('₹0 Deposit on Events');
    });

    it('should render WhatsApp link requesting event water supply booking', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: eventSupplyProduct,
      });

      const expectedMessage = encodeURIComponent(
        'नमस्ते आशीष शुद्ध जल, मुझे शादी/समारोह के लिए पानी आपूर्ति (Event Supply) की बुकिंग और कोटेशन चाहिए।'
      );
      expect(htmlMarkup).toContain(`https://wa.me/918235882384?text=${expectedMessage}`);
    });
  });

  describe('Strict Zero Reference to RO Servicing', () => {
    it('should verify zero references to RO servicing across all 4 product cards', () => {
      for (const productItem of DEFAULT_CATALOG_PRODUCTS) {
        const hindiMarkup = renderProductCardWithLanguage('hi', { product: productItem });
        const englishMarkup = renderProductCardWithLanguage('en', { product: productItem });

        const forbiddenTerms = [
          'servicing',
          'repair',
          'filter change',
          'सर्विसिंग',
          'मरम्मत',
          'सर्विस',
        ];

        for (const term of forbiddenTerms) {
          expect(hindiMarkup.toLowerCase()).not.toContain(term.toLowerCase());
          expect(englishMarkup.toLowerCase()).not.toContain(term.toLowerCase());
        }
      }
    });
  });

  describe('Accessibility & Semantics', () => {
    it('should render semantic article with role="article" and accessible labels', () => {
      const htmlMarkup = renderProductCardWithLanguage('hi', {
        product: normalJarProduct,
      });

      expect(htmlMarkup).toContain('<article');
      expect(htmlMarkup).toContain('role="article"');
      expect(htmlMarkup).toContain('aria-labelledby="product-title-jar-normal"');
      expect(htmlMarkup).toContain('href="#booking"');
      expect(htmlMarkup).toContain('asj-product-card__btn--wizard');
    });
  });
});
