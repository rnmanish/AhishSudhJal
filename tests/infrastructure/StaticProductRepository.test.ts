import { describe, it, expect } from 'vitest';
import { StaticProductRepository } from '../../src/infrastructure/repositories/StaticProductRepository';
import { PRODUCTS } from '../../src/infrastructure/config/products.data';
import type { ProductRecord } from '../../src/infrastructure/config/products.data';

describe('StaticProductRepository', () => {
  it('should initialize with all 4 active catalog products by default', async () => {
    const repository = new StaticProductRepository();
    const products = await repository.getAll();

    expect(products).toHaveLength(4);
    expect(PRODUCTS).toHaveLength(4);

    const ids = products.map((p) => p.getId());
    expect(ids).toEqual(['jar-normal', 'jar-chilled', 'bulk-bottles', 'event-supply']);
  });

  describe('Product Specifications & Pricing Rules', () => {
    const repository = new StaticProductRepository();

    it('should correctly configure 20L Normal Water Jar with ₹30 base, ₹25 recurring, and ₹150 deposit', async () => {
      const normalJar = await repository.getById('jar-normal');
      expect(normalJar).not.toBeNull();
      if (!normalJar) {
        throw new Error('Product should not be null');
      }

      expect(normalJar.getId()).toBe('jar-normal');
      expect(normalJar.getName('en')).toBe('20L Normal RO Water Jar');
      expect(normalJar.getName('hi')).toBe('20 लीटर नॉर्मल आरओ पानी जार');
      expect(normalJar.getCategory()).toBe('jar');
      expect(normalJar.getUnit()).toBe('jar');
      expect(normalJar.isAvailable()).toBe(true);
      expect(normalJar.isQuoteRequired()).toBe(false);

      expect(normalJar.getBasePrice()?.getAmount()).toBe(30);
      expect(normalJar.getRecurringPrice()?.getAmount()).toBe(25);
      expect(normalJar.getRecurringDiscount().getAmount()).toBe(5);
      expect(normalJar.getUnitPrice(false)?.getAmount()).toBe(30);
      expect(normalJar.getUnitPrice(true)?.getAmount()).toBe(25);

      expect(normalJar.hasDeposit()).toBe(true);
      expect(normalJar.getDeposit().getAmount()).toBe(150);
    });

    it('should correctly configure 20L Chilled Water Jar with ₹30 base, ₹25 recurring, and ₹150 deposit', async () => {
      const chilledJar = await repository.getById('jar-chilled');
      expect(chilledJar).not.toBeNull();
      if (!chilledJar) {
        throw new Error('Product should not be null');
      }

      expect(chilledJar.getId()).toBe('jar-chilled');
      expect(chilledJar.getName('en')).toBe('20L Chilled / Cool RO Water Jar');
      expect(chilledJar.getName('hi')).toBe('20 लीटर ठंडा आरओ पानी जार');
      expect(chilledJar.getCategory()).toBe('jar');
      expect(chilledJar.getUnit()).toBe('jar');
      expect(chilledJar.isAvailable()).toBe(true);
      expect(chilledJar.isQuoteRequired()).toBe(false);

      expect(chilledJar.getBasePrice()?.getAmount()).toBe(30);
      expect(chilledJar.getRecurringPrice()?.getAmount()).toBe(25);
      expect(chilledJar.getRecurringDiscount().getAmount()).toBe(5);
      expect(chilledJar.getUnitPrice(false)?.getAmount()).toBe(30);
      expect(chilledJar.getUnitPrice(true)?.getAmount()).toBe(25);

      expect(chilledJar.hasDeposit()).toBe(true);
      expect(chilledJar.getDeposit().getAmount()).toBe(150);
    });

    it('should correctly configure Bulk Packaged Bottles with ₹30 base and ZERO deposit', async () => {
      const bulkBottles = await repository.getById('bulk-bottles');
      expect(bulkBottles).not.toBeNull();
      if (!bulkBottles) {
        throw new Error('Product should not be null');
      }

      expect(bulkBottles.getId()).toBe('bulk-bottles');
      expect(bulkBottles.getName('en')).toBe('Packaged Water Bottles (250ml / 500ml / 1L)');
      expect(bulkBottles.getName('hi')).toBe('पैकेज्ड पानी बोतल (250ml / 500ml / 1L)');
      expect(bulkBottles.getCategory()).toBe('bulk_bottles');
      expect(bulkBottles.getUnit()).toBe('bottle');
      expect(bulkBottles.isAvailable()).toBe(true);
      expect(bulkBottles.isQuoteRequired()).toBe(false);

      expect(bulkBottles.getBasePrice()?.getAmount()).toBe(30);
      expect(bulkBottles.getRecurringPrice()?.getAmount()).toBe(30);
      expect(bulkBottles.getRecurringDiscount().getAmount()).toBe(0);
      expect(bulkBottles.getUnitPrice(false)?.getAmount()).toBe(30);
      expect(bulkBottles.getUnitPrice(true)?.getAmount()).toBe(30);

      expect(bulkBottles.hasDeposit()).toBe(false);
      expect(bulkBottles.getDeposit().getAmount()).toBe(0);
    });

    it('should correctly configure Event Water Supply with ₹30 base and ZERO deposit', async () => {
      const eventSupply = await repository.getById('event-supply');
      expect(eventSupply).not.toBeNull();
      if (!eventSupply) {
        throw new Error('Product should not be null');
      }

      expect(eventSupply.getId()).toBe('event-supply');
      expect(eventSupply.getName('en')).toBe('Event / Party / Social Gathering Water Supply');
      expect(eventSupply.getName('hi')).toBe('इवेंट / पार्टी / समारोह जल आपूर्ति');
      expect(eventSupply.getCategory()).toBe('event');
      expect(eventSupply.getUnit()).toBe('jar');
      expect(eventSupply.isAvailable()).toBe(true);
      expect(eventSupply.isQuoteRequired()).toBe(false);

      expect(eventSupply.getBasePrice()?.getAmount()).toBe(30);
      expect(eventSupply.getRecurringPrice()?.getAmount()).toBe(30);
      expect(eventSupply.getRecurringDiscount().getAmount()).toBe(0);
      expect(eventSupply.getUnitPrice(false)?.getAmount()).toBe(30);
      expect(eventSupply.getUnitPrice(true)?.getAmount()).toBe(30);

      expect(eventSupply.hasDeposit()).toBe(false);
      expect(eventSupply.getDeposit().getAmount()).toBe(0);
    });
  });

  describe('Category Filtering', () => {
    const repository = new StaticProductRepository();

    it('should filter jar category correctly', async () => {
      const jars = await repository.getByCategory('jar');
      expect(jars).toHaveLength(2);
      expect(jars.map((j) => j.getId())).toEqual(['jar-normal', 'jar-chilled']);
    });

    it('should filter bulk_bottles category correctly', async () => {
      const bottles = await repository.getByCategory('bulk_bottles');
      expect(bottles).toHaveLength(1);
      expect(bottles[0].getId()).toBe('bulk-bottles');
    });

    it('should filter event category correctly', async () => {
      const events = await repository.getByCategory('event');
      expect(events).toHaveLength(1);
      expect(events[0].getId()).toBe('event-supply');
    });
  });

  describe('Case-Insensitivity and Sanitization', () => {
    const repository = new StaticProductRepository();

    it('should handle uppercase, mixed-case, and whitespace in getById', async () => {
      const upper = await repository.getById('JAR-NORMAL');
      const mixed = await repository.getById('  Jar-Chilled  ');
      const event = await repository.getById('\tevent-supply\n');

      expect(upper?.getId()).toBe('jar-normal');
      expect(mixed?.getId()).toBe('jar-chilled');
      expect(event?.getId()).toBe('event-supply');
    });

    it('should return null for empty, whitespace-only, or unknown IDs', async () => {
      expect(await repository.getById('')).toBeNull();
      expect(await repository.getById('   ')).toBeNull();
      expect(await repository.getById('non-existent-product')).toBeNull();
    });
  });

  describe('Availability & Inactive Product Filtering', () => {
    const mockData: readonly ProductRecord[] = [
      {
        id: 'active-jar',
        name: 'Active Jar',
        nameHindi: 'सक्रिय जार',
        category: 'jar',
        priceRs: 30,
        recurringPriceRs: 25,
        recurringDiscountRs: 5,
        depositRs: 150,
        unit: 'jar',
        isAvailable: true,
        description: 'Active product',
        descriptionHindi: 'सक्रिय उत्पाद',
      },
      {
        id: 'discontinued-jar',
        name: 'Discontinued Jar',
        nameHindi: 'बंद जार',
        category: 'jar',
        priceRs: 30,
        recurringPriceRs: 25,
        recurringDiscountRs: 5,
        depositRs: 150,
        unit: 'jar',
        isAvailable: false,
        description: 'Discontinued product',
        descriptionHindi: 'बंद उत्पाद',
      },
    ];

    it('should return only active products by default', async () => {
      const repo = new StaticProductRepository(mockData);
      const all = await repo.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].getId()).toBe('active-jar');

      const byCat = await repo.getByCategory('jar');
      expect(byCat).toHaveLength(1);
      expect(byCat[0].getId()).toBe('active-jar');

      const byId = await repo.getById('discontinued-jar');
      expect(byId).toBeNull();
    });

    it('should include unavailable products when includeUnavailable is true', async () => {
      const repo = new StaticProductRepository(mockData);
      const all = await repo.getAll(true);
      expect(all).toHaveLength(2);

      const byCat = await repo.getByCategory('jar', true);
      expect(byCat).toHaveLength(2);

      const byId = await repo.getById('discontinued-jar', true);
      expect(byId).not.toBeNull();
      expect(byId?.getId()).toBe('discontinued-jar');
      expect(byId?.isAvailable()).toBe(false);
    });
  });

  describe('RO Servicing Complete Absence Audit', () => {
    it('should ensure RO purifier servicing is completely absent from catalog and repository', async () => {
      const repository = new StaticProductRepository();
      const all = await repository.getAll(true);

      const roServiceProduct = all.find(
        (p) =>
          p.getId().toLowerCase().includes('service') ||
          p.getId().toLowerCase().includes('repair') ||
          p.getName('en').toLowerCase().includes('servicing') ||
          p.getDescription('en').toLowerCase().includes('filter replacement')
      );

      expect(roServiceProduct).toBeUndefined();
    });
  });

  describe('Immutability & Isolation', () => {
    it('should not throw and return empty arrays for empty dataset', async () => {
      const repo = new StaticProductRepository([]);
      expect(await repo.getAll()).toHaveLength(0);
      expect(await repo.getById('jar-normal')).toBeNull();
      expect(await repo.getByCategory('jar')).toHaveLength(0);
    });
  });
});
