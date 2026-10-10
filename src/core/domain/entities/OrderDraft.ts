import type { IndianPhoneNumber } from '../value-objects/IndianPhoneNumber';
import { Money } from '../value-objects/Money';
import type { Product } from './Product';

export type OrderServiceType = 'jar' | 'bulk_bottles' | 'event';
export type JarTemperature = 'normal' | 'chilled';
export type DeliveryFrequency = 'daily' | 'alternate_days' | 'weekly';

export interface EventDetails {
  guestCount: number;
  eventType: string; // Wedding, Birthday, Puja, Corporate, Other
  eventDate: string;
  estimatedLitres?: number;
}

export interface OrderDraftProps {
  serviceType: OrderServiceType;
  productId: string;
  temperature?: JarTemperature;
  quantity: number;
  isRecurring: boolean;
  frequency?: DeliveryFrequency;
  isFirstOrder: boolean; // First-time order requires ₹150 deposit for jars
  customerName: string;
  customerPhone: IndianPhoneNumber;
  villageId: string;
  villageName: string;
  landmark: string;
  eventDetails?: EventDetails;
  notes?: string;
}

export interface CalculatedOrderSummary {
  unitPrice: Money | null;
  baseAmount: Money;
  depositAmount: Money;
  recurringSavings: Money;
  totalAmountPayable: Money;
  isCustomQuote: boolean;
}

export class OrderDraft {
  constructor(private readonly props: OrderDraftProps) {
    if (props.quantity <= 0 && props.serviceType !== 'event') {
      throw new Error(`Quantity must be at least 1. Received: ${props.quantity}`);
    }
    if (!props.customerName.trim()) {
      throw new Error('Customer name cannot be empty.');
    }
    if (!props.villageId) {
      throw new Error('Delivery village must be selected.');
    }
  }

  public getProps(): Readonly<OrderDraftProps> {
    return this.props;
  }

  public calculateSummary(product: Product): CalculatedOrderSummary {
    if (this.props.serviceType === 'event') {
      return {
        unitPrice: null,
        baseAmount: Money.zero(),
        depositAmount: Money.zero(), // Event orders have ZERO deposit
        recurringSavings: Money.zero(),
        totalAmountPayable: Money.zero(),
        isCustomQuote: true,
      };
    }

    if (this.props.serviceType === 'bulk_bottles') {
      return {
        unitPrice: null,
        baseAmount: Money.zero(),
        depositAmount: Money.zero(),
        recurringSavings: Money.zero(),
        totalAmountPayable: Money.zero(),
        isCustomQuote: true,
      };
    }

    // 20L Jar Calculation
    const unitPrice = product.getUnitPrice(this.props.isRecurring);
    if (!unitPrice) {
      throw new Error('Unit price unavailable for jar product.');
    }

    const baseAmount = unitPrice.multiply(this.props.quantity);
    
    // Deposit applies only for first order of jars
    const depositAmount = this.props.isFirstOrder ? product.getDeposit() : Money.zero();

    // Recurring savings calculation (₹5 per bottle if recurring)
    const recurringSavings = this.props.isRecurring
      ? product.getRecurringDiscount().multiply(this.props.quantity)
      : Money.zero();

    const totalAmountPayable = baseAmount.add(depositAmount);

    return {
      unitPrice,
      baseAmount,
      depositAmount,
      recurringSavings,
      totalAmountPayable,
      isCustomQuote: false,
    };
  }
}
