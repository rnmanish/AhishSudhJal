'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import type { AppContainer } from './container';
import { container as defaultContainer } from './container';
import type { IVillageRepository } from '../../core/domain/repositories/IVillageRepository';
import type { IProductRepository } from '../../core/domain/repositories/IProductRepository';
import type { IOrderDispatcher } from '../../core/domain/repositories/IOrderDispatcher';
import type { IPreferenceRepository } from '../../core/domain/repositories/IPreferenceRepository';

export const ContainerContext = createContext<AppContainer | null>(null);

export interface ContainerProviderProps {
  readonly children?: ReactNode;
  readonly container?: AppContainer;
}

/**
 * Provider component for injecting the application DI container.
 */
export function ContainerProvider({
  children,
  container = defaultContainer,
}: ContainerProviderProps): JSX.Element {
  const value = useMemo(() => container, [container]);
  return React.createElement(ContainerContext.Provider, { value }, children);
}

export interface AppProvidersProps {
  readonly children?: ReactNode;
  readonly container?: AppContainer;
}

/**
 * Root composition provider for Ashish Sudh Jal.
 * Wraps ContainerProvider (and future i18n/auth providers) into a single provider hierarchy.
 */
export function AppProviders({
  children,
  container,
}: AppProvidersProps): JSX.Element {
  return React.createElement(ContainerProvider, { container }, children);
}

export default AppProviders;

/**
 * Hook to access the full DI container from React components.
 * Throws an error if used outside of AppProviders or ContainerProvider.
 */
export function useContainer(): AppContainer {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error('useContainer must be used within an AppProviders or ContainerProvider component.');
  }
  return context;
}

/**
 * Dedicated hook to access IVillageRepository.
 */
export function useVillageRepository(): IVillageRepository {
  return useContainer().villageRepository;
}

/**
 * Dedicated hook to access IProductRepository.
 */
export function useProductRepository(): IProductRepository {
  return useContainer().productRepository;
}

/**
 * Dedicated hook to access IOrderDispatcher.
 */
export function useOrderDispatcher(): IOrderDispatcher {
  return useContainer().orderDispatcher;
}

/**
 * Dedicated hook to access IPreferenceRepository.
 */
export function usePreferenceRepository(): IPreferenceRepository {
  return useContainer().preferenceRepository;
}
