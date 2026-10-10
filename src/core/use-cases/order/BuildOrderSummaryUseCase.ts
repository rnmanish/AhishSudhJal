import type { IProductRepository } from '../../domain/repositories/IProductRepository';
import type { OrderDraft, CalculatedOrderSummary } from '../../domain/entities/OrderDraft';
import type { Product } from '../../domain/entities/Product';

export interface OrderSummaryResult {
  draft: OrderDraft;
  product: Product;
  summary: CalculatedOrderSummary;
}

export class BuildOrderSummaryUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  public async execute(draft: OrderDraft): Promise<OrderSummaryResult> {
    const props = draft.getProps();
    const product = await this.productRepo.getById(props.productId);

    if (!product) {
      throw new Error(`Product not found with ID: ${props.productId}`);
    }

    const summary = draft.calculateSummary(product);

    return {
      draft,
      product,
      summary,
    };
  }
}
