'use client';

import React from 'react';
import {
  AlertCircle,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  Package,
  PartyPopper,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import type {
  CalculatedOrderSummary,
  JarTemperature,
  OrderServiceType,
} from '../../../core/domain/entities/OrderDraft';
import type { VillageCoverage } from '../../../core/domain/entities/VillageCoverage';
import type {
  EventSeason,
  EventWaterVolumeEstimate,
} from '../../../core/use-cases/order/CalculateEventWaterVolumeUseCase';
import { useLanguage } from '../../i18n/useLanguage';

export interface Step4ReviewSummaryProps {
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
  readonly customerName: string;
  readonly customerPhone: string;
  readonly villageName: string;
  readonly currentVillage: VillageCoverage | null;
  readonly landmark: string;
  readonly calculatedSummary: CalculatedOrderSummary | null;
  readonly isSubmitting: boolean;
  readonly onSubmitWhatsApp: () => void;
  readonly errorMessage?: string;
}

/**
 * Step 4: Final Review & WhatsApp Dispatch Component.
 */
export function Step4ReviewSummary({
  serviceType,
  temperature,
  quantity,
  isRecurring,
  isFirstOrder,
  eventGuestCount,
  eventType,
  eventDate,
  eventEstimate,
  customerName,
  customerPhone,
  villageName,
  currentVillage,
  landmark,
  calculatedSummary,
  isSubmitting,
  onSubmitWhatsApp,
  errorMessage,
}: Step4ReviewSummaryProps): JSX.Element {
  const { isHindi, t } = useLanguage();

  let serviceDisplayName = '';
  if (serviceType === 'jar') {
    serviceDisplayName =
      temperature === 'chilled'
        ? isHindi
          ? '20 लीटर ठंडा / चिल्ड आरओ पानी जार'
          : '20L Chilled RO Water Jar'
        : isHindi
        ? '20 लीटर नॉर्मल आरओ पानी जार'
        : '20L Normal RO Water Jar';
  } else if (serviceType === 'bulk_bottles') {
    serviceDisplayName = t.wizard.services.bulkBottles.title;
  } else {
    serviceDisplayName = t.wizard.services.eventSupply.title;
  }

  const deliverySla = currentVillage
    ? currentVillage.getDeliverySla(isHindi ? 'hi' : 'en')
    : '30-60 mins';

  return React.createElement(
    'div',
    { className: 'asj-wizard-step asj-wizard-step--4' },
    React.createElement(
      'div',
      { className: 'asj-wizard-step__header' },
      React.createElement('h3', { className: 'asj-wizard-step__title' }, t.wizard.summary.heading)
    ),

    errorMessage &&
      React.createElement(
        'div',
        { className: 'asj-wizard-error-banner', role: 'alert' },
        React.createElement(AlertCircle, { size: 16, 'aria-hidden': true }),
        React.createElement('span', null, errorMessage)
      ),

    React.createElement(
      'div',
      { className: 'asj-summary-cards-container' },

      // 1. Service & Order Configuration Card
      React.createElement(
        'div',
        { className: 'asj-summary-card' },
        React.createElement(
          'div',
          { className: 'asj-summary-card__header' },
          React.createElement(
            'div',
            { className: 'asj-summary-card__icon-wrap' },
            serviceType === 'jar' && React.createElement(Droplets, { size: 20, 'aria-hidden': true }),
            serviceType === 'bulk_bottles' && React.createElement(Package, { size: 20, 'aria-hidden': true }),
            serviceType === 'event' && React.createElement(PartyPopper, { size: 20, 'aria-hidden': true })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'span',
              { className: 'asj-summary-card__label' },
              t.wizard.summary.selectedService
            ),
            React.createElement('h4', { className: 'asj-summary-card__title' }, serviceDisplayName)
          )
        ),
        React.createElement(
          'div',
          { className: 'asj-summary-card__body' },
          serviceType === 'jar' &&
            React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  t.wizard.summary.quantity
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-value' },
                  `${quantity} ${isHindi ? 'जार (20 लीटर)' : 'Jars (20L)'}`
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  isHindi ? 'ऑर्डर योजना:' : 'Plan Type:'
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-value' },
                  isRecurring
                    ? isHindi
                      ? 'नियमित दैनिक सब्सक्रिप्शन'
                      : 'Daily Recurring Subscription'
                    : isHindi
                    ? 'एक बार का ऑर्डर (One-Time)'
                    : 'One-Time Delivery'
                )
              )
            ),
          serviceType === 'bulk_bottles' &&
            React.createElement(
              'div',
              { className: 'asj-summary-detail-row' },
              React.createElement(
                'span',
                { className: 'asj-summary-detail-label' },
                t.wizard.summary.quantity
              ),
              React.createElement(
                'span',
                { className: 'asj-summary-detail-value' },
                `${quantity} ${isHindi ? 'कार्टन (24 बोतल प्रति कार्टन)' : 'Cartons (24 bottles each)'}`
              )
            ),
          serviceType === 'event' &&
            React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  isHindi ? 'समारोह प्रकार:' : 'Event Type:'
                ),
                React.createElement('span', { className: 'asj-summary-detail-value' }, eventType)
              ),
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  isHindi ? 'अनुमानित मेहमान:' : 'Estimated Guests:'
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-value' },
                  `${eventGuestCount} ${isHindi ? 'लोग' : 'Guests'}`
                )
              ),
              eventEstimate &&
                React.createElement(
                  'div',
                  { className: 'asj-summary-detail-row' },
                  React.createElement(
                    'span',
                    { className: 'asj-summary-detail-label' },
                    isHindi ? 'अनुमानित कुल पानी:' : 'Estimated Volume:'
                  ),
                  React.createElement(
                    'span',
                    { className: 'asj-summary-detail-value asj-summary-detail-value--highlight' },
                    `~${eventEstimate.estimatedLitres} L (${eventEstimate.recommended20LJars} ${
                      isHindi ? 'जार' : 'Jars'
                    })`
                  )
                ),
              eventDate &&
                React.createElement(
                  'div',
                  { className: 'asj-summary-detail-row' },
                  React.createElement(
                    'span',
                    { className: 'asj-summary-detail-label' },
                    isHindi ? 'समारोह तिथि:' : 'Event Date:'
                  ),
                  React.createElement('span', { className: 'asj-summary-detail-value' }, eventDate)
                )
            )
        )
      ),

      // 2. Financial Breakdown Card
      React.createElement(
        'div',
        { className: 'asj-summary-card' },
        React.createElement(
          'div',
          { className: 'asj-summary-card__header' },
          React.createElement(
            'span',
            { className: 'asj-summary-card__label' },
            isHindi ? 'भुगतान व शुल्क विवरण' : 'Financial Breakdown'
          )
        ),
        React.createElement(
          'div',
          { className: 'asj-summary-card__body' },
          serviceType === 'jar' &&
            calculatedSummary &&
            React.createElement(
              React.Fragment,
              null,
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  t.wizard.summary.unitPrice
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-value' },
                  calculatedSummary.unitPrice?.format() ?? (isRecurring ? '₹25' : '₹30')
                )
              ),
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  t.wizard.summary.baseAmount
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-value' },
                  calculatedSummary.baseAmount.format()
                )
              ),
              isRecurring &&
                !calculatedSummary.recurringSavings.isZero() &&
                React.createElement(
                  'div',
                  { className: 'asj-summary-detail-row asj-summary-detail-row--savings' },
                  React.createElement(
                    'span',
                    { className: 'asj-summary-detail-label' },
                    t.wizard.summary.recurringSavings
                  ),
                  React.createElement(
                    'span',
                    { className: 'asj-summary-detail-value' },
                    `-${calculatedSummary.recurringSavings.format()}`
                  )
                ),
              React.createElement(
                'div',
                { className: 'asj-summary-detail-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-label' },
                  t.wizard.summary.depositAmount
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-detail-value' },
                  isFirstOrder
                    ? calculatedSummary.depositAmount.format()
                    : isHindi
                    ? '₹0 (मौजूदा ग्राहक)'
                    : '₹0 (Existing Customer)'
                )
              ),
              React.createElement('div', { className: 'asj-summary-total-divider' }),
              React.createElement(
                'div',
                { className: 'asj-summary-total-row' },
                React.createElement(
                  'span',
                  { className: 'asj-summary-total-label' },
                  t.wizard.summary.totalPayable
                ),
                React.createElement(
                  'span',
                  { className: 'asj-summary-total-value' },
                  calculatedSummary.totalAmountPayable.format()
                )
              )
            ),

          (serviceType === 'bulk_bottles' || serviceType === 'event') &&
            React.createElement(
              'div',
              { className: 'asj-custom-quote-notice' },
              React.createElement(Sparkles, {
                size: 20,
                className: 'asj-custom-quote-icon',
                'aria-hidden': true,
              }),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'h5',
                  { className: 'asj-custom-quote-title' },
                  isHindi
                    ? 'व्हाट्सएप पर तुरंत थोक विशेष दर प्राप्त करें'
                    : 'Instant Custom Wholesale Quote on WhatsApp'
                ),
                React.createElement(
                  'p',
                  { className: 'asj-custom-quote-text' },
                  serviceType === 'event'
                    ? t.wizard.summary.eventZeroDepositNotice
                    : isHindi
                    ? 'थोक बोतल कार्टन के लिए विशेष रियायती दरें एवं शून्य सिक्योरिटी डिपॉजिट।'
                    : 'Wholesale carton discounts and zero security deposit apply.'
                )
              )
            ),

          React.createElement(
            'div',
            { className: 'asj-summary-cod-pill' },
            React.createElement(ShieldCheck, { size: 16, 'aria-hidden': true }),
            React.createElement('span', null, t.wizard.summary.codNotice)
          )
        )
      ),

      // 3. Delivery Destination Card
      React.createElement(
        'div',
        { className: 'asj-summary-card' },
        React.createElement(
          'div',
          { className: 'asj-summary-card__header' },
          React.createElement('span', { className: 'asj-summary-card__label' }, t.wizard.summary.deliveryTo)
        ),
        React.createElement(
          'div',
          { className: 'asj-summary-card__body' },
          React.createElement(
            'div',
            { className: 'asj-summary-detail-row' },
            React.createElement(
              'span',
              { className: 'asj-summary-detail-label' },
              React.createElement(User, { size: 15, 'aria-hidden': true }),
              ' ',
              isHindi ? 'ग्राहक का नाम:' : 'Customer:'
            ),
            React.createElement('span', { className: 'asj-summary-detail-value' }, customerName)
          ),
          React.createElement(
            'div',
            { className: 'asj-summary-detail-row' },
            React.createElement(
              'span',
              { className: 'asj-summary-detail-label' },
              React.createElement(Phone, { size: 15, 'aria-hidden': true }),
              ' ',
              isHindi ? 'संपर्क नंबर:' : 'Mobile:'
            ),
            React.createElement('span', { className: 'asj-summary-detail-value' }, `+91 ${customerPhone}`)
          ),
          React.createElement(
            'div',
            { className: 'asj-summary-detail-row' },
            React.createElement(
              'span',
              { className: 'asj-summary-detail-label' },
              React.createElement(MapPin, { size: 15, 'aria-hidden': true }),
              ' ',
              isHindi ? 'डिलीवरी गांव:' : 'Village:'
            ),
            React.createElement('span', { className: 'asj-summary-detail-value' }, villageName || 'Sarsar')
          ),
          landmark &&
            React.createElement(
              'div',
              { className: 'asj-summary-detail-row' },
              React.createElement(
                'span',
                { className: 'asj-summary-detail-label' },
                React.createElement(MapPin, { size: 15, 'aria-hidden': true }),
                ' ',
                isHindi ? 'पहचान स्थल:' : 'Landmark:'
              ),
              React.createElement('span', { className: 'asj-summary-detail-value' }, landmark)
            ),
          React.createElement(
            'div',
            { className: 'asj-summary-detail-row' },
            React.createElement(
              'span',
              { className: 'asj-summary-detail-label' },
              React.createElement(Clock, { size: 15, 'aria-hidden': true }),
              ' ',
              t.wizard.summary.deliverySla
            ),
            React.createElement(
              'span',
              { className: 'asj-summary-detail-value asj-summary-detail-value--highlight' },
              deliverySla
            )
          )
        )
      )
    ),

    // WhatsApp Dispatch CTA Button
    React.createElement(
      'div',
      { className: 'asj-whatsapp-submit-wrap' },
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: onSubmitWhatsApp,
          disabled: isSubmitting,
          className: 'asj-whatsapp-btn',
          'aria-label': t.wizard.summary.submitWhatsAppBtn,
        },
        React.createElement(MessageCircle, {
          size: 22,
          className: 'asj-whatsapp-btn__icon',
          'aria-hidden': true,
        }),
        React.createElement(
          'span',
          { className: 'asj-whatsapp-btn__text' },
          isSubmitting
            ? isHindi
              ? 'व्हाट्सएप खुल रहा है...'
              : 'Opening WhatsApp...'
            : t.wizard.summary.submitWhatsAppBtn
        )
      ),
      React.createElement(
        'p',
        { className: 'asj-whatsapp-help-note' },
        isHindi
          ? 'बटन दबाते ही सीधे आशीष शुद्ध जल के आधिकारिक व्हाट्सएप पर ऑर्डर का विवरण तैयार मिलेगा।'
          : 'Clicking opens WhatsApp with your pre-formatted order details ready to send.'
      )
    )
  );
}
