import { describe, it, expect } from 'vitest';
import { IndianPhoneNumber } from '../../../src/core/domain/value-objects/IndianPhoneNumber';

describe('IndianPhoneNumber Value Object', () => {
  it('throws error for invalid phone numbers', () => {
    expect(() => new IndianPhoneNumber('')).toThrow();
    expect(() => new IndianPhoneNumber('12345')).toThrow();
    expect(() => new IndianPhoneNumber('1234567890')).toThrow(); // starts with 1
    expect(() => new IndianPhoneNumber('5555555555')).toThrow(); // starts with 5
  });

  it('normalizes valid 10-digit mobile numbers', () => {
    const phone = new IndianPhoneNumber('8235882384');
    expect(phone.getDigits()).toBe('8235882384');
    expect(phone.getFormatted()).toBe('82358 82384');
    expect(phone.getInternationalFormat()).toBe('+91 82358 82384');
    expect(phone.getWhatsAppNumber()).toBe('918235882384');
  });

  it('handles +91 prefix, leading 0, hyphens, and spaces', () => {
    const p1 = new IndianPhoneNumber('+91 82358-82384');
    expect(p1.getDigits()).toBe('8235882384');

    const p2 = new IndianPhoneNumber('08235882384');
    expect(p2.getDigits()).toBe('8235882384');

    const p3 = new IndianPhoneNumber('918235882384');
    expect(p3.getDigits()).toBe('8235882384');
  });
});
