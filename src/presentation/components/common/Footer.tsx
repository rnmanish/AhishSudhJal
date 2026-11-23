'use client';

import React, { useCallback } from 'react';
import {
  ArrowUp,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import type { VillageRecord } from '../../../infrastructure/config/villages.data';
import { VILLAGES } from '../../../infrastructure/config/villages.data';
import { useLanguage } from '../../i18n/useLanguage';

export interface FooterProps {
  readonly className?: string;
  readonly villages?: readonly VillageRecord[];
}

interface FooterQuickLink {
  readonly href: string;
  readonly label: string;
}

interface FooterTrustBadge {
  readonly title: string;
  readonly description: string;
  readonly iconType: 'shield' | 'droplets' | 'sparkles' | 'truck';
}

const footerStyles = `
  /* ==========================================================================
   * 1. Footer Container & Background Architecture
   * ========================================================================== */
  .asj-footer {
    position: relative;
    width: 100%;
    background: linear-gradient(180deg, #030c1a 0%, #020710 100%);
    border-top: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    color: var(--color-text-secondary, #cbd5e1);
    font-family: inherit;
    overflow: hidden;
  }

  .asj-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--color-primary-500, #38bdf8) 50%, transparent 100%);
    opacity: 0.6;
    pointer-events: none;
  }

  .asj-footer__container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* ==========================================================================
   * 2. Trust Badges Strip (Multi-Stage RO, TDS, Sanitization, Delivery)
   * ========================================================================== */
  .asj-footer__trust-section {
    padding: 3rem 0 2.5rem;
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
  }

  .asj-footer__trust-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .asj-footer__trust-heading {
    display: inline-block;
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold, 700);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: linear-gradient(135deg, var(--color-text-primary, #f8fafc) 0%, var(--color-primary-300, #bae6fd) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .asj-footer__trust-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .asj-footer__trust-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
  }

  @media (min-width: 1024px) {
    .asj-footer__trust-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }

  .asj-footer__trust-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    backdrop-filter: blur(var(--glass-blur-sm, 6px));
    -webkit-backdrop-filter: blur(var(--glass-blur-sm, 6px));
    transition: transform var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease),
                background-color var(--transition-fast, 150ms ease);
  }

  .asj-footer__trust-card:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary-400, #7dd3fc);
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.65));
  }

  .asj-footer__trust-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: var(--radius-md, 12px);
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    color: var(--color-accent-aqua, #00e5ff);
    box-shadow: 0 0 12px rgba(14, 165, 233, 0.18);
  }

  .asj-footer__trust-body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asj-footer__trust-title {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-primary, #f8fafc);
    line-height: 1.35;
  }

  .asj-footer__trust-desc {
    font-size: 0.8125rem;
    color: var(--color-text-muted, #94a3b8);
    line-height: 1.5;
    margin: 0;
  }

  /* ==========================================================================
   * 3. Main Footer Columns Layout
   * ========================================================================== */
  .asj-footer__main {
    padding: 3.5rem 0 3rem;
  }

  .asj-footer__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  @media (min-width: 640px) {
    .asj-footer__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem 2rem;
    }
  }

  @media (min-width: 1024px) {
    .asj-footer__grid {
      grid-template-columns: 1.4fr 0.8fr 1.2fr 1.6fr;
      gap: 2.5rem;
    }
  }

  .asj-footer__col {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .asj-footer__col-title {
    position: relative;
    font-size: 1.0625rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    letter-spacing: -0.01em;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .asj-footer__col-title::after {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary-500, #38bdf8), var(--color-accent-aqua, #00e5ff));
    border-radius: var(--radius-full, 9999px);
    margin-left: 0.25rem;
  }

  /* Brand Column */
  .asj-footer__brand-header {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--color-text-primary, #f8fafc);
    min-height: var(--touch-target-min, 44px);
  }

  .asj-footer__brand-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md, 12px);
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.28) 0%, rgba(6, 182, 212, 0.16) 100%);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent-aqua, #00e5ff);
    box-shadow: 0 0 14px rgba(14, 165, 233, 0.25);
    transition: transform var(--transition-fast, 150ms ease);
  }

  .asj-footer__brand-header:hover .asj-footer__brand-icon {
    transform: scale(1.06);
  }

  .asj-footer__brand-headings {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }

  .asj-footer__brand-title {
    font-size: 1.25rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-footer__brand-subtitle {
    font-size: 0.75rem;
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-primary-400, #7dd3fc);
  }

  .asj-footer__tagline {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-accent-cyan, #06b6d4);
    font-style: italic;
    margin: 0;
  }

  .asj-footer__brand-desc {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-text-muted, #94a3b8);
    margin: 0;
  }

  .asj-footer__brand-actions {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-top: 0.5rem;
  }

  .asj-footer__whatsapp-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.625rem 1rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-whatsapp-primary, #25d366);
    color: var(--color-whatsapp-contrast-text, #03140a);
    font-size: 0.875rem;
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
    transition: background-color var(--transition-fast, 150ms ease),
                transform var(--transition-fast, 150ms ease);
  }

  .asj-footer__whatsapp-pill:hover {
    background-color: var(--color-whatsapp-hover, #1ebd5b);
    color: var(--color-whatsapp-contrast-text, #03140a);
    transform: translateY(-1px);
    text-decoration: none;
  }

  /* Quick Links Column */
  .asj-footer__links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .asj-footer__link-item {
    display: flex;
  }

  .asj-footer__link-anchor {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: var(--touch-target-min, 44px);
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.9375rem;
    font-weight: var(--font-weight-medium, 500);
    text-decoration: none;
    padding: 0.25rem 0;
    transition: color var(--transition-fast, 150ms ease),
                transform var(--transition-fast, 150ms ease);
  }

  .asj-footer__link-anchor:hover {
    color: var(--color-primary-400, #7dd3fc);
    transform: translateX(3px);
    text-decoration: none;
  }

  /* Contact Column */
  .asj-footer__contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .asj-footer__contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .asj-footer__contact-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: var(--radius-sm, 8px);
    background-color: var(--color-bg-subtle, rgba(56, 189, 248, 0.08));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    color: var(--color-primary-400, #7dd3fc);
    margin-top: 0.125rem;
  }

  .asj-footer__contact-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .asj-footer__contact-label {
    font-size: 0.75rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-muted, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .asj-footer__contact-link {
    color: var(--color-text-primary, #f8fafc);
    text-decoration: none;
    font-weight: var(--font-weight-medium, 500);
    min-height: var(--touch-target-min, 44px);
    display: inline-flex;
    align-items: center;
    transition: color var(--transition-fast, 150ms ease);
  }

  .asj-footer__contact-link:hover {
    color: var(--color-accent-aqua, #00e5ff);
    text-decoration: none;
  }

  .asj-footer__contact-value {
    color: var(--color-text-secondary, #cbd5e1);
  }

  /* 15-Village Coverage Column */
  .asj-footer__coverage-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asj-footer__coverage-subtitle {
    font-size: 0.8125rem;
    color: var(--color-text-muted, #94a3b8);
    margin: 0;
  }

  .asj-footer__villages-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4375rem;
    padding-top: 0.25rem;
  }

  .asj-footer__village-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3125rem;
    padding: 0.3125rem 0.625rem;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.75rem;
    font-weight: var(--font-weight-medium, 500);
    text-decoration: none;
    min-height: 32px;
    transition: background-color var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease),
                color var(--transition-fast, 150ms ease),
                transform var(--transition-fast, 150ms ease);
  }

  .asj-footer__village-chip:hover {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.75));
    border-color: var(--color-primary-400, #7dd3fc);
    color: var(--color-text-primary, #f8fafc);
    transform: translateY(-1px);
    text-decoration: none;
  }

  .asj-footer__village-chip--plant {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.28) 0%, rgba(6, 182, 212, 0.18) 100%);
    border-color: var(--color-primary-400, #7dd3fc);
    color: var(--color-accent-aqua, #00e5ff);
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-footer__village-sla-badge {
    font-size: 0.6875rem;
    padding: 0.0625rem 0.25rem;
    border-radius: var(--radius-xs, 4px);
    background-color: rgba(56, 189, 248, 0.12);
    color: var(--color-primary-300, #bae6fd);
  }

  /* ==========================================================================
   * 4. Copyright & Bottom Bar
   * ========================================================================== */
  .asj-footer__bottom {
    padding: 1.75rem 0 2rem;
    border-top: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    background-color: rgba(2, 7, 16, 0.85);
  }

  .asj-footer__bottom-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    text-align: center;
  }

  @media (min-width: 768px) {
    .asj-footer__bottom-inner {
      flex-direction: row;
      text-align: left;
    }
  }

  .asj-footer__copyright-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  @media (min-width: 768px) {
    .asj-footer__copyright-block {
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
    }
  }

  .asj-footer__copyright-text {
    font-size: 0.8125rem;
    color: var(--color-text-muted, #94a3b8);
    margin: 0;
  }

  .asj-footer__rights-divider {
    display: none;
    color: var(--color-text-muted, #94a3b8);
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    .asj-footer__rights-divider {
      display: inline;
    }
  }

  .asj-footer__back-to-top {
    display: inline-flex;
    align-items: center;
    gap: 0.4375rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.4375rem 0.875rem;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    color: var(--color-primary-300, #bae6fd);
    font-size: 0.75rem;
    font-weight: var(--font-weight-semibold, 600);
    text-decoration: none;
    cursor: pointer;
    transition: background-color var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease),
                color var(--transition-fast, 150ms ease),
                transform var(--transition-fast, 150ms ease);
  }

  .asj-footer__back-to-top:hover {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.75));
    border-color: var(--color-primary-400, #7dd3fc);
    color: var(--color-text-primary, #f8fafc);
    transform: translateY(-2px);
    text-decoration: none;
  }

  /* ==========================================================================
   * 5. WCAG 2.1 AA Focus Visibility & Accessibility
   * ========================================================================== */
  .asj-footer a:focus-visible,
  .asj-footer button:focus-visible {
    outline: 2px solid var(--color-primary-400, #7dd3fc);
    outline-offset: 2px;
  }
`;

/**
 * Footer component for Ashish Sudh Jal.
 * Clean Architecture Layer 4 (Presentation Component).
 * Features:
 * - Trust Badges Strip (RO & UV Purification, Controlled TDS 100-150 PPM, Food-Grade Sanitized Jars, Prompt Delivery)
 * - Brand identity with aquatic droplet logo, tagline, and mission description
 * - Complete 15-village delivery coverage area with SLA tags & plant indicator
 * - Direct contact info: hotline call link, pre-formatted WhatsApp chat, plant address, operating hours
 * - Quick navigation links matching Header anchors (#products, #tds-checker, #booking, #coverage)
 * - Copyright statement, all rights reserved notice, and accessible back-to-top button
 * - Full bilingual support (Hindi-first default with English toggle support)
 * - WCAG 2.1 AA compliant (color contrast, touch targets >= 44px, focus rings)
 */
export function Footer({
  className: customClassName,
  villages: customVillages,
}: FooterProps): JSX.Element {
  const { isHindi, t } = useLanguage();
  const villagesList: readonly VillageRecord[] = customVillages ?? VILLAGES;

  const handleBackToTop = useCallback(
    (clickEvent: React.MouseEvent<HTMLAnchorElement>): void => {
      if (typeof window !== 'undefined') {
        clickEvent.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    },
    []
  );

  const whatsappMessage = isHindi
    ? 'नमस्ते आशीष शुद्ध जल, मुझे शुद्ध पेयजल आपूर्ति के बारे में जानकारी चाहिए।'
    : 'Hello Ashish Sudh Jal, I would like information regarding your pure water supply.';

  const whatsappOrderUrl = `https://wa.me/918235882384?text=${encodeURIComponent(whatsappMessage)}`;
  const hotlineCallUrl = 'tel:+918235882384';

  const quickLinks: readonly FooterQuickLink[] = [
    { href: '#products', label: t.nav.products },
    { href: '#tds-checker', label: t.nav.tdsChecker },
    { href: '#booking', label: t.nav.booking },
    { href: '#coverage', label: t.nav.coverage },
  ];

  const trustBadges: readonly FooterTrustBadge[] = [
    {
      title: t.trustBadges.badge1.title,
      description: t.trustBadges.badge1.desc,
      iconType: 'shield',
    },
    {
      title: t.trustBadges.badge2.title,
      description: t.trustBadges.badge2.desc,
      iconType: 'droplets',
    },
    {
      title: t.trustBadges.badge3.title,
      description: t.trustBadges.badge3.desc,
      iconType: 'sparkles',
    },
    {
      title: t.trustBadges.badge4.title,
      description: t.trustBadges.badge4.desc,
      iconType: 'truck',
    },
  ];

  const footerClassNames = [
    'asj-footer',
    customClassName ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // Trust Badges Grid Element
  const trustSectionElement = React.createElement(
    'section',
    {
      className: 'asj-footer__trust-section',
      'aria-labelledby': 'asj-footer-trust-heading',
    },
    React.createElement(
      'div',
      { className: 'asj-footer__container' },
      React.createElement(
        'div',
        { className: 'asj-footer__trust-header' },
        React.createElement(
          'h2',
          {
            id: 'asj-footer-trust-heading',
            className: 'asj-footer__trust-heading',
          },
          t.trustBadges.sectionTitle
        )
      ),
      React.createElement(
        'div',
        { className: 'asj-footer__trust-grid' },
        trustBadges.map((badgeItem, badgeIndex) => {
          let badgeIconElement: JSX.Element;
          if (badgeItem.iconType === 'shield') {
            badgeIconElement = React.createElement(ShieldCheck, {
              size: 24,
              'aria-hidden': true,
            });
          } else if (badgeItem.iconType === 'droplets') {
            badgeIconElement = React.createElement(Droplets, {
              size: 24,
              'aria-hidden': true,
            });
          } else if (badgeItem.iconType === 'sparkles') {
            badgeIconElement = React.createElement(Sparkles, {
              size: 24,
              'aria-hidden': true,
            });
          } else {
            badgeIconElement = React.createElement(Truck, {
              size: 24,
              'aria-hidden': true,
            });
          }

          return React.createElement(
            'div',
            {
              key: `trust-badge-${badgeIndex}`,
              className: 'asj-footer__trust-card',
            },
            React.createElement(
              'div',
              { className: 'asj-footer__trust-icon-box' },
              badgeIconElement
            ),
            React.createElement(
              'div',
              { className: 'asj-footer__trust-body' },
              React.createElement(
                'h3',
                { className: 'asj-footer__trust-title' },
                badgeItem.title
              ),
              React.createElement(
                'p',
                { className: 'asj-footer__trust-desc' },
                badgeItem.description
              )
            )
          );
        })
      )
    )
  );

  // Column 1: Brand & Tagline
  const brandColumnElement = React.createElement(
    'div',
    { className: 'asj-footer__col asj-footer__col--brand' },
    React.createElement(
      'a',
      {
        href: '#top',
        className: 'asj-footer__brand-header',
        'aria-label': `${t.brand.name} - ${isHindi ? 'शीर्ष पर जाएं' : 'Back to Top'}`,
      },
      React.createElement(
        'div',
        { className: 'asj-footer__brand-icon' },
        React.createElement(Droplets, { size: 24, 'aria-hidden': true })
      ),
      React.createElement(
        'div',
        { className: 'asj-footer__brand-headings' },
        React.createElement(
          'span',
          { className: 'asj-footer__brand-title' },
          t.brand.name
        ),
        React.createElement(
          'span',
          { className: 'asj-footer__brand-subtitle' },
          isHindi ? 'सरसर, सिवान (बिहार)' : 'Sarsar, Siwan (Bihar)'
        )
      )
    ),
    React.createElement(
      'p',
      { className: 'asj-footer__tagline' },
      `"${t.brand.tagline}"`
    ),
    React.createElement(
      'p',
      { className: 'asj-footer__brand-desc' },
      t.footer.brandDesc
    ),
    React.createElement(
      'div',
      { className: 'asj-footer__brand-actions' },
      React.createElement(
        'a',
        {
          href: whatsappOrderUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'asj-footer__whatsapp-pill',
        },
        React.createElement(MessageCircle, { size: 18, 'aria-hidden': true }),
        React.createElement('span', null, t.nav.whatsappOrder)
      )
    )
  );

  // Column 2: Quick Links
  const quickLinksColumnElement = React.createElement(
    'div',
    { className: 'asj-footer__col asj-footer__col--links' },
    React.createElement(
      'h3',
      { className: 'asj-footer__col-title' },
      t.footer.quickLinksTitle
    ),
    React.createElement(
      'ul',
      { className: 'asj-footer__links-list' },
      quickLinks.map((linkRecord) =>
        React.createElement(
          'li',
          {
            key: linkRecord.href,
            className: 'asj-footer__link-item',
          },
          React.createElement(
            'a',
            {
              href: linkRecord.href,
              className: 'asj-footer__link-anchor',
            },
            React.createElement(
              'span',
              { 'aria-hidden': true, style: { color: 'var(--color-primary-400, #7dd3fc)' } },
              '›'
            ),
            React.createElement('span', null, linkRecord.label)
          )
        )
      )
    )
  );

  // Column 3: Contact & Support
  const contactColumnElement = React.createElement(
    'div',
    { className: 'asj-footer__col asj-footer__col--contact' },
    React.createElement(
      'h3',
      { className: 'asj-footer__col-title' },
      t.footer.contactTitle
    ),
    React.createElement(
      'ul',
      { className: 'asj-footer__contact-list' },
      React.createElement(
        'li',
        { className: 'asj-footer__contact-item' },
        React.createElement(
          'div',
          { className: 'asj-footer__contact-icon' },
          React.createElement(MapPin, { size: 18, 'aria-hidden': true })
        ),
        React.createElement(
          'div',
          { className: 'asj-footer__contact-text' },
          React.createElement(
            'span',
            { className: 'asj-footer__contact-label' },
            isHindi ? 'प्लांट का पता' : 'Plant Address'
          ),
          React.createElement(
            'span',
            { className: 'asj-footer__contact-value' },
            t.brand.plantAddress
          )
        )
      ),
      React.createElement(
        'li',
        { className: 'asj-footer__contact-item' },
        React.createElement(
          'div',
          { className: 'asj-footer__contact-icon' },
          React.createElement(Phone, { size: 18, 'aria-hidden': true })
        ),
        React.createElement(
          'div',
          { className: 'asj-footer__contact-text' },
          React.createElement(
            'span',
            { className: 'asj-footer__contact-label' },
            t.nav.callNow
          ),
          React.createElement(
            'a',
            {
              href: hotlineCallUrl,
              className: 'asj-footer__contact-link',
            },
            t.brand.hotline
          )
        )
      ),
      React.createElement(
        'li',
        { className: 'asj-footer__contact-item' },
        React.createElement(
          'div',
          { className: 'asj-footer__contact-icon' },
          React.createElement(Clock, { size: 18, 'aria-hidden': true })
        ),
        React.createElement(
          'div',
          { className: 'asj-footer__contact-text' },
          React.createElement(
            'span',
            { className: 'asj-footer__contact-label' },
            isHindi ? 'कार्य समय' : 'Operating Hours'
          ),
          React.createElement(
            'span',
            { className: 'asj-footer__contact-value' },
            t.map.openingHours
          )
        )
      )
    )
  );

  // Column 4: 15-Village Delivery Coverage Area
  const coverageColumnElement = React.createElement(
    'div',
    { className: 'asj-footer__col asj-footer__col--coverage' },
    React.createElement(
      'div',
      { className: 'asj-footer__coverage-header' },
      React.createElement(
        'h3',
        { className: 'asj-footer__col-title' },
        t.footer.coverageTitle
      ),
      React.createElement(
        'p',
        { className: 'asj-footer__coverage-subtitle' },
        isHindi
          ? 'सिवान जिले के 15 गांवों में त्वरित डोरस्टेप डिलीवरी'
          : 'Prompt doorstep delivery across 15 Siwan villages'
      )
    ),
    React.createElement(
      'div',
      {
        className: 'asj-footer__villages-container',
        role: 'list',
        'aria-label': t.footer.coverageTitle,
      },
      villagesList.map((villageRecord) => {
        const villageDisplayName = isHindi
          ? villageRecord.nameHindi
          : villageRecord.name;
        const villageSlaName = isHindi
          ? villageRecord.deliverySlaHindi
          : villageRecord.deliverySla;
        const isPlantVillage = Boolean(villageRecord.isPlantLocation);

        const chipClassNames = [
          'asj-footer__village-chip',
          isPlantVillage ? 'asj-footer__village-chip--plant' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return React.createElement(
          'a',
          {
            key: villageRecord.id,
            href: '#coverage',
            className: chipClassNames,
            role: 'listitem',
            title: `${villageDisplayName} - ${villageSlaName} (${villageRecord.distanceKm} km)`,
          },
          React.createElement(
            'span',
            null,
            isPlantVillage
              ? `📍 ${villageDisplayName}${isHindi ? ' (प्लांट)' : ' (Plant)'}`
              : villageDisplayName
          ),
          React.createElement(
            'span',
            { className: 'asj-footer__village-sla-badge' },
            villageSlaName
          )
        );
      })
    )
  );

  // Main Columns Container Element
  const mainSectionElement = React.createElement(
    'div',
    { className: 'asj-footer__main' },
    React.createElement(
      'div',
      { className: 'asj-footer__container' },
      React.createElement(
        'div',
        { className: 'asj-footer__grid' },
        brandColumnElement,
        quickLinksColumnElement,
        contactColumnElement,
        coverageColumnElement
      )
    )
  );

  // Bottom Copyright & Back-to-Top Bar
  const bottomBarElement = React.createElement(
    'div',
    { className: 'asj-footer__bottom' },
    React.createElement(
      'div',
      { className: 'asj-footer__container' },
      React.createElement(
        'div',
        { className: 'asj-footer__bottom-inner' },
        React.createElement(
          'div',
          { className: 'asj-footer__copyright-block' },
          React.createElement(
            'p',
            { className: 'asj-footer__copyright-text' },
            t.footer.copyright
          ),
          React.createElement(
            'span',
            { className: 'asj-footer__rights-divider', 'aria-hidden': true },
            '•'
          ),
          React.createElement(
            'p',
            { className: 'asj-footer__copyright-text' },
            t.footer.allRightsReserved
          )
        ),
        React.createElement(
          'a',
          {
            href: '#top',
            onClick: handleBackToTop,
            className: 'asj-footer__back-to-top',
            'aria-label': isHindi ? 'वापस ऊपर जाएं' : 'Back to Top',
          },
          React.createElement(ArrowUp, { size: 16, 'aria-hidden': true }),
          React.createElement(
            'span',
            null,
            isHindi ? 'वापस ऊपर जाएं' : 'Back to Top'
          )
        )
      )
    )
  );

  return React.createElement(
    'footer',
    {
      role: 'contentinfo',
      className: footerClassNames,
    },
    trustSectionElement,
    mainSectionElement,
    bottomBarElement,
    React.createElement('style', null, footerStyles)
  );
}
