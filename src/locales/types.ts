export interface LocalizedString {
  readonly hi: string;
  readonly en: string;
}

export interface LocalizedStringList {
  readonly hi: readonly string[];
  readonly en: readonly string[];
}

export interface BrandInfo {
  readonly name: LocalizedString;
  readonly nameHindi: LocalizedString;
  readonly tagline: LocalizedString;
  readonly plantAddress: LocalizedString;
  readonly plantLocation: LocalizedString;
  readonly hotline: string;
  readonly hotlineNumber: string;
  readonly whatsappNumber: string;
  readonly operatingHours: LocalizedString;
  readonly copyright: LocalizedString;
}

export interface SiteStats {
  readonly customersCount: string;
  readonly customersLabel: LocalizedString;
  readonly purityTdsRange: string;
  readonly purityLabel: LocalizedString;
  readonly villagesCoveredCount: string;
  readonly villagesLabel: LocalizedString;
}

export interface TrustBadgeItem {
  readonly id: string;
  readonly icon: string;
  readonly title: LocalizedString;
  readonly desc: LocalizedString;
}

export type FaqCategory = 'quality' | 'delivery' | 'pricing' | 'events' | 'products';

export interface FaqItem {
  readonly id: string;
  readonly category: FaqCategory;
  readonly question: LocalizedString;
  readonly answer: LocalizedString;
}

export interface TestimonialItem {
  readonly id: string;
  readonly name: string;
  readonly nameHindi: string;
  readonly village: string;
  readonly villageHindi: string;
  readonly role?: LocalizedString;
  readonly rating: number;
  readonly verified: boolean;
  readonly quote: LocalizedString;
}

export interface TdsQualityBand {
  readonly range: string;
  readonly maxPpm: number;
  readonly label: LocalizedString;
  readonly badge: LocalizedString;
  readonly description: LocalizedString;
  readonly recommendation: LocalizedString;
  readonly colorHex: string;
}

export interface ProductCopyItem {
  readonly name: LocalizedString;
  readonly shortName: LocalizedString;
  readonly desc: LocalizedString;
  readonly priceDisplay: LocalizedString;
  readonly recurringDisplay?: LocalizedString;
  readonly recurringBadge?: LocalizedString;
  readonly depositBadge: LocalizedString;
  readonly depositNote: LocalizedString;
  readonly features: LocalizedStringList;
}

export interface WhatsAppMessageTemplates {
  readonly header: LocalizedString;
  readonly customerHeading: LocalizedString;
  readonly nameLabel: LocalizedString;
  readonly phoneLabel: LocalizedString;
  readonly villageLabel: LocalizedString;
  readonly landmarkLabel: LocalizedString;
  readonly orderHeading: LocalizedString;
  readonly normalJarProductTitle: LocalizedString;
  readonly chilledJarProductTitle: LocalizedString;
  readonly quantityLabel: LocalizedString;
  readonly oneTimeOrder: LocalizedString;
  readonly recurringSubscriptionPrefix: LocalizedString;
  readonly rateLabel: LocalizedString;
  readonly perJarLabel: LocalizedString;
  readonly recurringDiscountLabel: LocalizedString;
  readonly savingsLabel: LocalizedString;
  readonly depositFirstOrder: LocalizedString;
  readonly depositExistingCustomer: LocalizedString;
  readonly paymentHeading: LocalizedString;
  readonly waterAmountLabel: LocalizedString;
  readonly depositAmountLabel: LocalizedString;
  readonly totalSavingsLabel: LocalizedString;
  readonly totalPayableLabel: LocalizedString;
  readonly bulkBottlesProductTitle: LocalizedString;
  readonly bulkEstimatedQuantityLabel: LocalizedString;
  readonly bulkRateText: LocalizedString;
  readonly eventHeading: LocalizedString;
  readonly eventTypeLabel: LocalizedString;
  readonly eventDateLabel: LocalizedString;
  readonly eventGuestsLabel: LocalizedString;
  readonly eventWaterLabel: LocalizedString;
  readonly eventLitresSuffix: LocalizedString;
  readonly eventZeroDeposit: LocalizedString;
  readonly eventRateText: LocalizedString;
  readonly eventDefaultType: LocalizedString;
  readonly eventDateUnavailable: LocalizedString;
  readonly eventGuestsUnspecified: LocalizedString;
  readonly specialInstructionsHeading: LocalizedString;
  readonly closingCta: LocalizedString;
  readonly frequencies: {
    readonly daily: LocalizedString;
    readonly alternate_days: LocalizedString;
    readonly weekly: LocalizedString;
    readonly default: LocalizedString;
  };
  readonly units: {
    readonly jarSingular: LocalizedString;
    readonly jarPlural: LocalizedString;
    readonly cartonSingular: LocalizedString;
    readonly cartonPlural: LocalizedString;
  };
}

export interface SiteData {
  readonly meta: {
    readonly title: LocalizedString;
    readonly description: LocalizedString;
    readonly plantLocation: LocalizedString;
  };
  readonly brand: BrandInfo;
  readonly stats: SiteStats;
  readonly nav: {
    readonly home: LocalizedString;
    readonly products: LocalizedString;
    readonly tdsChecker: LocalizedString;
    readonly booking: LocalizedString;
    readonly coverage: LocalizedString;
    readonly callNow: LocalizedString;
    readonly whatsappOrder: LocalizedString;
    readonly toggleLanguageAria: LocalizedString;
  };
  readonly hero: {
    readonly badge: LocalizedString;
    readonly title: LocalizedString;
    readonly highlight: LocalizedString;
    readonly subtitle: LocalizedString;
    readonly orderCta: LocalizedString;
    readonly checkVillageCta: LocalizedString;
    readonly callCta: LocalizedString;
    readonly deliveryPill: LocalizedString;
    readonly trustFeature1: LocalizedString;
    readonly trustFeature2: LocalizedString;
    readonly trustFeature3: LocalizedString;
  };
  readonly products: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
    readonly jarNormal: ProductCopyItem;
    readonly jarChilled: ProductCopyItem;
    readonly bulkBottles: ProductCopyItem;
    readonly eventSupply: ProductCopyItem;
    readonly perJar: LocalizedString;
    readonly orderOnWhatsApp: LocalizedString;
    readonly dispenserIncluded: LocalizedString;
    readonly refundableDepositNotice: LocalizedString;
  };
  readonly tds: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
    readonly sliderLabel: LocalizedString;
    readonly sourceSelectLabel: LocalizedString;
    readonly ppmUnit: LocalizedString;
    readonly sources: {
      readonly chapakal: LocalizedString;
      readonly submersible: LocalizedString;
      readonly nalJal: LocalizedString;
      readonly tanker: LocalizedString;
    };
    readonly levels: readonly TdsQualityBand[];
    readonly asjQualityNotice: LocalizedString;
  };
  readonly wizard: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
    readonly steps: {
      readonly step1: LocalizedString;
      readonly step2: LocalizedString;
      readonly step3: LocalizedString;
      readonly step4: LocalizedString;
    };
    readonly stepNames: {
      readonly serviceSelect: LocalizedString;
      readonly quantityDetails: LocalizedString;
      readonly customerDetails: LocalizedString;
      readonly reviewSummary: LocalizedString;
    };
    readonly services: {
      readonly jarNormal: { readonly title: LocalizedString; readonly subtitle: LocalizedString };
      readonly jarChilled: { readonly title: LocalizedString; readonly subtitle: LocalizedString };
      readonly bulkBottles: { readonly title: LocalizedString; readonly subtitle: LocalizedString };
      readonly eventSupply: { readonly title: LocalizedString; readonly subtitle: LocalizedString };
    };
    readonly form: {
      readonly chooseServiceHeading: LocalizedString;
      readonly quantityHeading: LocalizedString;
      readonly jarQuantityLabel: LocalizedString;
      readonly recurringCheckboxLabel: LocalizedString;
      readonly recurringSavingsText: LocalizedString;
      readonly firstOrderCheckboxLabel: LocalizedString;
      readonly firstOrderDepositInfo: LocalizedString;
      readonly bottleQuantityLabel: LocalizedString;
      readonly bottleContactNote: LocalizedString;
      readonly eventGuestsLabel: LocalizedString;
      readonly eventTypeLabel: LocalizedString;
      readonly eventEstimatedVolume: LocalizedString;
      readonly customerDetailsHeading: LocalizedString;
      readonly fullNameLabel: LocalizedString;
      readonly fullNamePlaceholder: LocalizedString;
      readonly phoneLabel: LocalizedString;
      readonly phonePlaceholder: LocalizedString;
      readonly villageLabel: LocalizedString;
      readonly selectVillagePlaceholder: LocalizedString;
      readonly landmarkLabel: LocalizedString;
      readonly landmarkPlaceholder: LocalizedString;
      readonly saveDetailsLabel: LocalizedString;
    };
    readonly eventTypes: {
      readonly wedding: LocalizedString;
      readonly birthday: LocalizedString;
      readonly religious: LocalizedString;
      readonly corporate: LocalizedString;
      readonly other: LocalizedString;
    };
    readonly summary: {
      readonly heading: LocalizedString;
      readonly selectedService: LocalizedString;
      readonly quantity: LocalizedString;
      readonly unitPrice: LocalizedString;
      readonly baseAmount: LocalizedString;
      readonly recurringSavings: LocalizedString;
      readonly depositAmount: LocalizedString;
      readonly totalPayable: LocalizedString;
      readonly codNotice: LocalizedString;
      readonly deliveryTo: LocalizedString;
      readonly deliverySla: LocalizedString;
      readonly eventZeroDepositNotice: LocalizedString;
      readonly submitWhatsAppBtn: LocalizedString;
      readonly backBtn: LocalizedString;
      readonly nextBtn: LocalizedString;
    };
    readonly validation: {
      readonly serviceRequired: LocalizedString;
      readonly quantityMin: LocalizedString;
      readonly guestsMin: LocalizedString;
      readonly nameRequired: LocalizedString;
      readonly phoneInvalid: LocalizedString;
      readonly villageRequired: LocalizedString;
      readonly landmarkRequired: LocalizedString;
    };
  };
  readonly villageChecker: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
    readonly searchPlaceholder: LocalizedString;
    readonly searchBtn: LocalizedString;
    readonly serviceableBadge: LocalizedString;
    readonly unserviceableBadge: LocalizedString;
    readonly plantDistanceLabel: LocalizedString;
    readonly deliverySlaLabel: LocalizedString;
    readonly freeDeliveryNotice: LocalizedString;
    readonly unserviceableNotice: LocalizedString;
    readonly customVillageWhatsAppCta: LocalizedString;
    readonly coveredVillagesHeading: LocalizedString;
  };
  readonly map: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
    readonly plantTitle: LocalizedString;
    readonly getDirectionsBtn: LocalizedString;
    readonly callPlantBtn: LocalizedString;
    readonly openingHoursTitle: LocalizedString;
  };
  readonly trustBadgesSectionTitle: LocalizedString;
  readonly trustBadges: readonly TrustBadgeItem[];
  readonly faqsSection: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
  };
  readonly faqs: readonly FaqItem[];
  readonly testimonialsSection: {
    readonly sectionBadge: LocalizedString;
    readonly sectionTitle: LocalizedString;
    readonly sectionSubtitle: LocalizedString;
  };
  readonly testimonials: readonly TestimonialItem[];
  readonly footer: {
    readonly brandDesc: LocalizedString;
    readonly quickLinksTitle: LocalizedString;
    readonly coverageTitle: LocalizedString;
    readonly contactTitle: LocalizedString;
    readonly allRightsReserved: LocalizedString;
  };
  readonly common: {
    readonly loading: LocalizedString;
    readonly error: LocalizedString;
    readonly success: LocalizedString;
    readonly back: LocalizedString;
    readonly next: LocalizedString;
    readonly callNow: LocalizedString;
    readonly orderNow: LocalizedString;
    readonly rupee: LocalizedString;
    readonly perJar: LocalizedString;
    readonly litres: LocalizedString;
    readonly bottles: LocalizedString;
    readonly jars: LocalizedString;
    readonly guests: LocalizedString;
    readonly languageToggle: LocalizedString;
  };
  readonly whatsappTemplates: WhatsAppMessageTemplates;
}

