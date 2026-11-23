'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  Droplets,
  Package,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Product as DomainProduct } from '../../../core/domain/entities/Product';
import type { Product, ProductCategory } from '../../../core/domain/entities/Product';
import { PRODUCTS } from '../../../infrastructure/config/products.data';
import { useLanguage } from '../../i18n/useLanguage';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  readonly className?: string;
  readonly products?: readonly Product[];
  readonly onOrderClick?: (product: Product) => void;
  readonly onSelectProduct?: (productId: string) => void;
}

export type CatalogFilterCategory = 'all' | ProductCategory;

/**
 * Default fallback products constructed from the centralized products configuration.
 * Adheres strictly to Clean Architecture domain entity standards.
 */
export const DEFAULT_CATALOG_PRODUCTS: readonly Product[] = Object.freeze(
  PRODUCTS.map(
    (record) =>
      new DomainProduct({
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

const productGridStyles = `
  /* ==========================================================================
   * 1. Product Grid Section Container & Aquatic Surface
   * ========================================================================== */
  .asj-catalog {
    position: relative;
    width: 100%;
    background: radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08) 0%, rgba(3, 12, 26, 0.98) 75%),
                linear-gradient(180deg, #030c1a 0%, #051329 100%);
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    padding: 4rem 1rem 4.5rem;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .asj-catalog {
      padding: 5rem 1.5rem 5.5rem;
    }
  }

  @media (min-width: 1024px) {
    .asj-catalog {
      padding: 6rem 2rem 6.5rem;
    }
  }

  .asj-catalog__container {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* ==========================================================================
   * 2. Section Header: Pill Badge, Titles & Description
   * ========================================================================== */
  .asj-catalog__header {
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
  }

  .asj-catalog__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.875rem;
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.32);
    border-radius: var(--radius-full, 9999px);
    color: var(--color-primary-300, #7dd3fc);
    font-size: 0.8125rem;
    font-weight: var(--font-weight-bold, 700);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .asj-catalog__title {
    font-size: clamp(1.75rem, 2.5vw + 1rem, 2.75rem);
    font-weight: var(--font-weight-extrabold, 800);
    line-height: var(--line-height-tight, 1.2);
    color: var(--color-text-primary, #f8fafc);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .asj-catalog__subtitle {
    font-size: clamp(0.9375rem, 1vw + 0.5rem, 1.125rem);
    font-weight: var(--font-weight-regular, 400);
    line-height: var(--line-height-relaxed, 1.6);
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0;
  }

  /* ==========================================================================
   * 3. Category Filter Tabs Strip
   * ========================================================================== */
  .asj-catalog__filters {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.5rem auto 1rem;
    padding: 0.375rem;
    background: rgba(5, 19, 41, 0.65);
    border: 1px solid rgba(56, 189, 248, 0.18);
    border-radius: var(--radius-full, 9999px);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    width: fit-content;
    max-width: 100%;
  }

  .asj-catalog__filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4375rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.5rem 1.125rem;
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    border-radius: var(--radius-full, 9999px);
    border: 1px solid transparent;
    background: transparent;
    color: var(--color-text-secondary, #cbd5e1);
    cursor: pointer;
    box-sizing: border-box;
    transition: all var(--transition-fast, 150ms ease);
    white-space: nowrap;
  }

  .asj-catalog__filter-btn:hover {
    color: var(--color-text-primary, #f8fafc);
    background: rgba(14, 165, 233, 0.12);
  }

  .asj-catalog__filter-btn--active {
    background: linear-gradient(135deg, var(--color-primary-600, #0284c7) 0%, var(--color-accent-cyan, #06b6d4) 100%);
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 10px rgba(6, 182, 212, 0.35);
  }

  /* ==========================================================================
   * 4. Product Cards Grid (1 col mobile, 2 col tablet, 4 col desktop)
   * ========================================================================== */
  .asj-catalog__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
  }

  @media (min-width: 640px) {
    .asj-catalog__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .asj-catalog__grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
  }

  @media (min-width: 1280px) {
    .asj-catalog__grid {
      gap: 1.5rem;
    }
  }

  /* ==========================================================================
   * 5. Catalog Trust & Deposit Guarantee Banner
   * ========================================================================== */
  .asj-catalog__guarantee-strip {
    margin-top: 1.5rem;
    padding: 1.25rem 1.5rem;
    background: rgba(5, 19, 41, 0.7);
    border: 1px solid rgba(56, 189, 248, 0.22);
    border-radius: var(--radius-lg, 16px);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;
  }

  @media (min-width: 768px) {
    .asj-catalog__guarantee-strip {
      flex-direction: row;
      justify-content: space-around;
      text-align: left;
    }
  }

  .asj-catalog__guarantee-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .asj-catalog__guarantee-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full, 9999px);
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #34d399;
    flex-shrink: 0;
  }

  .asj-catalog__guarantee-content {
    display: flex;
    flex-direction: column;
  }

  .asj-catalog__guarantee-title {
    font-size: 0.875rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-catalog__guarantee-desc {
    font-size: 0.75rem;
    color: var(--color-text-muted, #94a3b8);
  }
`;

/**
 * Renders the product catalog grid section containing:
 * - 20L Normal RO Water Jar
 * - 20L Chilled RO Water Jar
 * - Bulk Packaged Bottles (250ml / 500ml / 1L)
 * - Event / Party / Social Gathering Supply
 *
 * Implements interactive category filtering, bilingual support,
 * deposit guarantee strip, and strict adherence to Clean Architecture.
 * Strictly zero reference to RO servicing.
 */
export function ProductGrid({
  className,
  products = DEFAULT_CATALOG_PRODUCTS,
  onOrderClick,
  onSelectProduct,
}: ProductGridProps): JSX.Element {
  const { isHindi, t: currentTranslations } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<CatalogFilterCategory>('all');

  // Filter products based on selected tab
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') {
      return products;
    }
    return products.filter((productItem) => productItem.getCategory() === activeFilter);
  }, [products, activeFilter]);

  // Filter tab definitions
  const filterTabs = useMemo(() => {
    return [
      {
        filterKey: 'all' as CatalogFilterCategory,
        label: isHindi ? 'सभी उत्पाद (4)' : 'All Options (4)',
        icon: React.createElement(Droplets, { size: 16, 'aria-hidden': true }),
      },
      {
        filterKey: 'jar' as CatalogFilterCategory,
        label: isHindi ? '20L पानी जार' : '20L Jars',
        icon: React.createElement(Sparkles, { size: 16, 'aria-hidden': true }),
      },
      {
        filterKey: 'bulk_bottles' as CatalogFilterCategory,
        label: isHindi ? 'पैकेज्ड बोतलें' : 'Bottles',
        icon: React.createElement(Package, { size: 16, 'aria-hidden': true }),
      },
      {
        filterKey: 'event' as CatalogFilterCategory,
        label: isHindi ? 'समारोह आपूर्ति' : 'Events',
        icon: React.createElement(PartyPopper, { size: 16, 'aria-hidden': true }),
      },
    ];
  }, [isHindi]);

  const handleFilterChange = useCallback((filterCategory: CatalogFilterCategory) => {
    setActiveFilter(filterCategory);
  }, []);

  const sectionClassNames = useMemo(() => {
    return ['asj-catalog', className].filter(Boolean).join(' ');
  }, [className]);

  return React.createElement(
    'section',
    {
      id: 'products',
      role: 'region',
      'aria-labelledby': 'catalog-title',
      className: sectionClassNames,
    },
    React.createElement(
      'div',
      { className: 'asj-catalog__container' },

      // Header
      React.createElement(
        'div',
        { className: 'asj-catalog__header' },
        React.createElement(
          'span',
          { className: 'asj-catalog__badge' },
          React.createElement(Droplets, { size: 14, 'aria-hidden': true }),
          currentTranslations.products.sectionBadge
        ),
        React.createElement(
          'h2',
          { id: 'catalog-title', className: 'asj-catalog__title' },
          currentTranslations.products.sectionTitle
        ),
        React.createElement(
          'p',
          { className: 'asj-catalog__subtitle' },
          currentTranslations.products.sectionSubtitle
        )
      ),

      // Filter Tabs Strip
      React.createElement(
        'div',
        {
          className: 'asj-catalog__filters',
          role: 'tablist',
          'aria-label': isHindi ? 'उत्पाद श्रेणियां' : 'Product Categories',
        },
        filterTabs.map((tabItem) => {
          const isSelected = activeFilter === tabItem.filterKey;
          return React.createElement(
            'button',
            {
              key: `filter-${tabItem.filterKey}`,
              role: 'tab',
              type: 'button',
              'aria-selected': isSelected,
              'aria-controls': 'catalog-products-grid',
              className: `asj-catalog__filter-btn ${
                isSelected ? 'asj-catalog__filter-btn--active' : ''
              }`,
              onClick: () => handleFilterChange(tabItem.filterKey),
            },
            tabItem.icon,
            React.createElement('span', null, tabItem.label)
          );
        })
      ),

      // Product Cards Grid
      React.createElement(
        'div',
        {
          id: 'catalog-products-grid',
          className: 'asj-catalog__grid',
          role: 'region',
          'aria-label': isHindi ? 'उत्पाद सूची' : 'Product Catalog Grid',
        },
        filteredProducts.map((productItem) =>
          React.createElement(ProductCard, {
            key: productItem.getId(),
            product: productItem,
            isFeatured: productItem.getId() === 'jar-normal',
            onOrderClick,
            onSelectProduct,
          })
        )
      ),

      // Guarantee & Trust Strip
      React.createElement(
        'div',
        { className: 'asj-catalog__guarantee-strip' },
        React.createElement(
          'div',
          { className: 'asj-catalog__guarantee-item' },
          React.createElement(
            'div',
            { className: 'asj-catalog__guarantee-icon' },
            React.createElement(ShieldCheck, { size: 18, 'aria-hidden': true })
          ),
          React.createElement(
            'div',
            { className: 'asj-catalog__guarantee-content' },
            React.createElement(
              'span',
              { className: 'asj-catalog__guarantee-title' },
              isHindi ? '100% रिफंडेबल अमानत राशि' : '100% Refundable Deposit'
            ),
            React.createElement(
              'span',
              { className: 'asj-catalog__guarantee-desc' },
              isHindi
                ? 'जार व नल वापसी पर पूरी राशि वापस'
                : 'Full refund upon return of jar & tap'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'asj-catalog__guarantee-item' },
          React.createElement(
            'div',
            { className: 'asj-catalog__guarantee-icon' },
            React.createElement(PartyPopper, { size: 18, 'aria-hidden': true })
          ),
          React.createElement(
            'div',
            { className: 'asj-catalog__guarantee-content' },
            React.createElement(
              'span',
              { className: 'asj-catalog__guarantee-title' },
              isHindi ? 'समारोहों पर ₹0 अमानत राशि' : 'Zero Deposit on Events'
            ),
            React.createElement(
              'span',
              { className: 'asj-catalog__guarantee-desc' },
              isHindi
                ? 'शादी-विवाह में कोई सिक्योरिटी डिपॉजिट नहीं'
                : 'No equipment deposit on celebration supply'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'asj-catalog__guarantee-item' },
          React.createElement(
            'div',
            { className: 'asj-catalog__guarantee-icon' },
            React.createElement(Truck, { size: 18, 'aria-hidden': true })
          ),
          React.createElement(
            'div',
            { className: 'asj-catalog__guarantee-content' },
            React.createElement(
              'span',
              { className: 'asj-catalog__guarantee-title' },
              isHindi ? 'सरसर व 15+ गांवों में आपूर्ति' : 'Serving 15+ Siwan Villages'
            ),
            React.createElement(
              'span',
              { className: 'asj-catalog__guarantee-desc' },
              isHindi
                ? '30 से 120 मिनट में सुरक्षित डोरस्टेप डिलीवरी'
                : 'Reliable doorstep delivery in 30-120 mins'
            )
          )
        )
      )
    ),

    // Component Styles
    React.createElement('style', null, productGridStyles)
  );
}
