import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Footer } from '../../../src/presentation/components/common/Footer';
import type { FooterProps } from '../../../src/presentation/components/common/Footer';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';
import { VILLAGES } from '../../../src/infrastructure/config/villages.data';
import type { VillageRecord } from '../../../src/infrastructure/config/villages.data';

/**
 * Helper to render Footer wrapped in LanguageProvider with a selected language.
 */
function renderFooterWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  footerProps?: FooterProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(Footer, footerProps)
    )
  );
}

/**
 * Helper to escape HTML characters that react-dom/server escapes in static markup.
 */
function escapeHtmlEntities(textValue: string): string {
  return textValue.replace(/&/g, '&amp;');
}

describe('Footer Component (src/presentation/components/common/Footer.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedFooterConsumer(): JSX.Element {
        return React.createElement(Footer);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedFooterConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic footer with role="contentinfo" and base styling classes', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain('<footer role="contentinfo"');
      expect(htmlMarkup).toContain('class="asj-footer');
      expect(htmlMarkup).toContain('asj-footer__container');
    });

    it('should render Trust Badges section with 4 quality guarantees in Hindi', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-footer__trust-section');
      expect(htmlMarkup).toContain(hindiDict.trustBadgesSectionTitle);

      expect(htmlMarkup).toContain(hindiDict.trustBadges[0].title);
      expect(htmlMarkup).toContain(hindiDict.trustBadges[0].desc);

      expect(htmlMarkup).toContain(hindiDict.trustBadges[1].title);
      expect(htmlMarkup).toContain(hindiDict.trustBadges[1].desc);

      expect(htmlMarkup).toContain(hindiDict.trustBadges[2].title);
      expect(htmlMarkup).toContain(hindiDict.trustBadges[2].desc);

      expect(htmlMarkup).toContain(hindiDict.trustBadges[3].title);
      expect(htmlMarkup).toContain(hindiDict.trustBadges[3].desc);
    });

    it('should render brand identity, droplet logo, tagline, and mission description', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.brand.name);
      expect(htmlMarkup).toContain('सरसर, सिवान (बिहार)');
      expect(htmlMarkup).toContain(hindiDict.brand.tagline);
      expect(htmlMarkup).toContain(hindiDict.footer.brandDesc);
      expect(htmlMarkup).toContain('asj-footer__brand-icon');
    });

    it('should render direct WhatsApp order CTA with valid wa.me URL and pre-filled message', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain('class="asj-footer__whatsapp-pill"');
      expect(htmlMarkup).toContain('target="_blank"');
      expect(htmlMarkup).toContain('rel="noopener noreferrer"');
      expect(htmlMarkup).toContain(hindiDict.nav.whatsappOrder);

      const expectedText = encodeURIComponent(
        'नमस्ते आशीष शुद्ध जल, मुझे शुद्ध पेयजल आपूर्ति के बारे में जानकारी चाहिए।'
      );
      expect(htmlMarkup).toContain(`https://wa.me/918235882384?text=${expectedText}`);
    });

    it('should render Quick Links navigation matching Header anchors', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.footer.quickLinksTitle);
      expect(htmlMarkup).toContain('href="#products"');
      expect(htmlMarkup).toContain(hindiDict.nav.products);
      expect(htmlMarkup).toContain('href="#tds-checker"');
      expect(htmlMarkup).toContain(hindiDict.nav.tdsChecker);
      expect(htmlMarkup).toContain('href="#booking"');
      expect(htmlMarkup).toContain(hindiDict.nav.booking);
      expect(htmlMarkup).toContain('href="#coverage"');
      expect(htmlMarkup).toContain(hindiDict.nav.coverage);
    });

    it('should render plant contact information with telephone link and operating hours', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.footer.contactTitle);
      expect(htmlMarkup).toContain(hindiDict.brand.plantAddress);
      expect(htmlMarkup).toContain('href="tel:+918235882384"');
      expect(htmlMarkup).toContain(hindiDict.brand.hotline);
      expect(htmlMarkup).toContain(hindiDict.brand.operatingHours);
    });

    it('should render all 15 Siwan villages in delivery coverage list with plant indicator', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.footer.coverageTitle);
      expect(htmlMarkup).toContain('सिवान जिले के 15 गांवों में त्वरित डोरस्टेप डिलीवरी');

      expect(VILLAGES.length).toBe(15);

      for (const villageRecord of VILLAGES) {
        expect(htmlMarkup).toContain(villageRecord.nameHindi);
        expect(htmlMarkup).toContain(villageRecord.deliverySlaHindi);
      }

      expect(htmlMarkup).toContain('asj-footer__village-chip--plant');
      expect(htmlMarkup).toContain('सरसर (प्लांट)');
    });

    it('should render copyright notice, rights reserved, and back-to-top anchor', () => {
      const htmlMarkup = renderFooterWithLanguage('hi');

      const expectedCopyright = hindiDict.brand.copyright.replace('{year}', '2026');
      expect(htmlMarkup).toContain(expectedCopyright);
      expect(htmlMarkup).toContain(hindiDict.footer.allRightsReserved);
      expect(htmlMarkup).toContain('href="#top"');
      expect(htmlMarkup).toContain('class="asj-footer__back-to-top"');
      expect(htmlMarkup).toContain('वापस ऊपर जाएं');
    });
  });

  describe('English Language Rendering (EN Switch)', () => {
    it('should render brand title, English tagline, and English description', () => {
      const htmlMarkup = renderFooterWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.brand.name);
      expect(htmlMarkup).toContain('Sarsar, Siwan (Bihar)');
      expect(htmlMarkup).toContain(englishDict.brand.tagline);
      expect(htmlMarkup).toContain(englishDict.footer.brandDesc);
    });

    it('should render English Trust Badges titles and descriptions', () => {
      const htmlMarkup = renderFooterWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.trustBadgesSectionTitle);

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[0].title));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[0].desc));

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[1].title));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[1].desc));

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[2].title));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[2].desc));

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[3].title));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.trustBadges[3].desc));
    });

    it('should render English Quick Links navigation', () => {
      const htmlMarkup = renderFooterWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.footer.quickLinksTitle);
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.nav.products));
      expect(htmlMarkup).toContain(englishDict.nav.tdsChecker);
      expect(htmlMarkup).toContain(englishDict.nav.booking);
      expect(htmlMarkup).toContain(englishDict.nav.coverage);
    });

    it('should render English contact info, operating hours, and plant address', () => {
      const htmlMarkup = renderFooterWithLanguage('en');

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.footer.contactTitle));
      expect(htmlMarkup).toContain(englishDict.brand.plantAddress);
      expect(htmlMarkup).toContain(englishDict.brand.hotline);
      expect(htmlMarkup).toContain(englishDict.brand.operatingHours);
    });

    it('should render all 15 Siwan villages with English names, English SLAs, and Sarsar (Plant)', () => {
      const htmlMarkup = renderFooterWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.footer.coverageTitle);
      expect(htmlMarkup).toContain('Prompt doorstep delivery across 15 Siwan villages');

      for (const villageRecord of VILLAGES) {
        expect(htmlMarkup).toContain(villageRecord.name);
        expect(htmlMarkup).toContain(villageRecord.deliverySla);
      }

      expect(htmlMarkup).toContain('Sarsar (Plant)');
    });

    it('should render English copyright statement and Back to Top link', () => {
      const htmlMarkup = renderFooterWithLanguage('en');

      const expectedCopyright = englishDict.brand.copyright.replace('{year}', '2026');
      expect(htmlMarkup).toContain(expectedCopyright);
      expect(htmlMarkup).toContain(englishDict.footer.allRightsReserved);
      expect(htmlMarkup).toContain('Back to Top');
    });
  });

  describe('Custom Props and Flexibility', () => {
    it('should support merging custom className onto root footer element', () => {
      const htmlMarkup = renderFooterWithLanguage('hi', {
        className: 'custom-footer-class test-boundary',
      });

      expect(htmlMarkup).toContain('asj-footer');
      expect(htmlMarkup).toContain('custom-footer-class');
      expect(htmlMarkup).toContain('test-boundary');
    });

    it('should render custom villages list when passed via props', () => {
      const customVillagesList: readonly VillageRecord[] = [
        {
          id: 'custom-sample',
          name: 'Custom Sample',
          nameHindi: 'कस्टम नमूना',
          pincode: '841226',
          distanceKm: 1.2,
          deliverySla: 'Within 45 Mins',
          deliverySlaHindi: '45 मिनट के भीतर',
          isPlantLocation: false,
        },
      ];

      const htmlMarkup = renderFooterWithLanguage('hi', {
        villages: customVillagesList,
      });

      expect(htmlMarkup).toContain('कस्टम नमूना');
      expect(htmlMarkup).toContain('45 मिनट के भीतर');
      expect(htmlMarkup).not.toContain('बांसोपाली');
    });
  });
});
