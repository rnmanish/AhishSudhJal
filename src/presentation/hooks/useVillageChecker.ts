'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { IVillageRepository } from '../../core/domain/repositories/IVillageRepository';
import { VillageCoverage } from '../../core/domain/entities/VillageCoverage';
import type { ServiceabilityResult } from '../../core/use-cases/serviceability/ValidateVillageServiceabilityUseCase';
import { ValidateVillageServiceabilityUseCase } from '../../core/use-cases/serviceability/ValidateVillageServiceabilityUseCase';
import { InMemoryVillageRepository } from '../../infrastructure/repositories/InMemoryVillageRepository';
import { VILLAGES } from '../../infrastructure/config/villages.data';
import { ContainerContext } from '../../infrastructure/di/AppProviders';
import { useLanguage } from '../i18n/useLanguage';

/**
 * Default fallback village coverage constructed from centralized dataset.
 * Ensures instant SSR rendering and zero layout shift on rural 3G mobile networks.
 */
export const DEFAULT_VILLAGE_COVERAGE: readonly VillageCoverage[] = Object.freeze(
  VILLAGES.map(
    (record) =>
      new VillageCoverage({
        id: record.id,
        name: record.name,
        nameHindi: record.nameHindi,
        pincode: record.pincode,
        distanceKm: record.distanceKm,
        deliverySla: record.deliverySla,
        deliverySlaHindi: record.deliverySlaHindi,
        isPlantLocation: record.isPlantLocation,
      })
  )
);

export interface UseVillageCheckerOptions {
  readonly initialQuery?: string;
  readonly villageRepository?: IVillageRepository;
  readonly useCase?: ValidateVillageServiceabilityUseCase;
}

export interface UseVillageCheckerReturn {
  readonly searchQuery: string;
  readonly setSearchQuery: (queryText: string) => void;
  readonly isChecking: boolean;
  readonly result: ServiceabilityResult | null;
  readonly isServiceable: boolean | null;
  readonly matchedVillage: VillageCoverage | null;
  readonly checkServiceability: (queryOverride?: string) => Promise<ServiceabilityResult>;
  readonly reset: () => void;
  readonly allVillages: readonly VillageCoverage[];
  readonly topVillages: readonly VillageCoverage[];
  readonly suggestions: readonly VillageCoverage[];
  readonly selectVillage: (selectedVillage: VillageCoverage) => Promise<ServiceabilityResult>;
  readonly getWhatsAppInquiryUrl: (customVillageName?: string) => string;
  readonly statusMessage: string;
  readonly deliverySla: string | undefined;
}

/**
 * Custom React hook (Layer 3 Interface Adapter / Presenter)
 * Coordinates village serviceability checks, autocomplete suggestions,
 * and delivery routing inquiries for Ashish Sudh Jal.
 */
export function useVillageChecker(
  options?: UseVillageCheckerOptions
): UseVillageCheckerReturn {
  const { isHindi, t } = useLanguage();
  const containerContext = useContext(ContainerContext);

  const activeRepository = useMemo<IVillageRepository>(() => {
    if (options?.villageRepository) {
      return options.villageRepository;
    }
    if (containerContext?.villageRepository) {
      return containerContext.villageRepository;
    }
    return new InMemoryVillageRepository();
  }, [options?.villageRepository, containerContext?.villageRepository]);

  const activeUseCase = useMemo<ValidateVillageServiceabilityUseCase>(() => {
    if (options?.useCase) {
      return options.useCase;
    }
    return new ValidateVillageServiceabilityUseCase(activeRepository);
  }, [options?.useCase, activeRepository]);

  const [searchQuery, setSearchQueryState] = useState<string>(
    options?.initialQuery ?? ''
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [serviceabilityResult, setServiceabilityResult] =
    useState<ServiceabilityResult | null>(null);
  const [allVillages, setAllVillages] = useState<readonly VillageCoverage[]>(
    DEFAULT_VILLAGE_COVERAGE
  );

  // Load all covered villages once repository is available
  useEffect(() => {
    let isMounted = true;
    activeRepository
      .getAll()
      .then((loadedVillages) => {
        if (isMounted && Array.isArray(loadedVillages) && loadedVillages.length > 0) {
          setAllVillages(loadedVillages);
        }
      })
      .catch((_fetchError: unknown) => {
        if (isMounted) {
          // Keep the robust centralized dataset fallback on error
          setAllVillages(DEFAULT_VILLAGE_COVERAGE);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeRepository]);

  const handleSetSearchQuery = useCallback((queryText: string) => {
    setSearchQueryState(queryText);
    if (!queryText.trim()) {
      setServiceabilityResult(null);
    }
  }, []);

  const handleCheckServiceability = useCallback(
    async (queryOverride?: string): Promise<ServiceabilityResult> => {
      const targetQuery =
        typeof queryOverride === 'string' ? queryOverride : searchQuery;
      setIsChecking(true);
      try {
        const evaluationResult = await activeUseCase.execute(targetQuery);
        setServiceabilityResult(evaluationResult);
        return evaluationResult;
      } finally {
        setIsChecking(false);
      }
    },
    [activeUseCase, searchQuery]
  );

  const handleSelectVillage = useCallback(
    async (selectedVillage: VillageCoverage): Promise<ServiceabilityResult> => {
      const villageName = selectedVillage.getName(isHindi ? 'hi' : 'en');
      setSearchQueryState(villageName);
      setIsChecking(true);
      try {
        const evaluationResult = await activeUseCase.execute(villageName);
        setServiceabilityResult(evaluationResult);
        return evaluationResult;
      } finally {
        setIsChecking(false);
      }
    },
    [activeUseCase, isHindi]
  );

  const handleReset = useCallback(() => {
    setSearchQueryState('');
    setServiceabilityResult(null);
  }, []);

  const suggestions = useMemo<readonly VillageCoverage[]>(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) {
      return [];
    }
    return allVillages.filter((villageItem) =>
      villageItem.matchesQuery(cleanQuery)
    );
  }, [allVillages, searchQuery]);

  const topVillages = useMemo<readonly VillageCoverage[]>(() => {
    return allVillages.slice(0, 15);
  }, [allVillages]);

  const isServiceable = useMemo<boolean | null>(() => {
    if (!serviceabilityResult) {
      return null;
    }
    return serviceabilityResult.isServiceable;
  }, [serviceabilityResult]);

  const matchedVillage = useMemo<VillageCoverage | null>(() => {
    return serviceabilityResult?.village ?? null;
  }, [serviceabilityResult]);

  const statusMessage = useMemo<string>(() => {
    if (!serviceabilityResult) {
      return '';
    }
    return isHindi
      ? serviceabilityResult.messageHi
      : serviceabilityResult.messageEn;
  }, [serviceabilityResult, isHindi]);

  const deliverySla = useMemo<string | undefined>(() => {
    if (!serviceabilityResult || !serviceabilityResult.village) {
      return undefined;
    }
    return isHindi
      ? serviceabilityResult.deliverySlaHi
      : serviceabilityResult.deliverySlaEn;
  }, [serviceabilityResult, isHindi]);

  const getWhatsAppInquiryUrl = useCallback(
    (customVillageName?: string): string => {
      const fallbackName = isHindi ? 'मेरा गाँव' : 'My Village';
      const resolvedName =
        (customVillageName ?? searchQuery).trim() || fallbackName;
      const businessPhone = t?.brand?.whatsappNumber || '918235882384';

      const consultationMessage = isHindi
        ? `नमस्ते आशीष शुद्ध जल! मैं ${resolvedName} से हूँ। क्या आपके यहाँ 20L आरओ जार की डिलीवरी की विशेष व्यवस्था हो सकती है?`
        : `Hello Ashish Sudh Jal! I am from ${resolvedName}. Can you arrange special delivery of 20L pure RO drinking water jars to my area?`;

      return `https://wa.me/${businessPhone}?text=${encodeURIComponent(
        consultationMessage
      )}`;
    },
    [searchQuery, isHindi, t?.brand?.whatsappNumber]
  );

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    isChecking,
    result: serviceabilityResult,
    isServiceable,
    matchedVillage,
    checkServiceability: handleCheckServiceability,
    reset: handleReset,
    allVillages,
    topVillages,
    suggestions,
    selectVillage: handleSelectVillage,
    getWhatsAppInquiryUrl,
    statusMessage,
    deliverySla,
  };
}
