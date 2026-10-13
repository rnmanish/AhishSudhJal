import type { IVillageRepository } from '../../core/domain/repositories/IVillageRepository';
import type { IProductRepository } from '../../core/domain/repositories/IProductRepository';
import type { IOrderDispatcher } from '../../core/domain/repositories/IOrderDispatcher';
import type { IPreferenceRepository } from '../../core/domain/repositories/IPreferenceRepository';

import { InMemoryVillageRepository } from '../repositories/InMemoryVillageRepository';
import { StaticProductRepository } from '../repositories/StaticProductRepository';
import { WhatsAppLinkDispatcher } from '../dispatchers/WhatsAppLinkDispatcher';
import { LocalStoragePreferenceRepository } from '../repositories/LocalStoragePreferenceRepository';

export interface AppContainer {
  readonly villageRepository: IVillageRepository;
  readonly productRepository: IProductRepository;
  readonly orderDispatcher: IOrderDispatcher;
  readonly preferenceRepository: IPreferenceRepository;
}

export interface ContainerDependencies {
  readonly villageRepository?: IVillageRepository;
  readonly productRepository?: IProductRepository;
  readonly orderDispatcher?: IOrderDispatcher;
  readonly preferenceRepository?: IPreferenceRepository;
}

/**
 * Factory function to create a new AppContainer instance.
 * Useful for testing with test doubles / mocks or configuring custom implementations.
 */
export function createAppContainer(dependencies: ContainerDependencies = {}): AppContainer {
  return {
    villageRepository: dependencies.villageRepository ?? new InMemoryVillageRepository(),
    productRepository: dependencies.productRepository ?? new StaticProductRepository(),
    orderDispatcher: dependencies.orderDispatcher ?? new WhatsAppLinkDispatcher(),
    preferenceRepository:
      dependencies.preferenceRepository ?? new LocalStoragePreferenceRepository(),
  };
}

/**
 * Singleton composition root for the application.
 * All concrete repositories and dispatchers are instantiated here.
 */
export const container: AppContainer = createAppContainer();
