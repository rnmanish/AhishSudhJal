import type { IProductRepository } from '../../core/domain/repositories/IProductRepository';
import { Product } from '../../core/domain/entities/Product';
import type { ProductCategory } from '../../core/domain/entities/Product';
import type { ProductRecord } from '../config/products.data';
import { PRODUCTS } from '../config/products.data';

export class StaticProductRepository implements IProductRepository {
  private readonly products: readonly Product[];

  constructor(data: readonly ProductRecord[] = PRODUCTS) {
    this.products = Object.freeze(
      data.map(
        (record) =>
          new Product({
            id: record.id,
            name: record.name,
            nameHindi: record.nameHindi,
            category: record.category,
            priceRs: record.priceRs,
            recurringPriceRs: record.recurringPriceRs,
            recurringDiscountRs: record.recurringDiscountRs,
            depositRs: record.depositRs,
            unit: record.unit,
            isAvailable: record.isAvailable,
            description: record.description,
            descriptionHindi: record.descriptionHindi,
          })
      )
    );
  }

  public async getAll(includeUnavailable = false): Promise<Product[]> {
    if (includeUnavailable) {
      return [...this.products];
    }
    return this.products.filter((product) => product.isAvailable());
  }

  public async getById(productId: string, includeUnavailable = false): Promise<Product | null> {
    const cleanId = productId.trim().toLowerCase();
    if (!cleanId) {
      return null;
    }
    const match = this.products.find((product) => product.getId().toLowerCase() === cleanId);
    if (!match) {
      return null;
    }
    if (!includeUnavailable && !match.isAvailable()) {
      return null;
    }
    return match;
  }

  public async getByCategory(
    category: ProductCategory,
    includeUnavailable = false
  ): Promise<Product[]> {
    return this.products.filter(
      (product) => product.getCategory() === category && (includeUnavailable || product.isAvailable())
    );
  }
}
