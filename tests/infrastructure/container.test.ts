import { describe, it, expect } from 'vitest';
import { container, createAppContainer } from '../../src/infrastructure/di/container';
import type { AppContainer } from '../../src/infrastructure/di/container';
import { InMemoryVillageRepository } from '../../src/infrastructure/repositories/InMemoryVillageRepository';
import { StaticProductRepository } from '../../src/infrastructure/repositories/StaticProductRepository';
import { WhatsAppLinkDispatcher } from '../../src/infrastructure/dispatchers/WhatsAppLinkDispatcher';
import { LocalStoragePreferenceRepository } from '../../src/infrastructure/repositories/LocalStoragePreferenceRepository';
import type { IVillageRepository } from '../../src/core/domain/repositories/IVillageRepository';
import type { IProductRepository } from '../../src/core/domain/repositories/IProductRepository';
import type { IOrderDispatcher } from '../../src/core/domain/repositories/IOrderDispatcher';
import type { IPreferenceRepository, SavedCustomerDetails } from '../../src/core/domain/repositories/IPreferenceRepository';
import { OrderDraft } from '../../src/core/domain/entities/OrderDraft';
import type { CalculatedOrderSummary } from '../../src/core/domain/entities/OrderDraft';
import { IndianPhoneNumber } from '../../src/core/domain/value-objects/IndianPhoneNumber';
import { Money } from '../../src/core/domain/value-objects/Money';

describe('DI Composition Root (container.ts)', () => {
  describe('Default Singleton Container', () => {
    it('should instantiate and expose all 4 required domain interfaces', () => {
      expect(container).toBeDefined();
      expect(container.villageRepository).toBeDefined();
      expect(container.productRepository).toBeDefined();
      expect(container.orderDispatcher).toBeDefined();
      expect(container.preferenceRepository).toBeDefined();
    });

    it('should bind villageRepository to InMemoryVillageRepository implementing IVillageRepository', async () => {
      expect(container.villageRepository).toBeInstanceOf(InMemoryVillageRepository);

      const allVillages = await container.villageRepository.getAll();
      expect(allVillages.length).toBeGreaterThanOrEqual(15);

      const sarsar = await container.villageRepository.getById('sarsar');
      expect(sarsar).not.toBeNull();
      expect(sarsar?.getName('en')).toBe('Sarsar');
      expect(sarsar?.getName('hi')).toBe('सरसर');
      expect(sarsar?.isPlantLocation()).toBe(true);

      const isPurainaServiceable = await container.villageRepository.isServiceable('Puraina');
      expect(isPurainaServiceable).toBe(true);
    });

    it('should bind productRepository to StaticProductRepository implementing IProductRepository', async () => {
      expect(container.productRepository).toBeInstanceOf(StaticProductRepository);

      const products = await container.productRepository.getAll();
      expect(products.length).toBeGreaterThan(0);

      const jarNormal = await container.productRepository.getById('jar-normal');
      expect(jarNormal).not.toBeNull();
      expect(jarNormal?.getName('en')).toBe('20L Normal RO Water Jar');
      expect(jarNormal?.getName('hi')).toBe('20 लीटर नॉर्मल आरओ पानी जार');
      expect(jarNormal?.getBasePrice()?.getAmount()).toBe(30);
      expect(jarNormal?.getBasePrice()?.format()).toBe('₹30');
      expect(jarNormal?.getRecurringPrice()?.getAmount()).toBe(25);
      expect(jarNormal?.getDeposit().getAmount()).toBe(150);

      const jars = await container.productRepository.getByCategory('jar');
      expect(jars.length).toBe(2);
    });

    it('should bind orderDispatcher to WhatsAppLinkDispatcher implementing IOrderDispatcher', () => {
      expect(container.orderDispatcher).toBeInstanceOf(WhatsAppLinkDispatcher);

      const draft = new OrderDraft({
        customerName: 'Ashish Verma',
        customerPhone: new IndianPhoneNumber('8235882384'),
        villageId: 'sarsar',
        villageName: 'Sarsar',
        landmark: 'Near Sarsar High School',
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 2,
        isRecurring: false,
        isFirstOrder: true,
      });

      const summary: CalculatedOrderSummary = {
        baseAmount: new Money(60),
        recurringSavings: new Money(0),
        depositAmount: new Money(150),
        totalAmountPayable: new Money(210),
        unitPrice: new Money(30),
        isCustomQuote: false,
      };

      const url = container.orderDispatcher.generateWhatsAppUrl(draft, summary, 'hi');
      expect(url).toContain('https://wa.me/918235882384?text=');
      expect(decodeURIComponent(url)).toContain('Ashish Verma');
    });

    it('should bind preferenceRepository to LocalStoragePreferenceRepository implementing IPreferenceRepository', () => {
      expect(container.preferenceRepository).toBeInstanceOf(LocalStoragePreferenceRepository);

      // In test/node environment without window, graceful fallbacks should be safe
      expect(container.preferenceRepository.getLanguage()).toBeNull();
      expect(container.preferenceRepository.getSavedCustomerDetails()).toBeNull();
    });
  });

  describe('createAppContainer Factory Function', () => {
    it('should create a fresh independent container with default implementations when called without arguments', () => {
      const freshContainer = createAppContainer();

      expect(freshContainer.villageRepository).toBeInstanceOf(InMemoryVillageRepository);
      expect(freshContainer.productRepository).toBeInstanceOf(StaticProductRepository);
      expect(freshContainer.orderDispatcher).toBeInstanceOf(WhatsAppLinkDispatcher);
      expect(freshContainer.preferenceRepository).toBeInstanceOf(LocalStoragePreferenceRepository);

      // Ensure fresh instances are created
      expect(freshContainer.villageRepository).not.toBe(container.villageRepository);
      expect(freshContainer.productRepository).not.toBe(container.productRepository);
      expect(freshContainer.orderDispatcher).not.toBe(container.orderDispatcher);
      expect(freshContainer.preferenceRepository).not.toBe(container.preferenceRepository);
    });

    it('should allow partial overriding with custom mock villageRepository', async () => {
      const mockVillageRepo: IVillageRepository = {
        getAll: async () => [],
        getById: async () => null,
        search: async () => [],
        isServiceable: async () => false,
      };

      const customContainer = createAppContainer({
        villageRepository: mockVillageRepo,
      });

      expect(customContainer.villageRepository).toBe(mockVillageRepo);
      // Non-overridden dependencies fallback to defaults
      expect(customContainer.productRepository).toBeInstanceOf(StaticProductRepository);
      expect(customContainer.orderDispatcher).toBeInstanceOf(WhatsAppLinkDispatcher);
      expect(customContainer.preferenceRepository).toBeInstanceOf(LocalStoragePreferenceRepository);

      const villages = await customContainer.villageRepository.getAll();
      expect(villages).toEqual([]);
    });

    it('should allow partial overriding with custom mock productRepository', async () => {
      const mockProductRepo: IProductRepository = {
        getAll: async () => [],
        getById: async () => null,
        getByCategory: async () => [],
      };

      const customContainer = createAppContainer({
        productRepository: mockProductRepo,
      });

      expect(customContainer.productRepository).toBe(mockProductRepo);
      expect(customContainer.villageRepository).toBeInstanceOf(InMemoryVillageRepository);
    });

    it('should allow partial overriding with custom mock orderDispatcher', () => {
      const mockDispatcher: IOrderDispatcher = {
        generateWhatsAppUrl: () => 'https://custom-dispatcher.mock',
      };

      const customContainer = createAppContainer({
        orderDispatcher: mockDispatcher,
      });

      expect(customContainer.orderDispatcher).toBe(mockDispatcher);
      const dummyDraft = new OrderDraft({
        customerName: 'Test',
        customerPhone: new IndianPhoneNumber('9876543210'),
        villageId: 'sarsar',
        villageName: 'Sarsar',
        landmark: 'Near Temple',
        serviceType: 'jar',
        productId: 'jar-normal',
        temperature: 'normal',
        quantity: 1,
        isRecurring: false,
        isFirstOrder: false,
      });
      const dummySummary: CalculatedOrderSummary = {
        baseAmount: new Money(30),
        recurringSavings: new Money(0),
        depositAmount: new Money(0),
        totalAmountPayable: new Money(30),
        unitPrice: new Money(30),
        isCustomQuote: false,
      };

      expect(customContainer.orderDispatcher.generateWhatsAppUrl(dummyDraft, dummySummary, 'en')).toBe(
        'https://custom-dispatcher.mock'
      );
    });

    it('should allow partial overriding with custom mock preferenceRepository', () => {
      let currentLang: string | null = 'en';
      let savedDetails: SavedCustomerDetails | null = null;

      const mockPreferenceRepo: IPreferenceRepository = {
        getLanguage: () => currentLang,
        setLanguage: (lang: string) => {
          currentLang = lang;
        },
        getSavedCustomerDetails: () => savedDetails,
        saveCustomerDetails: (details: SavedCustomerDetails) => {
          savedDetails = details;
        },
        clearCustomerDetails: () => {
          savedDetails = null;
        },
        clearPreferences: () => {
          currentLang = null;
          savedDetails = null;
        },
      };

      const customContainer = createAppContainer({
        preferenceRepository: mockPreferenceRepo,
      });

      expect(customContainer.preferenceRepository).toBe(mockPreferenceRepo);
      expect(customContainer.preferenceRepository.getLanguage()).toBe('en');
      customContainer.preferenceRepository.setLanguage('hi');
      expect(customContainer.preferenceRepository.getLanguage()).toBe('hi');
    });

    it('should allow complete override with all custom dependencies', () => {
      const mockContainer: AppContainer = {
        villageRepository: {
          getAll: async () => [],
          getById: async () => null,
          search: async () => [],
          isServiceable: async () => true,
        },
        productRepository: {
          getAll: async () => [],
          getById: async () => null,
          getByCategory: async () => [],
        },
        orderDispatcher: {
          generateWhatsAppUrl: () => 'https://mock.com',
        },
        preferenceRepository: {
          getLanguage: () => 'hi',
          setLanguage: () => {},
          getSavedCustomerDetails: () => null,
          saveCustomerDetails: () => {},
          clearCustomerDetails: () => {},
          clearPreferences: () => {},
        },
      };

      const fullyCustom = createAppContainer(mockContainer);
      expect(fullyCustom.villageRepository).toBe(mockContainer.villageRepository);
      expect(fullyCustom.productRepository).toBe(mockContainer.productRepository);
      expect(fullyCustom.orderDispatcher).toBe(mockContainer.orderDispatcher);
      expect(fullyCustom.preferenceRepository).toBe(mockContainer.preferenceRepository);
    });
  });
});
