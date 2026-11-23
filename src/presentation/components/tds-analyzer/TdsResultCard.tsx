'use client';

import React, { useMemo } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ExternalLink,
  Info,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { TdsQualityAnalysisResult, WaterSourceType } from '../../../core/use-cases/tds/CalculateTdsQualityUseCase';
import { useLanguage } from '../../i18n/useLanguage';

export interface TdsResultCardProps {
  readonly analysisResult: TdsQualityAnalysisResult;
  readonly source?: WaterSourceType;
  readonly className?: string;
  readonly onConsultClick?: () => void;
}

export function TdsResultCard({
  analysisResult,
  source,
  className,
  onConsultClick,
}: TdsResultCardProps): JSX.Element {
  const { t, isHindi } = useLanguage();
  const classification = analysisResult.classification;
  const isSafe = classification.isSafe;
  const currentPpm = analysisResult.ppm;

  const statusLabel = isHindi ? classification.labelHi : classification.labelEn;
  const statusDescription = isHindi ? classification.descriptionHi : classification.descriptionEn;
  const actionRequired = isHindi ? classification.actionRequiredHi : classification.actionRequiredEn;
  const sourceContext = isHindi ? analysisResult.sourceContextHi : analysisResult.sourceContextEn;

  // Bilingual WhatsApp Consultation Message Generator
  const whatsappUrl = useMemo(() => {
    const whatsappPhone = t.brand.hotlineNumber ? `91${t.brand.hotlineNumber}` : '918235882384';
    const sourceDisplayName = source
      ? source === 'chapakal'
        ? isHindi
          ? 'चापाकल (हैंडपंप)'
          : 'Handpump (Chapakal)'
        : source === 'submersible'
        ? isHindi
          ? 'सबमर्सिबल'
          : 'Submersible'
        : source === 'nal_jal'
        ? isHindi
          ? 'नल-जल'
          : 'Nal-Jal Piped Supply'
        : isHindi
        ? 'टैंकर'
        : 'Tanker'
      : isHindi
      ? 'घरेलू स्रोत'
      : 'Home Source';

    const rawMessage = isHindi
      ? `नमस्ते आशीष शुद्ध जल! मैंने आपके टीडीएस कैलकुलेटर पर अपने पानी की जांच की है:
• स्रोत: ${sourceDisplayName}
• टीडीएस: ${currentPpm} PPM (${statusLabel})
• सुरक्षा स्थिति: ${isSafe ? 'पीने योग्य' : 'असुरक्षित (आरओ जरूरी)'}

कृपया मुझे शुद्ध और सुरक्षित 20L आरओ जार डिलीवरी के बारे में विवरण बताएं।`
      : `Hello Ashish Sudh Jal! I checked my home water quality on your TDS Analyzer:
• Source: ${sourceDisplayName}
• TDS: ${currentPpm} PPM (${statusLabel})
• Status: ${isSafe ? 'Safe for drinking' : 'Unsafe (RO purification needed)'}

Please share details about your 20L pure RO drinking water jar delivery in my area.`;

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(rawMessage)}`;
  }, [t.brand.hotlineNumber, source, isHindi, currentPpm, statusLabel, isSafe]);

  const containerClasses = [
    'asj-tds-result-card',
    isSafe ? 'asj-tds-result-card--safe' : 'asj-tds-result-card--unsafe',
    classification.grade === 'IDEAL' ? 'asj-tds-result-card--ideal' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Grade badge element with color coding
  const gradeBadgeElement = React.createElement(
    'span',
    {
      className: 'asj-tds-result-card__grade-badge',
      style: {
        backgroundColor: `${classification.colorHex}22`,
        borderColor: classification.colorHex,
        color: classification.colorHex,
      },
    },
    classification.grade === 'IDEAL'
      ? React.createElement(Sparkles, {
          size: 14,
          className: 'asj-tds-result-card__sparkle-icon',
        })
      : null,
    statusLabel
  );

  // Safety tag element
  const safetyTagElement = React.createElement(
    'span',
    {
      className: `asj-tds-result-card__safety-tag ${
        isSafe
          ? 'asj-tds-result-card__safety-tag--safe'
          : 'asj-tds-result-card__safety-tag--danger'
      }`,
    },
    isSafe
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(CheckCircle2, { size: 15 }),
          React.createElement('span', null, isHindi ? 'पीने के लिए सुरक्षित' : 'Safe for Drinking')
        )
      : React.createElement(
          React.Fragment,
          null,
          React.createElement(ShieldAlert, { size: 15 }),
          React.createElement('span', null, isHindi ? 'असुरक्षित - आरओ आवश्यक' : 'Unsafe - RO Required')
        )
  );

  // Headline
  const headlineText =
    classification.grade === 'IDEAL'
      ? isHindi
        ? 'अमृत तुल्य शुद्ध व मीठा जल'
        : 'Optimal Sweet Taste & Healthy Minerals'
      : isSafe
      ? isHindi
        ? 'सामान्य सुरक्षित पेयजल'
        : 'Acceptable Drinking Water'
      : isHindi
      ? 'स्वास्थ्य के लिए हानिकारक एवं भारी जल'
      : 'Unsafe Mineral Density for Direct Drinking';

  const headerElement = React.createElement(
    'div',
    { className: 'asj-tds-result-card__header' },
    React.createElement(
      'div',
      { className: 'asj-tds-result-card__badge-row' },
      gradeBadgeElement,
      safetyTagElement
    ),
    React.createElement('h3', { className: 'asj-tds-result-card__headline' }, headlineText)
  );

  // Body Elements
  const descriptionElement = React.createElement(
    'p',
    { className: 'asj-tds-result-card__desc' },
    statusDescription
  );

  const actionBoxElement = React.createElement(
    'div',
    { className: 'asj-tds-result-card__action-box' },
    React.createElement(
      'div',
      { className: 'asj-tds-result-card__action-icon-wrap' },
      isSafe
        ? React.createElement(ShieldCheck, {
            size: 20,
            className: 'asj-tds-result-card__action-icon--safe',
          })
        : React.createElement(AlertTriangle, {
            size: 20,
            className: 'asj-tds-result-card__action-icon--warn',
          })
    ),
    React.createElement(
      'div',
      { className: 'asj-tds-result-card__action-text' },
      React.createElement(
        'span',
        { className: 'asj-tds-result-card__action-title' },
        isHindi ? 'विशेषज्ञ सलाह / समाधान:' : 'Expert Recommendation:'
      ),
      React.createElement(
        'p',
        { className: 'asj-tds-result-card__action-desc' },
        actionRequired
      )
    )
  );

  const sourceContextElement = sourceContext
    ? React.createElement(
        'div',
        { className: 'asj-tds-result-card__source-context' },
        React.createElement(Info, {
          size: 16,
          className: 'asj-tds-result-card__info-icon',
        }),
        React.createElement(
          'p',
          { className: 'asj-tds-result-card__source-text' },
          sourceContext
        )
      )
    : null;

  const promiseElement = React.createElement(
    'div',
    { className: 'asj-tds-result-card__asj-promise' },
    React.createElement(
      'div',
      { className: 'asj-tds-result-card__promise-header' },
      React.createElement(Award, {
        size: 18,
        className: 'asj-tds-result-card__promise-icon',
      }),
      React.createElement(
        'span',
        { className: 'asj-tds-result-card__promise-title' },
        isHindi ? 'आशीष शुद्ध जल गुणवत्ता गारंटी' : 'Ashish Sudh Jal Quality Assurance'
      )
    ),
    React.createElement(
      'p',
      { className: 'asj-tds-result-card__promise-text' },
      t.tds.asjQualityNotice
    )
  );

  const bodyElement = React.createElement(
    'div',
    { className: 'asj-tds-result-card__body' },
    descriptionElement,
    actionBoxElement,
    sourceContextElement,
    promiseElement
  );

  // Footer CTA
  const footerElement = React.createElement(
    'div',
    { className: 'asj-tds-result-card__footer' },
    React.createElement(
      'a',
      {
        href: whatsappUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: onConsultClick,
        className: 'asj-tds-result-card__whatsapp-cta',
      },
      React.createElement(MessageCircle, { size: 19 }),
      React.createElement(
        'span',
        null,
        isHindi
          ? 'व्हाट्सएप पर पानी जांच व आरओ समाधान पूछें'
          : 'Consult Water Quality via WhatsApp'
      ),
      React.createElement(ExternalLink, {
        size: 16,
        className: 'asj-tds-result-card__ext-icon',
      })
    )
  );

  return React.createElement(
    'div',
    { className: containerClasses, 'aria-live': 'polite' },
    headerElement,
    bodyElement,
    footerElement
  );
}
