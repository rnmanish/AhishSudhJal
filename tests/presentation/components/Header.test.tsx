import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Header } from '../../../src/presentation/components/common/Header';
import type { HeaderProps } from '../../../src/presentation/components/common/Header';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';

/**
 * Helper to render Header wrapped in LanguageProvider with a selected language.
 */
function renderHeaderWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  headerProps?: HeaderProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(Header, headerProps)
    )
  );
}

describe('Header Component (src/presentation/components/common/Header.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedHeaderConsumer(): JSX.Element {
        return React.createElement(Header);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedHeaderConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic header banner with base styling classes', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('<header role="banner"');
      expect(htmlMarkup).toContain('class="asj-header');
      expect(htmlMarkup).toContain('asj-header__container');
    });

    it('should render accessible skip-to-content link in Hindi', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('href="#main-content"');
      expect(htmlMarkup).toContain('class="asj-skip-link"');
      expect(htmlMarkup).toContain('सीधे मुख्य सामग्री पर जाएं');
    });

    it('should render brand logo, title, and plant location subtitle', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('href="#top"');
      expect(htmlMarkup).toContain(hindiDict.brand.name);
      expect(htmlMarkup).toContain('सरसर, सिवान (बिहार)');
      expect(htmlMarkup).toContain('asj-icon-droplet');
    });

    it('should render desktop navigation links with correct Hindi copy', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('aria-label="मुख्य नेविगेशन"');
      expect(htmlMarkup).toContain('href="#products"');
      expect(htmlMarkup).toContain(hindiDict.nav.products);
      expect(htmlMarkup).toContain('href="#tds-checker"');
      expect(htmlMarkup).toContain(hindiDict.nav.tdsChecker);
      expect(htmlMarkup).toContain('href="#booking"');
      expect(htmlMarkup).toContain(hindiDict.nav.booking);
      expect(htmlMarkup).toContain('href="#coverage"');
      expect(htmlMarkup).toContain(hindiDict.nav.coverage);
    });

    it('should apply active styling and aria-current when activeSection is passed', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi', {
        activeSection: 'tds-checker',
      });

      expect(htmlMarkup).toContain('asj-header__nav-link--active');
      expect(htmlMarkup).toContain('aria-current="page"');
    });

    it('should render direct hotline call CTA with valid tel: protocol and phone number', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('href="tel:+918235882384"');
      expect(htmlMarkup).toContain('class="asj-header__btn-hotline"');
      expect(htmlMarkup).toContain('+91 82358 82384');
      expect(htmlMarkup).toContain(hindiDict.nav.callNow);
    });

    it('should render WhatsApp instant ordering CTA with pre-formatted Unicode message', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('class="asj-header__btn-whatsapp"');
      expect(htmlMarkup).toContain('target="_blank"');
      expect(htmlMarkup).toContain('rel="noopener noreferrer"');
      expect(htmlMarkup).toContain(hindiDict.nav.whatsappOrder);

      const expectedText = encodeURIComponent(
        'नमस्ते आशीष शुद्ध जल, मुझे शुद्ध 20L आरओ पानी जार का नया ऑर्डर देना है।'
      );
      expect(htmlMarkup).toContain(`https://wa.me/918235882384?text=${expectedText}`);
    });

    it('should render language toggle pill with Hindi option marked active', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('class="asj-header__lang-toggle"');
      expect(htmlMarkup).toContain(hindiDict.nav.toggleLanguageAria);
      expect(htmlMarkup).toContain(
        'class="asj-header__lang-option asj-header__lang-option--active">हिन्दी</span>'
      );
      expect(htmlMarkup).toContain('class="asj-header__lang-option ">EN</span>');
    });

    it('should render mobile menu toggle button with accessible aria attributes', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('class="asj-header__menu-button"');
      expect(htmlMarkup).toContain('aria-expanded="false"');
      expect(htmlMarkup).toContain('aria-controls="asj-mobile-menu"');
      expect(htmlMarkup).toContain('aria-label="मेन्यू खोलें"');
    });
  });

  describe('English Language Rendering (EN Switch)', () => {
    it('should render English brand title, subtitle, and skip link', () => {
      const htmlMarkup = renderHeaderWithLanguage('en');

      expect(htmlMarkup).toContain('Skip to main content');
      expect(htmlMarkup).toContain(englishDict.brand.name);
      expect(htmlMarkup).toContain('Sarsar, Siwan (Bihar)');
      expect(htmlMarkup).toContain('aria-label="Main Navigation"');
    });

    it('should render English navigation links', () => {
      const htmlMarkup = renderHeaderWithLanguage('en');

      // Note: react-dom/server escapes '&' to '&amp;' in static markup
      const escapedProductsText = englishDict.nav.products.replace('&', '&amp;');
      expect(htmlMarkup).toContain(escapedProductsText);
      expect(htmlMarkup).toContain(englishDict.nav.tdsChecker);
      expect(htmlMarkup).toContain(englishDict.nav.booking);
      expect(htmlMarkup).toContain(englishDict.nav.coverage);
    });

    it('should render English hotline and WhatsApp labels and messages', () => {
      const htmlMarkup = renderHeaderWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.nav.callNow);
      expect(htmlMarkup).toContain(englishDict.nav.whatsappOrder);

      const expectedEnglishText = encodeURIComponent(
        'Hello Ashish Sudh Jal, I would like to order a 20L pure RO water jar.'
      );
      expect(htmlMarkup).toContain(
        `https://wa.me/918235882384?text=${expectedEnglishText}`
      );
    });

    it('should mark EN option active in language toggle pill', () => {
      const htmlMarkup = renderHeaderWithLanguage('en');

      expect(htmlMarkup).toContain(englishDict.nav.toggleLanguageAria);
      expect(htmlMarkup).toContain(
        'class="asj-header__lang-option ">हिन्दी</span>'
      );
      expect(htmlMarkup).toContain(
        'class="asj-header__lang-option asj-header__lang-option--active">EN</span>'
      );
    });

    it('should provide English aria-label on mobile menu button', () => {
      const htmlMarkup = renderHeaderWithLanguage('en');

      expect(htmlMarkup).toContain('aria-label="Open menu"');
    });
  });

  describe('Custom Properties and Styling Integration', () => {
    it('should append custom className to header container when supplied', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi', {
        className: 'custom-navigation-header',
      });

      expect(htmlMarkup).toContain('custom-navigation-header');
      expect(htmlMarkup).toContain('asj-header');
    });

    it('should render scoped CSS style block with critical design tokens and media queries', () => {
      const htmlMarkup = renderHeaderWithLanguage('hi');

      expect(htmlMarkup).toContain('<style>');
      expect(htmlMarkup).toContain('.asj-header');
      expect(htmlMarkup).toContain('--z-sticky');
      expect(htmlMarkup).toContain('--touch-target-min');
      expect(htmlMarkup).toContain('@media (min-width: 1024px)');
      expect(htmlMarkup).toContain('backdrop-filter: blur');
    });
  });
});
