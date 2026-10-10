import { describe, it, expect } from 'vitest';
import { OrderDraft } from '../../../src/core/domain/entities/OrderDraft';
import { Product } from '../../../src/core/domain/entities/Product';
import { IndianPhoneNumber } from '../../../src/core/domain/value-objects/IndianPhoneNumber';

describe('OrderDraft Entity & Calculations', () => {
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
    description: 'Fresh RO water',
    descriptionHindi: 'ताज़ा आरओ पानी',
  });

  const eventProduct = new Product({
    id: 'event-supply',
    name: 'Event Water Supply',
    nameHindi: 'इवेंट जल आपूर्ति',
    category: 'event',
    priceRs: null,
    recurringPriceRs: null,
    recurringDiscountRs: 0,
    depositRs: 0,
    unit: 'custom',
    isAvailable: true,
    description: 'Bulk event supply',
    descriptionHindi: 'थोक आपूर्ति',
  });

  it('calculates regular first-time jar order with ₹150 deposit', () => {
    const draft = new OrderDraft({
      serviceType: 'jar',
      productId: 'jar-normal',
      quantity: 2,
      isRecurring: false,
      isFirstOrder: true,
      customerName: 'Rahul Kumar',
      customerPhone: new IndianPhoneNumber('8235882384'),
      villageId: 'puraina',
      villageName: 'Puraina',
      landmark: 'Near Temple',
    });

    const summary = draft.calculateSummary(jarProduct);
    expect(summary.unitPrice?.getAmount()).toBe(30);
    expect(summary.baseAmount.getAmount()).toBe(60); // 2 × 30
    expect(summary.depositAmount.getAmount()).toBe(150); // 150 deposit
    expect(summary.totalAmountPayable.getAmount()).toBe(210); // 60 + 150
    expect(summary.recurringSavings.getAmount()).toBe(0);
    expect(summary.isCustomQuote).toBe(false);
  });

  it('calculates recurring jar order with ₹5 discount per jar', () => {
    const draft = new OrderDraft({
      serviceType: 'jar',
      productId: 'jar-normal',
      quantity: 4,
      isRecurring: true,
      isFirstOrder: false, // repeat customer, no new deposit
      customerName: 'Amit Sharma',
      customerPhone: new IndianPhoneNumber('9876543210'),
      villageId: 'sarsar',
      villageName: 'Sarsar',
      landmark: 'Main Road',
    });

    const summary = draft.calculateSummary(jarProduct);
    expect(summary.unitPrice?.getAmount()).toBe(25); // ₹25 recurring price
    expect(summary.baseAmount.getAmount()).toBe(100); // 4 × 25
    expect(summary.depositAmount.getAmount()).toBe(0); // already paid previously
    expect(summary.recurringSavings.getAmount()).toBe(20); // 4 × 5 saved
    expect(summary.totalAmountPayable.getAmount()).toBe(100);
  });

  it('calculates event orders with ZERO deposit and flags custom quote', () => {
    const draft = new OrderDraft({
      serviceType: 'event',
      productId: 'event-supply',
      quantity: 1,
      isRecurring: false,
      isFirstOrder: true,
      customerName: 'Pooja Singh',
      customerPhone: new IndianPhoneNumber('7004123456'),
      villageId: 'nathu-chhap',
      villageName: 'Nathu Chhap',
      landmark: 'Community Hall',
      eventDetails: {
        guestCount: 300,
        eventType: 'Wedding',
        eventDate: '2026-11-15',
      },
    });

    const summary = draft.calculateSummary(eventProduct);
    expect(summary.depositAmount.getAmount()).toBe(0); // Zero deposit for events
    expect(summary.isCustomQuote).toBe(true);
  });
});
