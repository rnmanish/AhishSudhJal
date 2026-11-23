'use client';

import React, { useCallback } from 'react';
import { AlertCircle, MapPin, Phone, User } from 'lucide-react';
import type { VillageCoverage } from '../../../core/domain/entities/VillageCoverage';
import type { SupportedLanguage } from '../../../core/domain/value-objects/Language';
import { useLanguage } from '../../i18n/useLanguage';

export interface Step3CustomerDetailsProps {
  readonly customerName: string;
  readonly customerPhone: string;
  readonly villageId: string;
  readonly landmark: string;
  readonly saveDetails: boolean;
  readonly availableVillages: readonly VillageCoverage[];
  readonly onSetCustomerName: (name: string) => void;
  readonly onSetCustomerPhone: (phone: string) => void;
  readonly onSetVillageId: (villageId: string) => void;
  readonly onSetLandmark: (landmark: string) => void;
  readonly onSetSaveDetails: (save: boolean) => void;
  readonly errors?: Readonly<Record<string, string>>;
}

/**
 * Step 3: Customer & Delivery Details Component.
 */
export function Step3CustomerDetails({
  customerName,
  customerPhone,
  villageId,
  landmark,
  saveDetails,
  availableVillages,
  onSetCustomerName,
  onSetCustomerPhone,
  onSetVillageId,
  onSetLandmark,
  onSetSaveDetails,
  errors = {},
}: Step3CustomerDetailsProps): JSX.Element {
  const { language, isHindi, t } = useLanguage();

  const handlePhoneChange = useCallback(
    (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
      const digitsOnly = changeEvent.target.value.replace(/\D/g, '').slice(0, 10);
      onSetCustomerPhone(digitsOnly);
    },
    [onSetCustomerPhone]
  );

  return React.createElement(
    'div',
    { className: 'asj-wizard-step asj-wizard-step--3' },
    React.createElement(
      'div',
      { className: 'asj-wizard-step__header' },
      React.createElement(
        'h3',
        { className: 'asj-wizard-step__title' },
        t.wizard.form.customerDetailsHeading
      )
    ),

    React.createElement(
      'div',
      { className: 'asj-customer-form' },
      // Full Name
      React.createElement(
        'div',
        { className: 'asj-form-group' },
        React.createElement(
          'label',
          { htmlFor: 'customer-name-input', className: 'asj-form-label' },
          React.createElement(User, { size: 16, 'aria-hidden': true }),
          ' ',
          t.wizard.form.fullNameLabel
        ),
        React.createElement(
          'div',
          { className: 'asj-input-wrap' },
          React.createElement('input', {
            id: 'customer-name-input',
            type: 'text',
            autoComplete: 'name',
            value: customerName,
            onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
              onSetCustomerName(changeEvent.target.value),
            placeholder: t.wizard.form.fullNamePlaceholder,
            className: `asj-input ${errors.customerName ? 'asj-input--error' : ''}`,
            'aria-invalid': Boolean(errors.customerName),
            'aria-describedby': errors.customerName ? 'name-error-msg' : undefined,
          })
        ),
        errors.customerName &&
          React.createElement(
            'p',
            { id: 'name-error-msg', className: 'asj-form-error', role: 'alert' },
            React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
            ' ',
            errors.customerName
          )
      ),

      // 10-Digit Mobile Phone
      React.createElement(
        'div',
        { className: 'asj-form-group' },
        React.createElement(
          'label',
          { htmlFor: 'customer-phone-input', className: 'asj-form-label' },
          React.createElement(Phone, { size: 16, 'aria-hidden': true }),
          ' ',
          t.wizard.form.phoneLabel
        ),
        React.createElement(
          'div',
          { className: 'asj-phone-input-wrap' },
          React.createElement('span', { className: 'asj-phone-prefix', 'aria-hidden': true }, '+91'),
          React.createElement('input', {
            id: 'customer-phone-input',
            type: 'tel',
            inputMode: 'numeric',
            autoComplete: 'tel-national',
            value: customerPhone,
            onChange: handlePhoneChange,
            placeholder: t.wizard.form.phonePlaceholder,
            className: `asj-input asj-input--phone ${errors.customerPhone ? 'asj-input--error' : ''}`,
            'aria-invalid': Boolean(errors.customerPhone),
            'aria-describedby': errors.customerPhone ? 'phone-error-msg' : undefined,
          })
        ),
        errors.customerPhone &&
          React.createElement(
            'p',
            { id: 'phone-error-msg', className: 'asj-form-error', role: 'alert' },
            React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
            ' ',
            errors.customerPhone
          )
      ),

      // Village Dropdown
      React.createElement(
        'div',
        { className: 'asj-form-group' },
        React.createElement(
          'label',
          { htmlFor: 'village-select', className: 'asj-form-label' },
          React.createElement(MapPin, { size: 16, 'aria-hidden': true }),
          ' ',
          t.wizard.form.villageLabel
        ),
        React.createElement(
          'div',
          { className: 'asj-input-wrap' },
          React.createElement(
            'select',
            {
              id: 'village-select',
              value: villageId,
              onChange: (changeEvent: React.ChangeEvent<HTMLSelectElement>) =>
                onSetVillageId(changeEvent.target.value),
              className: `asj-select ${errors.villageId ? 'asj-select--error' : ''}`,
              'aria-invalid': Boolean(errors.villageId),
              'aria-describedby': errors.villageId ? 'village-error-msg' : undefined,
            },
            React.createElement(
              'option',
              { value: '' },
              t.wizard.form.selectVillagePlaceholder
            ),
            availableVillages.map((villageItem) => {
              const villageDisplayName = villageItem.getName(language as SupportedLanguage);
              const distanceKm = villageItem.getDistanceKm();
              const slaText = villageItem.getDeliverySla(language as SupportedLanguage);
              return React.createElement(
                'option',
                { key: villageItem.getId(), value: villageItem.getId() },
                `${villageDisplayName} (${slaText} • ${distanceKm} km)`
              );
            })
          )
        ),
        errors.villageId &&
          React.createElement(
            'p',
            { id: 'village-error-msg', className: 'asj-form-error', role: 'alert' },
            React.createElement(AlertCircle, { size: 14, 'aria-hidden': true }),
            ' ',
            errors.villageId
          )
      ),

      // Landmark
      React.createElement(
        'div',
        { className: 'asj-form-group' },
        React.createElement(
          'label',
          { htmlFor: 'landmark-input', className: 'asj-form-label' },
          React.createElement(MapPin, { size: 16, 'aria-hidden': true }),
          ' ',
          t.wizard.form.landmarkLabel
        ),
        React.createElement('input', {
          id: 'landmark-input',
          type: 'text',
          value: landmark,
          onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
            onSetLandmark(changeEvent.target.value),
          placeholder: t.wizard.form.landmarkPlaceholder,
          className: 'asj-input',
        })
      ),

      // Save Details Checkbox
      React.createElement(
        'div',
        { className: 'asj-checkbox-card asj-checkbox-card--subtle' },
        React.createElement(
          'label',
          { className: 'asj-checkbox-label' },
          React.createElement('input', {
            type: 'checkbox',
            checked: saveDetails,
            onChange: (changeEvent: React.ChangeEvent<HTMLInputElement>) =>
              onSetSaveDetails(changeEvent.target.checked),
            className: 'asj-checkbox-input',
          }),
          React.createElement(
            'div',
            { className: 'asj-checkbox-content' },
            React.createElement(
              'span',
              { className: 'asj-checkbox-title' },
              t.wizard.form.saveDetailsLabel
            ),
            React.createElement(
              'span',
              { className: 'asj-checkbox-subtitle' },
              isHindi
                ? 'अगली बार सीधे एक क्लिक में ऑर्डर करने के लिए जानकारी सुरक्षित रहेगी।'
                : 'Saves your name, phone, and village on this browser for faster repeat orders.'
            )
          )
        )
      )
    )
  );
}
