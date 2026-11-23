import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import {
  useTdsAnalyzer,
  DEFAULT_TDS_PPM,
  TDS_PRESETS,
} from '../../../src/presentation/hooks/useTdsAnalyzer';
import type { UseTdsAnalyzerReturn } from '../../../src/presentation/hooks/useTdsAnalyzer';
import { CalculateTdsQualityUseCase } from '../../../src/core/use-cases/tds/CalculateTdsQualityUseCase';

/**
 * Test consumer component that captures the return value of useTdsAnalyzer.
 */
function TdsAnalyzerTestConsumer({
  initialPpm,
  initialSource,
  onCapture,
}: {
  readonly initialPpm?: number;
  readonly initialSource?: 'chapakal' | 'submersible' | 'nal_jal' | 'tanker';
  readonly onCapture: (hookReturn: UseTdsAnalyzerReturn) => void;
}): JSX.Element {
  const hookState = useTdsAnalyzer({ initialPpm, initialSource });
  onCapture(hookState);
  return React.createElement('div', null, `${hookState.ppm} PPM - ${hookState.statusLabel}`);
}

describe('useTdsAnalyzer Hook (src/presentation/hooks/useTdsAnalyzer.ts)', () => {
  describe('Context Boundary Protection', () => {
    it('should throw descriptive error when used outside LanguageProvider', () => {
      function NakedConsumer(): JSX.Element {
        useTdsAnalyzer();
        return React.createElement('div', null, 'naked');
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedConsumer))).toThrow(
        'useLanguage must be used within a LanguageProvider.'
      );
    });
  });

  describe('Default State (Hindi-First)', () => {
    it('should initialize with default ideal 120 PPM and Hindi localized labels', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseTdsAnalyzerReturn;

      expect(state.ppm).toBe(DEFAULT_TDS_PPM);
      expect(state.source).toBeUndefined();
      expect(state.activeGrade).toBe('IDEAL');
      expect(state.isSafe).toBe(true);
      expect(state.colorHex).toBe('#10b981');
      expect(state.statusLabel).toBe('सर्वश्रेष्ठ आरओ शुद्ध पानी');
      expect(state.statusDescription).toContain('उत्कृष्ट मीठा स्वाद');
      expect(state.actionRequired).toContain('दैनिक पारिवारिक उपयोग');
      expect(state.sourceContext).toBeUndefined();
      expect(state.presets).toEqual(TDS_PRESETS);
    });
  });

  describe('Custom Initial Options & Source Context', () => {
    it('should classify low mineral water (< 50 PPM) with sky blue color', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 35,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(35);
      expect(state.activeGrade).toBe('LOW_MINERAL');
      expect(state.isSafe).toBe(true);
      expect(state.colorHex).toBe('#38bdf8');
      expect(state.statusLabel).toBe('कम खनिज युक्त पानी');
    });

    it('should classify acceptable water (150 - 300 PPM) with cyan color', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 220,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(220);
      expect(state.activeGrade).toBe('ACCEPTABLE');
      expect(state.isSafe).toBe(true);
      expect(state.colorHex).toBe('#06b6d4');
      expect(state.statusLabel).toBe('अच्छा पेयजल');
    });

    it('should classify hard water (300 - 500 PPM) as unsafe with amber color', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 420,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(420);
      expect(state.activeGrade).toBe('HARD');
      expect(state.isSafe).toBe(false);
      expect(state.colorHex).toBe('#f59e0b');
      expect(state.statusLabel).toBe('कठोर / अधिक खनिज वाला पानी');
      expect(state.actionRequired).toContain('आरओ शुद्धिकरण की दृढ़ता से सलाह');
    });

    it('should classify poor/hazardous water (> 500 PPM) as unsafe with red color', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 680,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(680);
      expect(state.activeGrade).toBe('POOR');
      expect(state.isSafe).toBe(false);
      expect(state.colorHex).toBe('#ef4444');
      expect(state.statusLabel).toBe('असुरक्षित / अत्यधिक दूषित पानी');
    });

    it('should provide rural source-specific context for chapakal in Hindi', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 250,
            initialSource: 'chapakal',
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.source).toBe('chapakal');
      expect(state.sourceContext).toContain('सिवान में चापाकल का पानी');
    });

    it('should provide rural source-specific context for submersible', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 380,
            initialSource: 'submersible',
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.source).toBe('submersible');
      expect(state.sourceContext).toContain('सबमर्सिबल का पानी');
    });
  });

  describe('Bilingual English Language Mode', () => {
    it('should return English labels and source descriptions when language is English', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'en' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 120,
            initialSource: 'chapakal',
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.statusLabel).toBe('Ideal RO Drinking Water');
      expect(state.statusDescription).toContain('Optimal sweet taste and mineral balance');
      expect(state.actionRequired).toContain('Best quality for daily family consumption');
      expect(state.sourceContext).toContain('Handpumps (Chapakal) in Siwan');
    });
  });

  describe('Defensive Input Sanitization', () => {
    it('should clamp negative PPM values to 0', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: -100,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(0);
      expect(state.activeGrade).toBe('LOW_MINERAL');
    });

    it('should clamp excessively high PPM values to 1000', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 99999,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(1000);
      expect(state.activeGrade).toBe('POOR');
    });

    it('should round decimal PPM values', () => {
      let capturedState: UseTdsAnalyzerReturn | null = null;

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(TdsAnalyzerTestConsumer, {
            initialPpm: 124.7,
            onCapture: (hookReturn) => {
              capturedState = hookReturn;
            },
          })
        )
      );

      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(125);
    });
  });

  describe('Use Case Injection', () => {
    it('should support custom CalculateTdsQualityUseCase instance', () => {
      const customUseCase = new CalculateTdsQualityUseCase();
      let capturedState: UseTdsAnalyzerReturn | null = null;

      function CustomUseCaseConsumer(): JSX.Element {
        const hookReturn = useTdsAnalyzer({ useCase: customUseCase });
        capturedState = hookReturn;
        return React.createElement('div', null, hookReturn.ppm);
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(CustomUseCaseConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseTdsAnalyzerReturn;
      expect(state.ppm).toBe(120);
    });
  });
});
