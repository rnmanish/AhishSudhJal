'use client';

import React, { useCallback, useId } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { useBookingWizard } from '../../hooks/useBookingWizard';
import type { UseBookingWizardOptions } from '../../hooks/useBookingWizard';
import { useLanguage } from '../../i18n/useLanguage';
import { WizardStepper } from './WizardStepper';
import { Step1ServiceSelect } from './Step1ServiceSelect';
import { Step2QuantityDetails } from './Step2QuantityDetails';
import { Step3CustomerDetails } from './Step3CustomerDetails';
import { Step4ReviewSummary } from './Step4ReviewSummary';

export interface BookingWizardProps {
  readonly className?: string;
  readonly options?: UseBookingWizardOptions;
}

const wizardStyles = `
  /* ==========================================================================
   * 1. Booking Wizard Container & Surface
   * ========================================================================== */
  .asj-wizard-section {
    position: relative;
    width: 100%;
    padding: 3.5rem 1rem 4rem;
    background: radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08) 0%, rgba(5, 19, 41, 0.98) 75%),
                linear-gradient(180deg, #030c1a 0%, #051329 100%);
    border-bottom: 1px solid var(--color-border-subtle, rgba(56, 189, 248, 0.14));
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .asj-wizard-section {
      padding: 4.5rem 1.5rem 5rem;
    }
  }

  .asj-wizard-container {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2.25rem;
    position: relative;
    z-index: 1;
  }

  /* Section Header */
  .asj-wizard-header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .asj-wizard-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-full, 9999px);
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    color: var(--color-primary-400, #38bdf8);
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
    letter-spacing: 0.025em;
  }

  .asj-wizard-title {
    font-size: 1.875rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: var(--color-text-primary, #f8fafc);
    line-height: 1.25;
    margin: 0;
  }

  @media (min-width: 768px) {
    .asj-wizard-title {
      font-size: 2.375rem;
    }
  }

  .asj-wizard-subtitle {
    font-size: 0.9375rem;
    color: var(--color-text-secondary, #cbd5e1);
    max-width: 620px;
    margin: 0;
    line-height: 1.6;
  }

  /* ==========================================================================
   * 2. Wizard Stepper Navigation
   * ========================================================================== */
  .asj-stepper {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .asj-stepper__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    gap: 0.5rem;
  }

  .asj-stepper__item {
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
  }

  .asj-stepper__connector {
    position: absolute;
    top: 20px;
    right: 50%;
    left: -50%;
    height: 2px;
    background: rgba(56, 189, 248, 0.18);
    z-index: 0;
    transition: background var(--transition-base, 250ms ease);
  }

  .asj-stepper__connector--active {
    background: linear-gradient(90deg, #0284c7 0%, #06b6d4 100%);
  }

  .asj-stepper__button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
    cursor: default;
    position: relative;
    z-index: 1;
    min-height: var(--touch-target-min, 44px);
  }

  .asj-stepper__button--clickable {
    cursor: pointer;
  }

  .asj-stepper__indicator {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full, 9999px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #071933;
    border: 2px solid rgba(56, 189, 248, 0.25);
    color: var(--color-text-muted, #94a3b8);
    font-weight: var(--font-weight-bold, 700);
    font-size: 0.9375rem;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-stepper__item--active .asj-stepper__indicator {
    background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
    border-color: #38bdf8;
    color: #ffffff;
    box-shadow: 0 0 16px rgba(14, 165, 233, 0.5);
  }

  .asj-stepper__item--completed .asj-stepper__indicator {
    background: rgba(16, 185, 129, 0.2);
    border-color: #10b981;
    color: #34d399;
  }

  .asj-stepper__label {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-muted, #94a3b8);
    text-align: center;
    transition: color var(--transition-fast, 150ms ease);
    white-space: nowrap;
  }

  .asj-stepper__item--active .asj-stepper__label {
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-stepper__item--completed .asj-stepper__label {
    color: #34d399;
  }

  @media (max-width: 640px) {
    .asj-stepper__label {
      display: none;
    }
  }

  /* ==========================================================================
   * 3. Main Wizard Card Shell
   * ========================================================================== */
  .asj-wizard-card {
    background: rgba(7, 25, 51, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-xl, 20px);
    padding: 1.5rem 1.25rem 2rem;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  }

  @media (min-width: 768px) {
    .asj-wizard-card {
      padding: 2.25rem 2.5rem 2.5rem;
    }
  }

  .asj-wizard-step__header {
    margin-bottom: 1.5rem;
  }

  .asj-wizard-step__title {
    font-size: 1.1875rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    margin: 0;
  }

  /* Error Banner */
  .asj-wizard-error-banner {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md, 12px);
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #fca5a5;
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
  }

  /* ==========================================================================
   * 4. Step 1: Service Cards Grid
   * ========================================================================== */
  .asj-service-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.125rem;
  }

  @media (min-width: 768px) {
    .asj-service-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .asj-service-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(5, 19, 41, 0.7);
    border: 1.5px solid rgba(56, 189, 248, 0.18);
    border-radius: var(--radius-lg, 16px);
    padding: 1.25rem;
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
    min-height: 220px;
    box-sizing: border-box;
  }

  .asj-service-card:hover {
    border-color: rgba(56, 189, 248, 0.45);
    background: rgba(8, 29, 61, 0.85);
    transform: translateY(-2px);
  }

  .asj-service-card--selected {
    border-color: #38bdf8;
    background: linear-gradient(180deg, rgba(14, 165, 233, 0.18) 0%, rgba(5, 19, 41, 0.9) 100%);
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.25);
  }

  .asj-service-card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .asj-service-card__icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md, 12px);
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.25);
    color: var(--color-primary-400, #38bdf8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .asj-service-card__icon-wrap--active {
    background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
    color: #ffffff;
    border-color: transparent;
  }

  .asj-service-card__price-badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-full, 9999px);
    background: rgba(6, 182, 212, 0.12);
    border: 1px solid rgba(6, 182, 212, 0.3);
    color: #22d3ee;
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-service-card__title {
    font-size: 1.0625rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    margin: 0 0 0.375rem;
  }

  .asj-service-card__subtitle {
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0 0 0.75rem;
    line-height: 1.45;
  }

  .asj-service-card__feature-pill {
    display: inline-block;
    font-size: 0.75rem;
    color: #34d399;
    font-weight: var(--font-weight-semibold, 600);
    margin-bottom: 1rem;
  }

  .asj-service-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(56, 189, 248, 0.1);
  }

  .asj-service-card__radio-indicator {
    width: 20px;
    height: 20px;
    border-radius: var(--radius-full, 9999px);
    border: 2px solid rgba(56, 189, 248, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #38bdf8;
  }

  .asj-service-card--selected .asj-service-card__radio-indicator {
    border-color: #38bdf8;
  }

  .asj-service-card__select-text {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-service-card--selected .asj-service-card__select-text {
    color: #38bdf8;
  }

  /* ==========================================================================
   * 5. Form Controls & Cards
   * ========================================================================== */
  .asj-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .asj-form-label {
    display: flex;
    align-items: center;
    gap: 0.4375rem;
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-temperature-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .asj-temp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md, 12px);
    border: 1.5px solid rgba(56, 189, 248, 0.2);
    background: rgba(5, 19, 41, 0.65);
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-temp-btn:hover {
    border-color: rgba(56, 189, 248, 0.4);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-temp-btn--active {
    background: linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(6, 182, 212, 0.35) 100%);
    border-color: #38bdf8;
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-counter-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: fit-content;
  }

  .asj-counter-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md, 12px);
    background: rgba(14, 165, 233, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.3);
    color: #38bdf8;
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-counter-btn:hover:not(:disabled) {
    background: rgba(14, 165, 233, 0.3);
    color: #ffffff;
  }

  .asj-counter-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .asj-counter-input {
    width: 72px;
    height: 44px;
    text-align: center;
    background: rgba(5, 19, 41, 0.8);
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: var(--radius-md, 12px);
    color: #ffffff;
    font-size: 1.125rem;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-counter-unit {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-checkbox-card {
    background: rgba(5, 19, 41, 0.65);
    border: 1px solid rgba(56, 189, 248, 0.18);
    border-radius: var(--radius-md, 12px);
    padding: 0.875rem 1rem;
    margin-bottom: 0.875rem;
    transition: border-color var(--transition-fast, 150ms ease);
  }

  .asj-checkbox-card:hover {
    border-color: rgba(56, 189, 248, 0.35);
  }

  .asj-checkbox-card--subtle {
    background: rgba(5, 19, 41, 0.45);
    border-style: dashed;
  }

  .asj-checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
    min-height: var(--touch-target-min, 44px);
  }

  .asj-checkbox-input {
    width: 20px;
    height: 20px;
    accent-color: #0284c7;
    margin-top: 0.125rem;
    cursor: pointer;
  }

  .asj-checkbox-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .asj-checkbox-title {
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-checkbox-badge {
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
    color: #34d399;
  }

  .asj-checkbox-subtitle {
    font-size: 0.75rem;
    color: var(--color-text-muted, #94a3b8);
    line-height: 1.4;
  }

  .asj-price-preview-card {
    background: rgba(14, 165, 233, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: var(--radius-md, 12px);
    padding: 1rem 1.25rem;
    margin-top: 1rem;
  }

  .asj-price-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.625rem;
    border-bottom: 1px solid rgba(56, 189, 248, 0.15);
    margin-bottom: 0.625rem;
    gap: 0.5rem;
  }

  .asj-price-preview-title {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-price-preview-badge {
    font-size: 0.75rem;
    color: #38bdf8;
    font-weight: var(--font-weight-semibold, 600);
  }

  .asj-price-preview-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #cbd5e1);
    margin-bottom: 0.375rem;
  }

  .asj-price-preview-row--savings {
    color: #34d399;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-price-preview-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: #ffffff;
    padding-top: 0.5rem;
    border-top: 1px dashed rgba(56, 189, 248, 0.2);
    margin-top: 0.5rem;
  }

  .asj-price-preview-amount {
    color: #38bdf8;
    font-size: 1.1875rem;
  }

  .asj-price-preview-note {
    font-size: 0.6875rem;
    color: var(--color-text-muted, #94a3b8);
    margin: 0.5rem 0 0;
  }

  .asj-input {
    width: 100%;
    min-height: var(--touch-target-min, 44px);
    background: rgba(5, 19, 41, 0.8);
    border: 1.5px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-md, 12px);
    padding: 0.625rem 0.875rem;
    color: var(--color-text-primary, #f8fafc);
    font-size: 0.9375rem;
    box-sizing: border-box;
    transition: border-color var(--transition-fast, 150ms ease);
  }

  .asj-input:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.35);
  }

  .asj-input--error {
    border-color: #ef4444;
  }

  .asj-select {
    width: 100%;
    min-height: var(--touch-target-min, 44px);
    background: rgba(5, 19, 41, 0.88);
    border: 1.5px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-md, 12px);
    padding: 0.625rem 0.875rem;
    color: var(--color-text-primary, #f8fafc);
    font-size: 0.9375rem;
    box-sizing: border-box;
    cursor: pointer;
  }

  .asj-select option {
    background: #051329;
    color: #f8fafc;
  }

  .asj-phone-input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-md, 12px);
    background: rgba(5, 19, 41, 0.8);
    overflow: hidden;
  }

  .asj-phone-prefix {
    padding: 0 0.875rem;
    background: rgba(14, 165, 233, 0.15);
    color: #38bdf8;
    font-size: 0.875rem;
    font-weight: var(--font-weight-bold, 700);
    border-right: 1px solid rgba(56, 189, 248, 0.2);
    height: 44px;
    display: flex;
    align-items: center;
  }

  .asj-input--phone {
    border: none;
    border-radius: 0;
  }

  .asj-form-error {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: #f87171;
    font-size: 0.75rem;
    margin: 0.25rem 0 0;
  }

  .asj-info-card {
    display: flex;
    gap: 1rem;
    background: rgba(5, 19, 41, 0.65);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-md, 12px);
    padding: 1rem 1.25rem;
    margin-top: 1rem;
  }

  .asj-info-card__icon {
    color: #38bdf8;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .asj-info-card__title {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    margin: 0 0 0.375rem;
  }

  .asj-info-card__text {
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0 0 0.5rem;
    line-height: 1.45;
  }

  .asj-info-card__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
    color: #34d399;
  }

  .asj-event-type-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .asj-pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-full, 9999px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    background: rgba(5, 19, 41, 0.65);
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-pill-btn:hover {
    border-color: rgba(56, 189, 248, 0.4);
    color: #ffffff;
  }

  .asj-pill-btn--active {
    background: linear-gradient(135deg, rgba(2, 132, 199, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%);
    border-color: #38bdf8;
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-season-toggle {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .asj-season-btn {
    min-height: var(--touch-target-min, 44px);
    padding: 0.5rem;
    border-radius: var(--radius-md, 12px);
    border: 1px solid rgba(56, 189, 248, 0.2);
    background: rgba(5, 19, 41, 0.65);
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.75rem;
    font-weight: var(--font-weight-semibold, 600);
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-season-btn--active {
    background: linear-gradient(135deg, rgba(2, 132, 199, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%);
    border-color: #38bdf8;
    color: #ffffff;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-event-estimate-card {
    background: rgba(6, 182, 212, 0.08);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: var(--radius-lg, 16px);
    padding: 1.25rem;
    margin-top: 1rem;
  }

  .asj-event-estimate-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .asj-event-estimate-icon {
    color: #22d3ee;
  }

  .asj-event-estimate-title {
    font-size: 0.9375rem;
    font-weight: var(--font-weight-bold, 700);
    color: #ffffff;
    margin: 0;
  }

  .asj-event-metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .asj-metric-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: rgba(5, 19, 41, 0.7);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-md, 12px);
    text-align: center;
  }

  .asj-metric-box--highlight {
    border-color: #22d3ee;
    background: rgba(6, 182, 212, 0.15);
  }

  .asj-metric-value {
    font-size: 1.1875rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: #38bdf8;
    margin-bottom: 0.25rem;
  }

  .asj-metric-label {
    font-size: 0.6875rem;
    color: var(--color-text-secondary, #cbd5e1);
  }

  .asj-event-estimate-note {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #cbd5e1);
    line-height: 1.45;
    margin: 0 0 0.75rem;
  }

  .asj-event-deposit-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: var(--font-weight-bold, 700);
    color: #34d399;
    padding: 0.5rem 0.75rem;
    background: rgba(16, 185, 129, 0.12);
    border-radius: var(--radius-sm, 6px);
  }

  /* ==========================================================================
   * 6. Step 4 Review Cards & WhatsApp Submission
   * ========================================================================== */
  .asj-summary-cards-container {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    margin-bottom: 1.5rem;
  }

  .asj-summary-card {
    background: rgba(5, 19, 41, 0.7);
    border: 1px solid rgba(56, 189, 248, 0.18);
    border-radius: var(--radius-lg, 16px);
    padding: 1.125rem 1.25rem;
  }

  .asj-summary-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(56, 189, 248, 0.12);
    margin-bottom: 0.75rem;
  }

  .asj-summary-card__icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md, 12px);
    background: rgba(14, 165, 233, 0.15);
    color: #38bdf8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .asj-summary-card__label {
    font-size: 0.75rem;
    color: var(--color-text-muted, #94a3b8);
    display: block;
  }

  .asj-summary-card__title {
    font-size: 1rem;
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text-primary, #f8fafc);
    margin: 0;
  }

  .asj-summary-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8125rem;
    color: var(--color-text-secondary, #cbd5e1);
    margin-bottom: 0.5rem;
  }

  .asj-summary-detail-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .asj-summary-detail-value {
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-primary, #f8fafc);
  }

  .asj-summary-detail-value--highlight {
    color: #38bdf8;
    font-weight: var(--font-weight-bold, 700);
  }

  .asj-summary-detail-row--savings {
    color: #34d399;
  }

  .asj-summary-total-divider {
    height: 1px;
    background: rgba(56, 189, 248, 0.18);
    margin: 0.75rem 0;
  }

  .asj-summary-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.0625rem;
    font-weight: var(--font-weight-extrabold, 800);
    color: #ffffff;
  }

  .asj-summary-total-value {
    color: #38bdf8;
    font-size: 1.25rem;
  }

  .asj-custom-quote-notice {
    display: flex;
    gap: 0.75rem;
    padding: 0.875rem;
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.25);
    border-radius: var(--radius-md, 12px);
    margin-bottom: 0.75rem;
  }

  .asj-custom-quote-icon {
    color: #22d3ee;
    flex-shrink: 0;
  }

  .asj-custom-quote-title {
    font-size: 0.875rem;
    font-weight: var(--font-weight-bold, 700);
    color: #ffffff;
    margin: 0 0 0.25rem;
  }

  .asj-custom-quote-text {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #cbd5e1);
    margin: 0;
    line-height: 1.4;
  }

  .asj-summary-cod-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #34d399;
    padding: 0.5rem 0.75rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: var(--radius-md, 12px);
    margin-top: 0.75rem;
  }

  .asj-whatsapp-submit-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    margin-top: 1.25rem;
  }

  .asj-whatsapp-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    width: 100%;
    min-height: 52px;
    padding: 0.875rem 1.5rem;
    border-radius: var(--radius-lg, 16px);
    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
    color: #ffffff;
    font-size: 1.0625rem;
    font-weight: var(--font-weight-bold, 700);
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-whatsapp-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.55);
  }

  .asj-whatsapp-btn:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  .asj-whatsapp-help-note {
    font-size: 0.75rem;
    color: var(--color-text-muted, #94a3b8);
    text-align: center;
    margin: 0;
  }

  /* ==========================================================================
   * 7. Wizard Footer Navigation
   * ========================================================================== */
  .asj-wizard-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(56, 189, 248, 0.15);
  }

  .asj-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md, 12px);
    background: rgba(5, 19, 41, 0.75);
    border: 1px solid rgba(56, 189, 248, 0.25);
    color: var(--color-text-secondary, #cbd5e1);
    font-size: 0.875rem;
    font-weight: var(--font-weight-semibold, 600);
    cursor: pointer;
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-btn-secondary:hover {
    color: #ffffff;
    border-color: rgba(56, 189, 248, 0.45);
    background: rgba(8, 29, 61, 0.9);
  }

  .asj-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: var(--touch-target-min, 44px);
    padding: 0.625rem 1.5rem;
    border-radius: var(--radius-md, 12px);
    background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
    border: none;
    color: #ffffff;
    font-size: 0.9375rem;
    font-weight: var(--font-weight-bold, 700);
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
    transition: all var(--transition-fast, 150ms ease);
  }

  .asj-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(14, 165, 233, 0.55);
  }

  .asj-wizard-step-counter {
    font-size: 0.8125rem;
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text-muted, #94a3b8);
  }
`;

/**
 * BookingWizard Component.
 */
export function BookingWizard({ className = '', options }: BookingWizardProps): JSX.Element {
  const headingId = useId();
  const { isHindi, t } = useLanguage();

  const {
    currentStep,
    serviceType,
    temperature,
    quantity,
    isRecurring,
    isFirstOrder,
    eventGuestCount,
    eventType,
    eventDate,
    eventSeason,
    customerName,
    customerPhone,
    villageId,
    villageName,
    landmark,
    saveDetails,
    validationErrors,
    availableVillages,
    currentVillage,
    calculatedSummary,
    eventEstimate,
    isSubmitting,
    goToStep,
    nextStep,
    previousStep,
    selectService,
    setTemperature,
    setQuantity,
    setIsRecurring,
    setIsFirstOrder,
    setEventGuestCount,
    setEventType,
    setEventDate,
    setEventSeason,
    setCustomerName,
    setCustomerPhone,
    setVillageId,
    setLandmark,
    setSaveDetails,
    submitOrder,
  } = useBookingWizard(options);

  const handleNextClick = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleBackClick = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleSubmitClick = useCallback(() => {
    submitOrder();
  }, [submitOrder]);

  return React.createElement(
    'section',
    {
      id: 'booking',
      role: 'region',
      'aria-labelledby': headingId,
      className: `asj-wizard-section ${className}`.trim(),
    },
    React.createElement(
      'div',
      { className: 'asj-wizard-container' },

      // Section Header
      React.createElement(
        'div',
        { className: 'asj-wizard-header' },
        React.createElement('span', { className: 'asj-wizard-badge' }, t.wizard.sectionBadge),
        React.createElement('h2', { id: headingId, className: 'asj-wizard-title' }, t.wizard.sectionTitle),
        React.createElement('p', { className: 'asj-wizard-subtitle' }, t.wizard.sectionSubtitle)
      ),

      // 4-Step Progress Navigation
      React.createElement(WizardStepper, { currentStep, onStepClick: goToStep }),

      // Wizard Main Card Shell
      React.createElement(
        'div',
        { className: 'asj-wizard-card' },

        // Step 1
        currentStep === 1 &&
          React.createElement(Step1ServiceSelect, {
            selectedService: serviceType,
            onSelectService: selectService,
            errorMessage: validationErrors.service || validationErrors.product,
          }),

        // Step 2
        currentStep === 2 &&
          React.createElement(Step2QuantityDetails, {
            serviceType,
            temperature,
            quantity,
            isRecurring,
            isFirstOrder,
            eventGuestCount,
            eventType,
            eventDate,
            eventSeason,
            eventEstimate,
            onSetTemperature: setTemperature,
            onSetQuantity: setQuantity,
            onSetIsRecurring: setIsRecurring,
            onSetIsFirstOrder: setIsFirstOrder,
            onSetEventGuestCount: setEventGuestCount,
            onSetEventType: setEventType,
            onSetEventDate: setEventDate,
            onSetEventSeason: setEventSeason,
            errors: validationErrors,
          }),

        // Step 3
        currentStep === 3 &&
          React.createElement(Step3CustomerDetails, {
            customerName,
            customerPhone,
            villageId,
            landmark,
            saveDetails,
            availableVillages,
            onSetCustomerName: setCustomerName,
            onSetCustomerPhone: setCustomerPhone,
            onSetVillageId: setVillageId,
            onSetLandmark: setLandmark,
            onSetSaveDetails: setSaveDetails,
            errors: validationErrors,
          }),

        // Step 4
        currentStep === 4 &&
          React.createElement(Step4ReviewSummary, {
            serviceType,
            temperature,
            quantity,
            isRecurring,
            isFirstOrder,
            eventGuestCount,
            eventType,
            eventDate,
            eventSeason,
            eventEstimate,
            customerName,
            customerPhone,
            villageName,
            currentVillage,
            landmark,
            calculatedSummary,
            isSubmitting,
            onSubmitWhatsApp: handleSubmitClick,
            errorMessage: validationErrors.submission,
          }),

        // Wizard Footer Navigation Controls
        React.createElement(
          'div',
          { className: 'asj-wizard-footer' },
          currentStep > 1
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: handleBackClick,
                  className: 'asj-btn-secondary',
                  'aria-label': t.wizard.summary.backBtn,
                },
                React.createElement(ArrowLeft, { size: 16, 'aria-hidden': true }),
                React.createElement('span', null, t.wizard.summary.backBtn)
              )
            : React.createElement('div', null),

          React.createElement(
            'span',
            { className: 'asj-wizard-step-counter' },
            isHindi ? `चरण ${currentStep} / 4` : `Step ${currentStep} of 4`
          ),

          currentStep < 4
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: handleNextClick,
                  className: 'asj-btn-primary',
                  'aria-label': t.wizard.summary.nextBtn,
                },
                React.createElement('span', null, t.wizard.summary.nextBtn),
                React.createElement(ArrowRight, { size: 16, 'aria-hidden': true })
              )
            : React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: handleSubmitClick,
                  disabled: isSubmitting,
                  className: 'asj-btn-primary',
                  'aria-label': t.wizard.summary.submitWhatsAppBtn,
                },
                React.createElement(MessageCircle, { size: 16, 'aria-hidden': true }),
                React.createElement('span', null, t.wizard.summary.submitWhatsAppBtn)
              )
        )
      )
    ),

    React.createElement('style', null, wizardStyles)
  );
}
