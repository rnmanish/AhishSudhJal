import type { IOrderDispatcher } from '../../core/domain/repositories/IOrderDispatcher';
import type { OrderDraft, CalculatedOrderSummary } from '../../core/domain/entities/OrderDraft';
import type { SupportedLanguage } from '../../core/domain/value-objects/Language';
import { dictionaries } from '../../locales';

export class WhatsAppLinkDispatcher implements IOrderDispatcher {
  private readonly businessPhoneNumber: string;

  constructor(businessPhoneNumber: string = dictionaries.en.brand.whatsappNumber) {
    if (!businessPhoneNumber || typeof businessPhoneNumber !== 'string') {
      throw new Error('Business WhatsApp phone number must be a non-empty string.');
    }

    let cleaned = businessPhoneNumber.replace(/[\s+()-]/g, '');

    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.slice(1);
    }

    if (cleaned.length === 10) {
      cleaned = `91${cleaned}`;
    }

    const indianMobileRegex = /^91[6-9]\d{9}$/;
    if (!indianMobileRegex.test(cleaned)) {
      throw new Error(
        `Invalid business WhatsApp phone number: "${businessPhoneNumber}". Must be a valid 10-digit Indian mobile number.`
      );
    }

    this.businessPhoneNumber = cleaned;
  }

  public getBusinessPhoneNumber(): string {
    return this.businessPhoneNumber;
  }

  public generateWhatsAppUrl(
    draft: OrderDraft,
    summary: CalculatedOrderSummary,
    lang: SupportedLanguage
  ): string {
    const message = this.formatMessage(draft, summary, lang);
    return `https://wa.me/${this.businessPhoneNumber}?text=${encodeURIComponent(message)}`;
  }

  public formatMessage(
    draft: OrderDraft,
    summary: CalculatedOrderSummary,
    lang: SupportedLanguage
  ): string {
    const langCode: SupportedLanguage = lang === 'en' ? 'en' : 'hi';
    const templates = dictionaries[langCode].whatsappTemplates;
    const props = draft.getProps();

    const sections: string[] = [];

    // 1. Header
    sections.push(templates.header);

    // 2. Customer Details
    const customerLines: string[] = [
      templates.customerHeading,
      `${templates.nameLabel} ${props.customerName}`,
      `${templates.phoneLabel} ${props.customerPhone.getFormatted()}`,
      `${templates.villageLabel} ${props.villageName}`,
    ];
    if (props.landmark && props.landmark.trim()) {
      customerLines.push(`${templates.landmarkLabel} ${props.landmark.trim()}`);
    }
    sections.push(customerLines.join('\n'));

    // 3. Service-Specific Order Details
    switch (props.serviceType) {
      case 'jar':
        sections.push(this.formatJarDetails(props, summary, langCode));
        sections.push(this.formatJarPayment(props, summary, langCode));
        break;

      case 'bulk_bottles':
        sections.push(this.formatBulkBottlesDetails(props, langCode));
        break;

      case 'event':
        sections.push(this.formatEventDetails(props, langCode));
        break;
    }

    // 4. Special Instructions (if present)
    if (props.notes && props.notes.trim()) {
      sections.push(`${templates.specialInstructionsHeading}\n${props.notes.trim()}`);
    }

    // 5. Closing / CTA
    sections.push(templates.closingCta);

    return sections.join('\n\n');
  }

  private formatJarDetails(
    props: ReturnType<OrderDraft['getProps']>,
    summary: CalculatedOrderSummary,
    langCode: SupportedLanguage
  ): string {
    const dict = dictionaries[langCode];
    const templates = dict.whatsappTemplates;
    const lines: string[] = [templates.orderHeading];
    const isChilled = props.temperature === 'chilled';

    lines.push(isChilled ? templates.chilledJarProductTitle : templates.normalJarProductTitle);

    const unit = props.quantity > 1 ? templates.units.jarPlural : templates.units.jarSingular;
    lines.push(`${templates.quantityLabel} ${props.quantity} ${unit}`);

    if (props.isRecurring) {
      const freqLabel = this.getFrequencyLabel(props.frequency, langCode);
      lines.push(`${templates.recurringSubscriptionPrefix} (${freqLabel})`);
      lines.push(
        `${templates.rateLabel} ${summary.unitPrice?.format() ?? dict.products.jarNormal.recurringDisplay} ${templates.perJarLabel}`
      );
      if (!summary.recurringSavings.isZero()) {
        lines.push(`${templates.recurringDiscountLabel} ${summary.recurringSavings.format()} ${templates.savingsLabel}`);
      }
    } else {
      lines.push(templates.oneTimeOrder);
      lines.push(
        `${templates.rateLabel} ${summary.unitPrice?.format() ?? dict.products.jarNormal.priceDisplay} ${templates.perJarLabel}`
      );
    }

    lines.push(props.isFirstOrder ? templates.depositFirstOrder : templates.depositExistingCustomer);

    return lines.join('\n');
  }

  private formatJarPayment(
    props: ReturnType<OrderDraft['getProps']>,
    summary: CalculatedOrderSummary,
    langCode: SupportedLanguage
  ): string {
    const templates = dictionaries[langCode].whatsappTemplates;
    const lines: string[] = [templates.paymentHeading];

    lines.push(`${templates.waterAmountLabel} ${summary.baseAmount.format()}`);
    if (props.isFirstOrder && !summary.depositAmount.isZero()) {
      lines.push(`${templates.depositAmountLabel} ${summary.depositAmount.format()}`);
    }
    if (props.isRecurring && !summary.recurringSavings.isZero()) {
      lines.push(`${templates.totalSavingsLabel} ${summary.recurringSavings.format()}`);
    }
    lines.push(`${templates.totalPayableLabel} ${summary.totalAmountPayable.format()}`);

    return lines.join('\n');
  }

  private formatBulkBottlesDetails(
    props: ReturnType<OrderDraft['getProps']>,
    langCode: SupportedLanguage
  ): string {
    const templates = dictionaries[langCode].whatsappTemplates;
    const lines: string[] = [templates.orderHeading, templates.bulkBottlesProductTitle];

    const unit = props.quantity > 1 ? templates.units.cartonPlural : templates.units.cartonSingular;
    lines.push(`${templates.bulkEstimatedQuantityLabel} ${props.quantity} ${unit}`);
    lines.push(templates.bulkRateText);

    return lines.join('\n');
  }

  private formatEventDetails(
    props: ReturnType<OrderDraft['getProps']>,
    langCode: SupportedLanguage
  ): string {
    const templates = dictionaries[langCode].whatsappTemplates;
    const lines: string[] = [templates.eventHeading];
    const event = props.eventDetails;

    lines.push(`${templates.eventTypeLabel} ${event?.eventType || templates.eventDefaultType}`);
    lines.push(`${templates.eventDateLabel} ${event?.eventDate || templates.eventDateUnavailable}`);
    lines.push(
      `${templates.eventGuestsLabel} ${event?.guestCount !== undefined ? event.guestCount : templates.eventGuestsUnspecified}`
    );
    if (event?.estimatedLitres) {
      lines.push(`${templates.eventWaterLabel} ${event.estimatedLitres} ${templates.eventLitresSuffix}`);
    }
    lines.push(templates.eventZeroDeposit);
    lines.push(templates.eventRateText);

    return lines.join('\n');
  }

  private getFrequencyLabel(frequency: string | undefined, langCode: SupportedLanguage): string {
    const freq = dictionaries[langCode].whatsappTemplates.frequencies;
    switch (frequency) {
      case 'daily':
        return freq.daily;
      case 'alternate_days':
        return freq.alternate_days;
      case 'weekly':
        return freq.weekly;
      default:
        return freq.default;
    }
  }
}
