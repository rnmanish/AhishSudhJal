import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { useVillageChecker } from '../../../src/presentation/hooks/useVillageChecker';
import type { UseVillageCheckerReturn } from '../../../src/presentation/hooks/useVillageChecker';
import { VillageCoverage } from '../../../src/core/domain/entities/VillageCoverage';
import type { IVillageRepository } from '../../../src/core/domain/repositories/IVillageRepository';
import { ValidateVillageServiceabilityUseCase } from '../../../src/core/use-cases/serviceability/ValidateVillageServiceabilityUseCase';

class TestVillageRepository implements IVillageRepository {
  private readonly mockVillages: readonly VillageCoverage[] = [
    new VillageCoverage({
      id: 'sarsar',
      name: 'Sarsar',
      nameHindi: 'सरसर',
      pincode: '841226',
      distanceKm: 0,
      deliverySla: 'Within 30 Mins (Plant)',
      deliverySlaHindi: '30 मिनट के भीतर (प्लांट)',
      isPlantLocation: true,
    }),
    new VillageCoverage({
      id: 'puraina',
      name: 'Puraina',
      nameHindi: 'पुरैना',
      pincode: '841226',
      distanceKm: 2.5,
      deliverySla: 'Within 1 Hour',
      deliverySlaHindi: '1 घंटे के भीतर',
    }),
  ];

  public async getAll(): Promise<VillageCoverage[]> {
    return [...this.mockVillages];
  }

  public async getById(targetVillageId: string): Promise<VillageCoverage | null> {
    const match = this.mockVillages.find(
      (villageItem) => villageItem.getId() === targetVillageId
    );
    return match ?? null;
  }

  public async search(searchQueryText: string): Promise<VillageCoverage[]> {
    const clean = searchQueryText.trim().toLowerCase();
    if (!clean) {
      return [];
    }
    return this.mockVillages.filter((villageItem) =>
      villageItem.matchesQuery(clean)
    );
  }

  public async isServiceable(searchQueryText: string): Promise<boolean> {
    const matches = await this.search(searchQueryText);
    return matches.length > 0;
  }
}

describe('useVillageChecker Hook (src/presentation/hooks/useVillageChecker.ts)', () => {
  describe('Initial State & Parameter Defaults', () => {
    it('should initialize with default empty query, null result, and false checking state', () => {
      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker();
        return React.createElement('div', null, capturedState.searchQuery);
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;
      expect(state.searchQuery).toBe('');
      expect(state.isChecking).toBe(false);
      expect(state.result).toBeNull();
      expect(state.isServiceable).toBeNull();
      expect(state.matchedVillage).toBeNull();
      expect(state.statusMessage).toBe('');
      expect(state.deliverySla).toBeUndefined();
    });

    it('should initialize with custom initialQuery when provided', () => {
      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({ initialQuery: 'Puraina' });
        return React.createElement('div', null, capturedState.searchQuery);
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'en' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;
      expect(state.searchQuery).toBe('Puraina');
    });
  });

  describe('Serviceability Execution & Validation', () => {
    it('should evaluate serviceable village correctly in Hindi', async () => {
      const mockRepository = new TestVillageRepository();
      const mockUseCase = new ValidateVillageServiceabilityUseCase(mockRepository);

      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({
          villageRepository: mockRepository,
          useCase: mockUseCase,
        });
        return React.createElement('div', null, 'Consumer');
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;

      const evalResult = await state.checkServiceability('सरसर');
      expect(evalResult.isServiceable).toBe(true);
      expect(evalResult.village).not.toBeNull();
      expect(evalResult.village?.getId()).toBe('sarsar');
      expect(evalResult.messageHi).toContain('सरसर में डिलीवरी उपलब्ध है');
    });

    it('should evaluate serviceable village correctly in English', async () => {
      const mockRepository = new TestVillageRepository();
      const mockUseCase = new ValidateVillageServiceabilityUseCase(mockRepository);

      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({
          villageRepository: mockRepository,
          useCase: mockUseCase,
        });
        return React.createElement('div', null, 'Consumer');
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'en' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;

      const evalResult = await state.checkServiceability('Puraina');
      expect(evalResult.isServiceable).toBe(true);
      expect(evalResult.village?.getId()).toBe('puraina');
      expect(evalResult.messageEn).toContain('delivers to Puraina');
    });

    it('should evaluate unserviceable location correctly', async () => {
      const mockRepository = new TestVillageRepository();
      const mockUseCase = new ValidateVillageServiceabilityUseCase(mockRepository);

      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({
          villageRepository: mockRepository,
          useCase: mockUseCase,
        });
        return React.createElement('div', null, 'Consumer');
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;

      const evalResult = await state.checkServiceability('Patna City');
      expect(evalResult.isServiceable).toBe(false);
      expect(evalResult.village).toBeNull();
      expect(evalResult.messageHi).toContain('वर्तमान में इस गाँव में सीधी डिलीवरी उपलब्ध नहीं है');
    });
  });

  describe('WhatsApp Inquiry URL Generation', () => {
    it('should generate properly encoded Hindi WhatsApp URL for custom village inquiry', () => {
      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({ initialQuery: 'मीरगंज' });
        return React.createElement('div', null, 'Consumer');
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;

      const generatedUrl = state.getWhatsAppInquiryUrl('मीरगंज');
      expect(generatedUrl).toContain('https://wa.me/918235882384?text=');
      expect(decodeURIComponent(generatedUrl)).toContain('मीरगंज');
      expect(decodeURIComponent(generatedUrl)).toContain('नमस्ते आशीष शुद्ध जल!');
    });

    it('should generate properly encoded English WhatsApp URL for custom village inquiry', () => {
      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({ initialQuery: 'Gopalganj' });
        return React.createElement('div', null, 'Consumer');
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'en' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;

      const generatedUrl = state.getWhatsAppInquiryUrl('Gopalganj');
      expect(generatedUrl).toContain('https://wa.me/918235882384?text=');
      expect(decodeURIComponent(generatedUrl)).toContain('Gopalganj');
      expect(decodeURIComponent(generatedUrl)).toContain('Hello Ashish Sudh Jal!');
    });
  });

  describe('Village Selection & Reset Handling', () => {
    it('should support selecting a village entity directly', async () => {
      const mockRepository = new TestVillageRepository();
      const mockUseCase = new ValidateVillageServiceabilityUseCase(mockRepository);

      let capturedState: UseVillageCheckerReturn | null = null;

      function HookConsumer(): JSX.Element {
        capturedState = useVillageChecker({
          villageRepository: mockRepository,
          useCase: mockUseCase,
        });
        return React.createElement('div', null, 'Consumer');
      }

      renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          { initialLanguage: 'hi' },
          React.createElement(HookConsumer)
        )
      );

      expect(capturedState).not.toBeNull();
      const state = capturedState as unknown as UseVillageCheckerReturn;

      const testVillage = new VillageCoverage({
        id: 'sarsar',
        name: 'Sarsar',
        nameHindi: 'सरसर',
        pincode: '841226',
        distanceKm: 0,
        deliverySla: 'Within 30 Mins (Plant)',
        deliverySlaHindi: '30 मिनट के भीतर (प्लांट)',
        isPlantLocation: true,
      });

      const selectedResult = await state.selectVillage(testVillage);
      expect(selectedResult.isServiceable).toBe(true);
      expect(selectedResult.village?.getId()).toBe('sarsar');
    });
  });
});
