export class IndianPhoneNumber {
  private readonly digits: string;

  constructor(input: string) {
    if (!input || typeof input !== 'string') {
      throw new Error('Phone number must be a non-empty string.');
    }

    // Strip whitespaces, hyphens, parentheses, and leading plus
    let cleaned = input.replace(/[\s\-()]/g, '');

    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.slice(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.slice(1);
    }

    // Must be exactly 10 digits starting with 6, 7, 8, or 9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(cleaned)) {
      throw new Error(`Invalid Indian mobile number: "${input}". Must be a valid 10-digit number starting with 6-9.`);
    }

    this.digits = cleaned;
  }

  public getDigits(): string {
    return this.digits;
  }

  public getFormatted(): string {
    // Format as "98765 43210"
    return `${this.digits.slice(0, 5)} ${this.digits.slice(5)}`;
  }

  public getInternationalFormat(): string {
    return `+91 ${this.getFormatted()}`;
  }

  public getWhatsAppNumber(): string {
    return `91${this.digits}`;
  }
}
