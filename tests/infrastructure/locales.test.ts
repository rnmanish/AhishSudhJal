import { describe, it, expect } from 'vitest';
import { dictionaries, englishDict, hindiDict } from '../../src/locales';

function collectParityErrors(
  hindiNode: unknown,
  englishNode: unknown,
  currentPath = 'root'
): string[] {
  const errors: string[] = [];

  if (Array.isArray(hindiNode)) {
    if (!Array.isArray(englishNode)) {
      errors.push(`Expected array at "${currentPath}" in en.json`);
      return errors;
    }
    if (hindiNode.length !== englishNode.length) {
      errors.push(
        `Array length mismatch at "${currentPath}": hi=${hindiNode.length}, en=${englishNode.length}`
      );
    }
    const minLen = Math.min(hindiNode.length, englishNode.length);
    for (let index = 0; index < minLen; index += 1) {
      errors.push(
        ...collectParityErrors(hindiNode[index], englishNode[index], `${currentPath}[${index}]`)
      );
    }
    return errors;
  }

  if (hindiNode !== null && typeof hindiNode === 'object') {
    if (englishNode === null || typeof englishNode !== 'object' || Array.isArray(englishNode)) {
      errors.push(`Expected object at "${currentPath}" in en.json`);
      return errors;
    }
    const hindiRecord = hindiNode as Record<string, unknown>;
    const englishRecord = englishNode as Record<string, unknown>;
    const hindiKeys = Object.keys(hindiRecord).sort();
    const englishKeys = Object.keys(englishRecord).sort();

    if (JSON.stringify(hindiKeys) !== JSON.stringify(englishKeys)) {
      errors.push(
        `Key mismatch at "${currentPath}": hi=[${hindiKeys.join(',')}] vs en=[${englishKeys.join(',')}]`
      );
      return errors;
    }

    for (const key of hindiKeys) {
      errors.push(
        ...collectParityErrors(hindiRecord[key], englishRecord[key], `${currentPath}.${key}`)
      );
    }
    return errors;
  }

  if (typeof hindiNode !== typeof englishNode) {
    errors.push(
      `Primitive type mismatch at "${currentPath}": hi=${typeof hindiNode}, en=${typeof englishNode}`
    );
  }

  if (typeof hindiNode === 'string' && hindiNode.trim().length === 0) {
    errors.push(`Empty string at "${currentPath}" in hi.json`);
  }
  if (typeof englishNode === 'string' && englishNode.trim().length === 0) {
    errors.push(`Empty string at "${currentPath}" in en.json`);
  }

  return errors;
}

describe('JSON Locale Engine (src/locales)', () => {
  describe('Structural Parity & Completeness', () => {
    it('should have 100% recursive key, array-length, and type parity between hi.json and en.json', () => {
      const parityErrors = collectParityErrors(hindiDict, englishDict);
      expect(parityErrors).toEqual([]);
    });

    it('should expose hi and en dictionaries through the unified dictionaries record', () => {
      expect(dictionaries.hi).toBe(hindiDict);
      expect(dictionaries.en).toBe(englishDict);
    });
  });

  describe('Script Authenticity (Devanagari & Latin)', () => {
    it('should use authentic Devanagari script across Hindi copy', () => {
      const devanagariRegex = /[\u0900-\u097F]/;
      expect(devanagariRegex.test(hindiDict.brand.name)).toBe(true);
      expect(devanagariRegex.test(hindiDict.hero.title)).toBe(true);
      expect(devanagariRegex.test(hindiDict.products.jarNormal.name)).toBe(true);
      expect(devanagariRegex.test(hindiDict.whatsappTemplates.header)).toBe(true);
    });

    it('should use Latin script across English copy', () => {
      const latinRegex = /[A-Za-z]/;
      expect(latinRegex.test(englishDict.brand.name)).toBe(true);
      expect(latinRegex.test(englishDict.hero.title)).toBe(true);
      expect(latinRegex.test(englishDict.products.jarNormal.name)).toBe(true);
      expect(latinRegex.test(englishDict.whatsappTemplates.header)).toBe(true);
    });
  });

  describe('Address & Contact Invariants', () => {
    it('should maintain canonical Ward No-1, Sarsar, Siwan, Pin 841226 address in both locales', () => {
      expect(hindiDict.brand.plantAddress).toContain('सरसर');
      expect(hindiDict.brand.plantAddress).toContain('वार्ड नं-1');
      expect(hindiDict.brand.plantAddress).toContain('सिवान');
      expect(hindiDict.brand.plantAddress).toContain('841226');

      expect(englishDict.brand.plantAddress).toContain('Sarsar');
      expect(englishDict.brand.plantAddress).toContain('Ward No-1');
      expect(englishDict.brand.plantAddress).toContain('Siwan');
      expect(englishDict.brand.plantAddress).toContain('841226');
    });

    it('should define identical hotline and whatsappNumber in both hi.json and en.json', () => {
      expect(hindiDict.brand.hotline).toBe('+91 82358 82384');
      expect(englishDict.brand.hotline).toBe('+91 82358 82384');
      expect(hindiDict.brand.hotlineNumber).toBe('8235882384');
      expect(englishDict.brand.hotlineNumber).toBe('8235882384');
      expect(hindiDict.brand.whatsappNumber).toBe('918235882384');
      expect(englishDict.brand.whatsappNumber).toBe('918235882384');
    });
  });

  describe('Pricing & Deposit Rules', () => {
    it('should specify ₹30 regular, ₹25 recurring, ₹150 first-order deposit, and ₹0 event deposit', () => {
      expect(hindiDict.products.jarNormal.priceDisplay).toBe('₹30');
      expect(englishDict.products.jarNormal.priceDisplay).toBe('₹30');
      expect(hindiDict.products.jarNormal.recurringDisplay).toBe('₹25');
      expect(englishDict.products.jarNormal.recurringDisplay).toBe('₹25');
      expect(hindiDict.products.jarNormal.depositBadge).toContain('₹150');
      expect(englishDict.products.jarNormal.depositBadge).toContain('₹150');

      expect(hindiDict.products.eventSupply.depositBadge).toContain('₹0');
      expect(englishDict.products.eventSupply.depositBadge).toContain('₹0');
      expect(hindiDict.whatsappTemplates.eventZeroDeposit).toContain('₹0');
      expect(englishDict.whatsappTemplates.eventZeroDeposit).toContain('₹0');
    });
  });

  describe('Zero-Servicing Rule Audit', () => {
    it('must have zero occurrences of RO servicing or repair terms across both locale files', () => {
      const hindiSerialized = JSON.stringify(hindiDict).toLowerCase();
      const englishSerialized = JSON.stringify(englishDict).toLowerCase();

      for (const serialized of [hindiSerialized, englishSerialized]) {
        expect(serialized).not.toContain('servicing');
        expect(serialized).not.toContain('सर्विसिंग');
        expect(serialized).not.toContain('repair');
        expect(serialized).not.toContain('मरम्मत');
      }
    });
  });
});

