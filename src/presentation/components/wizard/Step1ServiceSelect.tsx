'use client';

import React, { useCallback } from 'react';
import { CheckCircle2, Droplets, Package, PartyPopper } from 'lucide-react';
import type { OrderServiceType } from '../../../core/domain/entities/OrderDraft';
import { useLanguage } from '../../i18n/useLanguage';

export interface Step1ServiceSelectProps {
  readonly selectedService: OrderServiceType;
  readonly onSelectService: (service: OrderServiceType) => void;
  readonly errorMessage?: string;
}

interface ServiceCardOption {
  readonly serviceType: OrderServiceType;
  readonly iconType: 'jar' | 'bulk_bottles' | 'event';
  readonly priceBadgeHi: string;
  readonly priceBadgeEn: string;
  readonly featureTagHi: string;
  readonly featureTagEn: string;
}

const SERVICE_OPTIONS: readonly ServiceCardOption[] = [
  {
    serviceType: 'jar',
    iconType: 'jar',
    priceBadgeHi: '₹30 / ₹25 सब्सक्रिप्शन',
    priceBadgeEn: '₹30 / ₹25 Subscription',
    featureTagHi: 'मुफ्त डोरस्टेप डिलीवरी (30-60 मिनट)',
    featureTagEn: 'Free Doorstep Delivery (30-60 mins)',
  },
  {
    serviceType: 'bulk_bottles',
    iconType: 'bulk_bottles',
    priceBadgeHi: 'थोक दर (कार्टन)',
    priceBadgeEn: 'Bulk Wholesale Rate',
    featureTagHi: '₹0 सिक्योरिटी डिपॉजिट • 24 बोतलें/कार्टन',
    featureTagEn: '₹0 Security Deposit • 24 Bottles/Carton',
  },
  {
    serviceType: 'event',
    iconType: 'event',
    priceBadgeHi: 'शादी व समारोह आपूर्ति',
    priceBadgeEn: 'Events & Functions',
    featureTagHi: 'जार व डिस्पेंसर पर ₹0 डिपॉजिट • फ्री एस्टीमेटर',
    featureTagEn: 'Zero Deposit on Jars & Taps • Free Estimator',
  },
];

/**
 * Step 1: Service Selection Component.
 */
export function Step1ServiceSelect({
  selectedService,
  onSelectService,
  errorMessage,
}: Step1ServiceSelectProps): JSX.Element {
  const { isHindi, t } = useLanguage();

  const handleCardClick = useCallback(
    (targetService: OrderServiceType) => {
      onSelectService(targetService);
    },
    [onSelectService]
  );

  return React.createElement(
    'div',
    { className: 'asj-wizard-step asj-wizard-step--1' },
    React.createElement(
      'div',
      { className: 'asj-wizard-step__header' },
      React.createElement(
        'h3',
        { className: 'asj-wizard-step__title' },
        t.wizard.form.chooseServiceHeading
      )
    ),

    errorMessage &&
      React.createElement(
        'div',
        { className: 'asj-wizard-error-banner', role: 'alert' },
        errorMessage
      ),

    React.createElement(
      'div',
      {
        className: 'asj-service-grid',
        role: 'radiogroup',
        'aria-label': t.wizard.form.chooseServiceHeading,
      },
      SERVICE_OPTIONS.map((optionItem) => {
        const isSelected = selectedService === optionItem.serviceType;
        let titleText = '';
        let subtitleText = '';

        if (optionItem.serviceType === 'jar') {
          titleText = isHindi
            ? '20 लीटर आरओ पानी जार (नॉर्मल / ठंडा)'
            : '20L RO Water Jar (Normal / Cool)';
          subtitleText = t.wizard.services.jarNormal.subtitle;
        } else if (optionItem.serviceType === 'bulk_bottles') {
          titleText = t.wizard.services.bulkBottles.title;
          subtitleText = t.wizard.services.bulkBottles.subtitle;
        } else {
          titleText = t.wizard.services.eventSupply.title;
          subtitleText = t.wizard.services.eventSupply.subtitle;
        }

        const priceBadge = isHindi ? optionItem.priceBadgeHi : optionItem.priceBadgeEn;
        const featureTag = isHindi ? optionItem.featureTagHi : optionItem.featureTagEn;

        let iconElement: JSX.Element;
        if (optionItem.iconType === 'jar') {
          iconElement = React.createElement(Droplets, {
            className: 'asj-service-card__icon',
            size: 26,
            'aria-hidden': true,
          });
        } else if (optionItem.iconType === 'bulk_bottles') {
          iconElement = React.createElement(Package, {
            className: 'asj-service-card__icon',
            size: 26,
            'aria-hidden': true,
          });
        } else {
          iconElement = React.createElement(PartyPopper, {
            className: 'asj-service-card__icon',
            size: 26,
            'aria-hidden': true,
          });
        }

        return React.createElement(
          'button',
          {
            key: optionItem.serviceType,
            type: 'button',
            role: 'radio',
            'aria-checked': isSelected,
            className: `asj-service-card ${isSelected ? 'asj-service-card--selected' : ''}`,
            onClick: () => handleCardClick(optionItem.serviceType),
          },
          React.createElement(
            'div',
            { className: 'asj-service-card__top' },
            React.createElement(
              'div',
              {
                className: `asj-service-card__icon-wrap ${
                  isSelected ? 'asj-service-card__icon-wrap--active' : ''
                }`,
              },
              iconElement
            ),
            React.createElement(
              'div',
              { className: 'asj-service-card__badge-wrap' },
              React.createElement(
                'span',
                { className: 'asj-service-card__price-badge' },
                priceBadge
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'asj-service-card__body' },
            React.createElement('h4', { className: 'asj-service-card__title' }, titleText),
            React.createElement('p', { className: 'asj-service-card__subtitle' }, subtitleText),
            React.createElement(
              'div',
              { className: 'asj-service-card__feature-pill' },
              featureTag
            )
          ),
          React.createElement(
            'div',
            { className: 'asj-service-card__footer' },
            React.createElement(
              'div',
              { className: 'asj-service-card__radio-indicator' },
              isSelected &&
                React.createElement(CheckCircle2, {
                  className: 'asj-service-card__check-icon',
                  size: 20,
                  'aria-hidden': true,
                })
            ),
            React.createElement(
              'span',
              { className: 'asj-service-card__select-text' },
              isSelected
                ? isHindi
                  ? 'चयनित'
                  : 'Selected'
                : isHindi
                ? 'चुनें'
                : 'Select'
            )
          )
        );
      })
    )
  );
}
