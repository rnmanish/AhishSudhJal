'use client';

import React, { useMemo } from 'react';
import type { TdsGrade } from '../../../core/domain/value-objects/TdsReading';
import { useLanguage } from '../../i18n/useLanguage';

export interface TdsGaugeProps {
  readonly ppm: number;
  readonly activeGrade: TdsGrade;
  readonly className?: string;
}

interface GaugeBand {
  readonly grade: TdsGrade;
  readonly rangeLabel: string;
  readonly nameEn: string;
  readonly nameHi: string;
  readonly minPpm: number;
  readonly maxPpm: number;
  readonly colorHex: string;
  readonly isIdeal?: boolean;
}

const GAUGE_BANDS: readonly GaugeBand[] = [
  {
    grade: 'LOW_MINERAL',
    rangeLabel: '< 50',
    nameEn: 'Low Mineral',
    nameHi: 'कम खनिज',
    minPpm: 0,
    maxPpm: 50,
    colorHex: '#38bdf8',
  },
  {
    grade: 'IDEAL',
    rangeLabel: '50 - 150',
    nameEn: 'Ideal RO (ASJ)',
    nameHi: 'सर्वश्रेष्ठ आरओ',
    minPpm: 50,
    maxPpm: 150,
    colorHex: '#10b981',
    isIdeal: true,
  },
  {
    grade: 'ACCEPTABLE',
    rangeLabel: '150 - 300',
    nameEn: 'Acceptable',
    nameHi: 'स्वीकार्य',
    minPpm: 150,
    maxPpm: 300,
    colorHex: '#06b6d4',
  },
  {
    grade: 'HARD',
    rangeLabel: '300 - 500',
    nameEn: 'Hard Water',
    nameHi: 'कठोर पानी',
    minPpm: 300,
    maxPpm: 500,
    colorHex: '#f59e0b',
  },
  {
    grade: 'POOR',
    rangeLabel: '500+',
    nameEn: 'Unsafe',
    nameHi: 'असुरक्षित',
    minPpm: 500,
    maxPpm: 1000,
    colorHex: '#ef4444',
  },
];

export function TdsGauge({ ppm, activeGrade, className }: TdsGaugeProps): JSX.Element {
  const { isHindi } = useLanguage();

  const markerPercentage = useMemo(() => {
    const clampedPpm = Math.min(Math.max(ppm, 0), 1000);
    return (clampedPpm / 1000) * 100;
  }, [ppm]);

  const containerClasses = useMemo(() => {
    return ['asj-tds-gauge', className].filter(Boolean).join(' ');
  }, [className]);

  const headerElement = React.createElement(
    'div',
    { className: 'asj-tds-gauge__header' },
    React.createElement(
      'span',
      { className: 'asj-tds-gauge__title' },
      isHindi ? 'टीडीएस शुद्धता पैमाना (WHO/BIS मानक)' : 'TDS Quality Spectrum (WHO/BIS)'
    ),
    React.createElement(
      'span',
      { className: 'asj-tds-gauge__current-indicator' },
      `${ppm} PPM`
    )
  );

  const trackSegments = GAUGE_BANDS.map((bandItem) => {
    const isBandActive = bandItem.grade === activeGrade;
    const bandSegmentClass = [
      'asj-tds-gauge__segment',
      isBandActive ? 'asj-tds-gauge__segment--active' : '',
      bandItem.isIdeal ? 'asj-tds-gauge__segment--ideal' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return React.createElement('div', {
      key: bandItem.grade,
      className: bandSegmentClass,
      style: {
        backgroundColor: bandItem.colorHex,
        opacity: isBandActive ? 1 : 0.45,
      },
    });
  });

  const markerElement = React.createElement(
    'div',
    {
      className: 'asj-tds-gauge__marker',
      style: { left: `${markerPercentage}%` },
    },
    React.createElement('div', { className: 'asj-tds-gauge__marker-arrow' }),
    React.createElement('div', { className: 'asj-tds-gauge__marker-bubble' }, ppm)
  );

  const trackWrapperElement = React.createElement(
    'div',
    { className: 'asj-tds-gauge__track-wrapper', 'aria-hidden': true },
    React.createElement('div', { className: 'asj-tds-gauge__track' }, trackSegments),
    markerElement
  );

  const labelElements = GAUGE_BANDS.map((bandItem) => {
    const isBandActive = bandItem.grade === activeGrade;
    const labelClasses = [
      'asj-tds-gauge__label-item',
      isBandActive ? 'asj-tds-gauge__label-item--active' : '',
      bandItem.isIdeal ? 'asj-tds-gauge__label-item--ideal' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return React.createElement(
      'div',
      { key: bandItem.grade, className: labelClasses },
      React.createElement(
        'span',
        { className: 'asj-tds-gauge__range-text' },
        bandItem.rangeLabel
      ),
      React.createElement(
        'span',
        { className: 'asj-tds-gauge__name-text' },
        isHindi ? bandItem.nameHi : bandItem.nameEn
      )
    );
  });

  const labelsContainerElement = React.createElement(
    'div',
    { className: 'asj-tds-gauge__labels', 'aria-hidden': true },
    labelElements
  );

  return React.createElement(
    'div',
    {
      className: containerClasses,
      'aria-label': 'TDS Scale Spectrum',
      role: 'group',
    },
    headerElement,
    trackWrapperElement,
    labelsContainerElement
  );
}
