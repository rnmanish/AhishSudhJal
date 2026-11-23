'use client';

import React, { useCallback, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';

export interface HeroSectionProps {
  readonly className?: string;
  readonly onOrderClick?: () => void;
  readonly onCheckVillageClick?: () => void;
}

interface HeroTrustFeature {
  readonly iconType: 'shield' | 'droplet' | 'sparkles';
  readonly text: string;
}

interface HeroStatItem {
  readonly value: string;
  readonly label: string;
  readonly iconType: 'users' | 'purity' | 'villages';
}

const heroStyles = `
  /* ==========================================================================
   * 1. Hero Container & Atmospheric Aquatic Backdrop
   * ========================================================================== */
  .asj-hero {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.12) 0%, rgba(5, 19, 41, 0.98) 75%),
                linear-gradient(180deg, #051329 0%, #030c1a 100%);
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    padding: 3rem 1rem 3.5rem;
  }

  @media (min-width: 768px) {
    .asj-hero {
      padding: 4.5rem 1.5rem 4.5rem;
    }
  }

  @media (min-width: 1024px) {
    .asj-hero {
      padding: 5.5rem 2rem 5rem;
    }
  }

  /* Decorative Ambient Water Light Orbs */
  .asj-hero__ambient-orb {
    position: absolute;
    border-radius: var(--radius-full, 9999px);
    pointer-events: none;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.45;
  }

  .asj-hero__ambient-orb--top {
    top: -10%;
    left: 20%;
    width: 420px;
    height: 420px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(14, 165, 233, 0) 70%);
  }

  .asj-hero__ambient-orb--bottom {
    bottom: -15%;
    right: 15%;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(3, 12, 26, 0) 70%);
  }

  .asj-hero__container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3.5rem;
  }

  /* ==========================================================================
   * 2. Main Hero Grid (Content vs Visual Showcase Card)
   * ========================================================================== */
  .asj-hero__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
  }

  @media (min-width: 1024px) {
    .asj-hero__grid {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 3.5rem;
    }
  }

  .asj-hero__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  /* ==========================================================================
   * 3. Live Village Delivery Badge with Pulse Indicator
   * ========================================================================== */
  .asj-hero__badge-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    width: 100%;
  }

  .asj-hero__delivery-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.4375rem 0.875rem;
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.35));
    border-radius: var(--radius-full, 9999px);
    backdrop-filter: blur(var(--glass-blur-sm, 6px));
    -webkit-backdrop-filter: blur(var(--glass-blur-sm, 6px));
    box-shadow: 0 0 16px rgba(14, 165, 233, 0.15);
    max-width: fit-content;
  }

  .asj-hero__pulse-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
  }

  .asj-hero__pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-status-success, #10b981);
    opacity: 0.75;
    animation: asj-pulse-live 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .asj-hero__pulse-dot {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-status-success-light, #34d399);
    box-shadow: 0 0 8px #10b981;
  }

  .asj-hero__badge-text {
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-primary-300, #bae6fd);
    letter-spacing: 0.01em;
  }

  .asj-hero__sla-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--color-accent-cyan-light, #22d3ee);
    font-weight: var(--font-weight-medium, 500);
    padding: 0.25rem 0.625rem;
    background: rgba(6, 182, 212, 0.08);
    border-radius: var(--radius-sm, 8px);
    border: 1px solid rgba(6, 182, 212, 0.2);
    width: fit-content;
  }

  /* ==========================================================================
   * 4. Bilingual Headlines & Subtitle
   * ========================================================================== */
  .asj-hero__title {
    font-size: clamp(2rem, 5vw + 0.5rem, 3.375rem);
    font-weight: var(--font-weight-extrabold, 800);
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: var(--color-text-primary, #f8fafc);
    margin: 0;
  }

  .asj-hero__highlight {
    display: block;
    background: linear-gradient(135deg, var(--color-primary-400, #7dd3fc) 0%, var(--color-accent-cyan-light, #22d3ee) 50%, var(--color-accent-aqua, #00e5ff) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 2px 14px rgba(14, 165, 233, 0.35));
    margin-top: 0.25rem;
  }

  .asj-hero__subtitle {
    font-size: clamp(1rem, 1.5vw + 0.5rem, 1.1875rem);
    font-weight: var(--font-weight-regular, 400);
    line-height: var(--line-height-relaxed, 1.65);
    color: var(--color-text-secondary, #cbd5e1);
    max-width: 620px;
    margin: 0;
  }

  /* ==========================================================================
   * 5. Call to Action (CTA) Buttons Strip
   * ========================================================================== */
  .asj-hero__actions {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    width: 100%;
    margin-top: 0.5rem;
  }

  @media (min-width: 640px) {
    .asj-hero__actions {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }
  }

  /* Base CTA styles with 44px minimum touch target */
  .asj-hero__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.8125rem 1.625rem;
    font-size: 1rem;
    font-weight: var(--font-weight-bold, 700);
    border-radius: var(--radius-md, 12px);
    text-decoration: none;
    transition: transform var(--transition-fast, 150ms ease),
                box-shadow var(--transition-fast, 150ms ease),
                background-color var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease);
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
  }

  .asj-hero__btn:hover {
    transform: translateY(-2px);
    text-decoration: none;
  }

  .asj-hero__btn:active {
    transform: translateY(0);
  }

  /* Primary WhatsApp CTA */
  .asj-hero__btn--whatsapp {
    background: linear-gradient(135deg, var(--color-whatsapp-primary, #25d366) 0%, var(--color-whatsapp-dark, #128c7e) 100%);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 18px rgba(37, 211, 102, 0.35),
                0 0 12px rgba(37, 211, 102, 0.2);
  }

  .asj-hero__btn--whatsapp:hover {
    background: linear-gradient(135deg, var(--color-whatsapp-hover, #1ebd5b) 0%, var(--color-whatsapp-dark, #128c7e) 100%);
    box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5),
                0 0 20px rgba(37, 211, 102, 0.3);
  }

  /* Secondary Check Village Delivery CTA */
  .asj-hero__btn--village {
    background: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    color: var(--color-text-primary, #f8fafc);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.38));
    backdrop-filter: blur(var(--glass-blur-sm, 6px));
    -webkit-backdrop-filter: blur(var(--glass-blur-sm, 6px));
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  }

  .asj-hero__btn--village:hover {
    background: var(--color-bg-card-hover, rgba(13, 59, 102, 0.75));
    border-color: var(--color-primary-400, #7dd3fc);
    color: var(--color-accent-aqua, #00e5ff);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.25);
  }

  /* Direct Phone Call CTA */
  .asj-hero__btn--call {
    background: transparent;
    color: var(--color-primary-300, #bae6fd);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.2));
    padding: 0.8125rem 1.25rem;
  }

  .asj-hero__btn--call:hover {
    background: rgba(14, 165, 233, 0.1);
    color: #ffffff;
    border-color: var(--color-primary-400, #7dd3fc);
  }

  /* ==========================================================================
   * 6. Trust Features Strip (RO/UV, TDS 100-150, Sanitized Jars)
   * ========================================================================== */
  .asj-hero__trust-strip {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
  }

  @media (min-width: 640px) {
    .asj-hero__trust-strip {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
    }
  }

  .asj-hero__trust-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary, #cbd5e1);
    font-weight: var(--font-weight-medium, 500);
  }

  .asj-hero__trust-icon {
    color: var(--color-accent-cyan-light, #22d3ee);
    flex-shrink: 0;
  }

  /* ==========================================================================
   * 7. Visual Product Showcase Card (Right Column)
   * ========================================================================== */
  .asj-hero__visual-card {
    position: relative;
    border-radius: var(--radius-xl, 24px);
    background: linear-gradient(145deg, rgba(13, 59, 102, 0.55) 0%, rgba(5, 19, 41, 0.85) 100%);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.35));
    backdrop-filter: blur(var(--glass-blur-md, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur-md, 12px));
    padding: 2rem 1.75rem;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45),
                0 0 30px rgba(14, 165, 233, 0.15);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .asj-hero__card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .asj-hero__card-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3125rem 0.75rem;
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-radius: var(--radius-full, 9999px);
  }

  .asj-hero__card-pill--purity {
    background: rgba(16, 185, 129, 0.15);
    color: var(--color-status-success-light, #34d399);
    border: 1px solid rgba(16, 185, 129, 0.35);
  }

  .asj-hero__card-pill--origin {
    background: rgba(14, 165, 233, 0.15);
    color: var(--color-primary-300, #bae6fd);
    border: 1px solid rgba(14, 165, 233, 0.35);
  }

  /* Visual Jar Presentation Block */
  .asj-hero__jar-presentation {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 1.5rem 0;
  }

  .asj-hero__jar-circle {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: var(--radius-full, 9999px);
    background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(6, 182, 212, 0.08) 70%);
    border: 2px solid var(--color-border-medium, rgba(56, 189, 248, 0.35));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(14, 165, 233, 0.3),
                inset 0 0 20px rgba(0, 229, 255, 0.15);
    animation: asj-float 4s ease-in-out infinite;
  }

  .asj-hero__jar-icon-main {
    color: var(--color-accent-aqua, #00e5ff);
    filter: drop-shadow(0 4px 12px rgba(0, 229, 255, 0.5));
  }

  .asj-hero__jar-tag {
    position: absolute;
    bottom: -6px;
    background: linear-gradient(135deg, var(--color-primary-600, #0ea5e9) 0%, var(--color-accent-cyan, #06b6d4) 100%);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: var(--font-weight-extrabold, 800);
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-full, 9999px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
  }

  /* Pricing Highlights inside Card */
  .asj-hero__pricing-box {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: rgba(3, 12, 26, 0.6);
    border-radius: var(--radius-md, 12px);
    padding: 1.125rem;
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
  }

  .asj-hero__pricing-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .asj-hero__pricing-title {
    font-size: 1rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-hero__pricing-figure {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
  }

  .asj-hero__price-recurring {
    font-size: 1.5rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: var(--color-status-success-light, #34d399);
  }

  .asj-hero__price-standard {
    font-size: 0.9375rem;
    color: var(--color-text-muted, #94a3b8);
    text-decoration: line-through;
  }

  .asj-hero__pricing-notes {
    display: flex;
    flex-direction: column;
    gap: 0.3125rem;
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-hero__pricing-deposit {
    color: var(--color-primary-300, #bae6fd);
    font-weight: var(--font-weight-medium, 500);
  }

  .asj-hero__card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }

  .asj-hero__card-guarantee {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted, #94a3b8);
  }

  .asj-hero__card-link {
    font-size: 0.875rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-accent-aqua, #00e5ff);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: color var(--transition-fast, 150ms ease);
    min-height: var(--touch-target-min, 44px);
  }

  .asj-hero__card-link:hover {
    color: var(--color-primary-300, #bae6fd);
    text-decoration: underline;
  }

  /* ==========================================================================
   * 8. Stats Strip (500+ Families, 100-150 PPM, 15+ Villages)
   * ========================================================================== */
  .asj-hero__stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
  }

  @media (min-width: 640px) {
    .asj-hero__stats {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
  }

  .asj-hero__stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.125rem 1.25rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    backdrop-filter: blur(var(--glass-blur-sm, 6px));
    -webkit-backdrop-filter: blur(var(--glass-blur-sm, 6px));
    transition: transform var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease);
  }

  .asj-hero__stat-card:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary-400, #7dd3fc);
  }

  .asj-hero__stat-icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md, 12px);
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    color: var(--color-accent-aqua, #00e5ff);
    flex-shrink: 0;
  }

  .asj-hero__stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .asj-hero__stat-value {
    font-size: 1.25rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: var(--color-text-primary, #f8fafc);
    letter-spacing: -0.015em;
    line-height: 1.2;
  }

  .asj-hero__stat-label {
    font-size: 0.8125rem;
    color: var(--color-text-muted, #94a3b8);
    line-height: 1.35;
  }

  /* ==========================================================================
   * 9. Keyframe Animations
   * ========================================================================== */
  @keyframes asj-pulse-live {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    70% {
      transform: scale(2.2);
      opacity: 0;
    }
    100% {
      transform: scale(0.95);
      opacity: 0;
    }
  }

  @keyframes asj-float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .asj-hero__pulse-ring,
    .asj-hero__jar-circle {
      animation: none !important;
    }
  }
`;

export function HeroSection({
  className,
  onOrderClick,
  onCheckVillageClick,
}: HeroSectionProps): JSX.Element {
  const { isHindi, t: currentTranslations } = useLanguage();

  const heroClassNames = useMemo(() => {
    return ['asj-hero', className].filter(Boolean).join(' ');
  }, [className]);

  // Unicode safe WhatsApp order message
  const orderMessage = isHindi
    ? 'नमस्ते आशीष शुद्ध जल, मुझे 20L पानी जार ऑर्डर करना है।'
    : 'Hello Ashish Sudh Jal, I would like to order a 20L water jar.';
  const whatsappUrl = `https://wa.me/918235882384?text=${encodeURIComponent(orderMessage)}`;
  const hotlineUrl = 'tel:+918235882384';

  const handleOrderClick = useCallback(
    (_clickEvent: React.MouseEvent<HTMLAnchorElement>) => {
      if (onOrderClick) {
        onOrderClick();
      }
    },
    [onOrderClick]
  );

  const handleCheckVillageClick = useCallback(
    (_clickEvent: React.MouseEvent<HTMLAnchorElement>) => {
      if (onCheckVillageClick) {
        onCheckVillageClick();
      }
    },
    [onCheckVillageClick]
  );

  // Trust features data
  const trustFeatures: readonly HeroTrustFeature[] = [
    {
      iconType: 'shield',
      text: currentTranslations.hero.trustFeature1,
    },
    {
      iconType: 'droplet',
      text: currentTranslations.hero.trustFeature2,
    },
    {
      iconType: 'sparkles',
      text: currentTranslations.hero.trustFeature3,
    },
  ];

  // Stats data
  const statsList: readonly HeroStatItem[] = [
    {
      value: currentTranslations.hero.stats.customers,
      label: currentTranslations.hero.stats.customersLabel,
      iconType: 'users',
    },
    {
      value: currentTranslations.hero.stats.purity,
      label: currentTranslations.hero.stats.purityLabel,
      iconType: 'purity',
    },
    {
      value: currentTranslations.hero.stats.villages,
      label: currentTranslations.hero.stats.villagesLabel,
      iconType: 'villages',
    },
  ];

  // 1. Live Village Delivery Badge with pulsating indicator & SLA pill
  const deliveryBadgeElement = React.createElement(
    'div',
    { className: 'asj-hero__badge-wrapper' },
    React.createElement(
      'div',
      {
        className: 'asj-hero__delivery-badge',
        role: 'status',
        'aria-live': 'polite',
      },
      React.createElement(
        'div',
        {
          className: 'asj-hero__pulse-container',
          'aria-hidden': true,
        },
        React.createElement('div', { className: 'asj-hero__pulse-ring' }),
        React.createElement('div', { className: 'asj-hero__pulse-dot' })
      ),
      React.createElement(
        'span',
        { className: 'asj-hero__badge-text' },
        currentTranslations.hero.badge
      )
    ),
    React.createElement(
      'div',
      { className: 'asj-hero__sla-pill' },
      React.createElement(Truck, { size: 14, 'aria-hidden': true }),
      React.createElement(
        'span',
        null,
        currentTranslations.hero.deliveryPill
      )
    )
  );

  // 2. Headlines
  const headlinesElement = React.createElement(
    'div',
    { className: 'asj-hero__headlines' },
    React.createElement(
      'h1',
      { id: 'hero-title', className: 'asj-hero__title' },
      currentTranslations.hero.title,
      React.createElement(
        'span',
        { className: 'asj-hero__highlight' },
        currentTranslations.hero.highlight
      )
    )
  );

  // 3. Subtitle
  const subtitleElement = React.createElement(
    'p',
    { className: 'asj-hero__subtitle' },
    currentTranslations.hero.subtitle
  );

  // 4. Action Buttons (WhatsApp CTA, Check Village CTA, Hotline Call)
  const actionButtonsElement = React.createElement(
    'div',
    { className: 'asj-hero__actions' },
    React.createElement(
      'a',
      {
        href: whatsappUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'asj-hero__btn asj-hero__btn--whatsapp',
        onClick: handleOrderClick,
        'aria-label': `${currentTranslations.hero.orderCta} (${isHindi ? 'व्हाट्सएप खुलेगा' : 'Opens WhatsApp'})`,
      },
      React.createElement(MessageCircle, { size: 20, 'aria-hidden': true }),
      React.createElement('span', null, currentTranslations.hero.orderCta)
    ),
    React.createElement(
      'a',
      {
        href: '#coverage',
        className: 'asj-hero__btn asj-hero__btn--village',
        onClick: handleCheckVillageClick,
        'aria-label': currentTranslations.hero.checkVillageCta,
      },
      React.createElement(MapPin, { size: 20, 'aria-hidden': true }),
      React.createElement('span', null, currentTranslations.hero.checkVillageCta)
    ),
    React.createElement(
      'a',
      {
        href: hotlineUrl,
        className: 'asj-hero__btn asj-hero__btn--call',
        'aria-label': `${currentTranslations.hero.callCta} ${currentTranslations.brand.hotline}`,
      },
      React.createElement(Phone, { size: 18, 'aria-hidden': true }),
      React.createElement('span', null, currentTranslations.hero.callCta)
    )
  );

  // 5. Trust Features Strip
  const trustFeaturesElement = React.createElement(
    'div',
    { className: 'asj-hero__trust-strip', role: 'list', 'aria-label': isHindi ? 'गुणवत्ता आश्वासन' : 'Quality Assurances' },
    trustFeatures.map((featureItem, index) => {
      let iconComponent: JSX.Element;
      if (featureItem.iconType === 'shield') {
        iconComponent = React.createElement(ShieldCheck, { size: 18, className: 'asj-hero__trust-icon', 'aria-hidden': true });
      } else if (featureItem.iconType === 'droplet') {
        iconComponent = React.createElement(Droplets, { size: 18, className: 'asj-hero__trust-icon', 'aria-hidden': true });
      } else {
        iconComponent = React.createElement(Sparkles, { size: 18, className: 'asj-hero__trust-icon', 'aria-hidden': true });
      }

      return React.createElement(
        'div',
        { key: `trust-feature-${index}`, className: 'asj-hero__trust-item', role: 'listitem' },
        iconComponent,
        React.createElement('span', null, featureItem.text)
      );
    })
  );

  // Left Content Column Element
  const leftContentColumnElement = React.createElement(
    'div',
    { className: 'asj-hero__content' },
    deliveryBadgeElement,
    headlinesElement,
    subtitleElement,
    actionButtonsElement,
    trustFeaturesElement
  );

  // 6. Right Column: Visual Product Showcase Card
  const showcaseCardElement = React.createElement(
    'div',
    { className: 'asj-hero__visual-card' },
    React.createElement(
      'div',
      { className: 'asj-hero__card-header' },
      React.createElement(
        'span',
        { className: 'asj-hero__card-pill asj-hero__card-pill--purity' },
        React.createElement(CheckCircle2, { size: 12, 'aria-hidden': true }),
        isHindi ? '100% शुद्ध एवं स्वच्छ' : '100% Pure & Hygienic'
      ),
      React.createElement(
        'span',
        { className: 'asj-hero__card-pill asj-hero__card-pill--origin' },
        React.createElement(MapPin, { size: 12, 'aria-hidden': true }),
        isHindi ? 'सरसर प्लांट (सिवान)' : 'Sarsar Plant, Siwan'
      )
    ),
    React.createElement(
      'div',
      { className: 'asj-hero__jar-presentation' },
      React.createElement(
        'div',
        { className: 'asj-hero__jar-circle' },
        React.createElement(Droplets, { size: 64, className: 'asj-hero__jar-icon-main', 'aria-hidden': true }),
        React.createElement(
          'span',
          { className: 'asj-hero__jar-tag' },
          isHindi ? '20L सामान्य / ठंडा' : '20L Normal & Cool'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'asj-hero__pricing-box' },
      React.createElement(
        'div',
        { className: 'asj-hero__pricing-row' },
        React.createElement(
          'span',
          { className: 'asj-hero__pricing-title' },
          isHindi ? '20 लीटर आरओ पानी जार' : '20L RO Water Jar'
        ),
        React.createElement(
          'div',
          { className: 'asj-hero__pricing-figure' },
          React.createElement('span', { className: 'asj-hero__price-recurring' }, '₹25'),
          React.createElement('span', { className: 'asj-hero__price-standard' }, '₹30')
        )
      ),
      React.createElement(
        'div',
        { className: 'asj-hero__pricing-notes' },
        React.createElement(
          'span',
          null,
          isHindi ? '✨ नियमित ग्राहक छूट: ₹5/जार बचत' : '✨ Recurring discount: Save ₹5/jar'
        ),
        React.createElement(
          'span',
          { className: 'asj-hero__pricing-deposit' },
          isHindi
            ? '🔒 ₹150 एकमुश्त रिफंडेबल डिपॉजिट (जार + डिस्पेंसर)'
            : '🔒 ₹150 One-time refundable deposit (Jar + Dispenser)'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'asj-hero__card-footer' },
      React.createElement(
        'div',
        { className: 'asj-hero__card-guarantee' },
        React.createElement(Clock, { size: 14, 'aria-hidden': true }),
        React.createElement(
          'span',
          null,
          isHindi ? '30–120 मिनट में डिलीवरी' : 'Delivery in 30-120 mins'
        )
      ),
      React.createElement(
        'a',
        {
          href: '#booking',
          className: 'asj-hero__card-link',
          'aria-label': isHindi ? 'बुकिंग विज़ार्ड खोलें' : 'Open Booking Wizard',
        },
        React.createElement('span', null, isHindi ? 'ऑर्डर विज़ार्ड' : 'Order Wizard'),
        React.createElement('span', { 'aria-hidden': true }, '→')
      )
    )
  );

  // Main Grid Element (Left + Right Columns)
  const heroGridElement = React.createElement(
    'div',
    { className: 'asj-hero__grid' },
    leftContentColumnElement,
    showcaseCardElement
  );

  // 7. Bottom Stats Strip (500+ Families, 100-150 PPM, 15+ Villages)
  const statsStripElement = React.createElement(
    'div',
    {
      className: 'asj-hero__stats',
      role: 'region',
      'aria-label': isHindi ? 'सेवा सांख्यिकी' : 'Service Statistics',
    },
    statsList.map((statItem, index) => {
      let statIcon: JSX.Element;
      if (statItem.iconType === 'users') {
        statIcon = React.createElement(Users, { size: 22, 'aria-hidden': true });
      } else if (statItem.iconType === 'purity') {
        statIcon = React.createElement(Award, { size: 22, 'aria-hidden': true });
      } else {
        statIcon = React.createElement(MapPin, { size: 22, 'aria-hidden': true });
      }

      return React.createElement(
        'div',
        { key: `stat-${index}`, className: 'asj-hero__stat-card' },
        React.createElement(
          'div',
          { className: 'asj-hero__stat-icon-box', 'aria-hidden': true },
          statIcon
        ),
        React.createElement(
          'div',
          { className: 'asj-hero__stat-content' },
          React.createElement('span', { className: 'asj-hero__stat-value' }, statItem.value),
          React.createElement('span', { className: 'asj-hero__stat-label' }, statItem.label)
        )
      );
    })
  );

  // Ambient orbs for background atmosphere
  const ambientOrbTop = React.createElement('div', {
    className: 'asj-hero__ambient-orb asj-hero__ambient-orb--top',
    'aria-hidden': true,
  });
  const ambientOrbBottom = React.createElement('div', {
    className: 'asj-hero__ambient-orb asj-hero__ambient-orb--bottom',
    'aria-hidden': true,
  });

  return React.createElement(
    'section',
    {
      id: 'hero',
      role: 'region',
      'aria-labelledby': 'hero-title',
      className: heroClassNames,
    },
    ambientOrbTop,
    ambientOrbBottom,
    React.createElement(
      'div',
      { className: 'asj-hero__container' },
      heroGridElement,
      statsStripElement
    ),
    React.createElement('style', null, heroStyles)
  );
}
