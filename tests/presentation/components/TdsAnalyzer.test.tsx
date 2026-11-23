import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import {
  TdsAnalyzer,
  TdsGauge,
  TdsResultCard,
  TdsSlider,
  TdsSourceSelector,
} from '../../../src/presentation/components/tds-analyzer';
import { hindiDict, englishDict } from '../../../src/locales';
import { CalculateTdsQualityUseCase } from '../../../src/core/use-cases/tds/CalculateTdsQualityUseCase';

/**
 * Helper to escape HTML characters that react-dom/server escapes in static markup.
 */
function escapeHtmlEntities(textValue: string): string {
  return textValue.replace(/&/g, '&amp;');
}

/**
 * Helper to render TdsAnalyzer wrapped inside LanguageProvider.
 */
function renderTdsAnalyzerWithLanguage(
  languageChoice: 'hi' | 'en' = 'hi',
  props = {}
): string {
  return renderToStaticMarkup(
    React.createElement(
      LanguageProvider,
      { initialLanguage: languageChoice },
      React.createElement(TdsAnalyzer, props)
    )
  );
}

describe('TDS Water Quality Analyzer (src/presentation/components/tds-analyzer)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when rendered outside LanguageProvider', () => {
      function NakedAnalyzerConsumer(): JSX.Element {
        return React.createElement(TdsAnalyzer);
      }

      expect(() =>
        renderToStaticMarkup(React.createElement(NakedAnalyzerConsumer))
      ).toThrow('useLanguage must be used within a LanguageProvider.');
    });
  });

  describe('Default Hindi Rendering (Bilingual Hindi-First)', () => {
    it('should render semantic section with proper role, id, and aria-labelledby', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain('<section id="tds-analyzer"');
      expect(htmlMarkup).toContain('role="region"');
      expect(htmlMarkup).toContain('aria-labelledby="tds-title"');
      expect(htmlMarkup).toContain('asj-tds-analyzer');
      expect(htmlMarkup).toContain('asj-tds-analyzer__container');
    });

    it('should render header with badge, title, and subtitle matching Hindi dictionary', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.tds.sectionBadge);
      expect(htmlMarkup).toContain(hindiDict.tds.sectionTitle);
      expect(htmlMarkup).toContain(hindiDict.tds.sectionSubtitle);
    });

    it('should render 4 water source options with rural badges in Hindi', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain(hindiDict.tds.sources.chapakal);
      expect(htmlMarkup).toContain(hindiDict.tds.sources.submersible);
      expect(htmlMarkup).toContain(hindiDict.tds.sources.nalJal);
      expect(htmlMarkup).toContain(hindiDict.tds.sources.tanker);
      expect(htmlMarkup).toContain('सिवान के गांवों में सबसे आम');
    });

    it('should render accessible slider with range attributes and default 120 PPM readout', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain('type="range"');
      expect(htmlMarkup).toContain('min="0"');
      expect(htmlMarkup).toContain('max="1000"');
      expect(htmlMarkup).toContain('value="120"');
      expect(htmlMarkup).toContain('aria-valuenow="120"');
      expect(htmlMarkup).toContain('aria-valuetext="120 PPM"');
      expect(htmlMarkup).toContain('asj-tds-slider__readout-value">120<');
      expect(htmlMarkup).toContain('PPM');
    });

    it('should render quick preset jump buttons', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-tds-slider__presets');
      expect(htmlMarkup).toContain('40');
      expect(htmlMarkup).toContain('120');
      expect(htmlMarkup).toContain('220');
      expect(htmlMarkup).toContain('420');
      expect(htmlMarkup).toContain('750');
    });

    it('should render visual spectrum gauge with all quality bands', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-tds-gauge');
      expect(htmlMarkup).toContain('&lt; 50');
      expect(htmlMarkup).toContain('50 - 150');
      expect(htmlMarkup).toContain('150 - 300');
      expect(htmlMarkup).toContain('300 - 500');
      expect(htmlMarkup).toContain('500+');
      expect(htmlMarkup).toContain('asj-tds-gauge__marker');
    });

    it('should render Ashish Sudh Jal standard guarantee notice in Hindi', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain('आशीष शुद्ध जल गुणवत्ता गारंटी');
      expect(htmlMarkup).toContain(hindiDict.tds.asjQualityNotice);
    });

    it('should render WhatsApp consultation CTA button with pre-filled encoded text', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi');

      expect(htmlMarkup).toContain('asj-tds-result-card__whatsapp-cta');
      expect(htmlMarkup).toContain('target="_blank"');
      expect(htmlMarkup).toContain('rel="noopener noreferrer"');
      expect(htmlMarkup).toContain('https://wa.me/918235882384?text=');
      expect(htmlMarkup).toContain(
        encodeURIComponent('नमस्ते आशीष शुद्ध जल! मैंने आपके टीडीएस कैलकुलेटर पर अपने पानी की जांच की है:')
      );
    });
  });

  describe('English Language Mode', () => {
    it('should render all titles, badges, and advice in English when selected', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('en');

      expect(htmlMarkup).toContain(escapeHtmlEntities(englishDict.tds.sectionBadge));
      expect(htmlMarkup).toContain(englishDict.tds.sectionTitle);
      expect(htmlMarkup).toContain(englishDict.tds.sectionSubtitle);
      expect(htmlMarkup).toContain(englishDict.tds.sources.chapakal);
      expect(htmlMarkup).toContain('Most common in Siwan');
      expect(htmlMarkup).toContain('Optimal Sweet Taste &amp; Healthy Minerals');
      expect(htmlMarkup).toContain('Ashish Sudh Jal Quality Assurance');
      expect(htmlMarkup).toContain(englishDict.tds.asjQualityNotice);
      expect(htmlMarkup).toContain(
        encodeURIComponent('Hello Ashish Sudh Jal! I checked my home water quality on your TDS Analyzer:')
      );
    });
  });

  describe('Hard and Unsafe Water State Verification', () => {
    it('should render hard water status warning with amber banner for 450 PPM', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi', { initialPpm: 450 });

      expect(htmlMarkup).toContain('asj-tds-result-card--unsafe');
      expect(htmlMarkup).toContain('असुरक्षित - आरओ आवश्यक');
      expect(htmlMarkup).toContain('कठोर / अधिक खनिज वाला पानी');
      expect(htmlMarkup).toContain('स्वास्थ्य के लिए हानिकारक एवं भारी जल');
    });

    it('should render hazardous water status with red banner for 750 PPM', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi', { initialPpm: 750 });

      expect(htmlMarkup).toContain('asj-tds-result-card--unsafe');
      expect(htmlMarkup).toContain('असुरक्षित / अत्यधिक दूषित पानी');
      expect(htmlMarkup).toContain('value="750"');
    });

    it('should display source-specific advisory when initialSource is passed', () => {
      const htmlMarkup = renderTdsAnalyzerWithLanguage('hi', {
        initialPpm: 320,
        initialSource: 'chapakal',
      });

      expect(htmlMarkup).toContain('asj-tds-result-card__source-context');
      expect(htmlMarkup).toContain('सिवान में चापाकल का पानी उथले जलस्तर से आता है');
    });
  });

  describe('Subcomponents Direct Rendering', () => {
    const useCase = new CalculateTdsQualityUseCase();

    it('TdsGauge should render with marker percentage computed accurately', () => {
      const htmlMarkup = renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsGauge, { ppm: 150, activeGrade: 'IDEAL' })
        )
      );

      expect(htmlMarkup).toContain('left:15%');
      expect(htmlMarkup).toContain('asj-tds-gauge__segment--active');
      expect(htmlMarkup).toContain('asj-tds-gauge__segment--ideal');
    });

    it('TdsSlider should invoke onPpmChange callback and display custom className', () => {
      let capturedPpm = 0;
      const htmlMarkup = renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsSlider, {
            ppm: 250,
            onPpmChange: (nextPpm) => {
              capturedPpm = nextPpm;
            },
            className: 'custom-slider-class',
          })
        )
      );

      expect(htmlMarkup).toContain('custom-slider-class');
      expect(htmlMarkup).toContain('value="250"');
      expect(capturedPpm).toBe(0); // initial render
    });

    it('TdsSourceSelector should render custom radio buttons and highlight selected source', () => {
      const htmlMarkup = renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsSourceSelector, {
            selectedSource: 'nal_jal',
            onSourceSelect: () => {},
          })
        )
      );

      expect(htmlMarkup).toContain('asj-tds-source-selector__btn--active');
      expect(htmlMarkup).toContain('हर घर नल का जल');
    });

    it('TdsResultCard should render safe verdict for ideal drinking water', () => {
      const result = useCase.execute(110, 'submersible');

      const htmlMarkup = renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsResultCard, {
            analysisResult: result,
            source: 'submersible',
          })
        )
      );

      expect(htmlMarkup).toContain('asj-tds-result-card--safe');
      expect(htmlMarkup).toContain('asj-tds-result-card--ideal');
      expect(htmlMarkup).toContain('सबमर्सिबल का पानी');
      expect(htmlMarkup).toContain('पीने के लिए सुरक्षित');
    });
  });
});
