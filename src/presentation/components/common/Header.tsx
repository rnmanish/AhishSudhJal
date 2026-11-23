'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Droplet,
  Globe,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { useLanguage } from '../../i18n/useLanguage';

export interface HeaderProps {
  readonly className?: string;
  readonly activeSection?: string;
}

interface NavItem {
  readonly href: string;
  readonly label: string;
}

const headerStyles = `
  /* ==========================================================================
   * 1. Header Container & Glassmorphic Surface
   * ========================================================================== */
  .asj-header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: var(--z-sticky, 100);
    background-color: rgba(5, 19, 41, 0.85);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    transition: background-color var(--transition-base, 250ms ease),
                box-shadow var(--transition-base, 250ms ease),
                border-color var(--transition-base, 250ms ease);
  }

  .asj-header--scrolled {
    background-color: rgba(3, 12, 26, 0.95);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55),
                0 0 16px rgba(14, 165, 233, 0.15);
    border-bottom-color: var(--color-border-medium, rgba(56, 189, 248, 0.28));
  }

  /* Keyboard Accessibility Skip Link */
  .asj-skip-link {
    position: absolute;
    top: -120px;
    left: 1rem;
    padding: 0.625rem 1.25rem;
    background: linear-gradient(135deg, var(--color-primary-600, #0ea5e9) 0%, var(--color-accent-cyan, #06b6d4) 100%);
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
    border-radius: var(--radius-md, 12px);
    z-index: var(--z-toast, 1000);
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
    transition: top var(--transition-fast, 150ms ease);
  }

  .asj-skip-link:focus {
    top: 1rem;
    outline: 2px solid var(--color-primary-400, #7dd3fc);
    outline-offset: 2px;
  }

  .asj-header__container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    min-height: 64px;
  }

  /* ==========================================================================
   * 2. Brand Identity & Logo
   * ========================================================================== */
  .asj-header__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    color: var(--color-text-primary, #f8fafc);
    flex-shrink: 0;
    min-height: var(--touch-target-min, 44px);
  }

  .asj-header__brand:hover {
    text-decoration: none;
  }

  .asj-header__logo-icon {
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md, 12px);
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary-400, #7dd3fc);
    box-shadow: 0 0 12px rgba(14, 165, 233, 0.2);
    transition: transform var(--transition-fast, 150ms ease),
                box-shadow var(--transition-fast, 150ms ease);
  }

  .asj-header__brand:hover .asj-header__logo-icon {
    transform: scale(1.05);
    color: var(--color-accent-aqua, #00e5ff);
    box-shadow: 0 0 16px rgba(0, 229, 255, 0.35);
  }

  .asj-icon-droplet {
    filter: drop-shadow(0 2px 4px rgba(14, 165, 233, 0.4));
  }

  .asj-header__brand-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
  }

  .asj-header__brand-title {
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold, 700);
    letter-spacing: -0.015em;
    color: var(--color-text-primary, #f8fafc);
    background: linear-gradient(135deg, #ffffff 0%, var(--color-primary-200, #e0f2fe) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .asj-header__brand-subtitle {
    font-size: 0.6875rem;
    color: var(--color-primary-400, #7dd3fc);
    font-weight: var(--font-weight-medium, 500);
    letter-spacing: 0.02em;
  }

  /* ==========================================================================
   * 3. Desktop Navigation
   * ========================================================================== */
  .asj-header__nav-desktop {
    display: none;
  }

  @media (min-width: 1024px) {
    .asj-header__nav-desktop {
      display: flex;
      align-items: center;
    }
  }

  .asj-header__nav-list {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .asj-header__nav-item {
    display: inline-flex;
  }

  .asj-header__nav-link {
    display: inline-flex;
    align-items: center;
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.9375rem;
    font-weight: var(--font-weight-medium, 500);
    text-decoration: none;
    padding: 0.5rem 0.25rem;
    position: relative;
    transition: color var(--transition-fast, 150ms ease);
    min-height: var(--touch-target-min, 44px);
  }

  .asj-header__nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary-500, #38bdf8), var(--color-accent-cyan, #06b6d4));
    border-radius: var(--radius-full, 9999px);
    transition: width var(--transition-fast, 150ms ease);
  }

  .asj-header__nav-link:hover {
    color: var(--color-primary-300, #bae6fd);
    text-decoration: none;
  }

  .asj-header__nav-link:hover::after,
  .asj-header__nav-link--active::after {
    width: 100%;
  }

  .asj-header__nav-link--active {
    color: var(--color-text-accent, #38bdf8);
    font-weight: var(--font-weight-semibold, 600);
  }

  /* ==========================================================================
   * 4. Actions Group (Language, Hotline, WhatsApp, Menu)
   * ========================================================================== */
  .asj-header__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .asj-header__actions {
      gap: 0.625rem;
    }
  }

  /* Language Toggle Pill */
  .asj-header__lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.3125rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.3125rem 0.625rem;
    border-radius: var(--radius-full, 9999px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    color: var(--color-text-primary, #f8fafc);
    cursor: pointer;
    font-size: var(--font-size-xs, 0.75rem);
    font-family: inherit;
    backdrop-filter: blur(var(--glass-blur-sm, 6px));
    -webkit-backdrop-filter: blur(var(--glass-blur-sm, 6px));
    transition: background-color var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease),
                transform var(--transition-fast, 150ms ease);
  }

  .asj-header__lang-toggle:hover {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.65));
    border-color: var(--color-border-strong, rgba(56, 189, 248, 0.48));
    transform: translateY(-1px);
  }

  .asj-icon-globe {
    color: var(--color-primary-400, #7dd3fc);
    flex-shrink: 0;
  }

  .asj-header__lang-option {
    font-weight: var(--font-weight-regular, 400);
    color: var(--color-text-muted, #94a3b8);
    padding: 0.125rem 0.25rem;
    border-radius: var(--radius-xs, 4px);
    transition: color var(--transition-fast, 150ms ease),
                background-color var(--transition-fast, 150ms ease);
  }

  .asj-header__lang-option--active {
    color: var(--color-text-primary, #f8fafc);
    background-color: rgba(14, 165, 233, 0.28);
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-header__lang-divider {
    color: var(--color-text-muted, #94a3b8);
    font-size: 0.6875rem;
    opacity: 0.6;
  }

  /* Hotline Button */
  .asj-header__btn-hotline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4375rem;
    min-height: var(--touch-target-min, 44px);
    min-width: var(--touch-target-min, 44px);
    padding: 0.5rem 0.875rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    color: var(--color-primary-300, #bae6fd);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
    text-decoration: none;
    backdrop-filter: blur(var(--glass-blur-sm, 6px));
    -webkit-backdrop-filter: blur(var(--glass-blur-sm, 6px));
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-header__btn-hotline:hover {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.65));
    color: var(--color-text-primary, #f8fafc);
    border-color: var(--color-primary-400, #7dd3fc);
    transform: translateY(-1px);
    text-decoration: none;
  }

  .asj-header__hotline-text {
    display: none;
  }

  @media (min-width: 1200px) {
    .asj-header__hotline-text {
      display: inline;
    }
  }

  .asj-icon-phone {
    color: var(--color-primary-400, #7dd3fc);
    flex-shrink: 0;
  }

  /* WhatsApp Instant CTA Button */
  .asj-header__btn-whatsapp {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4375rem;
    min-height: var(--touch-target-min, 44px);
    min-width: var(--touch-target-min, 44px);
    padding: 0.5rem 0.875rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-whatsapp-primary, #25d366);
    color: var(--color-whatsapp-contrast-text, #03140a);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
    transition: background-color var(--transition-fast, 150ms ease),
                transform var(--transition-fast, 150ms ease),
                box-shadow var(--transition-fast, 150ms ease);
  }

  .asj-header__btn-whatsapp:hover {
    background-color: var(--color-whatsapp-hover, #1ebd5b);
    color: var(--color-whatsapp-contrast-text, #03140a);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
    transform: translateY(-1px);
    text-decoration: none;
  }

  .asj-header__whatsapp-text {
    display: none;
  }

  @media (min-width: 640px) {
    .asj-header__whatsapp-text {
      display: inline;
    }
  }

  .asj-icon-whatsapp {
    color: var(--color-whatsapp-contrast-text, #03140a);
    flex-shrink: 0;
  }

  /* Mobile Menu Toggle Button */
  .asj-header__menu-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--touch-target-min, 44px);
    min-width: var(--touch-target-min, 44px);
    padding: 0.5rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    color: var(--color-text-primary, #f8fafc);
    cursor: pointer;
    transition: background-color var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease);
  }

  @media (min-width: 1024px) {
    .asj-header__menu-button {
      display: none;
    }
  }

  .asj-header__menu-button:hover {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.65));
    border-color: var(--color-primary-400, #7dd3fc);
  }

  /* ==========================================================================
   * 5. Mobile Navigation Drawer
   * ========================================================================== */
  .asj-header__mobile-drawer {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(3, 12, 26, 0.98);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-top: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    padding: 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
    z-index: var(--z-drawer, 200);
    animation: asj-fade-in 200ms ease;
  }

  @keyframes asj-fade-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 1024px) {
    .asj-header__mobile-drawer {
      display: none;
    }
  }

  .asj-header__mobile-nav {
    width: 100%;
  }

  .asj-header__mobile-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .asj-header__mobile-item {
    width: 100%;
  }

  .asj-header__mobile-link {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--touch-target-min, 44px);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md, 12px);
    background-color: var(--color-bg-subtle, rgba(56, 189, 248, 0.08));
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    color: var(--color-text-primary, #f8fafc);
    font-size: var(--font-size-base, 1rem);
    font-weight: var(--font-weight-medium, 500);
    text-decoration: none;
    transition: background-color var(--transition-fast, 150ms ease),
                border-color var(--transition-fast, 150ms ease);
  }

  .asj-header__mobile-link:hover,
  .asj-header__mobile-link:active {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.65));
    border-color: var(--color-primary-400, #7dd3fc);
    color: var(--color-primary-300, #bae6fd);
    text-decoration: none;
  }

  .asj-header__mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    padding-top: 0.5rem;
  }

  .asj-header__mobile-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    width: 100%;
    min-height: var(--touch-target-min, 44px);
    padding: 0.875rem 1.25rem;
    border-radius: var(--radius-md, 12px);
    font-size: var(--font-size-base, 1rem);
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-header__mobile-cta--call {
    background-color: var(--color-bg-card, rgba(13, 59, 102, 0.45));
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    color: var(--color-primary-300, #bae6fd);
  }

  .asj-header__mobile-cta--call:hover {
    background-color: var(--color-bg-card-hover, rgba(13, 59, 102, 0.65));
    border-color: var(--color-primary-400, #7dd3fc);
    color: #ffffff;
    text-decoration: none;
  }

  .asj-header__mobile-cta--whatsapp {
    background-color: var(--color-whatsapp-primary, #25d366);
    color: var(--color-whatsapp-contrast-text, #03140a);
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
  }

  .asj-header__mobile-cta--whatsapp:hover {
    background-color: var(--color-whatsapp-hover, #1ebd5b);
    color: var(--color-whatsapp-contrast-text, #03140a);
    text-decoration: none;
  }

  .asj-header__mobile-footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    text-align: center;
  }

  .asj-header__mobile-location {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-muted, #94a3b8);
    line-height: var(--line-height-normal, 1.5);
  }

  /* ==========================================================================
   * 6. High-Contrast & Focus Visibility (WCAG 2.1 AA)
   * ========================================================================== */
  .asj-header a:focus-visible,
  .asj-header button:focus-visible {
    outline: 2px solid var(--color-primary-400, #7dd3fc);
    outline-offset: 2px;
  }
`;

/**
 * Header component for Ashish Sudh Jal.
 * Clean Architecture Layer 4 (Presentation Component).
 * Features:
 * - Brand logo with water purity icon and plant location
 * - Smooth scroll navigation anchors
 * - Direct hotline calling CTA (+91 82358 82384)
 * - Instant WhatsApp order CTA with pre-formatted bilingual message
 * - Instant language toggle pill (🌐 हिन्दी / EN)
 * - Sticky on scroll with glassmorphic elevation
 * - Responsive navigation drawer (360px - 1920px)
 * - Full WCAG 2.1 AA accessibility (min 44px touch targets, skip links, aria attributes)
 */
export function Header({
  className: customClassName,
  activeSection,
}: HeaderProps): JSX.Element {
  const { language, isHindi, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Synchronize scroll state for sticky elevation
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    function handleScrollEvent(): void {
      const scrolled = window.scrollY > 12;
      setIsScrolled((previousState) =>
        previousState !== scrolled ? scrolled : previousState
      );
    }

    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    handleScrollEvent();

    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    if (!isMenuOpen || typeof window === 'undefined') {
      return;
    }

    function handleKeyDownEvent(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDownEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = useCallback((): void => {
    setIsMenuOpen((previousState) => !previousState);
  }, []);

  const handleCloseMenu = useCallback((): void => {
    setIsMenuOpen(false);
  }, []);

  const navItems: readonly NavItem[] = [
    { href: '#products', label: t.nav.products },
    { href: '#tds-checker', label: t.nav.tdsChecker },
    { href: '#booking', label: t.nav.booking },
    { href: '#coverage', label: t.nav.coverage },
  ];

  const whatsappOrderMessage = isHindi
    ? 'नमस्ते आशीष शुद्ध जल, मुझे शुद्ध 20L आरओ पानी जार का नया ऑर्डर देना है।'
    : 'Hello Ashish Sudh Jal, I would like to order a 20L pure RO water jar.';

  const whatsappUrl = `https://wa.me/918235882384?text=${encodeURIComponent(whatsappOrderMessage)}`;
  const hotlineUrl = `tel:+918235882384`;

  const headerClassNames = [
    'asj-header',
    isScrolled ? 'asj-header--scrolled' : '',
    customClassName ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // Brand Logo element
      const brandLogoElement = React.createElement(
      'a',
      {
        href: '#top',
      className: 'asj-header__brand',
      onClick: handleCloseMenu,
      'aria-label': `${t.brand.name} - ${t.brand.plantAddress}`,
    },
      React.createElement(
      'div',
      {className: 'asj-header__logo-icon', 'aria-hidden': true },
      React.createElement(Droplet, {className: 'asj-icon-droplet', size: 24 })
      ),
      React.createElement(
      'div',
      {className: 'asj-header__brand-text' },
      React.createElement('span', {className: 'asj-header__brand-title' }, t.brand.name),
      React.createElement(
      'span',
      {className: 'asj-header__brand-subtitle' },
      isHindi ? 'सरसर, सिवान (बिहार)' : 'Sarsar, Siwan (Bihar)'
      )
      )
      );

  // Desktop Navigation element
        const desktopNavElement = React.createElement(
        'nav',
        {
          className: 'asj-header__nav-desktop',
        'aria-label': isHindi ? 'मुख्य नेविगेशन' : 'Main Navigation',
    },
        React.createElement(
        'ul',
        {className: 'asj-header__nav-list' },
      navItems.map((navItem) => {
        const isActive = activeSection === navItem.href.replace('#', '');
        return React.createElement(
        'li',
        {key: navItem.href, className: 'asj-header__nav-item' },
        React.createElement(
        'a',
        {
          href: navItem.href,
        className: `asj-header__nav-link ${isActive ? 'asj-header__nav-link--active' : ''}`,
        'aria-current': isActive ? 'page' : undefined,
            },
        navItem.label
        )
        );
      })
        )
        );

  // Language Toggle element
        const languageToggleElement = React.createElement(
        'button',
        {
          type: 'button',
        onClick: toggleLanguage,
        className: 'asj-header__lang-toggle',
        'aria-label': t.nav.toggleLanguageAria,
        title: t.nav.toggleLanguageAria,
    },
        React.createElement(Globe, {
          size: 18,
        'aria-hidden': true,
        className: 'asj-icon-globe',
    }),
        React.createElement(
        'span',
        {
          className: `asj-header__lang-option ${
          language === 'hi' ? 'asj-header__lang-option--active' : ''
        }`,
      },
        'हिन्दी'
        ),
        React.createElement(
        'span',
        {className: 'asj-header__lang-divider', 'aria-hidden': true },
        '/'
        ),
        React.createElement(
        'span',
        {
          className: `asj-header__lang-option ${
          language === 'en' ? 'asj-header__lang-option--active' : ''
        }`,
      },
        'EN'
        )
        );

  // Hotline button element
          const hotlineElement = React.createElement(
          'a',
          {
            href: hotlineUrl,
          className: 'asj-header__btn-hotline',
          'aria-label': `${t.nav.callNow}: ${t.brand.hotline}`,
          title: `${t.nav.callNow}: ${t.brand.hotline}`,
    },
          React.createElement(Phone, {
            size: 18,
          'aria-hidden': true,
          className: 'asj-icon-phone',
    }),
          React.createElement(
          'span',
          {className: 'asj-header__hotline-text' },
          t.brand.hotline
          )
          );

  // WhatsApp order button element
          const whatsappElement = React.createElement(
          'a',
          {
            href: whatsappUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'asj-header__btn-whatsapp',
          'aria-label': t.nav.whatsappOrder,
          title: t.nav.whatsappOrder,
    },
          React.createElement(MessageCircle, {
            size: 18,
          'aria-hidden': true,
          className: 'asj-icon-whatsapp',
    }),
          React.createElement(
          'span',
          {className: 'asj-header__whatsapp-text' },
          t.nav.whatsappOrder
          )
          );

  // Mobile menu button element
          const menuButtonElement = React.createElement(
          'button',
          {
            type: 'button',
          onClick: handleMenuToggle,
          className: 'asj-header__menu-button',
          'aria-label': isMenuOpen
          ? isHindi
          ? 'मेन्यू बंद करें'
          : 'Close menu'
          : isHindi
          ? 'मेन्यू खोलें'
          : 'Open menu',
          'aria-expanded': isMenuOpen,
          'aria-controls': 'asj-mobile-menu',
    },
          isMenuOpen
          ? React.createElement(X, {size: 24, 'aria-hidden': true })
          : React.createElement(Menu, {size: 24, 'aria-hidden': true })
          );

  // Actions group element
      const actionsGroupElement = React.createElement(
      'div',
      {className: 'asj-header__actions' },
      languageToggleElement,
      hotlineElement,
      whatsappElement,
      menuButtonElement
      );

  // Header container
          const headerContainerElement = React.createElement(
          'div',
          {className: 'asj-header__container' },
          brandLogoElement,
          desktopNavElement,
          actionsGroupElement
          );

  // Mobile Drawer element
            const mobileDrawerElement = isMenuOpen
            ? React.createElement(
            'div',
            {
              id: 'asj-mobile-menu',
            className: 'asj-header__mobile-drawer',
            role: 'dialog',
            'aria-modal': true,
            'aria-label': isHindi ? 'मोबाइल मेन्यू' : 'Mobile Navigation',
        },
            React.createElement(
            'nav',
            {
              className: 'asj-header__mobile-nav',
            'aria-label': isHindi ? 'मोबाइल नेविगेशन' : 'Mobile Navigation',
          },
            React.createElement(
            'ul',
            {className: 'asj-header__mobile-list' },
            navItems.map((navItem) =>
            React.createElement(
            'li',
            {key: navItem.href, className: 'asj-header__mobile-item' },
            React.createElement(
            'a',
            {
              href: navItem.href,
            className: 'asj-header__mobile-link',
            onClick: handleCloseMenu,
                  },
            navItem.label
            )
            )
            )
            )
            ),
            React.createElement(
            'div',
            {className: 'asj-header__mobile-actions' },
            React.createElement(
            'a',
            {
              href: hotlineUrl,
            className: 'asj-header__mobile-cta asj-header__mobile-cta--call',
            onClick: handleCloseMenu,
            },
            React.createElement(Phone, {size: 20, 'aria-hidden': true }),
            React.createElement(
            'span',
            null,
            `${t.nav.callNow}: ${t.brand.hotline}`
            )
            ),
            React.createElement(
            'a',
            {
              href: whatsappUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'asj-header__mobile-cta asj-header__mobile-cta--whatsapp',
            onClick: handleCloseMenu,
            },
            React.createElement(MessageCircle, {size: 20, 'aria-hidden': true }),
            React.createElement('span', null, t.nav.whatsappOrder)
            )
            ),
            React.createElement(
            'div',
            {className: 'asj-header__mobile-footer' },
            React.createElement(
            'p',
            {className: 'asj-header__mobile-location' },
            `📍 ${t.brand.plantAddress}`
            )
            )
            )
            : null;

  return React.createElement(
      'header',
      { role: 'banner', className: headerClassNames },
      React.createElement(
        'a',
        { href: '#main-content', className: 'asj-skip-link' },
        isHindi ? 'सीधे मुख्य सामग्री पर जाएं' : 'Skip to main content'
      ),
      headerContainerElement,
      mobileDrawerElement,
      React.createElement('style', null, headerStyles)
    );
}
