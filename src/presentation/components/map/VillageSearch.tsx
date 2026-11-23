'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Truck,
  X,
} from 'lucide-react';
import type { VillageCoverage } from '../../../core/domain/entities/VillageCoverage';
import { useVillageChecker } from '../../hooks/useVillageChecker';
import { useLanguage } from '../../i18n/useLanguage';

export interface VillageSearchProps {
  readonly className?: string;
  readonly onVillageSelect?: (selectedVillage: VillageCoverage) => void;
  readonly showPlantInfo?: boolean;
  readonly showTopVillages?: boolean;
  readonly initialQuery?: string;
}

const villageSearchStyles = `
  /* ==========================================================================
   * 1. Village Serviceability Search Widget Container
   * ========================================================================== */
  .asj-village-search {
    position: relative;
    width: 100%;
    background: radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08) 0%, rgba(3, 12, 26, 0.98) 75%),
                linear-gradient(180deg, #030c1a 0%, #051329 100%);
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    padding: 3.5rem 1rem 4rem;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .asj-village-search {
      padding: 4.5rem 1.5rem 5rem;
    }
  }

  .asj-village-search__container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* ==========================================================================
   * 2. Header & Section Badges
   * ========================================================================== */
  .asj-village-search__header {
    text-align: center;
    max-width: 680px;
    margin: 0 auto;
  }

  .asj-village-search__badge {
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

  .asj-village-search__title {
    font-size: var(--font-size-2xl, 1.5rem);
    font-weight: var(--font-weight-bold, 700);
    line-height: var(--line-height-tight, 1.25);
    color: var(--color-text-primary, #f8fafc);
    margin-bottom: 0.75rem;
    letter-spacing: -0.02em;
  }

  @media (min-width: 768px) {
    .asj-village-search__title {
      font-size: var(--font-size-3xl, 1.875rem);
    }
  }

  .asj-village-search__subtitle {
    font-size: var(--font-size-sm, 0.875rem);
    line-height: var(--line-height-relaxed, 1.6);
    color: var(--color-text-secondary, #94a3b8);
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .asj-village-search__subtitle {
      font-size: var(--font-size-base, 1rem);
    }
  }

  /* ==========================================================================
   * 3. Search Form & Autocomplete Surface
   * ========================================================================== */
  
  .asj-village-search__box-card {
    position: relative;
    background: var(--color-surface-card, rgba(15, 23, 42, 0.75));
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.2));
    border-radius: var(--radius-xl, 20px);
    padding: 1.25rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  @media (min-width: 768px) {
    .asj-village-search__box-card {
      padding: 1.75rem;
    }
  }

  .asj-village-search__form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
  }

  @media (min-width: 640px) {
    .asj-village-search__form {
      flex-direction: row;
      align-items: center;
    }
  }

  .asj-village-search__input-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .asj-village-search__icon {
    position: absolute;
    left: 1rem;
    color: var(--color-primary-400, #38bdf8);
    pointer-events: none;
    flex-shrink: 0;
  }

  .asj-village-search__input {
    width: 100%;
    min-height: 48px;
    padding: 0.75rem 2.75rem 0.75rem 2.875rem;
    background-color: rgba(3, 12, 26, 0.85);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.28));
    border-radius: var(--radius-lg, 14px);
    color: var(--color-text-primary, #f8fafc);
    font-size: var(--font-size-base, 1rem);
    font-family: inherit;
    outline: none;
    transition: border-color var(--transition-fast, 150ms ease),
                box-shadow var(--transition-fast, 150ms ease);
  }

  .asj-village-search__input:focus {
    border-color: var(--color-primary-400, #38bdf8);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.25);
  }

  .asj-village-search__input::placeholder {
    color: var(--color-text-muted, #64748b);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .asj-village-search__clear-btn {
    position: absolute;
    right: 0.75rem;
    min-width: 36px;
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--color-text-muted, #64748b);
    border-radius: var(--radius-full, 9999px);
    cursor: pointer;
    transition: color var(--transition-fast, 150ms ease),
                background-color var(--transition-fast, 150ms ease);
  }

  .asj-village-search__clear-btn:hover {
    color: var(--color-text-primary, #f8fafc);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .asj-village-search__submit-btn {
    min-height: 48px;
    min-width: 110px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--color-primary-600, #0284c7) 0%, var(--color-accent-cyan, #06b6d4) 100%);
    border: none;
    border-radius: var(--radius-lg, 14px);
    color: #ffffff;
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-bold, 700);
    cursor: pointer;
    transition: transform var(--transition-fast, 150ms ease),
                box-shadow var(--transition-fast, 150ms ease),
                opacity var(--transition-fast, 150ms ease);
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
  }

  .asj-village-search__submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(14, 165, 233, 0.45);
  }

  .asj-village-search__submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .asj-village-search__submit-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Autocomplete Suggestions Overlay */
  .asj-village-search__suggestions {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    max-height: 240px;
    overflow-y: auto;
    background-color: rgba(3, 12, 26, 0.98);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.35));
    border-radius: var(--radius-lg, 14px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
    z-index: var(--z-dropdown, 50);
    list-style: none;
    padding: 0.375rem;
    margin: 0;
    backdrop-filter: blur(14px);
  }

  .asj-village-search__suggestion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius-md, 10px);
    cursor: pointer;
    transition: background-color var(--transition-fast, 150ms ease);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-village-search__suggestion-item:hover,
  .asj-village-search__suggestion-item:focus {
    background-color: rgba(14, 165, 233, 0.15);
    outline: none;
  }

  .asj-village-search__suggestion-names {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .asj-village-search__suggestion-pincode {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-muted, #64748b);
    padding: 0.125rem 0.375rem;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-sm, 6px);
  }

  .asj-village-search__suggestion-dist {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-primary-400, #38bdf8);
    font-weight: var(--font-weight-semibold, 600);
  }

  /* ==========================================================================
   * 4. Results Card (Serviceable vs Unserviceable)
   * ========================================================================== */
  .asj-village-search__result-card {
    border-radius: var(--radius-lg, 16px);
    padding: 1.5rem;
    margin-top: 1rem;
    transition: transform var(--transition-base, 250ms ease),
                border-color var(--transition-base, 250ms ease);
    border: 1px solid transparent;
  }

  .asj-village-search__result-card--serviceable {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(3, 12, 26, 0.85) 100%);
    border-color: rgba(16, 185, 129, 0.35);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
  }

  .asj-village-search__result-card--unserviceable {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(3, 12, 26, 0.85) 100%);
    border-color: rgba(245, 158, 11, 0.35);
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
  }

  .asj-village-search__result-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 0.75rem;
  }

  .asj-village-search__status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full, 9999px);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-bold, 700);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .asj-village-search__status-pill--serviceable {
    background-color: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.4);
  }

  .asj-village-search__status-pill--unserviceable {
    background-color: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.4);
  }

  .asj-village-search__result-name {
    font-size: var(--font-size-xl, 1.25rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .asj-village-search__result-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin: 1rem 0;
  }

  @media (min-width: 640px) {
    .asj-village-search__result-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .asj-village-search__detail-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: rgba(3, 12, 26, 0.6);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.15));
    border-radius: var(--radius-md, 12px);
  }

  .asj-village-search__detail-label {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #94a3b8);
  }

  .asj-village-search__detail-value {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-village-search__notice {
    font-size: var(--font-size-xs, 0.75rem);
    line-height: var(--line-height-relaxed, 1.6);
    color: var(--color-text-secondary, #94a3b8);
    margin-top: 0.75rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .asj-village-search__cta-row {
    margin-top: 1.25rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .asj-village-search__action-btn {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md, 12px);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    cursor: pointer;
    transition: transform var(--transition-fast, 150ms ease),
                background-color var(--transition-fast, 150ms ease);
  }

  .asj-village-search__action-btn--primary {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
  }

  .asj-village-search__action-btn--primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
  }

  .asj-village-search__action-btn--whatsapp {
    background-color: #25d366;
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
  }

  .asj-village-search__action-btn--whatsapp:hover {
    background-color: #1ebd5a;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(37, 211, 102, 0.45);
  }

  /* ==========================================================================
   * 5. Top 15 Villages Covered Chips
   * ========================================================================== */
  .asj-village-search__chips-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .asj-village-search__chips-heading {
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-secondary, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .asj-village-search__chips-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .asj-village-search__chip {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    background-color: rgba(15, 23, 42, 0.65);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    border-radius: var(--radius-full, 9999px);
    color: var(--color-text-primary, #f8fafc);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-village-search__chip:hover {
    background-color: rgba(14, 165, 233, 0.15);
    border-color: var(--color-primary-400, #38bdf8);
    transform: translateY(-1px);
  }

  .asj-village-search__chip--active {
    background-color: rgba(14, 165, 233, 0.25);
    border-color: var(--color-primary-400, #38bdf8);
    color: var(--color-primary-300, #7dd3fc);
  }

  .asj-village-search__chip-dist {
    color: var(--color-primary-400, #38bdf8);
    font-size: 0.6875rem;
    font-weight: var(--font-weight-semibold, 600);
  }

  .asj-village-search__chip-plant-badge {
    padding: 0.125rem 0.375rem;
    background-color: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.4);
    border-radius: var(--radius-full, 9999px);
    color: #34d399;
    font-size: 0.625rem;
    font-weight: var(--font-weight-bold, 700);
  }

  /* ==========================================================================
   * 6. Plant Location & Direct Directions Surface
   * ========================================================================== */
  .asj-village-search__plant-card {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(3, 12, 26, 0.85) 100%);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.25));
    border-radius: var(--radius-xl, 20px);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .asj-village-search__plant-card {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 1.75rem;
    }
  }

  .asj-village-search__plant-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .asj-village-search__plant-title {
    font-size: var(--font-size-base, 1rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .asj-village-search__plant-address {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #94a3b8);
    line-height: var(--line-height-relaxed, 1.6);
  }

  .asj-village-search__plant-hours {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-primary-400, #38bdf8);
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .asj-village-search__plant-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .asj-village-search__directions-btn {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.125rem;
    background-color: rgba(14, 165, 233, 0.15);
    border: 1px solid var(--color-border-medium, rgba(56, 189, 248, 0.35));
    border-radius: var(--radius-md, 12px);
    color: var(--color-primary-300, #7dd3fc);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-village-search__directions-btn:hover {
    background-color: rgba(14, 165, 233, 0.28);
    border-color: var(--color-primary-400, #38bdf8);
    color: #ffffff;
  }

  .asj-village-search__call-plant-btn {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.125rem;
    background: linear-gradient(135deg, var(--color-primary-600, #0284c7) 0%, var(--color-accent-cyan, #06b6d4) 100%);
    border: none;
    border-radius: var(--radius-md, 12px);
    color: #ffffff;
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: var(--font-weight-bold, 700);
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
    transition: transform var(--transition-fast, 150ms ease);
  }

  .asj-village-search__call-plant-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(14, 165, 233, 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    .asj-village-search__submit-btn,
    .asj-village-search__action-btn,
    .asj-village-search__chip,
    .asj-village-search__call-plant-btn {
      transition: none !important;
      transform: none !important;
    }
  }
`;

/**
 * Village Serviceability Search Widget (Layer 4 UI Component)
 * Provides real-time interactive search and serviceability verification
 * across rural villages in Siwan district, Bihar.
 */
export function VillageSearch({
  className,
  onVillageSelect,
  showPlantInfo = true,
  showTopVillages = true,
  initialQuery = '',
}: VillageSearchProps): JSX.Element {
  const { t, isHindi, language } = useLanguage();
  const searchInputId = useId();
  const [isDropdownFocused, setIsDropdownFocused] = useState<boolean>(false);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);

  // Accessible click-outside and Escape key listener to close autocomplete dropdown
  useEffect(() => {
    if (!isDropdownFocused || typeof document === 'undefined') {
      return;
    }

    function handleDocumentClick(clickEvent: MouseEvent): void {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(clickEvent.target as Node)
      ) {
        setIsDropdownFocused(false);
      }
    }

    function handleKeyDown(keyboardEvent: KeyboardEvent): void {
      if (keyboardEvent.key === 'Escape') {
        setIsDropdownFocused(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownFocused]);

  const {
    searchQuery,
    setSearchQuery,
    isChecking,
    result,
    isServiceable,
    matchedVillage,
    checkServiceability,
    reset,
    topVillages,
    suggestions,
    selectVillage,
    getWhatsAppInquiryUrl,
    statusMessage,
    deliverySla,
  } = useVillageChecker({ initialQuery });

  const handleInputChange = useCallback(
    (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(changeEvent.target.value);
    },
    [setSearchQuery]
  );

  const handleFormSubmit = useCallback(
    async (formEvent: React.FormEvent<HTMLFormElement>) => {
      formEvent.preventDefault();
      setIsDropdownFocused(false);
      const evalResult = await checkServiceability();
      if (evalResult.village && onVillageSelect) {
        onVillageSelect(evalResult.village);
      }
    },
    [checkServiceability, onVillageSelect]
  );

  const handleSelectSuggestion = useCallback(
    async (targetVillage: VillageCoverage) => {
      setIsDropdownFocused(false);
      const evalResult = await selectVillage(targetVillage);
      if (evalResult.village && onVillageSelect) {
        onVillageSelect(evalResult.village);
      }
    },
    [selectVillage, onVillageSelect]
  );

  const handleClear = useCallback(() => {
    reset();
    setIsDropdownFocused(false);
  }, [reset]);

  const activeVillageId = matchedVillage ? matchedVillage.getId() : '';

  const containerClasses = useMemo(() => {
    return ['asj-village-search', className].filter(Boolean).join(' ');
  }, [className]);

  // 1. Header Element
  const headerElement = React.createElement(
    'div',
    { className: 'asj-village-search__header' },
    React.createElement(
      'span',
      { className: 'asj-village-search__badge' },
      React.createElement(MapPin, { size: 14, 'aria-hidden': true }),
      t.villageChecker.sectionBadge
    ),
    React.createElement(
      'h2',
      { id: 'village-search-title', className: 'asj-village-search__title' },
      t.villageChecker.sectionTitle
    ),
    React.createElement(
      'p',
      { className: 'asj-village-search__subtitle' },
      t.villageChecker.sectionSubtitle
    )
  );

  // 2. Autocomplete Suggestions Dropdown
  const suggestionsDropdownElement =
    isDropdownFocused && suggestions.length > 0
      ? React.createElement(
          'ul',
          {
            className: 'asj-village-search__suggestions',
            role: 'listbox',
            'aria-label': 'Village search suggestions',
          },
          suggestions.map((suggestionVillage) => {
            const villageDisplayName = suggestionVillage.getName(
              isHindi ? 'hi' : 'en'
            );
            const secondaryName = suggestionVillage.getName(
              isHindi ? 'en' : 'hi'
            );

            return React.createElement(
              'li',
              {
                key: suggestionVillage.getId(),
                className: 'asj-village-search__suggestion-item',
                role: 'option',
                'aria-selected': suggestionVillage.getId() === activeVillageId,
                onMouseDown: () => handleSelectSuggestion(suggestionVillage),
              },
              React.createElement(
                'div',
                { className: 'asj-village-search__suggestion-names' },
                React.createElement(MapPin, { size: 14, 'aria-hidden': true }),
                React.createElement('span', null, villageDisplayName),
                React.createElement(
                  'span',
                  { className: 'asj-village-search__suggestion-pincode' },
                  `${secondaryName} (${suggestionVillage.getPincode()})`
                )
              ),
              React.createElement(
                'span',
                { className: 'asj-village-search__suggestion-dist' },
                `${suggestionVillage.getDistanceKm()} km`
              )
            );
          })
        )
      : null;

  // 3. Search Form Elements
  const inputWrapperElement = React.createElement(
    'div',
    { ref: searchWrapperRef, className: 'asj-village-search__input-wrapper' },
    React.createElement(Search, {
      className: 'asj-village-search__icon',
      size: 18,
      'aria-hidden': true,
    }),
    React.createElement('input', {
      id: searchInputId,
      type: 'text',
      className: 'asj-village-search__input',
      placeholder: t.villageChecker.searchPlaceholder,
      value: searchQuery,
      onChange: handleInputChange,
      onFocus: () => setIsDropdownFocused(true),
      autoComplete: 'off',
      'aria-label': t.villageChecker.searchPlaceholder,
    }),
    searchQuery.trim().length > 0
      ? React.createElement(
          'button',
          {
            type: 'button',
            className: 'asj-village-search__clear-btn',
            onClick: handleClear,
            'aria-label': 'Clear village search',
          },
          React.createElement(X, { size: 16, 'aria-hidden': true })
        )
      : null,
    suggestionsDropdownElement
  );

  const submitButtonElement = React.createElement(
    'button',
    {
      type: 'submit',
      disabled: isChecking,
      className: 'asj-village-search__submit-btn',
    },
    isChecking
      ? React.createElement('span', null, t.common.loading)
      : React.createElement(
          React.Fragment,
          null,
          React.createElement(Search, { size: 16, 'aria-hidden': true }),
          React.createElement('span', null, t.villageChecker.searchBtn)
        )
  );

  const formElement = React.createElement(
    'form',
    {
      className: 'asj-village-search__form',
      onSubmit: handleFormSubmit,
      role: 'search',
      'aria-label': t.villageChecker.sectionTitle,
    },
    inputWrapperElement,
    submitButtonElement
  );

  // 4. Result Card Element
  let resultCardElement: JSX.Element | null = null;
  if (result !== null) {
    if (isServiceable && matchedVillage) {
      resultCardElement = React.createElement(
        'div',
        {
          className:
            'asj-village-search__result-card asj-village-search__result-card--serviceable',
          role: 'status',
          'aria-live': 'polite',
        },
        React.createElement(
          'div',
          { className: 'asj-village-search__result-header' },
          React.createElement(
            'span',
            {
              className:
                'asj-village-search__status-pill asj-village-search__status-pill--serviceable',
            },
            React.createElement(CheckCircle2, { size: 14, 'aria-hidden': true }),
            t.villageChecker.serviceableBadge
          )
        ),
        React.createElement(
          'div',
          { className: 'asj-village-search__result-name' },
          React.createElement('span', null, matchedVillage.getName('hi')),
          React.createElement('span', null, '/'),
          React.createElement('span', null, matchedVillage.getName('en')),
          React.createElement(
            'span',
            { className: 'asj-village-search__suggestion-pincode' },
            `PIN: ${matchedVillage.getPincode()}`
          )
        ),
        React.createElement(
          'p',
          { className: 'asj-village-search__subtitle' },
          statusMessage
        ),
        React.createElement(
          'div',
          { className: 'asj-village-search__result-grid' },
          React.createElement(
            'div',
            { className: 'asj-village-search__detail-box' },
            React.createElement(MapPin, {
              size: 18,
              className: 'asj-village-search__suggestion-dist',
              'aria-hidden': true,
            }),
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'asj-village-search__detail-label' },
                t.villageChecker.plantDistanceLabel
              ),
              React.createElement(
                'div',
                { className: 'asj-village-search__detail-value' },
                `${matchedVillage.getDistanceKm()} km`
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'asj-village-search__detail-box' },
            React.createElement(Clock, {
              size: 18,
              className: 'asj-village-search__suggestion-dist',
              'aria-hidden': true,
            }),
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'asj-village-search__detail-label' },
                t.villageChecker.deliverySlaLabel
              ),
              React.createElement(
                'div',
                { className: 'asj-village-search__detail-value' },
                deliverySla ?? matchedVillage.getDeliverySla(language)
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'asj-village-search__notice' },
          React.createElement(Truck, { size: 14, 'aria-hidden': true }),
          React.createElement('span', null, t.villageChecker.freeDeliveryNotice)
        ),
        React.createElement(
          'div',
          { className: 'asj-village-search__cta-row' },
          React.createElement(
            'a',
            {
              href: '#booking',
              className:
                'asj-village-search__action-btn asj-village-search__action-btn--primary',
            },
            React.createElement(Truck, { size: 16, 'aria-hidden': true }),
            React.createElement('span', null, t.hero.orderCta)
          )
        )
      );
    } else {
      const isQueryEmpty = searchQuery.trim().length === 0;

      resultCardElement = React.createElement(
        'div',
        {
          className:
            'asj-village-search__result-card asj-village-search__result-card--unserviceable',
          role: 'status',
          'aria-live': 'polite',
        },
        !isQueryEmpty
          ? React.createElement(
              'div',
              { className: 'asj-village-search__result-header' },
              React.createElement(
                'span',
                {
                  className:
                    'asj-village-search__status-pill asj-village-search__status-pill--unserviceable',
                },
                React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
                t.villageChecker.unserviceableBadge
              )
            )
          : null,
        React.createElement(
          'p',
          { className: 'asj-village-search__subtitle' },
          statusMessage
        ),
        !isQueryEmpty
          ? React.createElement(
              'div',
              { className: 'asj-village-search__notice' },
              React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
              React.createElement(
                'span',
                null,
                t.villageChecker.unserviceableNotice
              )
            )
          : null,
        !isQueryEmpty
          ? React.createElement(
              'div',
              { className: 'asj-village-search__cta-row' },
              React.createElement(
                'a',
                {
                  href: getWhatsAppInquiryUrl(),
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className:
                    'asj-village-search__action-btn asj-village-search__action-btn--whatsapp',
                },
                React.createElement(MessageCircle, { size: 16, 'aria-hidden': true }),
                React.createElement(
                  'span',
                  null,
                  t.villageChecker.customVillageWhatsAppCta
                )
              )
            )
          : null
      );
    }
  }

  const searchBoxCardElement = React.createElement(
    'div',
    { className: 'asj-village-search__box-card' },
    formElement,
    resultCardElement
  );

  // 5. Top 15 Covered Villages Chips Section
  let chipsSectionElement: JSX.Element | null = null;
  if (showTopVillages && topVillages.length > 0) {
    chipsSectionElement = React.createElement(
      'div',
      { className: 'asj-village-search__chips-section' },
      React.createElement(
        'h3',
        { className: 'asj-village-search__chips-heading' },
        t.villageChecker.coveredVillagesHeading
      ),
      React.createElement(
        'div',
        { className: 'asj-village-search__chips-grid', role: 'group' },
        topVillages.map((villageItem) => {
          const isActive = villageItem.getId() === activeVillageId;
          const displayName = villageItem.getName(language);

          return React.createElement(
            'button',
            {
              key: villageItem.getId(),
              type: 'button',
              className: `asj-village-search__chip ${
                isActive ? 'asj-village-search__chip--active' : ''
              }`,
              onClick: () => handleSelectSuggestion(villageItem),
              'aria-label': `Check serviceability for ${displayName}`,
            },
            React.createElement('span', null, displayName),
            React.createElement(
              'span',
              { className: 'asj-village-search__chip-dist' },
              `${villageItem.getDistanceKm()} km`
            ),
            villageItem.isPlantLocation()
              ? React.createElement(
                  'span',
                  { className: 'asj-village-search__chip-plant-badge' },
                  isHindi ? 'प्लांट' : 'Plant'
                )
              : null
          );
        })
      )
    );
  }

  // 6. Sarsar Plant Location & Directions Card
  let plantCardElement: JSX.Element | null = null;
  if (showPlantInfo) {
    plantCardElement = React.createElement(
      'div',
      { className: 'asj-village-search__plant-card' },
      React.createElement(
        'div',
        { className: 'asj-village-search__plant-details' },
        React.createElement(
          'div',
          { className: 'asj-village-search__plant-title' },
          React.createElement(Navigation, { size: 18, 'aria-hidden': true }),
          React.createElement('span', null, t.map.plantTitle)
        ),
        React.createElement(
          'div',
          { className: 'asj-village-search__plant-address' },
          t.brand.plantAddress
        ),
        React.createElement(
          'div',
          { className: 'asj-village-search__plant-hours' },
          React.createElement(Clock, { size: 14, 'aria-hidden': true }),
          React.createElement(
            'span',
            null,
            `${t.map.openingHoursTitle} ${t.map.openingHours}`
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'asj-village-search__plant-actions' },
        React.createElement(
          'a',
          {
            href: 'https://www.google.com/maps/search/?api=1&query=Ashish+Sudh+Jal+Sarsar+Siwan+Bihar',
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'asj-village-search__directions-btn',
          },
          React.createElement(ExternalLink, { size: 14, 'aria-hidden': true }),
          React.createElement('span', null, t.map.getDirectionsBtn)
        ),
        React.createElement(
          'a',
          {
            href: `tel:${t.brand.hotlineNumber}`,
            className: 'asj-village-search__call-plant-btn',
          },
          React.createElement(Phone, { size: 14, 'aria-hidden': true }),
          React.createElement('span', null, t.map.callPlantBtn)
        )
      )
    );
  }

  return React.createElement(
    'section',
    {
      id: 'coverage',
      className: containerClasses,
      role: 'region',
      'aria-labelledby': 'village-search-title',
    },
    React.createElement(
      'div',
      { className: 'asj-village-search__container' },
      headerElement,
      searchBoxCardElement,
      chipsSectionElement,
      plantCardElement
    ),
    React.createElement('style', null, villageSearchStyles)
  );
}

export default VillageSearch;
