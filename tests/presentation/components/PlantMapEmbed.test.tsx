import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlantMapEmbed } from '../../../src/presentation/components/map/PlantMapEmbed';
import type { PlantMapEmbedProps } from '../../../src/presentation/components/map/PlantMapEmbed';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { hindiDict, englishDict } from '../../../src/locales';

/**
 * Helper to render PlantMapEmbed wrapped in LanguageProvider with a selected language.
 */
function renderMapWithLanguage(
  languageOption: 'hi' | 'en' = 'hi',
  mapProps?: PlantMapEmbedProps
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageOption },
      React.createElement(PlantMapEmbed, mapProps)
    )
  );
}

/**
 * Helper to escape HTML characters that react-dom/server escapes in static markup.
 */
function escapeHtmlEntities(textValue: string): string {
  return textValue
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

describe('PlantMapEmbed Component (src/presentation/components/map/PlantMapEmbed.tsx)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedMapConsumer(): JSX.Element {
        return React.createElement(PlantMapEmbed);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedMapConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic section with proper role, id, and aria-labelledby', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain('<section id="plant-location"');
      expect(htmlMarkup).toContain('role="region"');
      expect(htmlMarkup).toContain('aria-labelledby="plant-map-title"');
      expect(htmlMarkup).toContain('class="asj-plant-map');
      expect(htmlMarkup).toContain('asj-plant-map__container');
    });

    it('should render section header with badge, title, and subtitle matching Hindi dictionary', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.map.sectionBadge));
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.map.sectionTitle));
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.map.sectionSubtitle));
    });

    it('should render Google Maps iframe embed with correct query parameters and accessibility attributes', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain('<iframe');
      expect(htmlMarkup).toContain('src="https://maps.google.com/maps?q=Ashish+Sudh+Jal,+Sarsar,+Siwan,+Bihar+841226&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"');
      expect(htmlMarkup).toContain(`title="${escapeHtmlEntities(hindiDict.map.plantTitle)}"`);
      expect(htmlMarkup).toContain(`aria-label="${escapeHtmlEntities(hindiDict.map.plantTitle)}"`);
      expect(htmlMarkup).toContain('loading="lazy"');
      expect(htmlMarkup).toContain('referrerPolicy="no-referrer-when-downgrade"');
    });

    it('should render floating plant pin overlay with pulsing indicator in Hindi', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain('class="asj-plant-map__pin-overlay"');
      expect(htmlMarkup).toContain('class="asj-plant-map__pin-pulse"');
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.map.plantTitle));
      expect(htmlMarkup).toContain('सरसर मुख्य प्लांट (सिवान)');
    });

    it('should render plant information card with address, operating hours, and hotline in Hindi', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain('class="asj-plant-map__card"');
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.brand.tagline));
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.brand.plantAddress));
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.brand.operatingHours));
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.brand.hotline));
      expect(htmlMarkup).toContain('प्रतिदिन खुला है');
    });

    it('should render 3 plant facility features (pickup, multi-stage RO, free testing) in Hindi', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain('सीधे प्लांट पिकअप');
      expect(htmlMarkup).toContain('मल्टी-स्टेज आरओ + यूवी');
      expect(htmlMarkup).toContain('मुफ्त टीडीएस जांच');
    });

    it('should render Google Maps Directions CTA linking directly to plant navigation', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain('href="https://www.google.com/maps/dir/?api=1&amp;destination=Ashish+Sudh+Jal+Sarsar+Siwan+Bihar+841226"');
      expect(htmlMarkup).toContain('target="_blank"');
      expect(htmlMarkup).toContain('rel="noopener noreferrer"');
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.map.getDirectionsBtn));
    });

    it('should render direct phone call and WhatsApp CTAs', () => {
      const htmlMarkup = renderMapWithLanguage('hi');

      expect(htmlMarkup).toContain(`href="tel:${hindiDict.brand.hotlineNumber}"`);
      expect(htmlMarkup).toContain(escapeHtmlEntities(hindiDict.map.callPlantBtn));
      expect(htmlMarkup).toContain('href="https://wa.me/918235882384?text=');
    });
  });

  describe('English Language Mode', () => {
    it('should render all titles, badges, and directions in English when selected', () => {
      const htmlMarkup = renderMapWithLanguage('en');

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.map.sectionBadge));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.map.sectionTitle));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.map.sectionSubtitle));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.map.plantTitle));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.brand.plantAddress));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.map.getDirectionsBtn));
      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.map.callPlantBtn));
      expect(htmlMarkup).toContain('Open Daily');
      expect(htmlMarkup).toContain('Direct Plant Pickup');
      expect(htmlMarkup).toContain('Multi-Stage RO + UV');
      expect(htmlMarkup).toContain('Free Water Testing');
      expect(htmlMarkup).toContain('Sarsar Central Plant, Siwan');
    });
  });

  describe('Custom Props & Visibility Control', () => {
    it('should apply custom mapHeight to the embed wrapper', () => {
      const htmlMarkup = renderMapWithLanguage('hi', { mapHeight: 520 });

      expect(htmlMarkup).toContain('height:520px');
      expect(htmlMarkup).toContain('min-height:520px');
    });

    it('should hide floating pin overlay when showPinOverlay is false', () => {
      const htmlMarkup = renderMapWithLanguage('hi', { showPinOverlay: false });

      expect(htmlMarkup).not.toContain('class="asj-plant-map__pin-overlay"');
      expect(htmlMarkup).not.toContain('class="asj-plant-map__pin-pulse"');
    });

    it('should hide address card when showAddressCard is false', () => {
      const htmlMarkup = renderMapWithLanguage('hi', { showAddressCard: false });

      expect(htmlMarkup).not.toContain('class="asj-plant-map__card"');
      expect(htmlMarkup).not.toContain(escapeHtmlEntities(hindiDict.brand.plantAddress));
    });

    it('should hide operating hours when showOperatingHours is false', () => {
      const htmlMarkup = renderMapWithLanguage('hi', { showOperatingHours: false });

      expect(htmlMarkup).not.toContain(escapeHtmlEntities(hindiDict.brand.operatingHours));
    });

    it('should hide contact action buttons when showContactButtons is false', () => {
      const htmlMarkup = renderMapWithLanguage('hi', { showContactButtons: false });

      expect(htmlMarkup).not.toContain('class="asj-plant-map__actions"');
      expect(htmlMarkup).not.toContain(escapeHtmlEntities(hindiDict.map.getDirectionsBtn));
      expect(htmlMarkup).not.toContain(escapeHtmlEntities(hindiDict.map.callPlantBtn));
    });

    it('should append custom className to the section element', () => {
      const htmlMarkup = renderMapWithLanguage('hi', { className: 'custom-map-wrapper' });

      expect(htmlMarkup).toContain('asj-plant-map custom-map-wrapper');
    });
  });
});
