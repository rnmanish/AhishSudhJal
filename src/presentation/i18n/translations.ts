import type { SupportedLanguage } from '../../core/domain/value-objects/Language';
import { dictionaries, hindiDict } from '../../locales';

export interface FaqTranslationItem {
  readonly id: string;
  readonly category: string;
  readonly question: string;
  readonly answer: string;
}

export interface TestimonialTranslationItem {
  readonly id: string;
  readonly name: string;
  readonly village: string;
  readonly role?: string;
  readonly rating: number;
  readonly quote: string;
}

export interface TdsLevelTranslation {
  readonly range: string;
  readonly label: string;
  readonly badge: string;
  readonly description: string;
  readonly recommendation: string;
}

export interface TrustBadgeTranslation {
  readonly title: string;
  readonly desc: string;
}

export interface AppTranslations {
  readonly meta: {
    readonly title: string;
    readonly description: string;
    readonly plantLocation: string;
  };
  readonly brand: {
    readonly name: string;
    readonly nameHindi: string;
    readonly tagline: string;
    readonly plantAddress: string;
    readonly hotline: string;
    readonly hotlineNumber: string;
    readonly whatsappNumber: string;
  };
  readonly nav: {
    readonly home: string;
    readonly products: string;
    readonly tdsChecker: string;
    readonly booking: string;
    readonly coverage: string;
    readonly callNow: string;
    readonly whatsappOrder: string;
    readonly toggleLanguageAria: string;
  };
  readonly hero: {
    readonly badge: string;
    readonly title: string;
    readonly highlight: string;
    readonly subtitle: string;
    readonly orderCta: string;
    readonly checkVillageCta: string;
    readonly callCta: string;
    readonly deliveryPill: string;
    readonly trustFeature1: string;
    readonly trustFeature2: string;
    readonly trustFeature3: string;
    readonly stats: {
      readonly customers: string;
      readonly customersLabel: string;
      readonly purity: string;
      readonly purityLabel: string;
      readonly villages: string;
      readonly villagesLabel: string;
    };
  };
  readonly products: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly jarNormal: {
      readonly name: string;
      readonly shortName: string;
      readonly desc: string;
      readonly priceDisplay: string;
      readonly recurringDisplay: string;
      readonly recurringBadge: string;
      readonly depositBadge: string;
      readonly depositNote: string;
      readonly features: readonly string[];
    };
    readonly jarChilled: {
      readonly name: string;
      readonly shortName: string;
      readonly desc: string;
      readonly priceDisplay: string;
      readonly recurringDisplay: string;
      readonly recurringBadge: string;
      readonly depositBadge: string;
      readonly depositNote: string;
      readonly features: readonly string[];
    };
    readonly bulkBottles: {
      readonly name: string;
      readonly shortName: string;
      readonly desc: string;
      readonly priceDisplay: string;
      readonly depositBadge: string;
      readonly depositNote: string;
      readonly features: readonly string[];
    };
    readonly eventSupply: {
      readonly name: string;
      readonly shortName: string;
      readonly desc: string;
      readonly priceDisplay: string;
      readonly depositBadge: string;
      readonly depositNote: string;
      readonly features: readonly string[];
    };
    readonly perJar: string;
    readonly orderOnWhatsApp: string;
    readonly dispenserIncluded: string;
    readonly refundableDepositNotice: string;
  };
  readonly tds: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly sliderLabel: string;
    readonly sourceSelectLabel: string;
    readonly ppmUnit: string;
    readonly sources: {
      readonly chapakal: string;
      readonly submersible: string;
      readonly nalJal: string;
      readonly tanker: string;
    };
    readonly levels: {
      readonly excellent: TdsLevelTranslation;
      readonly good: TdsLevelTranslation;
      readonly fair: TdsLevelTranslation;
      readonly poor: TdsLevelTranslation;
      readonly hazardous: TdsLevelTranslation;
    };
    readonly asjQualityNotice: string;
  };
  readonly wizard: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly steps: {
      readonly step1: string;
      readonly step2: string;
      readonly step3: string;
      readonly step4: string;
    };
    readonly stepNames: {
      readonly serviceSelect: string;
      readonly quantityDetails: string;
      readonly customerDetails: string;
      readonly reviewSummary: string;
    };
    readonly services: {
      readonly jarNormal: { readonly title: string; readonly subtitle: string };
      readonly jarChilled: { readonly title: string; readonly subtitle: string };
      readonly bulkBottles: { readonly title: string; readonly subtitle: string };
      readonly eventSupply: { readonly title: string; readonly subtitle: string };
    };
    readonly form: {
      readonly chooseServiceHeading: string;
      readonly quantityHeading: string;
      readonly jarQuantityLabel: string;
      readonly recurringCheckboxLabel: string;
      readonly recurringSavingsText: string;
      readonly firstOrderCheckboxLabel: string;
      readonly firstOrderDepositInfo: string;
      readonly bottleQuantityLabel: string;
      readonly bottleContactNote: string;
      readonly eventGuestsLabel: string;
      readonly eventTypeLabel: string;
      readonly eventEstimatedVolume: string;
      readonly customerDetailsHeading: string;
      readonly fullNameLabel: string;
      readonly fullNamePlaceholder: string;
      readonly phoneLabel: string;
      readonly phonePlaceholder: string;
      readonly villageLabel: string;
      readonly selectVillagePlaceholder: string;
      readonly landmarkLabel: string;
      readonly landmarkPlaceholder: string;
      readonly saveDetailsLabel: string;
    };
    readonly eventTypes: {
      readonly wedding: string;
      readonly birthday: string;
      readonly religious: string;
      readonly corporate: string;
      readonly other: string;
    };
    readonly summary: {
      readonly heading: string;
      readonly selectedService: string;
      readonly quantity: string;
      readonly unitPrice: string;
      readonly baseAmount: string;
      readonly recurringSavings: string;
      readonly depositAmount: string;
      readonly totalPayable: string;
      readonly codNotice: string;
      readonly deliveryTo: string;
      readonly deliverySla: string;
      readonly eventZeroDepositNotice: string;
      readonly submitWhatsAppBtn: string;
      readonly backBtn: string;
      readonly nextBtn: string;
    };
    readonly validation: {
      readonly serviceRequired: string;
      readonly quantityMin: string;
      readonly guestsMin: string;
      readonly nameRequired: string;
      readonly phoneInvalid: string;
      readonly villageRequired: string;
      readonly landmarkRequired: string;
    };
  };
  readonly villageChecker: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly searchPlaceholder: string;
    readonly searchBtn: string;
    readonly serviceableBadge: string;
    readonly unserviceableBadge: string;
    readonly plantDistanceLabel: string;
    readonly deliverySlaLabel: string;
    readonly freeDeliveryNotice: string;
    readonly unserviceableNotice: string;
    readonly customVillageWhatsAppCta: string;
    readonly coveredVillagesHeading: string;
  };
  readonly map: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly plantTitle: string;
    readonly plantAddress: string;
    readonly getDirectionsBtn: string;
    readonly callPlantBtn: string;
    readonly openingHoursTitle: string;
    readonly openingHours: string;
  };
  readonly trustBadges: {
    readonly sectionTitle: string;
    readonly badge1: TrustBadgeTranslation;
    readonly badge2: TrustBadgeTranslation;
    readonly badge3: TrustBadgeTranslation;
    readonly badge4: TrustBadgeTranslation;
  };
  readonly faqs: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly items: readonly FaqTranslationItem[];
  };
  readonly testimonials: {
    readonly sectionBadge: string;
    readonly sectionTitle: string;
    readonly sectionSubtitle: string;
    readonly items: readonly TestimonialTranslationItem[];
  };
  readonly footer: {
    readonly brandDesc: string;
    readonly quickLinksTitle: string;
    readonly coverageTitle: string;
    readonly contactTitle: string;
    readonly plantAddress: string;
    readonly hotlineDisplay: string;
    readonly copyright: string;
    readonly allRightsReserved: string;
  };
  readonly common: {
    readonly loading: string;
    readonly error: string;
    readonly success: string;
    readonly back: string;
    readonly next: string;
    readonly callNow: string;
    readonly orderNow: string;
    readonly rupee: string;
    readonly perJar: string;
    readonly litres: string;
    readonly bottles: string;
    readonly jars: string;
    readonly guests: string;
    readonly languageToggle: string;
  };
}

export type Translations = AppTranslations;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'hi';

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['hi', 'en'] as const;

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === 'hi' || value === 'en';
}

function toTdsLevelTranslation(level: TdsLevelTranslation): TdsLevelTranslation {
  return {
    range: level.range,
    label: level.label,
    badge: level.badge,
    description: level.description,
    recommendation: level.recommendation,
  };
}

function toTrustBadgeTranslation(badge: TrustBadgeTranslation): TrustBadgeTranslation {
  return {
    title: badge.title,
    desc: badge.desc,
  };
}

function buildTranslations(lang: SupportedLanguage): AppTranslations {
  const dict = dictionaries[lang];

  return {
    meta: dict.meta,
    brand: {
      name: dict.brand.name,
      nameHindi: hindiDict.brand.name,
      tagline: dict.brand.tagline,
      plantAddress: dict.brand.plantAddress,
      hotline: dict.brand.hotline,
      hotlineNumber: dict.brand.hotlineNumber,
      whatsappNumber: dict.brand.whatsappNumber,
    },
    nav: dict.nav,
    hero: {
      ...dict.hero,
      stats: {
        customers: dict.stats.customersCount,
        customersLabel: dict.stats.customersLabel,
        purity: dict.stats.purityTdsRange,
        purityLabel: dict.stats.purityLabel,
        villages: dict.stats.villagesCoveredCount,
        villagesLabel: dict.stats.villagesLabel,
      },
    },
    products: dict.products,
    tds: {
      sectionBadge: dict.tds.sectionBadge,
      sectionTitle: dict.tds.sectionTitle,
      sectionSubtitle: dict.tds.sectionSubtitle,
      sliderLabel: dict.tds.sliderLabel,
      sourceSelectLabel: dict.tds.sourceSelectLabel,
      ppmUnit: dict.tds.ppmUnit,
      sources: dict.tds.sources,
      levels: {
        excellent: toTdsLevelTranslation(dict.tds.levels[0]),
        good: toTdsLevelTranslation(dict.tds.levels[1]),
        fair: toTdsLevelTranslation(dict.tds.levels[2]),
        poor: toTdsLevelTranslation(dict.tds.levels[3]),
        hazardous: toTdsLevelTranslation(dict.tds.levels[4]),
      },
      asjQualityNotice: dict.tds.asjQualityNotice,
    },
    wizard: dict.wizard,
    villageChecker: dict.villageChecker,
    map: {
      ...dict.map,
      plantAddress: dict.brand.plantAddress,
      openingHours: dict.brand.operatingHours,
    },
    trustBadges: {
      sectionTitle: dict.trustBadgesSectionTitle,
      badge1: toTrustBadgeTranslation(dict.trustBadges[0]),
      badge2: toTrustBadgeTranslation(dict.trustBadges[1]),
      badge3: toTrustBadgeTranslation(dict.trustBadges[2]),
      badge4: toTrustBadgeTranslation(dict.trustBadges[3]),
    },
    faqs: {
      ...dict.faqsSection,
      items: dict.faqs,
    },
    testimonials: {
      ...dict.testimonialsSection,
      items: dict.testimonials.map((testimonial) => ({
        id: testimonial.id,
        name: lang === 'hi' ? testimonial.nameHindi : testimonial.name,
        village: lang === 'hi' ? testimonial.villageHindi : testimonial.village,
        role: 'role' in testimonial && typeof testimonial.role === 'string' ? testimonial.role : undefined,
        rating: testimonial.rating,
        quote: testimonial.quote,
      })),
    },
    footer: {
      ...dict.footer,
      plantAddress: dict.brand.plantAddress,
      hotlineDisplay: dict.brand.hotline,
      copyright: dict.brand.copyright.replace('{year}', '2026'),
    },
    common: dict.common,
  };
}

export const hiTranslations: AppTranslations = buildTranslations('hi');
export const enTranslations: AppTranslations = buildTranslations('en');

export const translations: Record<SupportedLanguage, AppTranslations> = {
  hi: hiTranslations,
  en: enTranslations,
};

/**
 * Returns the translations dictionary for the given language.
 * Defaults to Hindi ('hi') if the language is unsupported or invalid.
 */
export function getTranslations(lang: SupportedLanguage | string): AppTranslations {
  if (isSupportedLanguage(lang)) {
    return translations[lang];
  }
  return translations[DEFAULT_LANGUAGE];
}

/**
 * Replaces `{key}` placeholders in a template string with corresponding values from the params object.
 */
export function interpolate(template: string, params: Record<string, string | number>): string {
  if (!template) {
    return '';
  }
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match;
  });
}
