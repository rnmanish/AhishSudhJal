'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SupportedLanguage } from '../../core/domain/value-objects/Language';
import { IndianPhoneNumber } from '../../core/domain/value-objects/IndianPhoneNumber';
import type {
  CalculatedOrderSummary,
  JarTemperature,
  OrderDraftProps,
  OrderServiceType,
} from '../../core/domain/entities/OrderDraft';
import { OrderDraft } from '../../core/domain/entities/OrderDraft';
import { Product } from '../../core/domain/entities/Product';
import { VillageCoverage } from '../../core/domain/entities/VillageCoverage';
import type { IVillageRepository } from '../../core/domain/repositories/IVillageRepository';
import type { IProductRepository } from '../../core/domain/repositories/IProductRepository';
import type { IOrderDispatcher } from '../../core/domain/repositories/IOrderDispatcher';
import type { IPreferenceRepository } from '../../core/domain/repositories/IPreferenceRepository';
import type {
  EventSeason,
  EventWaterVolumeEstimate,
} from '../../core/use-cases/order/CalculateEventWaterVolumeUseCase';
import { CalculateEventWaterVolumeUseCase } from '../../core/use-cases/order/CalculateEventWaterVolumeUseCase';
import { PRODUCTS } from '../../infrastructure/config/products.data';
import { VILLAGES } from '../../infrastructure/config/villages.data';
import { ContainerContext } from '../../infrastructure/di/AppProviders';
import { container as defaultContainer } from '../../infrastructure/di/container';
import { useLanguage } from '../i18n/useLanguage';

export type WizardStepNumber = 1 | 2 | 3 | 4;

export interface UseBookingWizardOptions {
  readonly initialServiceType?: OrderServiceType;
  readonly initialProductId?: string;
  readonly initialStep?: WizardStepNumber;
  readonly villageRepository?: IVillageRepository;
  readonly productRepository?: IProductRepository;
  readonly orderDispatcher?: IOrderDispatcher;
  readonly preferenceRepository?: IPreferenceRepository;
}

export interface UseBookingWizardReturn {
  readonly currentStep: WizardStepNumber;
  readonly serviceType: OrderServiceType;
  readonly productId: string;
  readonly temperature: JarTemperature;
  readonly quantity: number;
  readonly isRecurring: boolean;
  readonly isFirstOrder: boolean;
  readonly eventGuestCount: number;
  readonly eventType: string;
  readonly eventDate: string;
  readonly eventSeason: EventSeason;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly villageId: string;
  readonly villageName: string;
  readonly landmark: string;
  readonly saveDetails: boolean;
  readonly validationErrors: Readonly<Record<string, string>>;
  readonly availableVillages: readonly VillageCoverage[];
  readonly currentVillage: VillageCoverage | null;
  readonly currentProduct: Product | null;
  readonly calculatedSummary: CalculatedOrderSummary | null;
  readonly eventEstimate: EventWaterVolumeEstimate | null;
  readonly isSubmitting: boolean;
  readonly whatsappUrl: string | null;

  // Actions
  readonly goToStep: (stepNumber: WizardStepNumber) => void;
  readonly nextStep: () => boolean;
  readonly previousStep: () => void;
  readonly selectService: (service: OrderServiceType, targetProductId?: string) => void;
  readonly setTemperature: (nextTemperature: JarTemperature) => void;
  readonly setQuantity: (nextQuantity: number) => void;
  readonly setIsRecurring: (nextRecurring: boolean) => void;
  readonly setIsFirstOrder: (nextFirstOrder: boolean) => void;
  readonly setEventGuestCount: (nextCount: number) => void;
  readonly setEventType: (nextType: string) => void;
  readonly setEventDate: (nextDate: string) => void;
  readonly setEventSeason: (nextSeason: EventSeason) => void;
  readonly setCustomerName: (nextName: string) => void;
  readonly setCustomerPhone: (nextPhone: string) => void;
  readonly setVillageId: (nextVillageId: string) => void;
  readonly setLandmark: (nextLandmark: string) => void;
  readonly setSaveDetails: (nextSave: boolean) => void;
  readonly validateStep: (stepNumber?: WizardStepNumber) => boolean;
  readonly clearError: (fieldKey: string) => void;
  readonly submitOrder: () => string | null;
  readonly reset: () => void;
}

export const DEFAULT_WIZARD_VILLAGES: readonly VillageCoverage[] = Object.freeze(
  VILLAGES.map(
    (villageRecord) =>
      new VillageCoverage({
        id: villageRecord.id,
        name: villageRecord.name,
        nameHindi: villageRecord.nameHindi,
        pincode: villageRecord.pincode,
        distanceKm: villageRecord.distanceKm,
        deliverySla: villageRecord.deliverySla,
        deliverySlaHindi: villageRecord.deliverySlaHindi,
        isPlantLocation: villageRecord.isPlantLocation,
      })
  )
);

export const DEFAULT_WIZARD_PRODUCTS: readonly Product[] = Object.freeze(
  PRODUCTS.map(
    (productRecord) =>
      new Product({
        id: productRecord.id,
        name: productRecord.name,
        nameHindi: productRecord.nameHindi,
        category: productRecord.category,
        priceRs: productRecord.priceRs,
        recurringPriceRs: productRecord.recurringPriceRs,
        recurringDiscountRs: productRecord.recurringDiscountRs,
        depositRs: productRecord.depositRs,
        unit: productRecord.unit,
        isAvailable: productRecord.isAvailable,
        description: productRecord.description,
        descriptionHindi: productRecord.descriptionHindi,
      })
  )
);

/**
 * Validates whether a raw mobile string satisfies standard 10-digit Indian mobile formats.
 */
export function isValidIndianMobileNumber(rawPhoneNumber: string): boolean {
  try {
    new IndianPhoneNumber(rawPhoneNumber);
    return true;
  } catch {
    return false;
  }
}

/**
 * Maps service type and temperature preference to a product catalog ID.
 */
export function resolveProductId(
  service: OrderServiceType,
  preferredTemperature: JarTemperature = 'normal'
): string {
  if (service === 'bulk_bottles') {
    return 'bulk-bottles';
  }
  if (service === 'event') {
    return 'event-supply';
  }
  return preferredTemperature === 'chilled' ? 'jar-chilled' : 'jar-normal';
}

/**
 * Custom React hook (Layer 3 Interface Adapter / Presenter)
 * Coordinates the 4-step drinking water booking wizard workflow, domain validation,
 * price calculations, village coverage lookup, and WhatsApp link generation.
 */
export function useBookingWizard(options?: UseBookingWizardOptions): UseBookingWizardReturn {
  const { language, t } = useLanguage();
  const containerContext = useContext(ContainerContext);

  const villageRepo =
    options?.villageRepository ??
    containerContext?.villageRepository ??
    defaultContainer.villageRepository;

  const productRepo =
    options?.productRepository ??
    containerContext?.productRepository ??
    defaultContainer.productRepository;

  const orderDispatcher =
    options?.orderDispatcher ??
    containerContext?.orderDispatcher ??
    defaultContainer.orderDispatcher;

  const preferenceRepo =
    options?.preferenceRepository ??
    containerContext?.preferenceRepository ??
    defaultContainer.preferenceRepository;

  // 1. Wizard Step State
  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(options?.initialStep ?? 1);

  // 2. Step 1: Service Selection State
  const [serviceType, setServiceType] = useState<OrderServiceType>(
    options?.initialServiceType ?? 'jar'
  );
  const [temperature, setTemperatureState] = useState<JarTemperature>('normal');
  const [productId, setProductId] = useState<string>(
    options?.initialProductId ?? resolveProductId(options?.initialServiceType ?? 'jar', 'normal')
  );

  // 3. Step 2: Quantity & Plan State
  const [quantity, setQuantityState] = useState<number>(1);
  const [isRecurring, setIsRecurringState] = useState<boolean>(false);
  const [isFirstOrder, setIsFirstOrderState] = useState<boolean>(false);

  // Event Details State
  const [eventGuestCount, setEventGuestCountState] = useState<number>(100);
  const [eventType, setEventTypeState] = useState<string>('wedding');
  const [eventDate, setEventDateState] = useState<string>('');
  const [eventSeason, setEventSeasonState] = useState<EventSeason>('normal');

  // Initial saved customer details from preference repository
  const savedCustomerDetails = useMemo(() => {
    try {
      return preferenceRepo.getSavedCustomerDetails();
    } catch {
      return null;
    }
  }, [preferenceRepo]);

  // 4. Step 3: Customer & Delivery Details State
  const [customerName, setCustomerNameState] = useState<string>(
    () => savedCustomerDetails?.customerName ?? ''
  );
  const [customerPhone, setCustomerPhoneState] = useState<string>(
    () => savedCustomerDetails?.customerPhone ?? ''
  );
  const [villageId, setVillageIdState] = useState<string>(
    () => savedCustomerDetails?.villageId ?? ''
  );
  const [landmark, setLandmarkState] = useState<string>(
    () => savedCustomerDetails?.landmark ?? ''
  );
  const [saveDetails, setSaveDetailsState] = useState<boolean>(true);

  // 5. Validation & Loading State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [availableVillages, setAvailableVillages] =
    useState<readonly VillageCoverage[]>(DEFAULT_WIZARD_VILLAGES);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(() => {
    const matched = DEFAULT_WIZARD_PRODUCTS.find(
      (productItem) =>
        productItem.getId() ===
        (options?.initialProductId ??
          resolveProductId(options?.initialServiceType ?? 'jar', 'normal'))
    );
    return matched ?? null;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  // Event Volume Calculation Use Case
  const eventUseCase = useMemo(() => new CalculateEventWaterVolumeUseCase(), []);

  // Fetch covered villages on mount
  useEffect(() => {
    let isMounted = true;
    villageRepo
      .getAll()
      .then((villagesList) => {
        if (isMounted) {
          setAvailableVillages(villagesList);
          // Set default village if not yet set and list is non-empty
          if (!villageId && villagesList.length > 0) {
            setVillageIdState(villagesList[0].getId());
          }
        }
      })
      .catch(() => {
        // Graceful fallback for village loading
      });

    return () => {
      isMounted = false;
    };
  }, [villageRepo, villageId]);

  // Load saved customer details from preference repository on mount
  useEffect(() => {
    try {
      const savedCustomer = preferenceRepo.getSavedCustomerDetails();
      if (savedCustomer) {
        if (savedCustomer.customerName) {
          setCustomerNameState(savedCustomer.customerName);
        }
        if (savedCustomer.customerPhone) {
          setCustomerPhoneState(savedCustomer.customerPhone);
        }
        if (savedCustomer.villageId) {
          setVillageIdState(savedCustomer.villageId);
        }
        if (savedCustomer.landmark) {
          setLandmarkState(savedCustomer.landmark);
        }
      }
    } catch {
      // Graceful fallback for restricted storage environments
    }
  }, [preferenceRepo]);

  // Fetch current product whenever productId changes
  useEffect(() => {
    let isMounted = true;
    productRepo
      .getById(productId)
      .then((matchedProduct) => {
        if (isMounted) {
          setCurrentProduct(matchedProduct);
        }
      })
      .catch(() => {
        // Fallback for product loading
      });

    return () => {
      isMounted = false;
    };
  }, [productRepo, productId]);

  // Resolve active village entity
  const currentVillage = useMemo<VillageCoverage | null>(() => {
    if (!villageId) {
      return null;
    }
    const matched = availableVillages.find((villageItem) => villageItem.getId() === villageId);
    return matched ?? null;
  }, [availableVillages, villageId]);

  // Resolve village name localized
  const villageName = useMemo<string>(() => {
    if (!currentVillage) {
      return '';
    }
    return currentVillage.getName(language as SupportedLanguage);
  }, [currentVillage, language]);

  // Reactive Event Water Volume Estimate
  const eventEstimate = useMemo<EventWaterVolumeEstimate | null>(() => {
    if (serviceType !== 'event') {
      return null;
    }
    try {
      return eventUseCase.execute({
        guestCount: Math.max(1, eventGuestCount),
        durationHours: 4,
        season: eventSeason,
      });
    } catch {
      return null;
    }
  }, [eventUseCase, serviceType, eventGuestCount, eventSeason]);

  // Calculated Order Summary
  const calculatedSummary = useMemo<CalculatedOrderSummary | null>(() => {
    if (!currentProduct) {
      return null;
    }

    try {
      const temporaryPhone = isValidIndianMobileNumber(customerPhone)
        ? new IndianPhoneNumber(customerPhone)
        : new IndianPhoneNumber('9800000000');

      const temporaryDraft = new OrderDraft({
        serviceType,
        productId,
        temperature: serviceType === 'jar' ? temperature : undefined,
        quantity: serviceType === 'event' ? 1 : Math.max(1, quantity),
        isRecurring: serviceType === 'jar' ? isRecurring : false,
        isFirstOrder: serviceType === 'jar' ? isFirstOrder : false,
        customerName: customerName.trim() || 'Guest Customer',
        customerPhone: temporaryPhone,
        villageId: villageId || 'sarsar',
        villageName: villageName || 'Sarsar',
        landmark: landmark.trim(),
      });

      return temporaryDraft.calculateSummary(currentProduct);
    } catch {
      return null;
    }
  }, [
    currentProduct,
    serviceType,
    productId,
    temperature,
    quantity,
    isRecurring,
    isFirstOrder,
    customerName,
    customerPhone,
    villageId,
    villageName,
    landmark,
  ]);

  // Clear single validation error
  const handleClearError = useCallback((fieldKey: string) => {
    setValidationErrors((previousErrors) => {
      if (!previousErrors[fieldKey]) {
        return previousErrors;
      }
      const updatedErrors = { ...previousErrors };
      delete updatedErrors[fieldKey];
      return updatedErrors;
    });
  }, []);

  // Validation function per step
  const handleValidateStep = useCallback(
    (targetStep: WizardStepNumber = currentStep): boolean => {
      const stepErrors: Record<string, string> = {};

      if (targetStep === 1) {
        if (!serviceType) {
          stepErrors.service = t.wizard.validation.serviceRequired;
        }
        if (!productId) {
          stepErrors.product = t.wizard.validation.serviceRequired;
        }
      } else if (targetStep === 2) {
        if (serviceType === 'jar' || serviceType === 'bulk_bottles') {
          if (!Number.isFinite(quantity) || quantity < 1) {
            stepErrors.quantity = t.wizard.validation.quantityMin;
          }
        } else if (serviceType === 'event') {
          if (!Number.isFinite(eventGuestCount) || eventGuestCount < 10) {
            stepErrors.eventGuests = t.wizard.validation.guestsMin;
          }
        }
      } else if (targetStep === 3) {
        if (!customerName || customerName.trim().length < 2) {
          stepErrors.customerName = t.wizard.validation.nameRequired;
        }
        if (!customerPhone || !isValidIndianMobileNumber(customerPhone)) {
          stepErrors.customerPhone = t.wizard.validation.phoneInvalid;
        }
        if (!villageId) {
          stepErrors.villageId = t.wizard.validation.villageRequired;
        }
      } else if (targetStep === 4) {
        if (!customerName || customerName.trim().length < 2) {
          stepErrors.customerName = t.wizard.validation.nameRequired;
        }
        if (!customerPhone || !isValidIndianMobileNumber(customerPhone)) {
          stepErrors.customerPhone = t.wizard.validation.phoneInvalid;
        }
        if (!villageId) {
          stepErrors.villageId = t.wizard.validation.villageRequired;
        }
      }

      setValidationErrors(stepErrors);
      return Object.keys(stepErrors).length === 0;
    },
    [
      currentStep,
      serviceType,
      productId,
      quantity,
      eventGuestCount,
      customerName,
      customerPhone,
      villageId,
      t.wizard.validation,
    ]
  );

  // Step Navigation Handlers
  const handleGoToStep = useCallback((targetStep: WizardStepNumber) => {
    setCurrentStep(targetStep);
    setValidationErrors({});
  }, []);

  const handleNextStep = useCallback((): boolean => {
    const isStepValid = handleValidateStep(currentStep);
    if (!isStepValid) {
      return false;
    }

    if (currentStep < 4) {
      setCurrentStep((previousStep) => (previousStep + 1) as WizardStepNumber);
      setValidationErrors({});
      return true;
    }
    return true;
  }, [currentStep, handleValidateStep]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((previousStep) => (previousStep - 1) as WizardStepNumber);
      setValidationErrors({});
    }
  }, [currentStep]);

  // Service Selection Handler
  const handleSelectService = useCallback(
    (nextService: OrderServiceType, explicitProductId?: string) => {
      setServiceType(nextService);
      const targetProductId =
        explicitProductId ?? resolveProductId(nextService, temperature);
      setProductId(targetProductId);

      if (nextService === 'jar') {
        if (targetProductId === 'jar-chilled') {
          setTemperatureState('chilled');
        } else {
          setTemperatureState('normal');
        }
      }

      handleClearError('service');
      handleClearError('product');
    },
    [temperature, handleClearError]
  );

  const handleSetTemperature = useCallback(
    (nextTemperature: JarTemperature) => {
      setTemperatureState(nextTemperature);
      if (serviceType === 'jar') {
        setProductId(nextTemperature === 'chilled' ? 'jar-chilled' : 'jar-normal');
      }
    },
    [serviceType]
  );

  const handleSetQuantity = useCallback(
    (nextQuantity: number) => {
      const sanitizedQuantity = Math.max(1, Math.round(nextQuantity));
      setQuantityState(sanitizedQuantity);
      handleClearError('quantity');
    },
    [handleClearError]
  );

  const handleSetIsRecurring = useCallback((nextRecurring: boolean) => {
    setIsRecurringState(nextRecurring);
  }, []);

  const handleSetIsFirstOrder = useCallback((nextFirstOrder: boolean) => {
    setIsFirstOrderState(nextFirstOrder);
  }, []);

  const handleSetEventGuestCount = useCallback(
    (nextCount: number) => {
      const sanitizedGuests = Math.max(1, Math.round(nextCount));
      setEventGuestCountState(sanitizedGuests);
      handleClearError('eventGuests');
    },
    [handleClearError]
  );

  const handleSetEventType = useCallback((nextType: string) => {
    setEventTypeState(nextType);
  }, []);

  const handleSetEventDate = useCallback((nextDate: string) => {
    setEventDateState(nextDate);
  }, []);

  const handleSetEventSeason = useCallback((nextSeason: EventSeason) => {
    setEventSeasonState(nextSeason);
  }, []);

  const handleSetCustomerName = useCallback(
    (nextName: string) => {
      setCustomerNameState(nextName);
      handleClearError('customerName');
    },
    [handleClearError]
  );

  const handleSetCustomerPhone = useCallback(
    (nextPhone: string) => {
      setCustomerPhoneState(nextPhone);
      handleClearError('customerPhone');
    },
    [handleClearError]
  );

  const handleSetVillageId = useCallback(
    (nextVillageId: string) => {
      setVillageIdState(nextVillageId);
      handleClearError('villageId');
    },
    [handleClearError]
  );

  const handleSetLandmark = useCallback((nextLandmark: string) => {
    setLandmarkState(nextLandmark);
  }, []);

  const handleSetSaveDetails = useCallback((nextSave: boolean) => {
    setSaveDetailsState(nextSave);
  }, []);

  // Submit Order to WhatsApp
  const handleSubmitOrder = useCallback((): string | null => {
    const isReady = handleValidateStep(4);
    if (!isReady || !currentProduct || !currentVillage) {
      return null;
    }

    try {
      setIsSubmitting(true);
      const parsedPhone = new IndianPhoneNumber(customerPhone);

      const draftProps: OrderDraftProps = {
        serviceType,
        productId,
        temperature: serviceType === 'jar' ? temperature : undefined,
        quantity: serviceType === 'event' ? 1 : quantity,
        isRecurring: serviceType === 'jar' ? isRecurring : false,
        frequency: isRecurring ? 'daily' : undefined,
        isFirstOrder: serviceType === 'jar' ? isFirstOrder : false,
        customerName: customerName.trim(),
        customerPhone: parsedPhone,
        villageId: currentVillage.getId(),
        villageName: currentVillage.getName(language as SupportedLanguage),
        landmark: landmark.trim(),
        eventDetails:
          serviceType === 'event'
            ? {
                guestCount: eventGuestCount,
                eventType,
                eventDate,
                estimatedLitres: eventEstimate?.estimatedLitres,
              }
            : undefined,
        notes: landmark.trim() ? `Landmark: ${landmark.trim()}` : undefined,
      };

      const finalDraft = new OrderDraft(draftProps);
      const orderSummaryResult = finalDraft.calculateSummary(currentProduct);

      const generatedUrl = orderDispatcher.generateWhatsAppUrl(
        finalDraft,
        orderSummaryResult,
        language as SupportedLanguage
      );

      setWhatsappUrl(generatedUrl);

      // Persist preferences if requested
      if (saveDetails) {
        preferenceRepo.saveCustomerDetails({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          villageId: currentVillage.getId(),
          landmark: landmark.trim(),
        });
      } else {
        preferenceRepo.clearCustomerDetails();
      }

      // Safe navigation in browser
      if (typeof window !== 'undefined') {
        window.open(generatedUrl, '_blank', 'noopener,noreferrer');
      }

      setIsSubmitting(false);
      return generatedUrl;
    } catch (submitError) {
      setIsSubmitting(false);
      const errorMessage =
        submitError instanceof Error ? submitError.message : 'Failed to generate order.';
      setValidationErrors((previousErrors) => ({
        ...previousErrors,
        submission: errorMessage,
      }));
      return null;
    }
  }, [
    handleValidateStep,
    currentProduct,
    currentVillage,
    customerPhone,
    serviceType,
    productId,
    temperature,
    quantity,
    isRecurring,
    isFirstOrder,
    customerName,
    landmark,
    eventType,
    eventDate,
    eventGuestCount,
    eventEstimate,
    orderDispatcher,
    language,
    saveDetails,
    preferenceRepo,
  ]);

  // Reset entire wizard to defaults
  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setServiceType('jar');
    setTemperatureState('normal');
    setProductId('jar-normal');
    setQuantityState(1);
    setIsRecurringState(false);
    setIsFirstOrderState(false);
    setEventGuestCountState(100);
    setEventTypeState('wedding');
    setEventDateState('');
    setEventSeasonState('normal');
    setValidationErrors({});
    setWhatsappUrl(null);
  }, []);

  return {
    currentStep,
    serviceType,
    productId,
    temperature,
    quantity,
    isRecurring,
    isFirstOrder,
    eventGuestCount,
    eventType,
    eventDate,
    eventSeason,
    customerName,
    customerPhone,
    villageId,
    villageName,
    landmark,
    saveDetails,
    validationErrors,
    availableVillages,
    currentVillage,
    currentProduct,
    calculatedSummary,
    eventEstimate,
    isSubmitting,
    whatsappUrl,
    goToStep: handleGoToStep,
    nextStep: handleNextStep,
    previousStep: handlePreviousStep,
    selectService: handleSelectService,
    setTemperature: handleSetTemperature,
    setQuantity: handleSetQuantity,
    setIsRecurring: handleSetIsRecurring,
    setIsFirstOrder: handleSetIsFirstOrder,
    setEventGuestCount: handleSetEventGuestCount,
    setEventType: handleSetEventType,
    setEventDate: handleSetEventDate,
    setEventSeason: handleSetEventSeason,
    setCustomerName: handleSetCustomerName,
    setCustomerPhone: handleSetCustomerPhone,
    setVillageId: handleSetVillageId,
    setLandmark: handleSetLandmark,
    setSaveDetails: handleSetSaveDetails,
    validateStep: handleValidateStep,
    clearError: handleClearError,
    submitOrder: handleSubmitOrder,
    reset: handleReset,
  };
}
