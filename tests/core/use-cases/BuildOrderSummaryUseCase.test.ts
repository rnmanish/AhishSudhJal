import { describe, it, expect } from 'vitest';
import { BuildOrderSummaryUseCase } from '../../../src/core/use-cases/order/BuildOrderSummaryUseCase';
import type { IProductRepository } from '../../../src/core/domain/repositories/IProductRepository';
import { Product } from '../../../src/core/domain/entities/Product';
import type { ProductCategory } from '../../../src/core/domain/entities/Product';
import { OrderDraft } from '../../../src/core/domain/entities/OrderDraft';
import { IndianPhoneNumber } from '../../../src/core/domain/value-objects/IndianPhoneNumber';

class MockProductRepository implements IProductRepository {
  private products = [
    new Product({
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
      description: '20L RO Water Jar',
      descriptionHindi: '20 लीटर आरओ पानी जार',
    }),
  ];

  async getAll(): Promise<Product[]> {
    return this.products;
  }

  async getById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.getId() === id) ?? null;
  }

  async getByCategory(category: ProductCategory): Promise<Product[]> {
    return this.products.filter((p) => p.getCategory() === category);
  }
}

describe('BuildOrderSummaryUseCase', () => {
  const repo = new MockProductRepository();
  const useCase = new BuildOrderSummaryUseCase(repo);

  it('builds summary and calculates totals for order draft', async () => {
    const draft = new OrderDraft({
      serviceType: 'jar',
      productId: 'jar-normal',
      quantity: 3,
      isRecurring: true,
      isFirstOrder: false,
      customerName: 'Sanjay Verma',
      customerPhone: new IndianPhoneNumber('8235882384'),
      villageId: 'puraina',
      villageName: 'Puraina',
      landmark: 'Near Panchayat Bhawan',
    });

    const result = await useCase.execute(draft);
    expect(result.product.getId()).toBe('jar-normal');
    expect(result.summary.baseAmount.getAmount()).toBe(75); // 3 × 25
    expect(result.summary.recurringSavings.getAmount()).toBe(15); // 3 × 5
    expect(result.summary.depositAmount.getAmount()).toBe(0);
    expect(result.summary.totalAmountPayable.getAmount()).toBe(75);
  });

  it('throws error when product does not exist', async () => {
    const draft = new OrderDraft({
      serviceType: 'jar',
      productId: 'non-existent-id',
      quantity: 1,
      isRecurring: false,
      isFirstOrder: true,
      customerName: 'Test Customer',
      customerPhone: new IndianPhoneNumber('9876543210'),
      villageId: 'puraina',
      villageName: 'Puraina',
      landmark: 'Near Gate',
    });

    await expect(useCase.execute(draft)).rejects.toThrow(/Product not found/);
  });
});
