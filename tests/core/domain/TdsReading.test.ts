import { describe, it, expect } from 'vitest';
import { TdsReading } from '../../../src/core/domain/value-objects/TdsReading';

describe('TdsReading Value Object', () => {
  it('throws error when PPM is negative or non-finite', () => {
    expect(() => new TdsReading(-5)).toThrow(/Invalid TDS reading/);
    expect(() => new TdsReading(NaN)).toThrow(/Invalid TDS reading/);
  });

  it('correctly classifies low mineral water (< 50 PPM)', () => {
    const reading = new TdsReading(35);
    expect(reading.getPpm()).toBe(35);
    expect(reading.getClassification().grade).toBe('LOW_MINERAL');
    expect(reading.isSafe()).toBe(true);
  });

  it('correctly classifies ideal RO drinking water (50 - 150 PPM)', () => {
    const reading = new TdsReading(95);
    expect(reading.getClassification().grade).toBe('IDEAL');
    expect(reading.isSafe()).toBe(true);
  });

  it('correctly classifies acceptable drinking water (151 - 300 PPM)', () => {
    const reading = new TdsReading(220);
    expect(reading.getClassification().grade).toBe('ACCEPTABLE');
    expect(reading.isSafe()).toBe(true);
  });

  it('correctly classifies hard water (301 - 500 PPM)', () => {
    const reading = new TdsReading(420);
    expect(reading.getClassification().grade).toBe('HARD');
    expect(reading.isSafe()).toBe(false);
  });

  it('correctly flags dangerous/poor water (> 500 PPM)', () => {
    const reading = new TdsReading(750);
    expect(reading.getClassification().grade).toBe('POOR');
    expect(reading.isSafe()).toBe(false);
  });
});
