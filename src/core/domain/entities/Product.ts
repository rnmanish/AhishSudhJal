import { Money } from '../value-objects/Money';

export type ProductCategory = 'jar' | 'bulk_bottles' | 'event';

export interface ProductProps {
  id: string;
  name: string;
  nameHindi: string;
  category: ProductCategory;
  priceRs: number | null;
  recurringPriceRs: number | null;
  recurringDiscountRs: number;
  depositRs: number;
  unit: string;
  isAvailable: boolean;
  description: string;
  descriptionHindi: string;
}

export class Product {
  constructor(private readonly props: ProductProps) {}

  public getId(): string {
    return this.props.id;
  }

  public getName(lang: 'hi' | 'en' = 'hi'): string {
    return lang === 'hi' ? this.props.nameHindi : this.props.name;
  }

  public getCategory(): ProductCategory {
    return this.props.category;
  }

  public isQuoteRequired(): boolean {
    return this.props.priceRs === null;
  }

  public getBasePrice(): Money | null {
    return this.props.priceRs !== null ? Money.fromRupees(this.props.priceRs) : null;
  }

  public getRecurringPrice(): Money | null {
    return this.props.recurringPriceRs !== null ? Money.fromRupees(this.props.recurringPriceRs) : null;
  }

  public getRecurringDiscount(): Money {
    return Money.fromRupees(this.props.recurringDiscountRs);
  }

  public getDeposit(): Money {
    return Money.fromRupees(this.props.depositRs);
  }

  public hasDeposit(): boolean {
    return this.props.depositRs > 0;
  }

  public getUnit(): string {
    return this.props.unit;
  }

  public isAvailable(): boolean {
    return this.props.isAvailable;
  }

  public getDescription(lang: 'hi' | 'en' = 'hi'): string {
    return lang === 'hi' ? this.props.descriptionHindi : this.props.description;
  }

  public getUnitPrice(isRecurring: boolean): Money | null {
    if (this.props.priceRs === null) {
      return null;
    }
    if (isRecurring && this.props.recurringPriceRs !== null) {
      return Money.fromRupees(this.props.recurringPriceRs);
    }
    return Money.fromRupees(this.props.priceRs);
  }
}
