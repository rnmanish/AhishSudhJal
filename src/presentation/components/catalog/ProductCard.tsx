'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  MessageCircle,
  Package,
  PartyPopper,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Product } from '../../../core/domain/entities/Product';
import { useLanguage } from '../../i18n/useLanguage';

export interface ProductCardProps {
  readonly product: Product;
  readonly className?: string;
  readonly onOrderClick?: (product: Product) => void;
  readonly onSelectProduct?: (productId: string) => void;
  readonly isFeatured?: boolean;
}

const productCardStyles = `
  /* ==========================================================================
   * 1. Product Card Container & Glassmorphic Elevation
   * ========================================================================== */
  .asj-product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.16));
    border-radius: var(--radius-lg, 16px);
    backdrop-filter: blur(var(--glass-blur-md, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur-md, 12px));
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.28);
    padding: 1.5rem;
    color: var(--color-text-primary, #f8fafc);
    box-sizing: border-box;
    transition: transform var(--transition-base, 250ms ease),
                border-color var(--transition-base, 250ms ease),
                box-shadow var(--transition-base, 250ms ease);
    overflow: hidden;
  }

  .asj-product-card:hover {
    transform: translateY(-4px);
    border-color: var(--color-border-medium, rgba(56, 189, 248, 0.42));
    box-shadow: 0 12px 32px rgba(14, 165, 233, 0.22),
                0 0 16px rgba(14, 165, 233, 0.12);
  }

  .asj-product-card--featured {
    border-color: var(--color-primary-400, #38bdf8);
    box-shadow: 0 8px 30px rgba(14, 165, 233, 0.25);
    background: radial-gradient(circle at 80% 10%, rgba(14, 165, 233, 0.14) 0%, rgba(13, 59, 102, 0.55) 100%);
  }

  /* Featured / Badge Strip */
  .asj-product-card__featured-pill {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    background: linear-gradient(135deg, var(--color-primary-600, #0284c7) 0%, var(--color-accent-cyan, #06b6d4) 100%);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
    border-radius: var(--radius-full, 9999px);
    box-shadow: 0 2px 8px rgba(6, 182, 212, 0.35);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ==========================================================================
   * 2. Card Header: Icon & Category Tag
   * ========================================================================== */
  .asj-product-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .asj-product-card__icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md, 12px);
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.25);
    color: var(--color-primary-300, #7dd3fc);
    flex-shrink: 0;
  }

  .asj-product-card--featured .asj-product-card__icon-box {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%);
    border-color: rgba(56, 189, 248, 0.45);
    color: #ffffff;
  }

  .asj-product-card__category-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-primary-300, #7dd3fc);
    background: rgba(14, 165, 233, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm, 6px);
  }

  /* ==========================================================================
   * 3. Titles & Descriptions
   * ========================================================================== */
  .asj-product-card__body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .asj-product-card__title {
    font-size: 1.25rem;
    font-weight: var(--font-weight-bold, 700);
    line-height: var(--line-height-snug, 1.35);
    color: var(--color-text-primary, #f8fafc);
    margin: 0;
  }

  .asj-product-card__description {
    font-size: 0.875rem;
    font-weight: var(--font-weight-regular, 400);
    line-height: var(--line-height-relaxed, 1.6);
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0;
  }

  /* ==========================================================================
   * 4. Pricing Box & Value Banners
   * ========================================================================== */
  .asj-product-card__pricing {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(3, 12, 26, 0.6);
    border: 1px solid rgba(56, 189, 248, 0.16);
    border-radius: var(--radius-md, 12px);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .asj-product-card__price-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .asj-product-card__price-main {
    display: inline-flex;
    align-items: baseline;
    gap: 0.375rem;
  }

  .asj-product-card__currency {
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-primary-400, #38bdf8);
  }

  .asj-product-card__amount {
    font-size: 1.75rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: #ffffff;
    line-height: 1;
  }

  .asj-product-card__unit {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text-muted, #94a3b8);
  }

  .asj-product-card__quote-text {
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-accent-cyan, #06b6d4);
  }

  /* Recurring discount badge: ₹5 saved / ₹25 per jar */
  .asj-product-card__recurring-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.35);
    border-radius: var(--radius-sm, 6px);
    color: #34d399;
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
  }

  /* Deposit Notice */
  .asj-product-card__deposit-info {
    display: flex;
    align-items: flex-start;
    gap: 0.375rem;
    font-size: 0.78125rem;
    line-height: 1.45;
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-product-card__deposit-info--zero {
    color: #34d399;
    font-weight: var(--font-weight-medium, 500);
  }

  .asj-product-card__deposit-icon {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  /* ==========================================================================
   * 5. Features Checkmark List
   * ========================================================================== */
  .asj-product-card__features {
    list-style: none;
    margin: 0.5rem 0 1.25rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .asj-product-card__feature-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.8125rem;
    line-height: 1.45;
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-product-card__feature-icon {
    color: #10b981;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  /* ==========================================================================
   * 6. Action Buttons & Minimum 44px Touch Targets
   * ========================================================================== */
  .asj-product-card__actions {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-top: auto;
  }

  .asj-product-card__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
    font-weight: var(--font-weight-bold, 700);
    border-radius: var(--radius-md, 12px);
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
    transition: transform var(--transition-fast, 150ms ease),
                background-color var(--transition-fast, 150ms ease),
                box-shadow var(--transition-fast, 150ms ease);
    text-align: center;
  }

  .asj-product-card__btn:hover {
    transform: translateY(-2px);
    text-decoration: none;
  }

  .asj-product-card__btn:active {
    transform: translateY(0);
  }

  /* WhatsApp Action Button */
  .asj-product-card__btn--whatsapp {
    background: linear-gradient(135deg, var(--color-whatsapp-primary, #25d366) 0%, var(--color-whatsapp-dark, #128c7e) 100%);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.32);
  }

  .asj-product-card__btn--whatsapp:hover {
    background: linear-gradient(135deg, var(--color-whatsapp-hover, #1ebd5b) 0%, var(--color-whatsapp-dark, #128c7e) 100%);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
  }

  /* Secondary Wizard Booking Link */
  .asj-product-card__btn--wizard {
    background: rgba(14, 165, 233, 0.08);
    color: var(--color-primary-300, #7dd3fc);
    border: 1px solid rgba(56, 189, 248, 0.28);
  }

  .asj-product-card__btn--wizard:hover {
    background: rgba(14, 165, 233, 0.18);
    color: #ffffff;
    border-color: var(--color-primary-400, #38bdf8);
  }
`;

/**
 * Renders an individual product catalog card with strict Clean Architecture compliance.
 * Supports bilingual display (Hindi/English), ₹30 base price, ₹5 recurring discount,
 * ₹150 refundable deposit note, bulk packaged bottles quote, and ₹0 event deposit note.
 * Zero references to RO servicing.
 */
export function ProductCard({
  product,
  className,
  onOrderClick,
  onSelectProduct,
  isFeatured = false,
}: ProductCardProps): JSX.Element {
  const { isHindi, language, t: currentTranslations } = useLanguage();

  const productId = product.getId();
  const productCategory = product.getCategory();

  // Determine card specific icons and details
  const cardIconComponent = useMemo(() => {
    switch (productId) {
      case 'jar-normal':
        return React.createElement(Droplets, { size: 24, 'aria-hidden': true });
      case 'jar-chilled':
        return React.createElement(Sparkles, { size: 24, 'aria-hidden': true });
      case 'bulk-bottles':
        return React.createElement(Package, { size: 24, 'aria-hidden': true });
      case 'event-supply':
        return React.createElement(PartyPopper, { size: 24, 'aria-hidden': true });
      default:
        return React.createElement(Droplets, { size: 24, 'aria-hidden': true });
    }
  }, [productId]);

  // Category Tag Text
  const categoryTagText = useMemo(() => {
    switch (productCategory) {
      case 'jar':
        return isHindi ? '20 लीटर आरओ जार' : '20L RO Water Jar';
      case 'bulk_bottles':
        return isHindi ? 'पैकेज्ड बोतलें' : 'Packaged Bottles';
      case 'event':
        return isHindi ? 'समारोह जल आपूर्ति' : 'Event Bulk Supply';
      default:
        return isHindi ? 'शुद्ध पेयजल' : 'Pure Drinking Water';
    }
  }, [isHindi, productCategory]);

  // Localized features list based on product ID
  const productFeatures = useMemo(() => {
    switch (productId) {
      case 'jar-normal':
        return currentTranslations.products.jarNormal.features;
      case 'jar-chilled':
        return currentTranslations.products.jarChilled.features;
      case 'bulk-bottles':
        return currentTranslations.products.bulkBottles.features;
      case 'event-supply':
        return currentTranslations.products.eventSupply.features;
      default:
        return [
          isHindi ? '100% शुद्ध आरओ पेयजल' : '100% Pure RO Drinking Water',
          isHindi ? 'मुफ्त एवं समय पर डोरस्टेप डिलीवरी' : 'Prompt Doorstep Delivery',
        ];
    }
  }, [productId, currentTranslations, isHindi]);

  // Unicode safe WhatsApp pre-filled message
  const whatsappOrderMessage = useMemo(() => {
    switch (productId) {
      case 'jar-normal':
        return isHindi
          ? 'नमस्ते आशीष शुद्ध जल, मुझे 20L नॉर्मल आरओ पानी जार (₹30) का ऑर्डर करना है।'
          : 'Hello Ashish Sudh Jal, I would like to order a 20L Normal RO Water Jar (₹30).';
      case 'jar-chilled':
        return isHindi
          ? 'नमस्ते आशीष शुद्ध जल, मुझे 20L ठंडा आरओ पानी जार (₹30) का ऑर्डर करना है।'
          : 'Hello Ashish Sudh Jal, I would like to order a 20L Chilled RO Water Jar (₹30).';
      case 'bulk-bottles':
        return isHindi
          ? 'नमस्ते आशीष शुद्ध जल, मुझे पैकेज्ड पानी बोतलों (250ml/500ml/1L) के थोक मूल्य (Bulk Pricing) की जानकारी चाहिए।'
          : 'Hello Ashish Sudh Jal, I would like to inquire about packaged water bottles bulk pricing.';
      case 'event-supply':
        return isHindi
          ? 'नमस्ते आशीष शुद्ध जल, मुझे शादी/समारोह के लिए पानी आपूर्ति (Event Supply) की बुकिंग और कोटेशन चाहिए।'
          : 'Hello Ashish Sudh Jal, I would like to request a quote for event water supply.';
      default:
        return isHindi
          ? `नमस्ते आशीष शुद्ध जल, मुझे ${product.getName('hi')} का ऑर्डर करना है।`
          : `Hello Ashish Sudh Jal, I would like to order ${product.getName('en')}.`;
    }
  }, [productId, isHindi, product]);

  const whatsappUrl = `https://wa.me/918235882384?text=${encodeURIComponent(whatsappOrderMessage)}`;

  // Event handlers
  const handleOrderClick = useCallback(
    (_clickEvent: React.MouseEvent<HTMLAnchorElement>) => {
      if (onOrderClick) {
        onOrderClick(product);
      }
    },
    [onOrderClick, product]
  );

  const handleSelectProduct = useCallback(
    (_clickEvent: React.MouseEvent<HTMLAnchorElement>) => {
      if (onSelectProduct) {
        onSelectProduct(productId);
      }
    },
    [onSelectProduct, productId]
  );

  // CSS classes
  const cardClassNames = useMemo(() => {
    return [
      'asj-product-card',
      isFeatured ? 'asj-product-card--featured' : '',
      `asj-product-card--${productId}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');
  }, [isFeatured, productId, className]);

  // Pricing presentation
  const isJarProduct = productCategory === 'jar';
  const isBulkProduct = productCategory === 'bulk_bottles';
  const isEventProduct = productCategory === 'event';

  return React.createElement(
    'article',
    {
      className: cardClassNames,
      'aria-labelledby': `product-title-${productId}`,
      role: 'article',
    },
    isFeatured
      ? React.createElement(
          'span',
          { className: 'asj-product-card__featured-pill' },
          React.createElement(Sparkles, { size: 12, 'aria-hidden': true }),
          isHindi ? 'लोकप्रिय विकल्प' : 'Most Popular'
        )
      : null,

    // Header: Icon + Category Badge
    React.createElement(
      'div',
      { className: 'asj-product-card__header' },
      React.createElement('div', { className: 'asj-product-card__icon-box' }, cardIconComponent),
      React.createElement(
        'span',
        { className: 'asj-product-card__category-badge' },
        categoryTagText
      )
    ),

    // Body: Title + Description
    React.createElement(
      'div',
      { className: 'asj-product-card__body' },
      React.createElement(
        'h3',
        {
          id: `product-title-${productId}`,
          className: 'asj-product-card__title',
        },
        product.getName(language)
      ),
      React.createElement(
        'p',
        { className: 'asj-product-card__description' },
        product.getDescription(language)
      ),

      // Pricing Section
      React.createElement(
        'div',
        { className: 'asj-product-card__pricing' },
        isJarProduct
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'asj-product-card__price-row' },
                React.createElement(
                  'div',
                  { className: 'asj-product-card__price-main' },
                  React.createElement('span', { className: 'asj-product-card__currency' }, '₹'),
                  React.createElement('span', { className: 'asj-product-card__amount' }, '30'),
                  React.createElement(
                    'span',
                    { className: 'asj-product-card__unit' },
                    ` / ${currentTranslations.products.perJar}`
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-product-card__recurring-badge' },
                React.createElement(Sparkles, { size: 14, 'aria-hidden': true }),
                isHindi
                  ? '₹25 प्रति जार (₹5 नियमित ग्राहक छूट)'
                  : '₹25 / jar on subscription (Save ₹5)'
              ),
              React.createElement(
                'div',
                { className: 'asj-product-card__deposit-info' },
                React.createElement(ShieldCheck, {
                  size: 14,
                  className: 'asj-product-card__deposit-icon',
                  'aria-hidden': true,
                }),
                React.createElement(
                  'span',
                  null,
                  isHindi
                    ? '🔒 ₹150 एकमुश्त रिफंडेबल डिपॉजिट (जार + डिस्पेंसर नल सहित)'
                    : '🔒 ₹150 One-time refundable deposit (Jar + Dispenser included)'
                )
              )
            )
          : isBulkProduct
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'asj-product-card__price-row' },
                React.createElement(
                  'span',
                  { className: 'asj-product-card__quote-text' },
                  isHindi ? 'थोक मूल्य हेतु संपर्क करें' : 'Contact for Bulk Pricing'
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-product-card__deposit-info asj-product-card__deposit-info--zero' },
                React.createElement(CheckCircle2, {
                  size: 14,
                  className: 'asj-product-card__deposit-icon',
                  'aria-hidden': true,
                }),
                React.createElement(
                  'span',
                  null,
                  isHindi
                    ? '₹0 अमानत राशि (पैकेज्ड बोतलों पर कोई सिक्योरिटी डिपॉजिट नहीं)'
                    : '₹0 Deposit (No security deposit required)'
                )
              )
            )
          : React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'asj-product-card__price-row' },
                React.createElement(
                  'span',
                  { className: 'asj-product-card__quote-text' },
                  isHindi ? 'कस्टम कोटेशन / संपर्क करें' : 'Custom Quote on Request'
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-product-card__deposit-info asj-product-card__deposit-info--zero' },
                React.createElement(PartyPopper, {
                  size: 14,
                  className: 'asj-product-card__deposit-icon',
                  'aria-hidden': true,
                }),
                React.createElement(
                  'span',
                  null,
                  isHindi
                    ? '🎉 आयोजनों पर शून्य (₹0) डिपॉजिट — जार एवं नल निशुल्क उपलब्ध'
                    : '🎉 ₹0 Deposit on Events — Free equipment & dispenser taps'
                )
              )
            )
      ),

      // Features list
      React.createElement(
        'ul',
        {
          className: 'asj-product-card__features',
          'aria-label': isHindi ? 'उत्पाद विशेषताएं' : 'Product Features',
        },
        productFeatures.map((featureText, featureIndex) =>
          React.createElement(
            'li',
            {
              key: `feature-${productId}-${featureIndex}`,
              className: 'asj-product-card__feature-item',
            },
            React.createElement(CheckCircle2, {
              size: 15,
              className: 'asj-product-card__feature-icon',
              'aria-hidden': true,
            }),
            React.createElement('span', null, featureText)
          )
        )
      )
    ),

    // Actions
    React.createElement(
      'div',
      { className: 'asj-product-card__actions' },
      React.createElement(
        'a',
        {
          href: whatsappUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'asj-product-card__btn asj-product-card__btn--whatsapp',
          onClick: handleOrderClick,
          'aria-label': `${isHindi ? 'व्हाट्सएप पर ऑर्डर करें' : 'Order via WhatsApp'} ${product.getName(language)}`,
        },
        React.createElement(MessageCircle, { size: 18, 'aria-hidden': true }),
        React.createElement(
          'span',
          null,
          isBulkProduct || isEventProduct
            ? isHindi
              ? 'व्हाट्सएप पर संपर्क करें'
              : 'Inquire on WhatsApp'
            : currentTranslations.products.orderOnWhatsApp
        )
      ),
      React.createElement(
        'a',
        {
          href: '#booking',
          className: 'asj-product-card__btn asj-product-card__btn--wizard',
          onClick: handleSelectProduct,
          'aria-label': `${isHindi ? 'विज़ार्ड से बुक करें' : 'Book via Wizard'} ${product.getName(language)}`,
        },
        React.createElement(
          'span',
          null,
          isHindi ? 'ऑनलाइन बुकिंग विज़ार्ड' : 'Book via Wizard'
        ),
        React.createElement(ArrowRight, { size: 16, 'aria-hidden': true })
      )
    ),

    // Component Styles
    React.createElement('style', null, productCardStyles)
  );
}
