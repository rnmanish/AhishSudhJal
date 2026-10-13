import type { ProductCategory } from '../../core/domain/entities/Product';

export interface ProductRecord {
  readonly id: string;
  readonly name: string;
  readonly nameHindi: string;
  readonly category: ProductCategory;
  readonly priceRs: number;
  readonly recurringPriceRs: number;
  readonly recurringDiscountRs: number;
  readonly depositRs: number;
  readonly unit: string;
  readonly isAvailable: boolean;
  readonly description: string;
  readonly descriptionHindi: string;
}

export const PRODUCTS: readonly ProductRecord[] = [
  {
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
    description: 'Multi-stage RO purified drinking water. Free doorstep delivery.',
    descriptionHindi: 'मल्टी-स्टेज आरओ शुद्ध पेयजल। मुफ्त डोरस्टेप डिलीवरी।',
  },
  {
    id: 'jar-chilled',
    name: '20L Chilled / Cool RO Water Jar',
    nameHindi: '20 लीटर ठंडा आरओ पानी जार',
    category: 'jar',
    priceRs: 30,
    recurringPriceRs: 25,
    recurringDiscountRs: 5,
    depositRs: 150,
    unit: 'jar',
    isAvailable: true,
    description: 'Temperature-controlled chilled RO water. Same purity, refreshing cold.',
    descriptionHindi: 'ठंडा आरओ शुद्ध पानी। वही शुद्धता, ताज़गी भरी ठंडक।',
  },
  {
    id: 'bulk-bottles',
    name: 'Packaged Water Bottles (250ml / 500ml / 1L)',
    nameHindi: 'पैकेज्ड पानी बोतल (250ml / 500ml / 1L)',
    category: 'bulk_bottles',
    priceRs: 30,
    recurringPriceRs: 30,
    recurringDiscountRs: 0,
    depositRs: 0,
    unit: 'bottle',
    isAvailable: true,
    description: 'Sealed packaged bottles in cartons. For home, commercial, and event use.',
    descriptionHindi: 'सीलबंद पैकेज्ड बोतलें। घरेलू, व्यावसायिक और समारोह उपयोग के लिए।',
  },
  {
    id: 'event-supply',
    name: 'Event / Party / Social Gathering Water Supply',
    nameHindi: 'इवेंट / पार्टी / समारोह जल आपूर्ति',
    category: 'event',
    priceRs: 30,
    recurringPriceRs: 30,
    recurringDiscountRs: 0,
    depositRs: 0,
    unit: 'jar',
    isAvailable: true,
    description: 'Bulk water supply for weddings, parties, and gatherings. Zero deposit on jars or dispensers.',
    descriptionHindi: 'शादी, पार्टी और समारोह के लिए थोक जल आपूर्ति। जार या डिस्पेंसर पर कोई जमा राशि नहीं।',
  },
];
