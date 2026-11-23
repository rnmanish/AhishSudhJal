'use client';

import React, { useCallback } from 'react';
import { Activity } from 'lucide-react';
import type { WaterSourceType } from '../../../core/use-cases/tds/CalculateTdsQualityUseCase';
import { useTdsAnalyzer } from '../../hooks/useTdsAnalyzer';
import { useLanguage } from '../../i18n/useLanguage';
import { TdsGauge } from './TdsGauge';
import { TdsResultCard } from './TdsResultCard';
import { TdsSlider } from './TdsSlider';
import { TdsSourceSelector } from './TdsSourceSelector';

export interface TdsAnalyzerProps {
  readonly initialPpm?: number;
  readonly initialSource?: WaterSourceType;
  readonly className?: string;
  readonly onPpmChange?: (nextPpm: number) => void;
  readonly onSourceChange?: (nextSource: WaterSourceType | undefined) => void;
  readonly onConsultClick?: () => void;
}

const tdsAnalyzerStyles = `
  /* ==========================================================================
   * 1. TDS Analyzer Container & Atmospheric Aquatic Section
   * ========================================================================== */
  .asj-tds-analyzer {
    position: relative;
    width: 100%;
    padding: 3.5rem 1rem 4rem;
    background: radial-gradient(circle at 50% 15%, rgba(6, 182, 212, 0.08) 0%, rgba(3, 12, 26, 0.98) 80%),
                linear-gradient(180deg, #030c1a 0%, #051329 100%);
    border-top: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    color: var(--color-text-primary, #f8fafc);
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .asj-tds-analyzer {
      padding: 5rem 1.5rem 5.5rem;
    }
  }

  @media (min-width: 1024px) {
    .asj-tds-analyzer {
      padding: 6rem 2rem 6.5rem;
    }
  }

  .asj-tds-analyzer__container {
    max-width: 1240px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2.75rem;
  }

  /* ==========================================================================
   * 2. Section Header
   * ========================================================================== */
  .asj-tds-analyzer__header {
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
  }

  .asj-tds-analyzer__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-full, 9999px);
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.28);
    color: var(--color-primary-400, #7dd3fc);
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
    letter-spacing: 0.025em;
  }

  .asj-tds-analyzer__badge-icon {
    color: var(--color-accent-cyan, #06b6d4);
  }

  .asj-tds-analyzer__title {
    font-size: 1.75rem;
    line-height: 1.25;
    font-weight: var(--font-weight-extrabold, 800);
    color: var(--color-text-primary, #f8fafc);
    letter-spacing: -0.015em;
    margin: 0;
  }

  @media (min-width: 768px) {
    .asj-tds-analyzer__title {
      font-size: 2.375rem;
    }
  }

  .asj-tds-analyzer__subtitle {
    font-size: 0.9375rem;
    line-height: 1.6;
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0;
  }

  @media (min-width: 768px) {
    .asj-tds-analyzer__subtitle {
      font-size: 1.0625rem;
    }
  }

  /* ==========================================================================
   * 3. Two-Column Interactive Grid
   * ========================================================================== */
  .asj-tds-analyzer__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: start;
  }

  @media (min-width: 1024px) {
    .asj-tds-analyzer__grid {
      grid-template-columns: 1.15fr 0.85fr;
      gap: 2.5rem;
    }
  }

  .asj-tds-analyzer__input-column {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    background: rgba(13, 59, 102, 0.35);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.18));
    border-radius: var(--radius-xl, 20px);
    padding: 1.5rem;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  }

  @media (min-width: 768px) {
    .asj-tds-analyzer__input-column {
      padding: 2rem;
    }
  }

  .asj-tds-analyzer__result-column {
    display: flex;
    flex-direction: column;
  }

  /* ==========================================================================
   * 4. Source Selector Styles
   * ========================================================================== */
  .asj-tds-source-selector {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .asj-tds-source-selector__label {
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-tds-source-selector__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    .asj-tds-source-selector__grid {
      grid-template-columns: 1fr;
    }
  }

  .asj-tds-source-selector__btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.875rem;
    min-height: var(--touch-target-min, 44px);
    border-radius: var(--radius-md, 12px);
    background: rgba(10, 37, 64, 0.45);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.16));
    color: var(--color-text-secondary, #cbd5e1);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-tds-source-selector__btn:hover:not(:disabled) {
    background: rgba(14, 165, 233, 0.12);
    border-color: var(--color-primary-500, #38bdf8);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-tds-source-selector__btn--active {
    background: rgba(14, 165, 233, 0.22);
    border-color: var(--color-accent-aqua, #00e5ff);
    color: #ffffff;
    box-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
  }

  .asj-tds-source-selector__icon-wrap {
    flex-shrink: 0;
    color: var(--color-accent-cyan, #06b6d4);
  }

  .asj-tds-source-selector__btn--active .asj-tds-source-selector__icon-wrap {
    color: var(--color-accent-aqua, #00e5ff);
  }

  .asj-tds-source-selector__content {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .asj-tds-source-selector__name {
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .asj-tds-source-selector__badge {
    font-size: 0.6875rem;
    color: var(--color-text-muted, #94a3b8);
    margin-top: 0.125rem;
  }

  .asj-tds-source-selector__btn--active .asj-tds-source-selector__badge {
    color: var(--color-primary-300, #bae6fd);
  }

  /* ==========================================================================
   * 5. Slider & Numeric Readout Styles
   * ========================================================================== */
  .asj-tds-slider {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
  }

  .asj-tds-slider__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .asj-tds-slider__label {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-tds-slider__readout {
    display: inline-flex;
    align-items: baseline;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: rgba(14, 165, 233, 0.15);
    border: 1px solid var(--color-primary-500, #38bdf8);
    border-radius: var(--radius-md, 12px);
    box-shadow: 0 0 16px rgba(14, 165, 233, 0.2);
  }

  .asj-tds-slider__readout-value {
    font-size: 1.625rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: #ffffff;
    font-variant-numeric: tabular-nums;
  }

  .asj-tds-slider__readout-unit {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-accent-cyan, #06b6d4);
  }

  .asj-tds-slider__input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .asj-tds-slider__range-input {
    width: 100%;
    height: 10px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: var(--radius-full, 9999px);
    background: linear-gradient(
      to right,
      #38bdf8 0%,
      #10b981 12%,
      #06b6d4 25%,
      #f59e0b 45%,
      #ef4444 80%
    );
    outline: none;
    cursor: pointer;
  }

  .asj-tds-slider__range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ffffff;
    border: 3px solid var(--color-primary-600, #0ea5e9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(14, 165, 233, 0.6);
    cursor: grab;
    transition: transform var(--transition-fast, 150ms ease);
  }

  .asj-tds-slider__range-input::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.15);
  }

  .asj-tds-slider__range-input::-moz-range-thumb {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #ffffff;
    border: 3px solid var(--color-primary-600, #0ea5e9);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 12px rgba(14, 165, 233, 0.6);
    cursor: grab;
  }

  .asj-tds-slider__scale-endpoints {
    display: flex;
    justify-content: space-between;
    font-size: 0.6875rem;
    color: var(--color-text-muted, #94a3b8);
  }

  .asj-tds-slider__presets {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .asj-tds-slider__presets-title {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-tds-slider__presets-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .asj-tds-slider__preset-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.4375rem 0.75rem;
    min-height: var(--touch-target-min, 44px);
    border-radius: var(--radius-md, 12px);
    background: rgba(10, 37, 64, 0.45);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.16));
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-tds-slider__preset-btn:hover:not(:disabled) {
    background: rgba(14, 165, 233, 0.15);
    border-color: var(--color-primary-500, #38bdf8);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-tds-slider__preset-btn--active {
    background: rgba(14, 165, 233, 0.25);
    border-color: var(--color-accent-aqua, #00e5ff);
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
    box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
  }

  .asj-tds-slider__preset-ppm {
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-accent-cyan, #06b6d4);
  }

  .asj-tds-slider__preset-btn--active .asj-tds-slider__preset-ppm {
    color: var(--color-accent-aqua, #00e5ff);
  }

  /* ==========================================================================
   * 6. Spectrum Gauge Styles
   * ========================================================================== */
  .asj-tds-gauge {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.125rem;
    background: rgba(5, 19, 41, 0.55);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    border-radius: var(--radius-lg, 16px);
  }

  .asj-tds-gauge__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--color-text-secondary, #cbd5e1);
    font-weight: var(--font-weight-semibold, 600);
  }

  .asj-tds-gauge__current-indicator {
    padding: 0.1875rem 0.5rem;
    background: rgba(14, 165, 233, 0.2);
    border-radius: var(--radius-sm, 8px);
    color: var(--color-accent-aqua, #00e5ff);
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-tds-gauge__track-wrapper {
    position: relative;
    padding: 1.25rem 0 0.5rem;
  }

  .asj-tds-gauge__track {
    display: grid;
    grid-template-columns: 0.5fr 1fr 1.5fr 2fr 5fr;
    height: 12px;
    border-radius: var(--radius-full, 9999px);
    overflow: hidden;
    gap: 2px;
    background: rgba(0, 0, 0, 0.3);
  }

  .asj-tds-gauge__segment {
    height: 100%;
    transition: opacity var(--transition-fast, 150ms ease),
                filter var(--transition-fast, 150ms ease);
  }

  .asj-tds-gauge__segment--active {
    filter: brightness(1.2);
    box-shadow: 0 0 10px currentColor;
  }

  .asj-tds-gauge__segment--ideal {
    position: relative;
  }

  .asj-tds-gauge__marker {
    position: absolute;
    top: -2px;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    transition: left var(--transition-fast, 150ms ease);
    z-index: 2;
  }

  .asj-tds-gauge__marker-bubble {
    font-size: 0.6875rem;
    font-weight: var(--font-weight-bold, 700);
    padding: 0.125rem 0.375rem;
    background: #ffffff;
    color: #030c1a;
    border-radius: var(--radius-sm, 6px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    white-space: nowrap;
  }

  .asj-tds-gauge__marker-arrow {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #ffffff;
  }

  .asj-tds-gauge__labels {
    display: grid;
    grid-template-columns: 0.5fr 1fr 1.5fr 2fr 5fr;
    gap: 2px;
  }

  .asj-tds-gauge__label-item {
    display: flex;
    flex-direction: column;
    font-size: 0.625rem;
    color: var(--color-text-muted, #94a3b8);
    overflow: hidden;
  }

  .asj-tds-gauge__label-item--active {
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-tds-gauge__range-text {
    font-variant-numeric: tabular-nums;
  }

  .asj-tds-gauge__name-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ==========================================================================
   * 7. Result Card Styles
   * ========================================================================== */
  .asj-tds-result-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-radius: var(--radius-xl, 20px);
    padding: 1.75rem;
    background: rgba(13, 59, 102, 0.45);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.2));
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    transition: border-color var(--transition-base, 250ms ease),
                box-shadow var(--transition-base, 250ms ease);
  }

  @media (min-width: 768px) {
    .asj-tds-result-card {
      padding: 2.25rem;
    }
  }

  .asj-tds-result-card--safe {
    border-color: rgba(16, 185, 129, 0.35);
  }

  .asj-tds-result-card--unsafe {
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 16px 40px rgba(239, 68, 68, 0.12);
  }

  .asj-tds-result-card--ideal {
    border-color: rgba(16, 185, 129, 0.55);
    box-shadow: 0 16px 44px rgba(16, 185, 129, 0.2);
  }

  .asj-tds-result-card__header {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .asj-tds-result-card__badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .asj-tds-result-card__grade-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3125rem 0.75rem;
    border-radius: var(--radius-full, 9999px);
    border: 1px solid;
    font-size: 0.8125rem;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-tds-result-card__sparkle-icon {
    color: var(--color-accent-aqua, #00e5ff);
  }

  .asj-tds-result-card__safety-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.3125rem 0.6875rem;
    border-radius: var(--radius-full, 9999px);
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-tds-result-card__safety-tag--safe {
    background: var(--color-status-success-bg, rgba(16, 185, 129, 0.16));
    border: 1px solid var(--color-status-success-border, rgba(16, 185, 129, 0.38));
    color: var(--color-status-success-light, #34d399);
  }

  .asj-tds-result-card__safety-tag--danger {
    background: var(--color-status-danger-bg, rgba(239, 68, 68, 0.16));
    border: 1px solid var(--color-status-danger-border, rgba(239, 68, 68, 0.38));
    color: var(--color-status-danger-light, #f87171);
  }

  .asj-tds-result-card__headline {
    font-size: 1.25rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    line-height: 1.35;
    margin: 0;
  }

  .asj-tds-result-card__body {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .asj-tds-result-card__desc {
    font-size: 0.9375rem;
    line-height: 1.55;
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0;
  }

  .asj-tds-result-card__action-box {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem;
    border-radius: var(--radius-md, 12px);
    background: rgba(10, 37, 64, 0.55);
    border: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.16));
  }

  .asj-tds-result-card__action-icon-wrap {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .asj-tds-result-card__action-icon--safe {
    color: var(--color-status-success, #10b981);
  }

  .asj-tds-result-card__action-icon--warn {
    color: var(--color-status-warning, #f59e0b);
  }

  .asj-tds-result-card__action-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asj-tds-result-card__action-title {
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .asj-tds-result-card__action-desc {
    font-size: 0.875rem;
    color: var(--color-text-secondary, #cbd5e1);
    line-height: 1.45;
    margin: 0;
  }

  .asj-tds-result-card__source-context {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md, 12px);
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.24);
  }

  .asj-tds-result-card__info-icon {
    flex-shrink: 0;
    color: var(--color-accent-cyan, #06b6d4);
    margin-top: 0.1875rem;
  }

  .asj-tds-result-card__source-text {
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #cbd5e1);
    line-height: 1.45;
    margin: 0;
  }

  .asj-tds-result-card__asj-promise {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: var(--radius-md, 12px);
    background: rgba(14, 165, 233, 0.08);
    border: 1px solid rgba(14, 165, 233, 0.2);
  }

  .asj-tds-result-card__promise-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .asj-tds-result-card__promise-icon {
    color: var(--color-accent-aqua, #00e5ff);
  }

  .asj-tds-result-card__promise-title {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-primary-300, #bae6fd);
  }

  .asj-tds-result-card__promise-text {
    font-size: 0.8125rem;
    color: var(--color-text-muted, #94a3b8);
    line-height: 1.45;
    margin: 0;
  }

  /* WhatsApp CTA */
  .asj-tds-result-card__footer {
    display: flex;
    flex-direction: column;
  }

  .asj-tds-result-card__whatsapp-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 0.875rem 1.25rem;
    min-height: var(--touch-target-min, 44px);
    border-radius: var(--radius-md, 12px);
    background: var(--color-whatsapp-primary, #25d366);
    color: var(--color-whatsapp-contrast-text, #03140a);
    font-weight: var(--font-weight-bold, 700);
    font-size: 0.9375rem;
    text-decoration: none;
    box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-tds-result-card__whatsapp-cta:hover {
    background: var(--color-whatsapp-hover, #1ebd5b);
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
  }

  .asj-tds-result-card__ext-icon {
    opacity: 0.75;
  }
`;

export function TdsAnalyzer({
  initialPpm,
  initialSource,
  className,
  onPpmChange,
  onSourceChange,
  onConsultClick,
}: TdsAnalyzerProps): JSX.Element {
  const { t } = useLanguage();
  const analyzerState = useTdsAnalyzer({ initialPpm, initialSource });

  const handlePpmChange = useCallback(
    (nextPpmValue: number) => {
      analyzerState.setPpm(nextPpmValue);
      if (onPpmChange) {
        onPpmChange(nextPpmValue);
      }
    },
    [analyzerState, onPpmChange]
  );

  const handleSourceSelect = useCallback(
    (nextSourceValue: WaterSourceType) => {
      analyzerState.setSource(nextSourceValue);
      if (onSourceChange) {
        onSourceChange(nextSourceValue);
      }
    },
    [analyzerState, onSourceChange]
  );

  const sectionClasses = ['asj-tds-analyzer', className].filter(Boolean).join(' ');

  // Section Header
  const headerElement = React.createElement(
    'header',
    { className: 'asj-tds-analyzer__header' },
    React.createElement(
      'div',
      { className: 'asj-tds-analyzer__badge' },
      React.createElement(Activity, {
        size: 15,
        className: 'asj-tds-analyzer__badge-icon',
      }),
      React.createElement('span', null, t.tds.sectionBadge)
    ),
    React.createElement(
      'h2',
      { id: 'tds-title', className: 'asj-tds-analyzer__title' },
      t.tds.sectionTitle
    ),
    React.createElement(
      'p',
      { className: 'asj-tds-analyzer__subtitle' },
      t.tds.sectionSubtitle
    )
  );

  // Input Column
  const inputColumnElement = React.createElement(
    'div',
    { className: 'asj-tds-analyzer__input-column' },
    React.createElement(TdsSourceSelector, {
      selectedSource: analyzerState.source,
      onSourceSelect: handleSourceSelect,
    }),
    React.createElement(TdsSlider, {
      ppm: analyzerState.ppm,
      onPpmChange: handlePpmChange,
      presets: analyzerState.presets,
    }),
    React.createElement(TdsGauge, {
      ppm: analyzerState.ppm,
      activeGrade: analyzerState.activeGrade,
    })
  );

  // Result Column
  const resultColumnElement = React.createElement(
    'div',
    { className: 'asj-tds-analyzer__result-column' },
    React.createElement(TdsResultCard, {
      analysisResult: analyzerState.analysisResult,
      source: analyzerState.source,
      onConsultClick,
    })
  );

  // Grid
  const gridElement = React.createElement(
    'div',
    { className: 'asj-tds-analyzer__grid' },
    inputColumnElement,
    resultColumnElement
  );

  const containerElement = React.createElement(
    'div',
    { className: 'asj-tds-analyzer__container' },
    headerElement,
    gridElement
  );

  const styleElement = React.createElement('style', null, tdsAnalyzerStyles);

  return React.createElement(
    'section',
    {
      id: 'tds-analyzer',
      role: 'region',
      'aria-labelledby': 'tds-title',
      className: sectionClasses,
    },
    containerElement,
    styleElement
  );
}
