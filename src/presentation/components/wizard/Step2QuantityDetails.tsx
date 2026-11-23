'use client';

import React, { useCallback } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Droplets,
  Minus,
  Package,
  PartyPopper,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type {
  JarTemperature,
  OrderServiceType,
} from '../../../core/domain/entities/OrderDraft';
import type {
  EventSeason,
  EventWaterVolumeEstimate,
} from '../../../core/use-cases/order/CalculateEventWaterVolumeUseCase';
import { useLanguage } from '../../i18n/useLanguage';

export interface Step2QuantityDetailsProps {
  readonly serviceType: OrderServiceType;
  readonly temperature: JarTemperature;
  readonly quantity: number;
  readonly isRecurring: boolean;
  readonly isFirstOrder: boolean;
  readonly eventGuestCount: number;
  readonly eventType: string;
  readonly eventDate: string;
  readonly eventSeason: EventSeason;
  readonly eventEstimate: EventWaterVolumeEstimate | null;
  readonly onSetTemperature: (temperature: JarTemperature) => void;
  readonly onSetQuantity: (quantity: number) => void;
  readonly onSetIsRecurring: (isRecurring: boolean) => void;
  readonly onSetIsFirstOrder: (isFirstOrder: boolean) => void;
  readonly onSetEventGuestCount: (guestCount: number) => void;
  readonly onSetEventType: (eventType: string) => void;
  readonly onSetEventDate: (eventDate: string) => void;
  readonly onSetEventSeason: (season: EventSeason) => void;
  readonly errors?: Readonly<Record<string, string>>;
}

interface EventTypeOption {
  readonly typeKey: string;
  readonly labelHi: string;
  readonly labelEn: string;
}

const EVENT_TYPE_OPTIONS: readonly EventTypeOption[] = [
  { typeKey: 'wedding', labelHi: 'शादी / रिसेप्शन', labelEn: 'Wedding / Reception' },
  { typeKey: 'birthday', labelHi: 'जन्मदिन / उत्सव', labelEn: 'Birthday / Celebration' },
  { typeKey: 'religious', labelHi: 'पूजा / धार्मिक अनुष्ठान', labelEn: 'Puja / Religious Ceremony' },
  { typeKey: 'corporate', labelHi: 'ऑफिस / सभा', labelEn: 'Office / Conference' },
  { typeKey: 'other', labelHi: 'अन्य सामाजिक समारोह', labelEn: 'Other Social Gathering' },
];

/**
 * Step 2: Quantity & Configuration Details Component.
 */
export function Step2QuantityDetails({
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
  onSetTemperature,
  onSetQuantity,
  onSetIsRecurring,
  onSetIsFirstOrder,
  onSetEventGuestCount,
  onSetEventType,
  onSetEventDate,
  onSetEventSeason,
  errors = {},
}: Step2QuantityDetailsProps): JSX.Element {
  const { isHindi, t } = useLanguage();

  const handleDecrementQuantity = useCallback(() => {
    if (quantity > 1) {
      onSetQuantity(quantity - 1);
    }
  }, [quantity, onSetQuantity]);

  const handleIncrementQuantity = useCallback(() => {
    onSetQuantity(quantity + 1);
  }, [quantity, onSetQuantity]);

  const handleQuantityInputChange = useCallback(
    (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
      const parsedValue = parseInt(changeEvent.target.value, 10);
      if (!Number.isNaN(parsedValue)) {
        onSetQuantity(Math.max(1, parsedValue));
      }
    },
    [onSetQuantity]
  );

  const handleGuestCountChange = useCallback(
    (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
      const parsedValue = parseInt(changeEvent.target.value, 10);
      if (!Number.isNaN(parsedValue)) {
        onSetEventGuestCount(Math.max(1, parsedValue));
      }
    },
    [onSetEventGuestCount]
  );

  const unitRateRs = isRecurring ? 25 : 30;
  const waterChargeRs = unitRateRs * quantity;
  const subscriberSavingsRs = isRecurring ? 5 * quantity : 0;
  const securityDepositRs = isFirstOrder ? 150 : 0;
  const estimatedTotalRs = waterChargeRs + securityDepositRs;

  return React.createElement(
    'div',
    { className: 'asj-wizard-step asj-wizard-step--2' },
    React.createElement(
      'div',
      { className: 'asj-wizard-step__header' },
      React.createElement('h3', { className: 'asj-wizard-step__title' }, t.wizard.form.quantityHeading)
    ),

    // Mode A: 20L Water Jar Configuration
    serviceType === 'jar' &&
      React.createElement(
        'div',
        { className: 'asj-jar-config' },
        // Temperature Choice
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { className: 'asj-form-label' },
            isHindi ? 'पानी का प्रकार चुनें:' : 'Select Water Temperature:'
          ),
          React.createElement(
            'div',
            {
              className: 'asj-temperature-toggle',
              role: 'radiogroup',
              'aria-label': 'Water temperature selection',
            },
            React.createElement(
              'button',
              {
                type: 'button',
                role: 'radio',
                'aria-checked': temperature === 'normal',
                className: `asj-temp-btn ${temperature === 'normal' ? 'asj-temp-btn--active' : ''}`,
                onClick: () => onSetTemperature('normal'),
              },
              React.createElement(Droplets, { size: 18, 'aria-hidden': true }),
              React.createElement('span', null, isHindi ? 'नॉर्मल पानी (20L)' : 'Normal Water (20L)'),
              temperature === 'normal' && React.createElement(Check, { size: 16, 'aria-hidden': true })
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                role: 'radio',
                'aria-checked': temperature === 'chilled',
                className: `asj-temp-btn ${temperature === 'chilled' ? 'asj-temp-btn--active' : ''}`,
                onClick: () => onSetTemperature('chilled'),
              },
              React.createElement(Sparkles, { size: 18, 'aria-hidden': true }),
              React.createElement(
                'span',
                null,
                isHindi ? 'ठंडा / चिल्ड पानी (20L)' : 'Chilled / Cool Water (20L)'
              ),
              temperature === 'chilled' && React.createElement(Check, { size: 16, 'aria-hidden': true })
            )
          )
        ),

        // Quantity Counter
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { htmlFor: 'jar-quantity-input', className: 'asj-form-label' },
            t.wizard.form.jarQuantityLabel
          ),
          React.createElement(
            'div',
            { className: 'asj-counter-wrap' },
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-label': 'Decrease quantity',
                className: 'asj-counter-btn',
                onClick: handleDecrementQuantity,
                disabled: quantity <= 1,
              },
              React.createElement(Minus, { size: 18, 'aria-hidden': true })
            ),
            React.createElement('input', {
              id: 'jar-quantity-input',
              type: 'number',
              min: '1',
              max: '100',
              value: quantity,
              onChange: handleQuantityInputChange,
              className: 'asj-counter-input',
              'aria-label': 'Jar quantity number',
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-label': 'Increase quantity',
                className: 'asj-counter-btn',
                onClick: handleIncrementQuantity,
              },
              React.createElement(Plus, { size: 18, 'aria-hidden': true })
            ),
            React.createElement(
              'span',
              { className: 'asj-counter-unit' },
              isHindi ? 'जार' : 'Jars'
            )
          ),
          errors.quantity &&
            React.createElement(
              'p',
              { className: 'asj-form-error', role: 'alert' },
              React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
              ' ',
              errors.quantity
            )
        ),

        // Subscription Checkbox
        React.createElement(
          'div',
          { className: 'asj-checkbox-card' },
          React.createElement(
            'label',
            { className: 'asj-checkbox-label' },
            React.createElement('input', {
              type: 'checkbox',
              checked: isRecurring,
              onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
                onSetIsRecurring(changeEvent.target.checked),
              className: 'asj-checkbox-input',
            }),
            React.createElement(
              'div',
              { className: 'asj-checkbox-content' },
              React.createElement(
                'span',
                { className: 'asj-checkbox-title' },
                t.wizard.form.recurringCheckboxLabel
              ),
              React.createElement(
                'span',
                { className: 'asj-checkbox-badge' },
                isHindi
                  ? '₹25 प्रति जार (₹5 की बचत हर डिलीवरी पर)'
                  : '₹25 per jar (₹5 discount on recurring)'
              )
            )
          )
        ),

        // First Order Checkbox
        React.createElement(
          'div',
          { className: 'asj-checkbox-card' },
          React.createElement(
            'label',
            { className: 'asj-checkbox-label' },
            React.createElement('input', {
              type: 'checkbox',
              checked: isFirstOrder,
              onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
                onSetIsFirstOrder(changeEvent.target.checked),
              className: 'asj-checkbox-input',
            }),
            React.createElement(
              'div',
              { className: 'asj-checkbox-content' },
              React.createElement(
                'span',
                { className: 'asj-checkbox-title' },
                t.wizard.form.firstOrderCheckboxLabel
              ),
              React.createElement(
                'span',
                { className: 'asj-checkbox-subtitle' },
                t.wizard.form.firstOrderDepositInfo
              )
            )
          )
        ),

        // Live Cost Breakdown Card
        React.createElement(
          'div',
          { className: 'asj-price-preview-card' },
          React.createElement(
            'div',
            { className: 'asj-price-preview-header' },
            React.createElement(
              'span',
              { className: 'asj-price-preview-title' },
              isHindi ? 'अनुमानित शुल्क विवरण:' : 'Estimated Price Breakdown:'
            ),
            React.createElement(
              'span',
              { className: 'asj-price-preview-badge' },
              isRecurring
                ? isHindi
                  ? 'सब्सक्राइबर दर: ₹25/जार'
                  : 'Subscriber Rate: ₹25/jar'
                : isHindi
                ? 'मानक दर: ₹30/जार'
                : 'Standard Rate: ₹30/jar'
            )
          ),
          React.createElement(
            'div',
            { className: 'asj-price-preview-row' },
            React.createElement('span', null, isHindi ? 'पानी शुल्क:' : 'Water Charge:'),
            React.createElement('span', null, `₹${waterChargeRs}`)
          ),
          isRecurring &&
            subscriberSavingsRs > 0 &&
            React.createElement(
              'div',
              { className: 'asj-price-preview-row asj-price-preview-row--savings' },
              React.createElement(
                'span',
                null,
                isHindi ? 'सब्सक्रिप्शन छूट (बचत):' : 'Subscriber Savings:'
              ),
              React.createElement('span', null, `-₹${subscriberSavingsRs}`)
            ),
          React.createElement(
            'div',
            { className: 'asj-price-preview-row' },
            React.createElement(
              'span',
              null,
              isHindi ? 'रिफंडेबल अमानत राशि (डिपॉजिट):' : 'Refundable Deposit:'
            ),
            React.createElement('span', null, isFirstOrder ? `₹${securityDepositRs}` : '₹0')
          ),
          React.createElement(
            'div',
            { className: 'asj-price-preview-total' },
            React.createElement('span', null, isHindi ? 'कुल देय राशि:' : 'Total Payable Amount:'),
            React.createElement(
              'span',
              { className: 'asj-price-preview-amount' },
              `₹${estimatedTotalRs}`
            )
          ),
          React.createElement(
            'p',
            { className: 'asj-price-preview-note' },
            t.wizard.summary.codNotice
          )
        )
      ),

    // Mode B: Bulk Packaged Bottles Configuration
    serviceType === 'bulk_bottles' &&
      React.createElement(
        'div',
        { className: 'asj-bulk-config' },
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { htmlFor: 'bottle-cartons-input', className: 'asj-form-label' },
            t.wizard.form.bottleQuantityLabel
          ),
          React.createElement(
            'div',
            { className: 'asj-counter-wrap' },
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-label': 'Decrease cartons',
                className: 'asj-counter-btn',
                onClick: handleDecrementQuantity,
                disabled: quantity <= 1,
              },
              React.createElement(Minus, { size: 18, 'aria-hidden': true })
            ),
            React.createElement('input', {
              id: 'bottle-cartons-input',
              type: 'number',
              min: '1',
              max: '500',
              value: quantity,
              onChange: handleQuantityInputChange,
              className: 'asj-counter-input',
              'aria-label': 'Bottle cartons number',
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-label': 'Increase cartons',
                className: 'asj-counter-btn',
                onClick: handleIncrementQuantity,
              },
              React.createElement(Plus, { size: 18, 'aria-hidden': true })
            ),
            React.createElement(
              'span',
              { className: 'asj-counter-unit' },
              isHindi ? 'कार्टन (Cartons)' : 'Cartons'
            )
          ),
          errors.quantity &&
            React.createElement(
              'p',
              { className: 'asj-form-error', role: 'alert' },
              React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
              ' ',
              errors.quantity
            )
        ),
        React.createElement(
          'div',
          { className: 'asj-info-card' },
          React.createElement(
            'div',
            { className: 'asj-info-card__icon' },
            React.createElement(Package, { size: 22, 'aria-hidden': true })
          ),
          React.createElement(
            'div',
            { className: 'asj-info-card__content' },
            React.createElement(
              'h4',
              { className: 'asj-info-card__title' },
              isHindi ? '24 सीलबंद बोतलें प्रति कार्टन' : '24 Sealed Bottles per Carton'
            ),
            React.createElement(
              'p',
              { className: 'asj-info-card__text' },
              isHindi
                ? '250ml, 500ml एवं 1 लीटर विकल्पों में उपलब्ध। दुकानों, कार्यालयों एवं बैठकों के लिए विशेष थोक रियायती दरें।'
                : 'Available in 250ml, 500ml, and 1L options. Special wholesale volume rates for stores and venues.'
            ),
            React.createElement(
              'div',
              { className: 'asj-info-card__badge' },
              React.createElement(ShieldCheck, { size: 16, 'aria-hidden': true }),
              React.createElement(
                'span',
                null,
                isHindi
                  ? '₹0 डिपॉजिट • कोई अमानत राशि नहीं'
                  : '₹0 Security Deposit • Zero deposit on cartons'
              )
            )
          )
        )
      ),

    // Mode C: Event & Wedding Supply Configuration
    serviceType === 'event' &&
      React.createElement(
        'div',
        { className: 'asj-event-config' },
        // Guest Count Input
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { htmlFor: 'event-guests-input', className: 'asj-form-label' },
            React.createElement(Users, { size: 16, 'aria-hidden': true }),
            ' ',
            t.wizard.form.eventGuestsLabel
          ),
          React.createElement('input', {
            id: 'event-guests-input',
            type: 'number',
            min: '10',
            max: '10000',
            step: '10',
            value: eventGuestCount,
            onChange: handleGuestCountChange,
            className: 'asj-input asj-input--number',
            placeholder: 'e.g. 250',
          }),
          errors.eventGuests &&
            React.createElement(
              'p',
              { className: 'asj-form-error', role: 'alert' },
              React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
              ' ',
              errors.eventGuests
            )
        ),

        // Event Type Selector
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { className: 'asj-form-label' },
            React.createElement(PartyPopper, { size: 16, 'aria-hidden': true }),
            ' ',
            t.wizard.form.eventTypeLabel
          ),
          React.createElement(
            'div',
            {
              className: 'asj-event-type-grid',
              role: 'radiogroup',
              'aria-label': 'Event category selection',
            },
            EVENT_TYPE_OPTIONS.map((typeItem) => {
              const isTypeActive = eventType === typeItem.typeKey;
              const typeLabel = isHindi ? typeItem.labelHi : typeItem.labelEn;
              return React.createElement(
                'button',
                {
                  key: typeItem.typeKey,
                  type: 'button',
                  role: 'radio',
                  'aria-checked': isTypeActive,
                  className: `asj-pill-btn ${isTypeActive ? 'asj-pill-btn--active' : ''}`,
                  onClick: () => onSetEventType(typeItem.typeKey),
                },
                isTypeActive && React.createElement(CheckCircle2, { size: 16, 'aria-hidden': true }),
                React.createElement('span', null, typeLabel)
              );
            })
          )
        ),

        // Event Date
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { htmlFor: 'event-date-input', className: 'asj-form-label' },
            React.createElement(Calendar, { size: 16, 'aria-hidden': true }),
            ' ',
            isHindi ? 'आयोजन की तिथि (वैकल्पिक):' : 'Event Date (Optional):'
          ),
          React.createElement('input', {
            id: 'event-date-input',
            type: 'date',
            value: eventDate,
            onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
              onSetEventDate(changeEvent.target.value),
            className: 'asj-input',
          })
        ),

        // Season Selector
        React.createElement(
          'div',
          { className: 'asj-form-group' },
          React.createElement(
            'label',
            { className: 'asj-form-label' },
            isHindi ? 'मौसम (पानी खपत दर):' : 'Weather Season (Consumption Rate):'
          ),
          React.createElement(
            'div',
            {
              className: 'asj-season-toggle',
              role: 'radiogroup',
              'aria-label': 'Season selection for water estimation',
            },
            React.createElement(
              'button',
              {
                type: 'button',
                role: 'radio',
                'aria-checked': eventSeason === 'normal',
                className: `asj-season-btn ${eventSeason === 'normal' ? 'asj-season-btn--active' : ''}`,
                onClick: () => onSetEventSeason('normal'),
              },
              React.createElement('span', null, isHindi ? 'सामान्य (Normal)' : 'Normal Season')
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                role: 'radio',
                'aria-checked': eventSeason === 'summer',
                className: `asj-season-btn ${eventSeason === 'summer' ? 'asj-season-btn--active' : ''}`,
                onClick: () => onSetEventSeason('summer'),
              },
              React.createElement('span', null, isHindi ? 'गर्मी (Summer +50%)' : 'Summer (+50% Water)')
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                role: 'radio',
                'aria-checked': eventSeason === 'winter',
                className: `asj-season-btn ${eventSeason === 'winter' ? 'asj-season-btn--active' : ''}`,
                onClick: () => onSetEventSeason('winter'),
              },
              React.createElement('span', null, isHindi ? 'सर्दी (Winter)' : 'Winter Season')
            )
          )
        ),

        // Live Event Estimation Result Card
        eventEstimate &&
          React.createElement(
            'div',
            { className: 'asj-event-estimate-card' },
            React.createElement(
              'div',
              { className: 'asj-event-estimate-header' },
              React.createElement(Sparkles, {
                size: 20,
                className: 'asj-event-estimate-icon',
                'aria-hidden': true,
              }),
              React.createElement(
                'h4',
                { className: 'asj-event-estimate-title' },
                t.wizard.form.eventEstimatedVolume
              )
            ),
            React.createElement(
              'div',
              { className: 'asj-event-metrics-grid' },
              React.createElement(
                'div',
                { className: 'asj-metric-box' },
                React.createElement(
                  'span',
                  { className: 'asj-metric-value' },
                  `${eventEstimate.estimatedLitres} L`
                ),
                React.createElement(
                  'span',
                  { className: 'asj-metric-label' },
                  isHindi ? 'अनुमानित कुल पानी' : 'Estimated Litres'
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-metric-box asj-metric-box--highlight' },
                React.createElement(
                  'span',
                  { className: 'asj-metric-value' },
                  `~${eventEstimate.recommended20LJars}`
                ),
                React.createElement(
                  'span',
                  { className: 'asj-metric-label' },
                  isHindi ? '20L आरओ जार' : '20L RO Jars'
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-metric-box' },
                React.createElement(
                  'span',
                  { className: 'asj-metric-value' },
                  `~${eventEstimate.recommendedCartons250ml}`
                ),
                React.createElement(
                  'span',
                  { className: 'asj-metric-label' },
                  isHindi ? 'बोतल कार्टन (250ml)' : 'Cartons (250ml)'
                )
              )
            ),
            React.createElement(
              'p',
              { className: 'asj-event-estimate-note' },
              isHindi ? eventEstimate.notesHi : eventEstimate.notesEn
            ),
            React.createElement(
              'div',
              { className: 'asj-event-deposit-notice' },
              React.createElement(ShieldCheck, { size: 18, 'aria-hidden': true }),
              React.createElement('span', null, t.wizard.summary.eventZeroDepositNotice)
            )
          )
      )
  );
}
