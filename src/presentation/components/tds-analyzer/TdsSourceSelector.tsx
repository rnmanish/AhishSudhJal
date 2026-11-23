'use client';

import React from 'react';
import { Droplet, Waves, Filter, Truck } from 'lucide-react';
import type { WaterSourceType } from '../../../core/use-cases/tds/CalculateTdsQualityUseCase';
import { useLanguage } from '../../i18n/useLanguage';

export interface TdsSourceSelectorProps {
  readonly selectedSource: WaterSourceType | undefined;
  readonly onSourceSelect: (source: WaterSourceType) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

interface SourceOptionItem {
  readonly type: WaterSourceType;
  readonly translationKey: 'chapakal' | 'submersible' | 'nalJal' | 'tanker';
  readonly ruralBadgeHi: string;
  readonly ruralBadgeEn: string;
}

const WATER_SOURCE_CONFIGS: readonly SourceOptionItem[] = [
  {
    type: 'chapakal',
    translationKey: 'chapakal',
    ruralBadgeHi: 'सिवान के गांवों में सबसे आम',
    ruralBadgeEn: 'Most common in Siwan',
  },
  {
    type: 'submersible',
    translationKey: 'submersible',
    ruralBadgeHi: 'गहरा बोरवेल जल',
    ruralBadgeEn: 'Deep borewell source',
  },
  {
    type: 'nal_jal',
    translationKey: 'nalJal',
    ruralBadgeHi: 'हर घर नल का जल',
    ruralBadgeEn: 'Govt piped supply',
  },
  {
    type: 'tanker',
    translationKey: 'tanker',
    ruralBadgeHi: 'सप्लाई / टैंकर',
    ruralBadgeEn: 'Commercial supply',
  },
];

function renderSourceIcon(sourceType: WaterSourceType): JSX.Element {
  if (sourceType === 'chapakal') {
    return React.createElement(Droplet, {
      size: 22,
      className: 'asj-tds-source-selector__icon',
    });
  }
  if (sourceType === 'submersible') {
    return React.createElement(Waves, {
      size: 22,
      className: 'asj-tds-source-selector__icon',
    });
  }
  if (sourceType === 'nal_jal') {
    return React.createElement(Filter, {
      size: 22,
      className: 'asj-tds-source-selector__icon',
    });
  }
  return React.createElement(Truck, {
    size: 22,
    className: 'asj-tds-source-selector__icon',
  });
}

export function TdsSourceSelector({
  selectedSource,
  onSourceSelect,
  disabled = false,
  className,
}: TdsSourceSelectorProps): JSX.Element {
  const { t, isHindi } = useLanguage();

  const containerClasses = ['asj-tds-source-selector', className].filter(Boolean).join(' ');

  const labelElement = React.createElement(
    'label',
    {
      className: 'asj-tds-source-selector__label',
      id: 'tds-source-group-label',
    },
    t.tds.sourceSelectLabel
  );

  const sourceOptionButtons = WATER_SOURCE_CONFIGS.map((sourceOption) => {
    const isSelected = selectedSource === sourceOption.type;
    const sourceName = t.tds.sources[sourceOption.translationKey];
    const ruralBadge = isHindi
      ? sourceOption.ruralBadgeHi
      : sourceOption.ruralBadgeEn;
    const buttonClasses = [
      'asj-tds-source-selector__btn',
      isSelected ? 'asj-tds-source-selector__btn--active' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return React.createElement(
      'button',
      {
        key: sourceOption.type,
        type: 'button',
        role: 'radio',
        'aria-checked': isSelected,
        disabled,
        onClick: () => onSourceSelect(sourceOption.type),
        className: buttonClasses,
      },
      React.createElement(
        'div',
        { className: 'asj-tds-source-selector__icon-wrap' },
        renderSourceIcon(sourceOption.type)
      ),
      React.createElement(
        'div',
        { className: 'asj-tds-source-selector__content' },
        React.createElement(
          'span',
          { className: 'asj-tds-source-selector__name' },
          sourceName
        ),
        React.createElement(
          'span',
          { className: 'asj-tds-source-selector__badge' },
          ruralBadge
        )
      )
    );
  });

  const gridElement = React.createElement(
    'div',
    {
      className: 'asj-tds-source-selector__grid',
      role: 'radiogroup',
      'aria-labelledby': 'tds-source-group-label',
    },
    sourceOptionButtons
  );

  return React.createElement(
    'div',
    { className: containerClasses },
    labelElement,
    gridElement
  );
}
