import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  isValidIndianMobileNumber,
  resolveProductId,
  useBookingWizard,
} from '../../../src/presentation/hooks/useBookingWizard';
import type {
  UseBookingWizardOptions,
  UseBookingWizardReturn,
} from '../../../src/presentation/hooks/useBookingWizard';
import { LanguageProvider } from '../../../src/presentation/i18n/useLanguage';
import { ContainerProvider } from '../../../src/infrastructure/di/AppProviders';
import { createAppContainer } from '../../../src/infrastructure/di/container';
import { InMemoryVillageRepository } from '../../../src/infrastructure/repositories/InMemoryVillageRepository';
import { StaticProductRepository } from '../../../src/infrastructure/repositories/StaticProductRepository';
import type { StorageLike } from '../../../src/infrastructure/repositories/LocalStoragePreferenceRepository';
import { LocalStoragePreferenceRepository } from '../../../src/infrastructure/repositories/LocalStoragePreferenceRepository';
import { WhatsAppLinkDispatcher } from '../../../src/infrastructure/dispatchers/WhatsAppLinkDispatcher';

class InMemoryStorage implements StorageLike {
  private readonly store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }
}

describe('useBookingWizard Hook (src/presentation/hooks/useBookingWizard.ts)', () => {
  let inMemoryStorage: InMemoryStorage;
  let villageRepositoryDouble: InMemoryVillageRepository;
  let productRepositoryDouble: StaticProductRepository;
  let preferenceRepositoryDouble: LocalStoragePreferenceRepository;
  let orderDispatcherDouble: WhatsAppLinkDispatcher;

  beforeEach(() => {
    inMemoryStorage = new InMemoryStorage();
    villageRepositoryDouble = new InMemoryVillageRepository();
    productRepositoryDouble = new StaticProductRepository();
    preferenceRepositoryDouble = new LocalStoragePreferenceRepository({
      storage: inMemoryStorage,
    });
    orderDispatcherDouble = new WhatsAppLinkDispatcher('918235882384');
  });

  /**
   * Test harness helper to execute and capture useBookingWizard in-memory via renderToStaticMarkup.
   */
  function renderWizardHook(
    wizardOptions?: UseBookingWizardOptions,
    languageOption: 'hi' | 'en' = 'hi',
    onRenderCallback?: (wizardReturn: UseBookingWizardReturn) => void
  ): UseBookingWizardReturn {
    let capturedResult: UseBookingWizardReturn | null = null;

    const customContainer = createAppContainer({
      villageRepository: villageRepositoryDouble,
      productRepository: productRepositoryDouble,
      preferenceRepository: preferenceRepositoryDouble,
      orderDispatcher: orderDispatcherDouble,
    });

    function TestHarnessConsumer(): JSX.Element {
      capturedResult = useBookingWizard(wizardOptions);
      if (onRenderCallback) {
        onRenderCallback(capturedResult);
      }
      return React.createElement('div', { 'data-testid': 'wizard-harness' });
    }

    renderToStaticMarkup(
      React.createElement(
        ContainerProvider,
        { container: customContainer },
        React.createElement(
          LanguageProvider,
          { initialLanguage: languageOption, preferenceRepository: preferenceRepositoryDouble },
          React.createElement(TestHarnessConsumer)
        )
      )
    );

    if (!capturedResult) {
      throw new Error('Failed to capture useBookingWizard result.');
    }

    return capturedResult;
  }

  describe('Utility Functions', () => {
    it('isValidIndianMobileNumber should validate valid 10-digit Indian mobile numbers', () => {
      expect(isValidIndianMobileNumber('9876543210')).toBe(true);
      expect(isValidIndianMobileNumber('8235882384')).toBe(true);
      expect(isValidIndianMobileNumber('+91 82358 82384')).toBe(true);
      expect(isValidIndianMobileNumber('6200000000')).toBe(true);
    });

    it('isValidIndianMobileNumber should reject invalid mobile numbers', () => {
      expect(isValidIndianMobileNumber('')).toBe(false);
      expect(isValidIndianMobileNumber('12345')).toBe(false);
      expect(isValidIndianMobileNumber('5235882384')).toBe(false); // Does not start with 6-9
      expect(isValidIndianMobileNumber('abcdefghij')).toBe(false);
    });

    it('resolveProductId should correctly map service and temperature to catalog product IDs', () => {
      expect(resolveProductId('jar', 'normal')).toBe('jar-normal');
      expect(resolveProductId('jar', 'chilled')).toBe('jar-chilled');
      expect(resolveProductId('bulk_bottles')).toBe('bulk-bottles');
      expect(resolveProductId('event')).toBe('event-supply');
    });
  });

  describe('Initial State and Default Values', () => {
    it('should initialize with step 1 and default 20L normal jar service', () => {
      const wizardState = renderWizardHook();

      expect(wizardState.currentStep).toBe(1);
      expect(wizardState.serviceType).toBe('jar');
      expect(wizardState.productId).toBe('jar-normal');
      expect(wizardState.temperature).toBe('normal');
      expect(wizardState.quantity).toBe(1);
      expect(wizardState.isRecurring).toBe(false);
      expect(wizardState.isFirstOrder).toBe(false);
      expect(wizardState.eventGuestCount).toBe(100);
      expect(wizardState.eventType).toBe('wedding');
      expect(wizardState.saveDetails).toBe(true);
      expect(wizardState.validationErrors).toEqual({});
    });

    it('should accept custom initial options', () => {
      const customOptions: UseBookingWizardOptions = {
        initialStep: 2,
        initialServiceType: 'bulk_bottles',
        initialProductId: 'bulk-bottles',
      };

      const wizardState = renderWizardHook(customOptions, 'en');

      expect(wizardState.currentStep).toBe(2);
      expect(wizardState.serviceType).toBe('bulk_bottles');
      expect(wizardState.productId).toBe('bulk-bottles');
    });
  });

  describe('Service Selection and Navigation Callbacks', () => {
    it('should provide callable transition and modifier functions', () => {
      const wizardState = renderWizardHook();

      expect(typeof wizardState.goToStep).toBe('function');
      expect(typeof wizardState.nextStep).toBe('function');
      expect(typeof wizardState.previousStep).toBe('function');
      expect(typeof wizardState.selectService).toBe('function');
      expect(typeof wizardState.setTemperature).toBe('function');
      expect(typeof wizardState.setQuantity).toBe('function');
      expect(typeof wizardState.setIsRecurring).toBe('function');
      expect(typeof wizardState.setIsFirstOrder).toBe('function');
      expect(typeof wizardState.setEventGuestCount).toBe('function');
      expect(typeof wizardState.setEventType).toBe('function');
      expect(typeof wizardState.setEventDate).toBe('function');
      expect(typeof wizardState.setEventSeason).toBe('function');
      expect(typeof wizardState.setCustomerName).toBe('function');
      expect(typeof wizardState.setCustomerPhone).toBe('function');
      expect(typeof wizardState.setVillageId).toBe('function');
      expect(typeof wizardState.setLandmark).toBe('function');
      expect(typeof wizardState.setSaveDetails).toBe('function');
      expect(typeof wizardState.validateStep).toBe('function');
      expect(typeof wizardState.submitOrder).toBe('function');
      expect(typeof wizardState.reset).toBe('function');
    });

    it('validateStep should validate step 1 accurately', () => {
      const wizardState = renderWizardHook();
      expect(wizardState.validateStep(1)).toBe(true);
    });

    it('validateStep should validate step 3 and detect missing details', () => {
      const wizardState = renderWizardHook({ initialStep: 3 });
      const isValid = wizardState.validateStep(3);
      expect(isValid).toBe(false);
    });
  });

  describe('Customer Preference Pre-population', () => {
    it('should pre-populate customer details from preference repository if available', () => {
      preferenceRepositoryDouble.saveCustomerDetails({
        customerName: 'Anil Sharma',
        customerPhone: '8235882384',
        villageId: 'puraina',
        landmark: 'Middle School',
      });

      const wizardState = renderWizardHook();

      expect(wizardState.customerName).toBe('Anil Sharma');
      expect(wizardState.customerPhone).toBe('8235882384');
      expect(wizardState.villageId).toBe('puraina');
      expect(wizardState.landmark).toBe('Middle School');
    });
  });

  describe('Event Water Volume Reactive Estimate', () => {
    it('should compute event water volume estimation when service is event', () => {
      const wizardState = renderWizardHook({ initialServiceType: 'event' });

      expect(wizardState.eventEstimate).not.toBeNull();
      expect(wizardState.eventEstimate?.estimatedLitres).toBeGreaterThan(0);
      expect(wizardState.eventEstimate?.recommended20LJars).toBeGreaterThan(0);
    });

    it('should return null event estimate when service is not event', () => {
      const wizardState = renderWizardHook({ initialServiceType: 'jar' });
      expect(wizardState.eventEstimate).toBeNull();
    });
  });
});
