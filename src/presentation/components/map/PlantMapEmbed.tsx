'use client';

import React, { useCallback, useMemo } from 'react';
import {
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';

export interface PlantMapEmbedProps {
  readonly className?: string;
  readonly mapHeight?: number | string;
  readonly showAddressCard?: boolean;
  readonly showOperatingHours?: boolean;
  readonly showContactButtons?: boolean;
  readonly showPinOverlay?: boolean;
  readonly onDirectionsClick?: () => void;
  readonly onCallClick?: () => void;
  readonly onWhatsAppClick?: () => void;
}

interface PlantFacilityFeature {
  readonly featureKey: string;
  readonly title: string;
  readonly description: string;
  readonly iconType: 'shield' | 'sparkles' | 'truck';
}

const plantMapStyles = `
  /* ==========================================================================
   * 1. Sarsar Plant Map Embed Container & Atmospheric Backdrop
   * ========================================================================== */
  .asj-plant-map {
    position: relative;
    width: 100%;
    background: radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08) 0%, rgba(3, 12, 26, 0.98) 75%),
                linear-gradient(180deg, #030c1a 0%, #051329 100%);
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    padding: 3.5rem 1rem 4rem;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .asj-plant-map {
      padding: 4.5rem 1.5rem 5rem;
    }
  }

  .asj-plant-map__container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  /* Ambient Water Glow Effect */
  .asj-plant-map__glow-orb {
    position: absolute;
    border-radius: var(--radius-full, 9999px);
    pointer-events: none;
    filter: blur(90px);
    z-index: 0;
    opacity: 0.35;
  }

  .asj-plant-map__glow-orb--left {
    top: -5%;
    left: -10%;
    width: 460px;
    height: 460px;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(14, 165, 233, 0) 70%);
  }

  .asj-plant-map__glow-orb--right {
    bottom: -10%;
    right: -5%;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(3, 12, 26, 0) 70%);
  }

  /* ==========================================================================
   * 2. Header & Section Badges
   * ========================================================================== */
  .asj-plant-map__header {
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .asj-plant-map__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-full, 9999px);
    background-color: rgba(14, 165, 233, 0.12);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.28));
    color: var(--color-primary-400, #38bdf8);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .asj-plant-map__title {
    font-size: var(--font-size-2xl, 1.875rem);
    font-weight: var(--font-weight-bold, 700);
    line-height: var(--line-height-tight, 1.25);
    color: var(--color-text-primary, #f8fafc);
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
  }

  @media (min-width: 768px) {
    .asj-plant-map__title {
      font-size: var(--font-size-3xl, 2.25rem);
    }
  }

  .asj-plant-map__subtitle {
    font-size: var(--font-size-sm, 0.875rem);
    line-height: var(--line-height-relaxed, 1.6);
    color: var(--color-text-secondary, #94a3b8);
  }

  @media (min-width: 768px) {
    .asj-plant-map__subtitle {
      font-size: var(--font-size-base, 1rem);
    }
  }

  /* ==========================================================================
   * 3. Main Plant Content Grid (Map Embed + Plant Information Card)
   * ========================================================================== */
  .asj-plant-map__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
    position: relative;
    z-index: 1;
    align-items: stretch;
  }

  @media (min-width: 1024px) {
    .asj-plant-map__grid {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 2.25rem;
    }
  }

  /* ==========================================================================
   * 4. Google Maps Iframe Embed & Pin Wrapper
   * ========================================================================== */
  .asj-plant-map__embed-wrapper {
    position: relative;
    width: 100%;
    min-height: 380px;
    border-radius: var(--radius-xl, 24px);
    overflow: hidden;
    background: var(--color-bg-surface-elevated, #092042);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 32px rgba(14, 165, 233, 0.14);
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .asj-plant-map__embed-wrapper {
      min-height: 460px;
    }
  }

  .asj-plant-map__iframe {
    width: 100%;
    height: 100%;
    min-height: 380px;
    border: 0;
    display: block;
    flex: 1;
    transition: filter var(--transition-base, 250ms ease);
  }

  @media (min-width: 768px) {
    .asj-plant-map__iframe {
      min-height: 460px;
    }
  }

  /* Floating Plant Pin Overlay Banner */
  .asj-plant-map__pin-overlay {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    max-width: fit-content;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    background: rgba(5, 19, 41, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.35));
    border-radius: var(--radius-lg, 16px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(14, 165, 233, 0.22);
    pointer-events: auto;
    z-index: 2;
  }

  .asj-plant-map__pin-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full, 9999px);
    background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
    color: #ffffff;
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(14, 165, 233, 0.5);
  }

  .asj-plant-map__pin-pulse {
    position: absolute;
    inset: -3px;
    border-radius: var(--radius-full, 9999px);
    border: 2px solid var(--color-accent-aqua, #00e5ff);
    animation: asj-plant-map-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes asj-plant-map-pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.15;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.9;
    }
  }

  .asj-plant-map__pin-details {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .asj-plant-map__pin-title {
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    letter-spacing: 0.02em;
    line-height: 1.25;
  }

  .asj-plant-map__pin-subtitle {
    font-size: 0.6875rem;
    color: var(--color-primary-300, #bae6fd);
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .asj-plant-map__pin-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-status-success, #10b981);
    box-shadow: 0 0 6px var(--color-status-success, #10b981);
  }

  /* ==========================================================================
   * 5. Plant Information Card
   * ========================================================================== */
  .asj-plant-map__card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.75rem;
    border-radius: var(--radius-xl, 24px);
    background: rgba(10, 37, 64, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  }

  @media (min-width: 768px) {
    .asj-plant-map__card {
      padding: 2.25rem 2rem;
    }
  }

  /* Card Header & Operating Pill */
  .asj-plant-map__card-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    padding-bottom: 1.25rem;
  }

  .asj-plant-map__card-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .asj-plant-map__card-title {
    font-size: var(--font-size-xl, 1.25rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    letter-spacing: -0.01em;
    margin: 0;
  }

  .asj-plant-map__status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-full, 9999px);
    background: var(--color-status-success-bg, rgba(16, 185, 129, 0.16));
    border: 1px solid var(--color-status-success-border, rgba(16, 185, 129, 0.38));
    color: var(--color-status-success-light, #34d399);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    white-space: nowrap;
  }

  .asj-plant-map__status-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-status-success, #10b981);
    box-shadow: 0 0 6px var(--color-status-success, #10b981);
  }

  .asj-plant-map__card-tagline {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #94a3b8);
    margin: 0;
  }

  /* Address & Working Hours Section */
  .asj-plant-map__details-list {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .asj-plant-map__detail-item {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .asj-plant-map__detail-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md, 12px);
    background-color: rgba(14, 165, 233, 0.12);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.2));
    color: var(--color-accent-aqua, #00e5ff);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .asj-plant-map__detail-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asj-plant-map__detail-label {
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-primary-400, #38bdf8);
    margin: 0;
  }

  .asj-plant-map__detail-value {
    font-size: var(--font-size-sm, 0.875rem);
    line-height: var(--line-height-relaxed, 1.5);
    color: var(--color-text-primary, #f8fafc);
    font-style: normal;
    margin: 0;
  }

  .asj-plant-map__detail-subtext {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-muted, #94a3b8);
    margin: 0;
  }

  /* Plant Highlights Strip */
  .asj-plant-map__features-strip {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: var(--radius-lg, 16px);
    background: rgba(14, 165, 233, 0.06);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.16));
  }

  @media (min-width: 640px) {
    .asj-plant-map__features-strip {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .asj-plant-map__feature-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asj-plant-map__feature-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--color-accent-aqua, #00e5ff);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-plant-map__feature-desc {
    font-size: 0.6875rem;
    color: var(--color-text-muted, #94a3b8);
    line-height: 1.35;
    margin: 0;
  }

  /* ==========================================================================
   * 6. Action CTAs (Directions, Call, WhatsApp)
   * ========================================================================== */
  .asj-plant-map__actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  @media (min-width: 640px) {
    .asj-plant-map__actions {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  .asj-plant-map__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 0.75rem 1.25rem;
    min-height: var(--touch-target-min, 44px);
    border-radius: var(--radius-md, 12px);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
    border: 1px solid transparent;
    text-align: center;
  }

  @media (min-width: 640px) {
    .asj-plant-map__btn {
      flex: 1;
    }
  }

  .asj-plant-map__btn--primary {
    background: linear-gradient(135deg, var(--color-accent-aqua, #00e5ff) 0%, var(--color-primary-500, #38bdf8) 100%);
    color: var(--color-text-inverse, #030c1a);
    box-shadow: 0 4px 16px rgba(14, 165, 233, 0.35);
  }

  .asj-plant-map__btn--primary:hover {
    background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
    color: var(--color-text-inverse, #030c1a);
    text-decoration: none;
  }

  .asj-plant-map__btn--secondary {
    background: rgba(14, 165, 233, 0.1);
    color: var(--color-primary-300, #bae6fd);
    border-color: var(--color-border-medium, rgba(56, 189, 248, 0.32));
  }

  .asj-plant-map__btn--secondary:hover {
    background: rgba(14, 165, 233, 0.2);
    border-color: var(--color-primary-400, #38bdf8);
    color: var(--color-text-primary, #f8fafc);
    transform: translateY(-2px);
    text-decoration: none;
  }

  .asj-plant-map__btn--whatsapp {
    background: var(--color-whatsapp-primary, #25d366);
    color: var(--color-whatsapp-contrast-text, #03140a);
    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
  }

  .asj-plant-map__btn--whatsapp:hover {
    background: var(--color-whatsapp-hover, #1ebd5b);
    color: var(--color-whatsapp-contrast-text, #03140a);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
    text-decoration: none;
  }
`;

export function PlantMapEmbed({
  className,
  mapHeight,
  showAddressCard = true,
  showOperatingHours = true,
  showContactButtons = true,
  showPinOverlay = true,
  onDirectionsClick,
  onCallClick,
  onWhatsAppClick,
}: PlantMapEmbedProps): JSX.Element {
  const { isHindi, t: currentTranslations } = useLanguage();

  // Directions destination URL (Google Maps navigation intent)
  const directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Ashish+Sudh+Jal+Sarsar+Siwan+Bihar+841226';

  // Embed URL for standard Google Maps iframe
  const embedIframeUrl =
    'https://maps.google.com/maps?q=Ashish+Sudh+Jal,+Sarsar,+Siwan,+Bihar+841226&t=&z=15&ie=UTF8&iwloc=&output=embed';

  const telephoneNumber = currentTranslations.brand.hotlineNumber || '8235882384';

  const whatsappInquiryUrl = useMemo(() => {
    const defaultWhatsAppMessage = isHindi
      ? 'नमस्ते! मैं सरसर स्थित आपके आरओ प्लांट पर आना चाहता हूँ।'
      : 'Hello! I would like to visit your RO water plant in Sarsar, Siwan.';
    return `https://wa.me/918235882384?text=${encodeURIComponent(defaultWhatsAppMessage)}`;
  }, [isHindi]);

  const plantFeatures: readonly PlantFacilityFeature[] = useMemo(() => {
    return [
      {
        featureKey: 'pickup',
        title: isHindi ? 'सीधे प्लांट पिकअप' : 'Direct Plant Pickup',
        description: isHindi ? 'स्वयं आकर तुरंत जार लें' : 'Pick up fresh jars on the spot',
        iconType: 'truck',
      },
      {
        featureKey: 'purification',
        title: isHindi ? 'मल्टी-स्टेज आरओ + यूवी' : 'Multi-Stage RO + UV',
        description: isHindi ? '100% शुद्ध व स्वच्छ पेयजल' : '100% pure & certified water',
        iconType: 'shield',
      },
      {
        featureKey: 'testing',
        title: isHindi ? 'मुफ्त टीडीएस जांच' : 'Free Water Testing',
        description: isHindi ? 'अपने घर का पानी टेस्ट करवाएं' : 'Bring water sample for free test',
        iconType: 'sparkles',
      },
    ];
  }, [isHindi]);

  const handleDirectionsClick = useCallback(() => {
    if (onDirectionsClick) {
      onDirectionsClick();
    }
  }, [onDirectionsClick]);

  const handleCallClick = useCallback(() => {
    if (onCallClick) {
      onCallClick();
    }
  }, [onCallClick]);

  const handleWhatsAppClick = useCallback(() => {
    if (onWhatsAppClick) {
      onWhatsAppClick();
    }
  }, [onWhatsAppClick]);

  const sectionClasses = ['asj-plant-map', className].filter(Boolean).join(' ');

  const iframeCustomStyle = useMemo(() => {
    if (!mapHeight) {
      return undefined;
    }
    return {
      height: typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight,
      minHeight: typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight,
    };
  }, [mapHeight]);

  // Ambient orbs
  const ambientOrbLeft = React.createElement('div', {
    className: 'asj-plant-map__glow-orb asj-plant-map__glow-orb--left',
    'aria-hidden': true,
  });

  const ambientOrbRight = React.createElement('div', {
    className: 'asj-plant-map__glow-orb asj-plant-map__glow-orb--right',
    'aria-hidden': true,
  });

  // Section Header
  const headerBadgeElement = React.createElement(
    'div',
    { className: 'asj-plant-map__badge' },
    React.createElement(MapPin, { size: 14, 'aria-hidden': true }),
    React.createElement('span', null, currentTranslations.map.sectionBadge)
  );

  const headerTitleElement = React.createElement(
    'h2',
    { id: 'plant-map-title', className: 'asj-plant-map__title' },
    currentTranslations.map.sectionTitle
  );

  const headerSubtitleElement = React.createElement(
    'p',
    { className: 'asj-plant-map__subtitle' },
    currentTranslations.map.sectionSubtitle
  );

  const headerElement = React.createElement(
    'header',
    { className: 'asj-plant-map__header' },
    headerBadgeElement,
    headerTitleElement,
    headerSubtitleElement
  );

  // Column 1: Embed Wrapper & Pin Overlay
  const pinOverlayElement = showPinOverlay
    ? React.createElement(
        'div',
        { className: 'asj-plant-map__pin-overlay' },
        React.createElement(
          'div',
          { className: 'asj-plant-map__pin-icon-wrap' },
          React.createElement('div', { className: 'asj-plant-map__pin-pulse' }),
          React.createElement(MapPin, { size: 20, 'aria-hidden': true })
        ),
        React.createElement(
          'div',
          { className: 'asj-plant-map__pin-details' },
          React.createElement(
            'span',
            { className: 'asj-plant-map__pin-title' },
            currentTranslations.map.plantTitle
          ),
          React.createElement(
            'span',
            { className: 'asj-plant-map__pin-subtitle' },
            React.createElement('span', { className: 'asj-plant-map__pin-dot' }),
            isHindi ? 'सरसर मुख्य प्लांट (सिवान)' : 'Sarsar Central Plant, Siwan'
          )
        )
      )
    : null;

  const iframeElement = React.createElement('iframe', {
    title: currentTranslations.map.plantTitle,
    'aria-label': currentTranslations.map.plantTitle,
    src: embedIframeUrl,
    className: 'asj-plant-map__iframe',
    loading: 'lazy',
    referrerPolicy: 'no-referrer-when-downgrade',
    allowFullScreen: true,
  });

  const embedWrapperElement = React.createElement(
    'div',
    {
      className: 'asj-plant-map__embed-wrapper',
      style: iframeCustomStyle,
    },
    pinOverlayElement,
    iframeElement
  );

  // Column 2: Information Card
  const cardTitleRowElement = React.createElement(
    'div',
    { className: 'asj-plant-map__card-title-row' },
    React.createElement(
      'h3',
      { className: 'asj-plant-map__card-title' },
      currentTranslations.map.plantTitle
    ),
    React.createElement(
      'div',
      { className: 'asj-plant-map__status-pill' },
      React.createElement('span', { className: 'asj-plant-map__status-dot' }),
      React.createElement('span', null, isHindi ? 'प्रतिदिन खुला है' : 'Open Daily')
    )
  );

  const cardHeaderElement = React.createElement(
    'div',
    { className: 'asj-plant-map__card-header' },
    cardTitleRowElement,
    React.createElement(
      'p',
      { className: 'asj-plant-map__card-tagline' },
      currentTranslations.brand.tagline
    )
  );

  // Address Detail
  const addressItemElement = React.createElement(
    'div',
    { className: 'asj-plant-map__detail-item' },
    React.createElement(
      'div',
      { className: 'asj-plant-map__detail-icon-wrap' },
      React.createElement(MapPin, { size: 20, 'aria-hidden': true })
    ),
    React.createElement(
      'div',
      { className: 'asj-plant-map__detail-content' },
      React.createElement(
        'span',
        { className: 'asj-plant-map__detail-label' },
        isHindi ? 'प्लांट का पूरा पता' : 'Plant Address'
      ),
      React.createElement(
        'address',
        { className: 'asj-plant-map__detail-value' },
        currentTranslations.map.plantAddress
      ),
      React.createElement(
        'span',
        { className: 'asj-plant-map__detail-subtext' },
        isHindi
          ? 'पिनकोड: 841226 | जिला: सिवान (बिहार)'
          : 'Pincode: 841226 | District: Siwan (Bihar)'
      )
    )
  );

  // Operating Hours Detail
  const hoursItemElement = showOperatingHours
    ? React.createElement(
        'div',
        { className: 'asj-plant-map__detail-item' },
        React.createElement(
          'div',
          { className: 'asj-plant-map__detail-icon-wrap' },
          React.createElement(Clock, { size: 20, 'aria-hidden': true })
        ),
        React.createElement(
          'div',
          { className: 'asj-plant-map__detail-content' },
          React.createElement(
            'span',
            { className: 'asj-plant-map__detail-label' },
            currentTranslations.map.openingHoursTitle
          ),
          React.createElement(
            'p',
            { className: 'asj-plant-map__detail-value' },
            currentTranslations.map.openingHours
          ),
          React.createElement(
            'span',
            { className: 'asj-plant-map__detail-subtext' },
            isHindi
              ? 'प्रातः 6 बजे से रात्रि 8 बजे तक (सोमवार - रविवार)'
              : 'Daily 6:00 AM – 8:00 PM (Monday – Sunday)'
          )
        )
      )
    : null;

  // Phone Detail
  const phoneItemElement = React.createElement(
    'div',
    { className: 'asj-plant-map__detail-item' },
    React.createElement(
      'div',
      { className: 'asj-plant-map__detail-icon-wrap' },
      React.createElement(Phone, { size: 20, 'aria-hidden': true })
    ),
    React.createElement(
      'div',
      { className: 'asj-plant-map__detail-content' },
      React.createElement(
        'span',
        { className: 'asj-plant-map__detail-label' },
        isHindi ? 'हेल्पलाइन व संपर्क' : 'Helpline & Contact'
      ),
      React.createElement(
        'p',
        { className: 'asj-plant-map__detail-value' },
        currentTranslations.brand.hotline
      ),
      React.createElement(
        'span',
        { className: 'asj-plant-map__detail-subtext' },
        isHindi
          ? 'त्वरित डिलीवरी व प्लांट पूछताछ हेतु'
          : 'For urgent deliveries and plant pickup queries'
      )
    )
  );

  const detailsListElement = React.createElement(
    'div',
    { className: 'asj-plant-map__details-list' },
    addressItemElement,
    hoursItemElement,
    phoneItemElement
  );

  // Features Strip
  const featuresStripElement = React.createElement(
    'div',
    { className: 'asj-plant-map__features-strip' },
    plantFeatures.map((featureItem) => {
      let featureIconElement: JSX.Element;
      if (featureItem.iconType === 'shield') {
        featureIconElement = React.createElement(ShieldCheck, { size: 14, 'aria-hidden': true });
      } else if (featureItem.iconType === 'sparkles') {
        featureIconElement = React.createElement(Sparkles, { size: 14, 'aria-hidden': true });
      } else {
        featureIconElement = React.createElement(Truck, { size: 14, 'aria-hidden': true });
      }

      return React.createElement(
        'div',
        { key: featureItem.featureKey, className: 'asj-plant-map__feature-card' },
        React.createElement(
          'div',
          { className: 'asj-plant-map__feature-header' },
          featureIconElement,
          React.createElement('span', null, featureItem.title)
        ),
        React.createElement(
          'p',
          { className: 'asj-plant-map__feature-desc' },
          featureItem.description
        )
      );
    })
  );

  // Actions
  const actionsElement = showContactButtons
    ? React.createElement(
        'div',
        { className: 'asj-plant-map__actions' },
        React.createElement(
          'a',
          {
            href: directionsUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: handleDirectionsClick,
            className: 'asj-plant-map__btn asj-plant-map__btn--primary',
          },
          React.createElement(Navigation, { size: 16, 'aria-hidden': true }),
          React.createElement('span', null, currentTranslations.map.getDirectionsBtn),
          React.createElement(ExternalLink, { size: 14, 'aria-hidden': true })
        ),
        React.createElement(
          'a',
          {
            href: `tel:${telephoneNumber}`,
            onClick: handleCallClick,
            className: 'asj-plant-map__btn asj-plant-map__btn--secondary',
          },
          React.createElement(Phone, { size: 16, 'aria-hidden': true }),
          React.createElement('span', null, currentTranslations.map.callPlantBtn)
        ),
        React.createElement(
          'a',
          {
            href: whatsappInquiryUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            onClick: handleWhatsAppClick,
            className: 'asj-plant-map__btn asj-plant-map__btn--whatsapp',
          },
          React.createElement(MessageCircle, { size: 16, 'aria-hidden': true }),
          React.createElement('span', null, 'WhatsApp')
        )
      )
    : null;

  const cardElement = showAddressCard
    ? React.createElement(
        'div',
        { className: 'asj-plant-map__card' },
        cardHeaderElement,
        detailsListElement,
        featuresStripElement,
        actionsElement
      )
    : null;

  const gridElement = React.createElement(
    'div',
    { className: 'asj-plant-map__grid' },
    embedWrapperElement,
    cardElement
  );

  return React.createElement(
    'section',
    {
      id: 'plant-location',
      role: 'region',
      'aria-labelledby': 'plant-map-title',
      className: sectionClasses,
    },
    React.createElement('style', null, plantMapStyles),
    ambientOrbLeft,
    ambientOrbRight,
    React.createElement(
      'div',
      { className: 'asj-plant-map__container' },
      headerElement,
      gridElement
    )
  );
}

export default PlantMapEmbed;
