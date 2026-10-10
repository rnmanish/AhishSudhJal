import type { Product, ProductCategory } from '../entities/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getByCategory(category: ProductCategory): Promise<Product[]>;
}
