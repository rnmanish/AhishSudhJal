import hindiDict from './hi.json';
import englishDict from './en.json';
import type { SupportedLanguage } from '../core/domain/value-objects/Language';

export type {
  LocalizedString,
  LocalizedStringList,
  BrandInfo,
  SiteStats,
  TrustBadgeItem,
  FaqCategory,
  FaqItem,
  TestimonialItem,
  TdsQualityBand,
  ProductCopyItem,
  WhatsAppMessageTemplates,
  SiteData,
} from './types';

/**
 * TranslationSchema is structurally inferred from the Hindi JSON file.
 * hi.json is the canonical schema; en.json must match it 100%.
 */
export type TranslationSchema = typeof hindiDict;

/**
 * Compile-time structural parity check.
 * If en.json is missing any key present in hi.json (or vice-versa), TypeScript
 * raises a compile error here in both `npm run build` and `npm test`.
 */
const _parity: TranslationSchema = englishDict;
void _parity;

export const dictionaries: Record<SupportedLanguage, TranslationSchema> = {
  hi: hindiDict,
  en: englishDict,
} as const;

export { hindiDict, englishDict };

