import { describe, it, expect } from 'vitest';
import { Product } from '../../../src/core/domain/entities/Product';

describe('Product Entity', () => {
  const jarProduct = new Product({
    id: 'jar-normal',
    name: '20L Normal RO Water Jar',
    nameHindi: '20 लीटर नॉर्मल आरओ पानी जार',
    category: 'jar',
    priceRs: 30,
    recurringPriceRs: 25,
    recurringDiscountRs: 5,
    depositRs: 150,
    unit: 'jar',
    isAvailable: true,
    description: 'Multi-stage RO purified drinking water.',
    descriptionHindi: 'मल्टी-स्टेज आरओ शुद्ध पेयजल।',
  });

  const bulkBottles = new Product({
    id: 'bulk-bottles',
    name: 'Packaged Water Bottles (250ml / 500ml / 1L)',
    nameHindi: 'पैकेज्ड पानी बोतल (250ml / 500ml / 1L)',
    category: 'bulk_bottles',
    priceRs: null,
    recurringPriceRs: null,
    recurringDiscountRs: 0,
    depositRs: 0,
    unit: 'carton',
    isAvailable: true,
    description: 'Sealed packaged bottles in cartons.',
    descriptionHindi: 'सीलबंद पैकेज्ड बोतलें।',
  });

  it('retrieves bilingual names and descriptions correctly', () => {
    expect(jarProduct.getName('hi')).toBe('20 लीटर नॉर्मल आरओ पानी जार');
    expect(jarProduct.getName('en')).toBe('20L Normal RO Water Jar');
    expect(jarProduct.getDescription('hi')).toBe('मल्टी-स्टेज आरओ शुद्ध पेयजल।');
    expect(jarProduct.getDescription('en')).toBe('Multi-stage RO purified drinking water.');
  });

  it('correctly calculates recurring unit price vs regular unit price', () => {
    expect(jarProduct.getUnitPrice(false)?.getAmount()).toBe(30);
    expect(jarProduct.getUnitPrice(true)?.getAmount()).toBe(25);
    expect(jarProduct.getRecurringDiscount().getAmount()).toBe(5);
  });

  it('identifies products that require a custom quote', () => {
    expect(bulkBottles.isQuoteRequired()).toBe(true);
    expect(bulkBottles.getBasePrice()).toBeNull();
    expect(bulkBottles.getUnitPrice(false)).toBeNull();
    expect(bulkBottles.hasDeposit()).toBe(false);
  });
});
