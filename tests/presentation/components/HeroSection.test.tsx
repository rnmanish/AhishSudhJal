import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HeroSection } from '../../../src/presentation/components/hero/HeroSection';
import type { HeroSectionProps } from '../../../src/presentation/components/hero/HeroSection';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';

/**
 * Helper to render HeroSection wrapped in LanguageProvider with a selected language.
 */
function renderHeroWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  heroProps?: HeroSectionProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(HeroSection, heroProps)
    )
  );
}

/**
 * Helper to escape HTML characters that react-dom/server escapes in static markup.
 */
function escapeHtmlEntities(textValue: string): string {
  return textValue.replace(/&/g, '&amp;');
}

describe('HeroSection Component (src/presentation/components/hero/HeroSection.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedHeroConsumer(): JSX.Element {
        return React.createElement(HeroSection);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedHeroConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic section with proper role, id, and aria-labelledby', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('<section id="hero"');
      expect(htmlMarkup).toContain('role="region"');
      expect(htmlMarkup).toContain('aria-labelledby="hero-title"');
      expect(htmlMarkup).toContain('class="asj-hero');
      expect(htmlMarkup).toContain('asj-hero__container');
    });

    it('should render live village delivery badge with pulsing indicator in Hindi', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__delivery-badge');
      expect(htmlMarkup).toContain('asj-hero__pulse-ring');
      expect(htmlMarkup).toContain('asj-hero__pulse-dot');
      expect(htmlMarkup).toContain(hindiDict.hero.badge);
    });

    it('should render delivery SLA pill with 30-min to 2-hour guarantee in Hindi', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__sla-pill');
      expect(htmlMarkup).toContain(hindiDict.hero.deliveryPill);
    });

    it('should render main bilingual headline with aquatic gradient highlight', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('<h1 id="hero-title"');
      expect(htmlMarkup).toContain(hindiDict.hero.title);
      expect(htmlMarkup).toContain('asj-hero__highlight');
      expect(htmlMarkup).toContain(hindiDict.hero.highlight);
    });

    it('should render informative subtitle describing 20L jars and coverage', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__subtitle');
      expect(htmlMarkup).toContain(hindiDict.hero.subtitle);
    });

    it('should render primary WhatsApp order CTA button with pre-formatted Hindi message', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__btn--whatsapp');
      expect(htmlMarkup).toContain('target="_blank"');
      expect(htmlMarkup).toContain('rel="noopener noreferrer"');
      expect(htmlMarkup).toContain(hindiDict.hero.orderCta);

      const expectedHindiMessage = encodeURIComponent(
        'नमस्ते आशीष शुद्ध जल, मुझे 20L पानी जार ऑर्डर करना है।'
      );
      expect(htmlMarkup).toContain(
        `https://wa.me/918235882384?text=${expectedHindiMessage}`
      );
    });

    it('should render secondary Check Village Delivery CTA button linking to #coverage', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__btn--village');
      expect(htmlMarkup).toContain('href="#coverage"');
      expect(htmlMarkup).toContain(hindiDict.hero.checkVillageCta);
    });

    it('should render tertiary direct phone call CTA button with valid tel: protocol', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__btn--call');
      expect(htmlMarkup).toContain('href="tel:+918235882384"');
      expect(htmlMarkup).toContain(hindiDict.hero.callCta);
    });

    it('should render 3 trust guarantee items in Hindi', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__trust-strip');
      expect(htmlMarkup).toContain(hindiDict.hero.trustFeature1);
      expect(htmlMarkup).toContain(hindiDict.hero.trustFeature2);
      expect(htmlMarkup).toContain(hindiDict.hero.trustFeature3);
    });

    it('should render visual product showcase card with pricing, deposit and origin details in Hindi', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__visual-card');
      expect(htmlMarkup).toContain('100% शुद्ध एवं स्वच्छ');
      expect(htmlMarkup).toContain('सरसर प्लांट (सिवान)');
      expect(htmlMarkup).toContain('20L सामान्य / ठंडा');
      expect(htmlMarkup).toContain('20 लीटर आरओ पानी जार');
      expect(htmlMarkup).toContain('₹25');
      expect(htmlMarkup).toContain('₹30');
      expect(htmlMarkup).toContain('₹150 एकमुश्त रिफंडेबल डिपॉजिट (जार + डिस्पेंसर)');
      expect(htmlMarkup).toContain('href="#booking"');
    });

    it('should render service statistics strip (customers, purity, villages) in Hindi', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-hero__stats');
      expect(htmlMarkup).toContain(hindiDict.stats.customersCount);
      expect(htmlMarkup).toContain(hindiDict.stats.customersLabel);
      expect(htmlMarkup).toContain(hindiDict.stats.purityTdsRange);
      expect(htmlMarkup).toContain(hindiDict.stats.purityLabel);
      expect(htmlMarkup).toContain(hindiDict.stats.villagesCoveredCount);
      expect(htmlMarkup).toContain(hindiDict.stats.villagesLabel);
    });
  });

  describe('English Rendering (Secondary Language Support)', () => {
    it('should render headlines, badges, and CTAs in English when language is en', () => {
      const htmlMarkup = renderHeroWithLanguage('en');

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.hero.badge));
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.deliveryPill)
      );
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.hero.title));
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.highlight)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.subtitle)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.orderCta)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.checkVillageCta)
      );
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.hero.callCta));
    });

    it('should format WhatsApp URL with English encoded message when language is en', () => {
      const htmlMarkup = renderHeroWithLanguage('en');

      const expectedEnglishMessage = encodeURIComponent(
        'Hello Ashish Sudh Jal, I would like to order a 20L water jar.'
      );
      expect(htmlMarkup).toContain(
        `https://wa.me/918235882384?text=${expectedEnglishMessage}`
      );
    });

    it('should render trust guarantees and stats in English', () => {
      const htmlMarkup = renderHeroWithLanguage('en');

      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.trustFeature1)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.trustFeature2)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.hero.trustFeature3)
      );
      expect(htmlMarkup).toContain('100% Pure &amp; Hygienic');
      expect(htmlMarkup).toContain('Sarsar Plant, Siwan');
      expect(htmlMarkup).toContain('20L Normal &amp; Cool');
      expect(htmlMarkup).toContain(
        '₹150 One-time refundable deposit (Jar + Dispenser)'
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.stats.customersLabel)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.stats.purityLabel)
      );
      expect(htmlMarkup).toContain(
        escapeHtmlEntities(englishDict.stats.villagesLabel)
      );
    });
  });

  describe('Component Props & Accessibility', () => {
    it('should accept and append custom className to section container', () => {
      const htmlMarkup = renderHeroWithLanguage('hi', {
        className: 'custom-hero-test-class',
      });

      expect(htmlMarkup).toContain('class="asj-hero custom-hero-test-class');
    });

    it('should include embedded scoped style block', () => {
      const htmlMarkup = renderHeroWithLanguage('hi');

      expect(htmlMarkup).toContain('<style>');
      expect(htmlMarkup).toContain('.asj-hero');
      expect(htmlMarkup).toContain('.asj-hero__delivery-badge');
      expect(htmlMarkup).toContain('@keyframes asj-pulse-live');
    });
  });
});
