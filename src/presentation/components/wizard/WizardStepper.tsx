'use client';

import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import type { WizardStepNumber } from '../../hooks/useBookingWizard';
import { useLanguage } from '../../i18n/useLanguage';

export interface WizardStepperProps {
  readonly currentStep: WizardStepNumber;
  readonly onStepClick?: (stepNumber: WizardStepNumber) => void;
  readonly className?: string;
}

interface StepMeta {
  readonly stepNumber: WizardStepNumber;
  readonly labelKey: 'serviceSelect' | 'quantityDetails' | 'customerDetails' | 'reviewSummary';
}

const STEP_DEFINITIONS: readonly StepMeta[] = [
  { stepNumber: 1, labelKey: 'serviceSelect' },
  { stepNumber: 2, labelKey: 'quantityDetails' },
  { stepNumber: 3, labelKey: 'customerDetails' },
  { stepNumber: 4, labelKey: 'reviewSummary' },
];

/**
 * Accessible multi-step wizard progress navigation.
 * Displays step numbers, titles, and completion indicators.
 */
export function WizardStepper({
  currentStep,
  onStepClick,
  className = '',
}: WizardStepperProps): JSX.Element {
  const { t } = useLanguage();

  const handleStepClick = useCallback(
    (stepNumber: WizardStepNumber) => {
      if (stepNumber < currentStep && onStepClick) {
        onStepClick(stepNumber);
      }
    },
    [currentStep, onStepClick]
  );

  return React.createElement(
    'nav',
    {
      className: `asj-stepper ${className}`.trim(),
      'aria-label': 'Order progress navigation',
    },
    React.createElement(
      'ol',
      { className: 'asj-stepper__list' },
      STEP_DEFINITIONS.map((stepItem, stepIndex) => {
        const isCompleted = stepItem.stepNumber < currentStep;
        const isActive = stepItem.stepNumber === currentStep;
        const isClickable = isCompleted && Boolean(onStepClick);
        const stepLabel = t.wizard.stepNames[stepItem.labelKey];

        const itemClasses = [
          'asj-stepper__item',
          isActive
            ? 'asj-stepper__item--active'
            : isCompleted
            ? 'asj-stepper__item--completed'
            : 'asj-stepper__item--pending',
        ].join(' ');

        return React.createElement(
          'li',
          { key: stepItem.stepNumber, className: itemClasses },
          stepIndex > 0 &&
            React.createElement('div', {
              className: `asj-stepper__connector ${
                stepItem.stepNumber <= currentStep ? 'asj-stepper__connector--active' : ''
              }`,
              'aria-hidden': true,
            }),
          React.createElement(
            'button',
            {
              type: 'button',
              className: `asj-stepper__button ${
                isClickable ? 'asj-stepper__button--clickable' : ''
              }`,
              onClick: () => handleStepClick(stepItem.stepNumber),
              disabled: !isClickable,
              'aria-current': isActive ? 'step' : undefined,
              'aria-label': `Step ${stepItem.stepNumber}: ${stepLabel}`,
            },
            React.createElement(
              'span',
              { className: 'asj-stepper__indicator' },
              isCompleted
                ? React.createElement(Check, {
                    className: 'asj-stepper__icon',
                    size: 16,
                    'aria-hidden': true,
                  })
                : React.createElement(
                    'span',
                    { className: 'asj-stepper__number' },
                    stepItem.stepNumber
                  )
            ),
            React.createElement('span', { className: 'asj-stepper__label' }, stepLabel)
          )
        );
      })
    )
  );
}
