import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AppProviders,
  ContainerProvider,
  ContainerContext,
  useContainer,
  useVillageRepository,
  useProductRepository,
  useOrderDispatcher,
  usePreferenceRepository,
} from '../../src/infrastructure/di/AppProviders';
import { container as defaultContainer, createAppContainer } from '../../src/infrastructure/di/container';
import type { AppContainer } from '../../src/infrastructure/di/container';
import type { IVillageRepository } from '../../src/core/domain/repositories/IVillageRepository';
import type { IProductRepository } from '../../src/core/domain/repositories/IProductRepository';
import type { IOrderDispatcher } from '../../src/core/domain/repositories/IOrderDispatcher';
import type { IPreferenceRepository } from '../../src/core/domain/repositories/IPreferenceRepository';
import { OrderDraft } from '../../src/core/domain/entities/OrderDraft';
import type { CalculatedOrderSummary } from '../../src/core/domain/entities/OrderDraft';
import { IndianPhoneNumber } from '../../src/core/domain/value-objects/IndianPhoneNumber';
import { Money } from '../../src/core/domain/value-objects/Money';

function createDummyOrderContext(): {
  draft: OrderDraft;
  summary: CalculatedOrderSummary;
} {
  const draft = new OrderDraft({
    customerName: 'Test Customer',
    customerPhone: new IndianPhoneNumber('8235882384'),
    villageId: 'sarsar',
    villageName: 'Sarsar',
    landmark: 'Near Sarsar Primary School',
    serviceType: 'jar',
    productId: 'jar-normal',
    temperature: 'normal',
    quantity: 1,
    isRecurring: false,
    isFirstOrder: false,
  });

  const summary: CalculatedOrderSummary = {
    baseAmount: new Money(30),
    recurringSavings: new Money(0),
    depositAmount: new Money(0),
    totalAmountPayable: new Money(30),
    unitPrice: new Money(30),
    isCustomQuote: false,
  };

  return { draft, summary };
}

describe('DI AppProviders and Context Hooks (AppProviders.tsx)', () => {
  describe('Context Hooks Error Handling (Outside Provider)', () => {
    it('should throw descriptive error when useContainer is called outside provider', () => {
      function NakedConsumer() {
        useContainer();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedConsumer))).toThrow(
        'useContainer must be used within an AppProviders or ContainerProvider component.'
      );
    });

    it('should throw error when useVillageRepository is called outside provider', () => {
      function NakedVillageConsumer() {
        useVillageRepository();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedVillageConsumer))).toThrow(
        'useContainer must be used within an AppProviders or ContainerProvider component.'
      );
    });

    it('should throw error when useProductRepository is called outside provider', () => {
      function NakedProductConsumer() {
        useProductRepository();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedProductConsumer))).toThrow(
        'useContainer must be used within an AppProviders or ContainerProvider component.'
      );
    });

    it('should throw error when useOrderDispatcher is called outside provider', () => {
      function NakedDispatcherConsumer() {
        useOrderDispatcher();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedDispatcherConsumer))).toThrow(
        'useContainer must be used within an AppProviders or ContainerProvider component.'
      );
    });

    it('should throw error when usePreferenceRepository is called outside provider', () => {
      function NakedPreferenceConsumer() {
        usePreferenceRepository();
        return null;
      }

      expect(() => renderToStaticMarkup(React.createElement(NakedPreferenceConsumer))).toThrow(
        'useContainer must be used within an AppProviders or ContainerProvider component.'
      );
    });
  });

  describe('AppProviders with Default Container', () => {
    it('should provide default container singleton to consumers', () => {
      let retrievedContainer: AppContainer | undefined;

      function ContainerConsumer() {
        retrievedContainer = useContainer();
        return React.createElement('div', null, 'loaded');
      }

      const html = renderToStaticMarkup(
        React.createElement(AppProviders, null, React.createElement(ContainerConsumer))
      );

      expect(html).toContain('loaded');
      expect(retrievedContainer).toBe(defaultContainer);
      const resolved: AppContainer = retrievedContainer ?? defaultContainer;
      expect(resolved.villageRepository).toBe(defaultContainer.villageRepository);
      expect(resolved.productRepository).toBe(defaultContainer.productRepository);
      expect(resolved.orderDispatcher).toBe(defaultContainer.orderDispatcher);
      expect(resolved.preferenceRepository).toBe(defaultContainer.preferenceRepository);
    });

    it('should allow consumers to access individual repositories via dedicated hooks', () => {
      let villageRepo: IVillageRepository | null = null;
      let productRepo: IProductRepository | null = null;
      let orderDispatcher: IOrderDispatcher | null = null;
      let preferenceRepo: IPreferenceRepository | null = null;

      function GranularConsumer() {
        villageRepo = useVillageRepository();
        productRepo = useProductRepository();
        orderDispatcher = useOrderDispatcher();
        preferenceRepo = usePreferenceRepository();
        return React.createElement('span', null, 'ready');
      }

      const html = renderToStaticMarkup(
        React.createElement(AppProviders, null, React.createElement(GranularConsumer))
      );

      expect(html).toContain('ready');
      expect(villageRepo).toBe(defaultContainer.villageRepository);
      expect(productRepo).toBe(defaultContainer.productRepository);
      expect(orderDispatcher).toBe(defaultContainer.orderDispatcher);
      expect(preferenceRepo).toBe(defaultContainer.preferenceRepository);
    });
  });

  describe('AppProviders with Custom Container Overrides', () => {
    it('should provide custom container when injected into AppProviders', () => {
      const mockDispatcher: IOrderDispatcher = {
        generateWhatsAppUrl: () => 'https://mock-whatsapp-url.com',
      };

      const customContainer = createAppContainer({
        orderDispatcher: mockDispatcher,
      });

      let retrievedDispatcher: IOrderDispatcher | null = null;

      function CustomConsumer() {
        retrievedDispatcher = useOrderDispatcher();
        const { draft, summary } = createDummyOrderContext();
        return React.createElement(
          'div',
          null,
          retrievedDispatcher.generateWhatsAppUrl(draft, summary, 'hi')
        );
      }

      const html = renderToStaticMarkup(
        React.createElement(
          AppProviders,
          { container: customContainer },
          React.createElement(CustomConsumer)
        )
      );

      expect(html).toContain('https://mock-whatsapp-url.com');
      expect(retrievedDispatcher).toBe(mockDispatcher);
    });
  });

  describe('ContainerProvider Direct Usage & Nesting', () => {
    it('should work when ContainerProvider is used directly', () => {
      let isAvailable = false;

      function DirectConsumer() {
        const c = useContainer();
        isAvailable = Boolean(c);
        return React.createElement('div', null, 'direct');
      }

      const html = renderToStaticMarkup(
        React.createElement(ContainerProvider, null, React.createElement(DirectConsumer))
      );

      expect(html).toContain('direct');
      expect(isAvailable).toBe(true);
    });

    it('should support nested providers where inner provider overrides outer container', () => {
      const outerDispatcher: IOrderDispatcher = {
        generateWhatsAppUrl: () => 'https://outer.url',
      };
      const innerDispatcher: IOrderDispatcher = {
        generateWhatsAppUrl: () => 'https://inner.url',
      };

      const outerContainer = createAppContainer({ orderDispatcher: outerDispatcher });
      const innerContainer = createAppContainer({ orderDispatcher: innerDispatcher });

      let outerRetrievedUrl = '';
      let innerRetrievedUrl = '';

      function OuterConsumer() {
        const dispatcher = useOrderDispatcher();
        const { draft, summary } = createDummyOrderContext();
        outerRetrievedUrl = dispatcher.generateWhatsAppUrl(draft, summary, 'en');
        return React.createElement('div', null, 'outer');
      }

      function InnerConsumer() {
        const dispatcher = useOrderDispatcher();
        const { draft, summary } = createDummyOrderContext();
        innerRetrievedUrl = dispatcher.generateWhatsAppUrl(draft, summary, 'en');
        return React.createElement('div', null, 'inner');
      }

      renderToStaticMarkup(
        React.createElement(
          ContainerProvider,
          { container: outerContainer },
          React.createElement(OuterConsumer),
          React.createElement(
            ContainerProvider,
            { container: innerContainer },
            React.createElement(InnerConsumer)
          )
        )
      );

      expect(outerRetrievedUrl).toBe('https://outer.url');
      expect(innerRetrievedUrl).toBe('https://inner.url');
    });

    it('should expose ContainerContext directly for custom consumers or integrations', () => {
      expect(ContainerContext).toBeDefined();
    });
  });
});
