import type { IOrderDispatcher } from '../../core/domain/repositories/IOrderDispatcher';
import type { OrderDraft, CalculatedOrderSummary } from '../../core/domain/entities/OrderDraft';

export class WhatsAppLinkDispatcher implements IOrderDispatcher {
  private readonly businessPhoneNumber: string;

  constructor(businessPhoneNumber: string = '918235882384') {
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
    lang: 'hi' | 'en'
  ): string {
    const message = this.formatMessage(draft, summary, lang);
    return `https://wa.me/${this.businessPhoneNumber}?text=${encodeURIComponent(message)}`;
  }

  public formatMessage(
    draft: OrderDraft,
    summary: CalculatedOrderSummary,
    lang: 'hi' | 'en'
  ): string {
    const isHindi = lang !== 'en';
    const props = draft.getProps();

    const sections: string[] = [];

    // 1. Header
    if (isHindi) {
      sections.push('💧 *आशीष शुद्ध जल (सरसर, सिवान)*\nनया ऑर्डर अनुरोध:');
    } else {
      sections.push('💧 *Ashish Sudh Jal (Sarsar, Siwan)*\nNew Order Request:');
    }

    // 2. Customer Details
    const customerLines: string[] = [];
    if (isHindi) {
      customerLines.push('👤 *ग्राहक विवरण:*');
      customerLines.push(`• नाम: ${props.customerName}`);
      customerLines.push(`• फोन: ${props.customerPhone.getFormatted()}`);
      customerLines.push(`• गाँव: ${props.villageName}`);
      if (props.landmark && props.landmark.trim()) {
        customerLines.push(`• लैंडमार्क: ${props.landmark.trim()}`);
      }
    } else {
      customerLines.push('👤 *Customer Details:*');
      customerLines.push(`• Name: ${props.customerName}`);
      customerLines.push(`• Phone: ${props.customerPhone.getFormatted()}`);
      customerLines.push(`• Village: ${props.villageName}`);
      if (props.landmark && props.landmark.trim()) {
        customerLines.push(`• Landmark: ${props.landmark.trim()}`);
      }
    }
    sections.push(customerLines.join('\n'));

    // 3. Service-Specific Order Details
    switch (props.serviceType) {
      case 'jar':
        sections.push(this.formatJarDetails(props, summary, isHindi));
        sections.push(this.formatJarPayment(props, summary, isHindi));
        break;

      case 'bulk_bottles':
        sections.push(this.formatBulkBottlesDetails(props, isHindi));
        break;

      case 'event':
        sections.push(this.formatEventDetails(props, isHindi));
        break;
    }

    // 4. Special Instructions (if present)
    if (props.notes && props.notes.trim()) {
      if (isHindi) {
        sections.push(`📝 *विशेष निर्देश:*\n${props.notes.trim()}`);
      } else {
        sections.push(`📝 *Special Instructions:*\n${props.notes.trim()}`);
      }
    }

    // 5. Closing / CTA
    if (isHindi) {
      sections.push('कृपया ऑर्डर एवं डिलीवरी समय की पुष्टि करें। धन्यवाद!');
    } else {
      sections.push('Please confirm the order and delivery SLA. Thank you!');
    }

    return sections.join('\n\n');
  }

  private formatJarDetails(
    props: ReturnType<OrderDraft['getProps']>,
    summary: CalculatedOrderSummary,
    isHindi: boolean
  ): string {
    const lines: string[] = [];
    const isChilled = props.temperature === 'chilled';

    if (isHindi) {
      lines.push('📦 *ऑर्डर विवरण:*');
      lines.push(`• उत्पाद: 20L ${isChilled ? 'ठंडा (चिल्ड)' : 'नॉर्मल'} आरओ पानी जार`);
      lines.push(`• मात्रा: ${props.quantity} जार`);

      if (props.isRecurring) {
        const freqLabel = this.getFrequencyHindi(props.frequency);
        lines.push(`• ऑर्डर प्रकार: नियमित सब्सक्रिप्शन (${freqLabel})`);
        lines.push(`• दर: ${summary.unitPrice?.format() ?? '₹25'} प्रति जार`);
        if (!summary.recurringSavings.isZero()) {
          lines.push(`• नियमित छूट: ${summary.recurringSavings.format()} बचत`);
        }
      } else {
        lines.push('• ऑर्डर प्रकार: एक बार का ऑर्डर');
        lines.push(`• दर: ${summary.unitPrice?.format() ?? '₹30'} प्रति जार`);
      }

      if (props.isFirstOrder) {
        lines.push('• अमानत राशि: ₹150 (जार + डिस्पेंसर - केवल पहला ऑर्डर)');
      } else {
        lines.push('• अमानत राशि: ₹0 (पुराने ग्राहक - कोई अमानत राशि नहीं)');
      }
    } else {
      lines.push('📦 *Order Details:*');
      lines.push(`• Product: 20L ${isChilled ? 'Chilled' : 'Normal'} RO Water Jar`);
      lines.push(`• Quantity: ${props.quantity} ${props.quantity > 1 ? 'Jars' : 'Jar'}`);

      if (props.isRecurring) {
        const freqLabel = this.getFrequencyEnglish(props.frequency);
        lines.push(`• Order Type: Recurring Subscription (${freqLabel})`);
        lines.push(`• Rate: ${summary.unitPrice?.format() ?? '₹25'} per jar`);
        if (!summary.recurringSavings.isZero()) {
          lines.push(`• Recurring Discount: ${summary.recurringSavings.format()} savings`);
        }
      } else {
        lines.push('• Order Type: One-time Order');
        lines.push(`• Rate: ${summary.unitPrice?.format() ?? '₹30'} per jar`);
      }

      if (props.isFirstOrder) {
        lines.push('• Deposit: ₹150 (Jar + Dispenser - First order only)');
      } else {
        lines.push('• Deposit: ₹0 (Existing customer - No deposit)');
      }
    }

    return lines.join('\n');
  }

  private formatJarPayment(
    props: ReturnType<OrderDraft['getProps']>,
    summary: CalculatedOrderSummary,
    isHindi: boolean
  ): string {
    const lines: string[] = [];

    if (isHindi) {
      lines.push('💰 *भुगतान विवरण (कैश / यूपीआई):*');
      lines.push(`• पानी शुल्क: ${summary.baseAmount.format()}`);
      if (props.isFirstOrder && !summary.depositAmount.isZero()) {
        lines.push(`• अमानत राशि: ${summary.depositAmount.format()}`);
      }
      if (props.isRecurring && !summary.recurringSavings.isZero()) {
        lines.push(`• कुल बचत: ${summary.recurringSavings.format()}`);
      }
      lines.push(`• कुल देय राशि: ${summary.totalAmountPayable.format()}`);
    } else {
      lines.push('💰 *Payment Details (Cash / UPI):*');
      lines.push(`• Water Amount: ${summary.baseAmount.format()}`);
      if (props.isFirstOrder && !summary.depositAmount.isZero()) {
        lines.push(`• Deposit Amount: ${summary.depositAmount.format()}`);
      }
      if (props.isRecurring && !summary.recurringSavings.isZero()) {
        lines.push(`• Total Savings: ${summary.recurringSavings.format()}`);
      }
      lines.push(`• Total Amount Payable: ${summary.totalAmountPayable.format()}`);
    }

    return lines.join('\n');
  }

  private formatBulkBottlesDetails(
    props: ReturnType<OrderDraft['getProps']>,
    isHindi: boolean
  ): string {
    const lines: string[] = [];

    if (isHindi) {
      lines.push('📦 *ऑर्डर विवरण:*');
      lines.push('• उत्पाद: पैकेज्ड पानी बोतल (250ml / 500ml / 1L)');
      lines.push(`• अनुमानित मात्रा: ${props.quantity} कार्टन`);
      lines.push('• दर: थोक दर के लिए संपर्क करें (कस्टम कोटेशन)');
    } else {
      lines.push('📦 *Order Details:*');
      lines.push('• Product: Packaged Water Bottles (250ml / 500ml / 1L)');
      lines.push(`• Quantity: ${props.quantity} ${props.quantity > 1 ? 'Cartons' : 'Carton'}`);
      lines.push('• Rate: Contact for bulk pricing (Custom quote)');
    }

    return lines.join('\n');
  }

  private formatEventDetails(
    props: ReturnType<OrderDraft['getProps']>,
    isHindi: boolean
  ): string {
    const lines: string[] = [];
    const event = props.eventDetails;

    if (isHindi) {
      lines.push('🎉 *समारोह / इवेंट विवरण:*');
      lines.push(`• समारोह का प्रकार: ${event?.eventType || 'समारोह / पार्टी'}`);
      lines.push(`• समारोह की तारीख: ${event?.eventDate || 'दिनांक अनुपलब्ध'}`);
      lines.push(`• अनुमानित मेहमान: ${event?.guestCount !== undefined ? event.guestCount : 'अस्पष्ट'}`);
      if (event?.estimatedLitres) {
        lines.push(`• अनुमानित पानी: ${event.estimatedLitres} लीटर`);
      }
      lines.push('• अमानत राशि: ₹0 (इवेंट ऑर्डर पर कोई जमा राशि नहीं)');
      lines.push('• दर: कस्टम कोटेशन');
    } else {
      lines.push('🎉 *Event Details:*');
      lines.push(`• Event Type: ${event?.eventType || 'Event / Party'}`);
      lines.push(`• Event Date: ${event?.eventDate || 'N/A'}`);
      lines.push(`• Estimated Guests: ${event?.guestCount !== undefined ? event.guestCount : 'N/A'}`);
      if (event?.estimatedLitres) {
        lines.push(`• Estimated Water: ${event.estimatedLitres} Litres`);
      }
      lines.push('• Deposit: ₹0 (Zero deposit for event orders)');
      lines.push('• Rate: Custom Quote');
    }

    return lines.join('\n');
  }

  private getFrequencyHindi(frequency?: string): string {
    switch (frequency) {
      case 'daily':
        return 'दैनिक';
      case 'alternate_days':
        return 'एक दिन छोड़कर';
      case 'weekly':
        return 'साप्ताहिक';
      default:
        return 'नियमित';
    }
  }

  private getFrequencyEnglish(frequency?: string): string {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'alternate_days':
        return 'Alternate Days';
      case 'weekly':
        return 'Weekly';
      default:
        return 'Recurring';
    }
  }
}
