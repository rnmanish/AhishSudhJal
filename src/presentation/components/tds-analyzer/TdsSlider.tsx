'use client';

import React, { useCallback, useId } from 'react';
import type { TdsPresetOption } from '../../hooks/useTdsAnalyzer';
import { TDS_PRESETS } from '../../hooks/useTdsAnalyzer';
import { useLanguage } from '../../i18n/useLanguage';

export interface TdsSliderProps {
  readonly ppm: number;
  readonly onPpmChange: (nextPpm: number) => void;
  readonly presets?: readonly TdsPresetOption[];
  readonly disabled?: boolean;
  readonly className?: string;
}

export function TdsSlider({
  ppm,
  onPpmChange,
  presets = TDS_PRESETS,
  disabled = false,
  className,
}: TdsSliderProps): JSX.Element {
  const { t, isHindi } = useLanguage();
  const sliderInputId = useId();

  const handleSliderChange = useCallback(
    (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
      const parsedValue = Number(changeEvent.target.value);
      if (Number.isFinite(parsedValue)) {
        onPpmChange(parsedValue);
      }
    },
    [onPpmChange]
  );

  const containerClasses = ['asj-tds-slider', className].filter(Boolean).join(' ');

  const headerElement = React.createElement(
    'div',
    { className: 'asj-tds-slider__header' },
    React.createElement(
      'label',
      { htmlFor: sliderInputId, className: 'asj-tds-slider__label' },
      t.tds.sliderLabel
    ),
    React.createElement(
      'div',
      { className: 'asj-tds-slider__readout', 'aria-live': 'polite' },
      React.createElement(
        'span',
        { className: 'asj-tds-slider__readout-value' },
        ppm
      ),
      React.createElement(
        'span',
        { className: 'asj-tds-slider__readout-unit' },
        'PPM'
      )
    )
  );

  const inputWrapperElement = React.createElement(
    'div',
    { className: 'asj-tds-slider__input-wrapper' },
    React.createElement('input', {
      id: sliderInputId,
      type: 'range',
      min: 0,
      max: 1000,
      step: 5,
      value: ppm,
      disabled,
      onChange: handleSliderChange,
      'aria-label': t.tds.sliderLabel,
      'aria-valuemin': 0,
      'aria-valuemax': 1000,
      'aria-valuenow': ppm,
      'aria-valuetext': `${ppm} PPM`,
      className: 'asj-tds-slider__range-input',
    }),
    React.createElement(
      'div',
      { className: 'asj-tds-slider__scale-endpoints', 'aria-hidden': true },
      React.createElement('span', null, '0 PPM (Pure Distilled)'),
      React.createElement('span', null, '1000+ PPM (Highly Contaminated)')
    )
  );

  const presetButtons = presets.map((presetOption) => {
    const isSelected = presetOption.ppm === ppm;
    const presetBtnClasses = [
      'asj-tds-slider__preset-btn',
      isSelected ? 'asj-tds-slider__preset-btn--active' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return React.createElement(
      'button',
      {
        key: presetOption.ppm,
        type: 'button',
        disabled,
        'aria-pressed': isSelected,
        onClick: () => onPpmChange(presetOption.ppm),
        className: presetBtnClasses,
      },
      React.createElement(
        'span',
        { className: 'asj-tds-slider__preset-ppm' },
        presetOption.ppm
      ),
      React.createElement(
        'span',
        { className: 'asj-tds-slider__preset-label' },
        isHindi ? presetOption.labelHi : presetOption.labelEn
      )
    );
  });

  const presetsContainerElement =
    presets && presets.length > 0
      ? React.createElement(
          'div',
          { className: 'asj-tds-slider__presets' },
          React.createElement(
            'span',
            { className: 'asj-tds-slider__presets-title' },
            isHindi ? 'त्वरित जांच उदाहरण:' : 'Quick Presets:'
          ),
          React.createElement(
            'div',
            {
              className: 'asj-tds-slider__presets-grid',
              role: 'group',
              'aria-label': 'TDS Quick Presets',
            },
            presetButtons
          )
        )
      : null;

  return React.createElement(
    'div',
    { className: containerClasses },
    headerElement,
    inputWrapperElement,
    presetsContainerElement
  );
}
